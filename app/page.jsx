
// "use client";

// import { useState, useEffect } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import LoadingScreen from "@/components/LoadingScreen";
// import Header from "@/components/Header";
// import Sidebar from "@/components/Sidebar";
// import Hero from "@/components/Hero";
// import CategoryGrid from "@/components/CategoryGrid";
// import CategoryFilter from "@/components/CategoryFilter";
// import FilterableProductGrid from "@/components/FilterableProductGrid";
// import Footer from "@/components/Footer";
// import LoginModal from "@/components/LoginModal";
// import LocationModal from "@/components/LocationModal";
// import CartSidebar from "@/components/CartSidebar";
// import AllPackages from "@/components/allcombopacks/AllPackages";

// export default function Home() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [showPaymentFlow, setShowPaymentFlow] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//   const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
//   const [isCartOpen, setIsCartOpen] = useState(false);

//   const [cartItems, setCartItems] = useState([]);

//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [isFilterAnimating, setIsFilterAnimating] = useState(false);

//   const { user } = useAuth();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1200);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//   const openHandler = () => setIsCartOpen(true);

//   window.addEventListener("openCart", openHandler);
//   return () => window.removeEventListener("openCart", openHandler);
// }, []);


//   const handleProceedToPay = () => {
//     setShowPaymentFlow(true);
//   };



// const handlePaymentComplete = () => {
//   // setShowPaymentFlow(false);
//   setCartItems([]); 
// };

//   const addToCart = (product) => {
//     setCartItems((prev) => {
//       const existing = prev.find((p) => p.id === product.id);
//       if (existing) {
//         return prev.map((p) =>
//           p.id === product.id ? { ...p, quantity: (p.quantity || 0) + 1 } : p
//         );
//       }
//       return [...prev, { ...product, quantity: 1 }];
//     });
//   };


//   useEffect(() => {
//   const onProductAdd = (e) => {
//     try {
//       const payload = e && e.detail ? e.detail : null;
//       // ProductClient dispatches: new CustomEvent("productAddToCart", { detail: { product } })
//       const product = payload && payload.product ? payload.product : payload;

//       if (!product) return;

//       // add to local cart (your existing addToCart function)
//       addToCart(product);

//       // open the cart UI
//       setIsCartOpen(true);
//     } catch (err) {
//       // eslint-disable-next-line no-console
//       console.warn("productAddToCart handler failed", err);
//     }
//   };

//   window.addEventListener("productAddToCart", onProductAdd);
//   return () => window.removeEventListener("productAddToCart", onProductAdd);
// }, [addToCart]); // include addToCart in deps so handler always has latest
//   const cartTotal = cartItems.reduce((sum, item) => {
//     const price = typeof item.price === "number" ? item.price : 0;
//     const qty = typeof item.quantity === "number" ? item.quantity : 0;
//     return sum + price * qty;
//   }, 0);

//   const updateQuantity = (id, quantity) => {
//     if (quantity <= 0) {
//       setCartItems((prev) => prev.filter((item) => item.id !== id));
//       return;
//     }
//     setCartItems((prev) =>
//       prev.map((item) => (item.id === id ? { ...item, quantity } : item))
//     );
//   };

//   const handleCategoryChange = (category) => {
//     setIsFilterAnimating(true);
//     setSelectedCategory(category);

//     setTimeout(() => {
//       setIsFilterAnimating(false);
//     }, 300);
//   };

//   useEffect(() => {
//     const handler = (e) => {
//       const ce = e;
//       if (ce && typeof ce.detail === "string") {
//         handleCategoryChange(ce.detail);
//       }
//     };

//     // uncomment to listen globally:
//     // window.addEventListener("categoryFilterChange", handler);
//     // return () => window.removeEventListener("categoryFilterChange", handler);
//   }, []);

//   if (isLoading) {
//     return <LoadingScreen />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header
//         onLoginClick={() => setIsLoginModalOpen(true)}
//         onLocationClick={() => setIsLocationModalOpen(true)}
//         onCartClick={() => setIsCartOpen(true)}
//         cartItemCount={cartItems.reduce((s, i) => s + (i.quantity || 0), 0)}
//         cartTotal={cartTotal}
//         handlePaymentComplete={handlePaymentComplete}
//       />

//       <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

//       <main>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <Hero />

//           <CategoryFilter
//             onCategoryChange={handleCategoryChange}
//             selectedCategory={selectedCategory}
//           />

//           <FilterableProductGrid
//             onAddToCart={addToCart}
//             selectedCategory={selectedCategory}
//             isAnimating={isFilterAnimating}
//           />
//         </div>
//       </main>
//       {/* <AllPackages /> */}
//       <Footer />

//       <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
//       <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />

//       <CartSidebar
//         isOpen={isCartOpen}
//         onClose={() => setIsCartOpen(false)}
//         items={cartItems}
//         onUpdateQuantity={updateQuantity}
//         onProceedToPay={handleProceedToPay}
//         handlePaymentComplete={handlePaymentComplete}
//       />

