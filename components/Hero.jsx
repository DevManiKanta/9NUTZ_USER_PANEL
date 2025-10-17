
"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { API_BASE } from "@/lib/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuth } from "@/contexts/AuthContext";
import apiAxios from "@/lib/api";




const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Crect fill='%23f3f4f6' width='1200' height='800'/%3E%3Ctext fill='%239ca3af' font-family='Arial, Helvetica, sans-serif' font-size='28' x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'%3EImage not available%3C/text%3E%3C/svg%3E";

export async function getCategoriesPublicAPI() {
  try {
    const res = await apiAxios.get("category/show", {
      headers: {
        "Content-Type": "application/json",
      },
      // Axios doesn’t use "cache: no-store" — it always fetches fresh data unless you manually cache
    });

    // API returns { status: true, data: [ ... ] }
    console.log("Category Response:", res.data);

    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (err) {
    console.error(
      "getCategoriesPublicAPI error:",
      err.response?.data || err.message
    );
    throw err;
  }
}
// ------------------------------------------------------------------

export default function Hero() {
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const autoplayRef = useRef(null);
  const isHoveringRef = useRef(false);

  // helper to convert backend image paths to full URLs
  const toFullImageUrl = (img) => {
    const val = img ?? "";
    if (!val) return "";
    if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:")) return val;
    const base = (API_BASE || process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
    if (!base) return val;
    if (val.startsWith("/")) return `${base}${val}`;
    return `${base}/${val}`;
  };

useEffect(() => {
  let cancelled = false;

  const fetchBanners = async () => {
    try {
      const base =
        (API_BASE || process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");

      // ✅ Use your axios instance
      const res = await apiAxios.get("banners");

      if (cancelled) return;

      const data = res.data || [];
      const active = data.filter(
        (b) => b && b.is_active !== 0 && b.is_active !== false
      );

      const mapped = (active.length ? active : data).map((b) => ({
        ...b,
        image_url: toFullImageUrl(b.image_url),
      }));

      setBanners(mapped);
    } catch (err) {
      console.error("Error loading banners:", err);

      if (cancelled) return;

      // ✅ Fallback banners
      setBanners([
         {
          id: 2,
          title: "FRESH GROCERIES",
          subtitle: "DELIVERED IN MINUTES",
          discount: "UP TO 25% OFF*",
          image_url:
            "https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900",
          buttonText: "ORDER NOW",
          is_active: 1,
        },,
        {
          id: 2,
          title: "FRESH GROCERIES",
          subtitle: "DELIVERED IN MINUTES",
          discount: "UP TO 25% OFF*",
          image_url:
            "https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900",
          buttonText: "ORDER NOW",
          is_active: 1,
        },
        {
          id: 2,
          title: "FRESH GROCERIES",
          subtitle: "DELIVERED IN MINUTES",
          discount: "UP TO 25% OFF*",
          image_url:
            "https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900",
          buttonText: "ORDER NOW",
          is_active: 1,
        },
      ]);
    }
  };

  fetchBanners();

  return () => {
    cancelled = true;
  };
}, []);


  // fetch categories directly here (using the token)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const rows = await getCategoriesPublicAPI();
        if (cancelled) return;
        // normalize rows to CategoryRow type (use image_url from API)
        const norm = (rows || []).map((r) => ({
          id: r.id,
          name: r.name,
          image: r.image, // relative path maybe
          image_url: r.image_url || toFullImageUrl(r.image),
          products_count: r.products_count
        })) 
        setCategories(norm);
      } catch (err) {
        setCategoriesError(String(err?.message || err));
        setCategories([]);
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  const nextBanner = () => setCurrentBanner((p) => (banners.length ? (p + 1) % banners.length : 0));
  const prevBanner = () => setCurrentBanner((p) => (banners.length ? (p - 1 + banners.length) % banners.length : 0));

  // autoplay for hero banners
  useEffect(() => {
    const start = () => {
      stop();
      autoplayRef.current = window.setInterval(() => {
        if (!isHoveringRef.current) nextBanner();
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

  // keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prevBanner();
      if (e.key === "ArrowRight") nextBanner();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [banners.length]);

  return (
    <div className="mb-4">
      {/* Hero banners */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg"
        onMouseEnter={() => (isHoveringRef.current = true)}
        onMouseLeave={() => (isHoveringRef.current = false)}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)`, width: `${Math.max(1, banners.length) * 100}%` }}
        >
          {banners.length === 0 ? (
            <div className="w-full h-80 md:h-96 lg:h-[28rem] bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500">No banners available</span>
            </div>
          ) : (
            banners.map((banner) => (
              <div key={banner.id} className="w-full flex-shrink-0">
                <div
                  className="relative w-full h-80 md:h-96 lg:h-[28rem] cursor-pointer"
                  onClick={() => banner.redirect_url && (window.location.href = banner.redirect_url)}
                >
                  {/* blurred background */}
                  <div
                    aria-hidden
                    style={{
                      backgroundImage: `url(${banner.image_url || PLACEHOLDER})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "blur(6px) brightness(.7)",
                      transform: "scale(1.03)"
                    }}
                    className="absolute inset-0 -z-10"
                  />
                  <div className="absolute inset-0 bg-black/30 -z-0" />
                  <div className="relative z-10 h-full flex items-center justify-center px-6">
                    <div className="max-w-3xl text-center text-white">
                      {/* {banner.title && <div className="text-sm md:text-base font-semibold opacity-90 mb-2">{banner.title}</div>}
                      {banner.subtitle && <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">{banner.subtitle}</h2>} */}
                      {/* {banner.discount && (
                        <div className="mb-6">
                          <span className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-md font-bold">{banner.discount}</span>
                        </div>
                      )} */}
                      {/* {banner.buttonText && (
                        <div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (banner.redirect_url) window.location.href = banner.redirect_url;
                            }}
                            className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow transition"
                          >
                            {banner.buttonText}
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

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
      </div>

      {/* category grid / carousel */}
      <div className="mt-6">
        <CategoryCarousel
          categories={categories}
          loading={categoriesLoading}
          error={categoriesError}
          toFullImageUrl={toFullImageUrl}
        />
      </div>
    </div>
  );
}

/* ---------- CategoryCarousel: separated small component ---------- */
function CategoryCarousel({
  categories,
  loading,
  error,
  toFullImageUrl
}) {
  // slick settings
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
            // prefer the API-provided image_url, fallback to building via toFullImageUrl(category.image)
            const src = category.image_url
              ? String(category.image_url)
              : category.image
              ? toFullImageUrl(String(category.image))
              : "";

            const safeSrc = src || PLACEHOLDER;

            return (
              <div key={String(category.id)} className="px-2">
                <button
                  // onClick={() =>
                  //   window.dispatchEvent(new CustomEvent("categoryFilterChange", { detail: category.name }))
                  // }
                  className="group flex flex-col items-center justify-center p-0 rounded-xl overflow-hidden transform transition-all duration-200 hover:scale-105"
                  aria-label={`Open category ${category.name}`}
                >
                  <div className="w-full h-24 md:h-28 lg:h-32 relative">
                    <img
                      src={safeSrc}
                      alt={category.name}
                      className="w-full h-full object-cover rounded-xl"
                      loading="lazy"
                      decoding="async"
                      // onError={(e) => ((e.currentTarget as HTMLImageElement).src = PLACEHOLDER)}
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-xl pointer-events-none" />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-center text-gray-700 py-2 w-full bg-white/0">
                    {category.name}
                  </span>
                </button>
              </div>
            );
          })}
        </Slider>
      </div>
    </>
  );
}


