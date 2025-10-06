// app/product/[id]/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import LoginModal from "@/components/LoginModal";
import { API_BASE } from "@/lib/api";
import type { CartItem, ID } from "@/types"; // adapt path if your types live elsewhere

type ProductRow = {
  id: number | string;
  name?: string;
  description?: string;
  price?: number;
  price_cents?: number | null;
  offer_price?: number | null;
  offerPrice?: number | null;
  images?: any;
  image?: string | null;
  image_url?: string | null;
  stock?: number | null;
  inventory?: number | null;
  status?: string | null;
  weight?: string | null;
  brand?: string | null;
  rating?: number | null;
  reviews?: number | null;
  quantity_prices?: any;
  quantityPrices?: any;
  created_at?: string | null;
  updated_at?: string | null;
  category_id?: number | string | null;
  [k: string]: any;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  offerPrice?: number;
  images: string[];
  image: string;
  stock: number;
  status: "active" | "inactive";
  weight: string;
  brand: string;
  rating: number;
  reviews: number;
  quantityPrices: any[];
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
};

const normalizeServerProduct = (r: ProductRow): Product => {
  const BASE = API_BASE.replace(/\/+$/, "");

  let imgs: string[] = [];
  try {
    if (Array.isArray(r.images)) {
      imgs = r.images.map((x: any) => String(x)).filter(Boolean);
    } else if (typeof r.images === "string") {
      const s = String(r.images).trim();
      if (s.startsWith("[")) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) imgs = parsed.map((x: any) => String(x));
      } else if (s) {
        imgs = [s];
      }
    } else if (r.image) {
      imgs = [String(r.image)];
    } else if (r.image_url) {
      imgs = [String(r.image_url)];
    }
  } catch {
    imgs = [];
  }

  imgs = imgs
    .filter(Boolean)
    .map((src) => {
      const trimmed = String(src).trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) return trimmed;
      if (trimmed.startsWith("/")) return `${BASE}${trimmed}`;
      return `${BASE}/${trimmed}`;
    })
    .filter(Boolean);

  const price = typeof r.price_cents === "number" ? Math.round(Number(r.price_cents) / 100) : (r.price ?? 0);

  const offerVal =
    typeof r.offer_price !== "undefined" && r.offer_price !== null
      ? Number(r.offer_price)
      : typeof r.offerPrice !== "undefined" && r.offerPrice !== null
      ? Number(r.offerPrice)
      : undefined;

  let qp: any[] = [];
  try {
    if (Array.isArray(r.quantity_prices)) qp = r.quantity_prices;
    else if (typeof r.quantity_prices === "string" && r.quantity_prices.trim()) qp = JSON.parse(r.quantity_prices);
    else if (Array.isArray(r.quantityPrices)) qp = r.quantityPrices;
    else qp = [];
  } catch {
    qp = r.quantityPrices ?? [];
  }

  const categoryId = String(r.category_id ?? "");

  return {
    id: String(r.id),
    name: r.name ?? "Untitled product",
    description: r.description ?? "",
    price,
    offerPrice: typeof offerVal === "number" ? offerVal : undefined,
    images: imgs,
    image: imgs[0] ?? (r.image_url ?? r.image ?? ""),
    stock: Number(r.stock ?? r.inventory ?? 0),
    status: r.status === "inactive" ? "inactive" : "active",
    weight: r.weight ?? "",
    brand: r.brand ?? "",
    rating: Number(r.rating ?? 0),
    reviews: Number(r.reviews ?? 0),
    quantityPrices: qp,
    createdAt: r.created_at ? new Date(r.created_at) : new Date(),
    updatedAt: r.updated_at ? new Date(r.updated_at) : new Date(),
    categoryId,
  };
};

// client-only helpers for cart persistence
function loadCartFromStorage(): CartItem[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("jbasket_cart_v1");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((it: any) => ({
      ...it,
      originalPrice: it.originalPrice ?? undefined,
    })) as CartItem[];
  } catch {
    return [];
  }
}
function saveCartToStorage(items: CartItem[]) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem("jbasket_cart_v1", JSON.stringify(items));
  } catch {}
}