//     </div>
//   );
// }

// app/page.jsx
// app/page.jsx
// app/page.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryFilter from "@/components/CategoryFilter";
import FilterableProductGrid from "@/components/FilterableProductGrid";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import LocationModal from "@/components/LocationModal";
import CartSidebar from "@/components/CartSidebar";
import FeatureStrip from "@/components/ViewBand";
import HeroTestimonials from "@/components/HeroWithTestimonials"
// IMPORTANT: use the reusable ProductDetailClient that dispatches events or calls onAddToCart
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductDetailContent from "@/components/ProductDetailContent";
import TopSelling from "@/components/TopSellingProducts"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [cartItems, setCartItems] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFilterAnimating, setIsFilterAnimating] = useState(false);

  // For product detail modal
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Stable addToCart so event listeners can include it in deps
  const addToCart = useCallback((product, incomingQty = 1) => {
    if (!product) return;
    const qtyToAdd = Math.max(
      1,
      Number.isFinite(Number(incomingQty)) ? Math.trunc(incomingQty) : 1
    );

    setCartItems((prev) => {
      const existing = prev.find((p) => String(p.id) === String(product.id));
      if (existing) {
        return prev.map((p) =>
          String(p.id) === String(product.id)
            ? { ...p, quantity: (p.quantity || 0) + qtyToAdd }
            : p
        );
      }
      return [...prev, { ...product, quantity: qtyToAdd }];
    });
  }, []);

  // Handler for productAddToCart window event — stable with useCallback
  const onProductAdd = useCallback(
    (e) => {
      try {
        const payload = e && e.detail ? e.detail : e;
        // payload may be { product } or the product itself, or { product, quantity }
        const product = payload && payload.product ? payload.product : payload;
        const qty =
          payload && (payload.quantity ?? payload.qty)
            ? Number(payload.quantity ?? payload.qty)
            : 1;

        if (!product) return;

        addToCart(product, qty);
        setIsCartOpen(true);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("productAddToCart handler failed", err);
      }
    },
    [addToCart]
  );

  // Attach listener once — uses stable onProductAdd
  useEffect(() => {
    window.addEventListener("productAddToCart", onProductAdd);
    return () => window.removeEventListener("productAddToCart", onProductAdd);
  }, [onProductAdd]);

  // openCart event — opens CartSidebar
  useEffect(() => {
    const openHandler = () => setIsCartOpen(true);
    window.addEventListener("openCart", openHandler);
    return () => window.removeEventListener("openCart", openHandler);
  }, []);

  const handleProceedToPay = () => {
    setShowPaymentFlow(true);
  };

  const handlePaymentComplete = useCallback(() => {
    // clear cart after payment complete
    setShowPaymentFlow(false);
    setCartItems([]);
  }, []);

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = typeof item.price === "number" ? item.price : 0;
    const qty = typeof item.quantity === "number" ? item.quantity : 0;
    return sum + price * qty;
  }, 0);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (String(item.id) === String(id) ? { ...item, quantity } : item))
    );
  }, []);

  const handleCategoryChange = (category) => {
    setIsFilterAnimating(true);
    setSelectedCategory(category);

    setTimeout(() => {
      setIsFilterAnimating(false);
    }, 300);
  };
  // ---- Product modal controls ----
  const openProductModal = useCallback((productId) => {
    if (!productId) return;
    setSelectedProductId(String(productId));
    setIsProductModalOpen(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const closeProductModal = useCallback(() => {
    setIsProductModalOpen(false);
    setSelectedProductId(null);
  }, []);
  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLocationClick={() => setIsLocationModalOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        cartItemCount={cartItems.reduce((s, i) => s + (i.quantity || 0), 0)}
        cartTotal={cartTotal}
        handlePaymentComplete={handlePaymentComplete}
      />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Hero />
          <CategoryFilter
            onCategoryChange={handleCategoryChange}
            selectedCategory={selectedCategory}
          />

          <FilterableProductGrid
            onAddToCart={addToCart}
            onProductSelect={openProductModal}    // <- ensure grid calls this
            selectedCategory={selectedCategory}
            isAnimating={isFilterAnimating}
          />
        </div>
      </main>
        <TopSelling/>
          <FeatureStrip />
          <HeroTestimonials/>
      <Footer />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} />
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onProceedToPay={handleProceedToPay}
        handlePaymentComplete={handlePaymentComplete}
      />
      {/* Product detail modal (client) */}
      {isProductModalOpen && selectedProductId && (
        <div
          className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeProductModal}
            aria-hidden
          />

          {/* Modal panel */}
          <div className="relative w-full max-w-5xl mx-auto bg-transparent">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* close button */}
              <div className="flex justify-end p-3">
                <button
                  onClick={closeProductModal}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none"
                  aria-label="Close product details"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <ProductDetailClient id={selectedProductId} onAddToCart={addToCart} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


