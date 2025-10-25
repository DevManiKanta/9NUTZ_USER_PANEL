
"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import apiAxios, { API_BASE } from "@/lib/api";
import { Login_API_BASE } from "@/lib/api";
import axios from "axios"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Crect fill='%23f3f4f6' width='1200' height='800'/%3E%3Ctext fill='%239ca3af' font-family='Arial, Helvetica, sans-serif' font-size='28' x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'%3EImage not available%3C/text%3E%3C/svg%3E";

/** Convert backend image paths to absolute URLs (uses API_BASE or NEXT_PUBLIC_API_BASE) */
function toFullImageUrl(img) {
  const val = img ?? "";
  if (!val) return "";
  if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:")) return val;
  const base = (API_BASE || process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
  if (!base) return val;
  if (val.startsWith("/")) return `${base}${val}`;
  return `${base}/${val}`;
}

export async function getCategoriesPublicAPI() {
  try {
    const res = await axios.get(`${Login_API_BASE}/category/show`, { headers: { "Content-Type": "application/json" } });
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (err) {
    console.error("getCategoriesPublicAPI error:", err?.response?.data ?? err?.message ?? err);
    throw err;
  }
}
export default function Hero() {
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const autoplayRef = useRef(null);
  const isHoveringRef = useRef(false);

  // Fetch banners
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchBanners = async () => {
      try {
        // Try endpoint relative to axios base; fallback to absolute if needed
        let res;
        try {
          res = await apiAxios.get("list-banners");
        } catch (e) {
          // fallback absolute path if axios baseURL not configured
          res = await apiAxios.get("list-banners");
        }

        if (cancelled) return;

        const payload = res?.data ?? null;
        const rows = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.banners)
          ? payload.banners
          : [];

        // prefer active banners but fall back to all if none active
        const active = rows.filter((b) => b && (b.is_active === 1 || b.is_active === true || b.is_active === "1"));
        const source = active.length ? active : rows;

        const mapped = (source || []).map((b) => {
          // Use redirect_url as image source when present (absolute). Otherwise build from image_url.
          const redirect = b?.redirect_url ? String(b.redirect_url) : "";
          const imageCandidate =
            redirect && (redirect.startsWith("http://") || redirect.startsWith("https://"))
              ? redirect
              : toFullImageUrl(b?.image_url ?? b?.image ?? "");

          return {
            id: b?.id ?? `${b?.title ?? "banner"}-${Math.random().toString(36).slice(2, 8)}`,
            title: b?.title ?? "",
            subtitle: b?.subtitle ?? "",
            discount: b?.discount ?? "",
            image_url: imageCandidate || "",
            redirect_url: redirect || "",
            is_active: b?.is_active ?? 0,
            raw: b,
          };
        });

        setBanners(mapped);
      } catch (err) {
        console.error("Hero: failed to load banners:", err?.response?.data ?? err?.message ?? err);
        if (!cancelled) {
          setError("Failed to load banners.");
          setBanners([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBanners();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch categories for the carousel
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const rows = await getCategoriesPublicAPI();
        if (cancelled) return;
        const norm = (rows || []).map((r) => ({
          id: r.id,
          name: r.name ?? r.title ?? "",
          image: r.image ?? "",
          image_url: r.image_url ?? toFullImageUrl(r.image ?? ""),
          products_count: r.products_count ?? 0,
        }));
        setCategories(norm);
      } catch (err) {
        setCategoriesError(String(err?.message ?? err) || "Failed to load categories");
        setCategories([]);
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Autoplay logic
  useEffect(() => {
    const start = () => {
      stop();
      autoplayRef.current = window.setInterval(() => {
        if (!isHoveringRef.current) {
          setCurrentBanner((p) => (banners.length ? (p + 1) % banners.length : 0));
        }
      }, 5000);
    };
    const stop = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
    start();
    return () => stop();
  }, [banners.length]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setCurrentBanner((p) => (banners.length ? (p - 1 + banners.length) % banners.length : 0));
      if (e.key === "ArrowRight") setCurrentBanner((p) => (banners.length ? (p + 1) % banners.length : 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [banners.length]);

  const nextBanner = () => setCurrentBanner((p) => (banners.length ? (p + 1) % banners.length : 0));
  const prevBanner = () => setCurrentBanner((p) => (banners.length ? (p - 1 + banners.length) % banners.length : 0));

  return (
    <div className="mb-4">
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg"
        onMouseEnter={() => (isHoveringRef.current = true)}
        onMouseLeave={() => (isHoveringRef.current = false)}
      >
        {/* States */}
        {loading ? (
          <div className="w-full h-80 md:h-96 lg:h-[28rem] bg-gray-100 flex items-center justify-center">
            <div className="text-gray-500">Loading banners...</div>
          </div>
        ) : error ? (
          <div className="w-full h-80 md:h-96 lg:h-[28rem] bg-red-50 text-red-600 flex items-center justify-center">
            <div className="text-center">
              <div className="font-semibold mb-2">Could not load banners</div>
              <div className="text-sm">{String(error)}</div>
            </div>
          </div>
        ) : banners.length === 0 ? (
          <div className="w-full h-80 md:h-96 lg:h-[28rem] bg-gray-100 flex items-center justify-center">
            <span className="text-gray-500">No banners available</span>
          </div>
        ) : (
          // Carousel: we render each slide with an <img> to keep it crisp
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentBanner * 100}%)`, width: `${Math.max(1, banners.length) * 100}%` }}
          >
            {banners.map((banner) => {
              const src = banner.image_url || PLACEHOLDER;
              return (
                <div key={banner.id} className="w-full flex-shrink-0">
                  <div
                    role="img"
                    aria-label={`${banner.title ?? ""} ${banner.subtitle ?? ""}`.trim()}
                    className="relative w-full h-80 md:h-96 lg:h-[28rem]"
                    tabIndex={-1} /* not focusable for activation */
                  >
                    {/* Actual image element ensures crisp rendering */}
                    <img
                      src={src}
                      alt={banner.title || banner.subtitle || "Banner"}
                      className="w-full h-full object-cover"
                      loading="eager"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER;
                      }}
                    />

                    {/* overlay to darken image for readable text */}
                    <div className="absolute inset-0 bg-black/25" />

                    {/* Text content (title/subtitle/discount) */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
                      <div className="max-w-3xl text-center text-white">
                        {banner.title ? <div className="text-sm md:text-base font-semibold opacity-90 mb-2">{banner.title}</div> : null}
                        {banner.subtitle ? (
                          <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">{banner.subtitle}</h2>
                        ) : null}
                        {banner.discount ? (
                          <div className="mb-4">
                            <span className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-md font-bold">
                              {banner.discount}
                            </span>
                          </div>
                        ) : null}
                        {/* Explore button removed by request */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Controls and dots */}
        {!loading && banners.length > 0 && (
          <>
            <button
              aria-label="Previous banner"
              onClick={(e) => {
                e.stopPropagation();
                prevBanner();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center transition"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>

            <button
              aria-label="Next banner"
              onClick={(e) => {
                e.stopPropagation();
                nextBanner();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center transition"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  aria-label={`go to slide ${i + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentBanner(i);
                  }}
                  className={`w-3 h-3 rounded-full transition ${currentBanner === i ? "bg-white" : "bg-white/60"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Category carousel below hero (kept from original) */}
      <div className="mt-6">
        <CategoryCarousel categories={categories} loading={categoriesLoading} error={categoriesError} />
      </div>
    </div>
  );
}

/* ---------- CategoryCarousel: small component ---------- */
function CategoryCarousel({ categories, loading, error }) {
  const slidesToShow = Math.min(6, Math.max(1, categories.length || 1));
  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 2500,
    slidesToShow,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: Math.min(5, categories.length || 1) } },
      { breakpoint: 1024, settings: { slidesToShow: Math.min(4, categories.length || 1) } },
      { breakpoint: 768, settings: { slidesToShow: Math.min(3, categories.length || 1) } },
      { breakpoint: 640, settings: { slidesToShow: Math.min(2, categories.length || 1) } },
    ],
  };

  if (loading) {
    return (
      <div className="w-full h-36 flex items-center justify-center bg-gray-100 text-gray-500 rounded-xl">
        Loading categories...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-36 flex items-center justify-center bg-red-50 text-red-600 rounded-xl">
        Failed to load categories: {error}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="w-full h-36 flex items-center justify-center bg-gray-100 text-gray-500 rounded-xl">
        No categories to display
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Shop by Categories</h2>
      </div>

      <div className="w-full overflow-hidden">
        <Slider {...settings}>
          {categories.map((category) => {
            const src = category.image_url || category.image || PLACEHOLDER;
            return (
              <div key={String(category.id)} className="px-2">
                <button
                  className="group flex flex-col items-center justify-center p-0 rounded-xl overflow-hidden transform transition-all duration-200 hover:scale-105"
                  aria-label={`Open category ${category.name}`}
                >
                  <div className="w-full h-24 md:h-28 lg:h-32 relative">
                    <img src={src} alt={category.name} className="w-full h-full object-cover rounded-xl" loading="lazy" decoding="async" onError={(e) => (e.currentTarget.src = PLACEHOLDER)} />
                    <div className="absolute inset-0 bg-black/20 rounded-xl pointer-events-none" />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-center text-gray-700 py-2 w-full bg-white/0">{category.name}</span>
                </button>
              </div>
            );
          })}
        </Slider>
      </div>
    </>
  );
}