export default function ProductPageClient({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  // login modal state (this is the key to make header login open the modal)
  const [loginOpen, setLoginOpen] = React.useState(false);


  // Cart state
  const [cartOpen, setCartOpen] = React.useState(false);
  const [cartItems, setCartItems] = React.useState<CartItem[]>(() => []); // start empty on server

  // mounted flag - prevents hydration mismatch
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);

    // load cart only on client after mount
    const items = loadCartFromStorage();
    setCartItems(items);
  }, []);

  // derived totals (safe to compute on server but these are used only after mount)
  const cartItemCount = cartItems.reduce((s, it) => s + (it.quantity || 0), 0);
  const cartTotal = Math.round(cartItems.reduce((s, it) => s + ((it.price || 0) * (it.quantity || 0)), 0));

  React.useEffect(() => {
    // Persist cart whenever it changes
    if (isMounted) saveCartToStorage(cartItems);
  }, [cartItems, isMounted]);

  // fetch product (client-rendered page fetch)
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const base = API_BASE.replace(/\/+$/, "");
        const res = await fetch(`${base}/api/products`, { cache: "no-store" });
        if (!res.ok) {
          console.error("Failed to fetch products", res.status);
          if (mounted) setProduct(null);
          return;
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          if (mounted) setProduct(null);
          return;
        }
        const raw = data.find((p: any) => String(p.id) === String(id));
        if (!raw) {
          if (mounted) setProduct(null);
          return;
        }
        const normalized = normalizeServerProduct(raw);
        if (mounted) setProduct(normalized);
      } catch (err) {
        console.error("Product fetch error", err);
        if (mounted) setProduct(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Header callbacks
  const handleLoginClick = () => setLoginOpen(true); ;
  const handleLocationClick = () => {
    // open location modal etc
  };
  const handleCartClick = () => setCartOpen(true);

  // add to cart
  const handleAddToCart = (qty = 1) => {
    if (!product) return;
    setCartItems((prev) => {
      const existing = prev.find((it) => String(it.id) === String(product.id));
      if (existing) {
        const next = prev.map((it) =>
          String(it.id) === String(product.id) ? { ...it, quantity: it.quantity + qty } : it
        );
        return next;
      }
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        image: product.image || product.images?.[0] || "/placeholder.png",
        price: product.offerPrice ?? product.price,
        originalPrice: undefined,
        quantity: qty,
        weight: product.weight,
      } as CartItem;
      return [newItem, ...prev];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (itemId: ID, quantity: number) => {
    setCartItems((prev) => {
      const next = prev
        .map((it) => (String(it.id) === String(itemId) ? { ...it, quantity: Math.max(0, quantity) } : it))
        .filter((it) => it.quantity > 0);
      return next;
    });
  };

  const handleProceedToPay = () => {
    setCartOpen(false);
    router.push("/checkout");
  };

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) router.back();
    else router.push("/");
  };

  // To avoid hydration mismatch, pass server-friendly default (0) to Header,
  // but after mount show actual totals via isMounted check.
  const headerCartItemCount = isMounted ? cartItemCount : 0;
  const headerCartTotal = isMounted ? cartTotal : 0;

  return (
    <>
      <Header
        onLoginClick={handleLoginClick}
        onLocationClick={handleLocationClick}
        onCartClick={handleCartClick}
        cartItemCount={headerCartItemCount}
        cartTotal={headerCartTotal}
      />
      {/* Login modal controlled by this page */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        isLoggedIn={false}
        onProceedToPay={handleProceedToPay}
      />
      <main className="max-w-6xl mx-auto p-6 pt-24 min-h-[60vh]">
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 text-sm"
          >
            ← Back
          </button>
          <div className="text-sm text-gray-500">Product</div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading product...</div>
        ) : product ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: gallery */}
            <div>
              <div className="rounded-lg border overflow-hidden mb-4">
                {product.images && product.images.length ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.images[0]} alt={product.name} className="w-full h-96 object-cover" />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center bg-gray-100 text-gray-400">No image</div>
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {product.images.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={src} alt={`${product.name} ${i + 1}`} className="w-24 h-24 object-cover rounded-lg border" />
                  ))}
                </div>
              )}
            </div>

            {/* Right: info */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              <p className="text-sm text-gray-500 mb-4">{product.brand} • {product.weight}</p>

              <div className="mb-4">
                <div className="text-2xl font-extrabold text-green-600">₹{product.offerPrice ?? product.price}</div>
                {product.offerPrice && product.offerPrice < product.price && (
                  <div className="text-sm text-gray-400 line-through">₹{product.price}</div>
                )}
              </div>

              <div className="mb-4 text-sm text-gray-700 whitespace-pre-wrap">{product.description}</div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAddToCart(1)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Add to cart
                </button>

                <button
                  onClick={() => { handleAddToCart(1); router.push("/cart"); }}
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  Buy now
                </button>
              </div>

              <div className="mt-6 text-xs text-gray-400">Product ID: {product.id} • Category: {product.categoryId}</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">Product not found.</div>
        )}
      </main>

      <Footer />
    </>
  );
}
