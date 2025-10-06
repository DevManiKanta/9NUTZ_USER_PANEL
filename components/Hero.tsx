// components/Hero.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { API_BASE } from "@/lib/api"; // single source of truth for base URL
import { useCategories } from "@/contexts/CategoryContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type BannerItem = {
  id: number;
  title?: string;
  subtitle?: string;
  discount?: string;
  image_url?: string | null;
  redirect_url?: string | null;
  buttonText?: string;
  is_active?: number | boolean;
};

export default function Hero() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentBanner, setCurrentBanner] = useState<number>(0);
  const autoplayRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false);

  // helper to convert backend image paths to full URLs
  const toFullImageUrl = (img?: string | null) => {
    const val = img || "";
    if (!val) return val;
    if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:")) return val;
    const base = (API_BASE || process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
    if (val.startsWith("/")) return `${base}${val}`;
    return `${base}/${val}`;
  };

  // fetch public banners
  useEffect(() => {
    (async () => {
      try {
        const base = (API_BASE || process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
        const res = await fetch(`${base}/api/banners`);
        if (!res.ok) {
          console.warn("Failed to load remote banners, using fallback");
          setBanners([
            {
              id: 1,
              title: "ONE STOP SOLUTION",
              subtitle: "FOR ALL YOUR DAILY ESSENTIALS",
              discount: "UP TO 35% OFF*",
              image_url:
                "https://images.pexels.com/photos/4099123/pexels-photo-4099123.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900",
              redirect_url: "/categories",
              buttonText: "SHOP NOW",
              is_active: 1
            },
            {
              id: 2,
              title: "FRESH GROCERIES",
              subtitle: "DELIVERED IN MINUTES",
              discount: "UP TO 25% OFF*",
              image_url:
                "https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900",
              redirect_url: "/category/fruits-vegetables",
              buttonText: "ORDER NOW",
              is_active: 1
            }
          ]);
          return;
        }
        const data: BannerItem[] = await res.json();
        const active = data.filter((b) => b && (b as any).is_active !== 0 && (b as any).is_active !== false);
        // convert image paths to full urls
        const mapped = (active.length ? active : data).map((b) => ({ ...b, image_url: toFullImageUrl(b.image_url) }));
        setBanners(mapped);
      } catch (err) {
        console.error("Error loading banners:", err);
      }
    })();
  }, []);

  const nextBanner = () => setCurrentBanner((p) => (banners.length ? (p + 1) % banners.length : 0));
  const prevBanner = () => setCurrentBanner((p) => (banners.length ? (p - 1 + banners.length) % banners.length : 0));

  // autoplay
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevBanner();
      if (e.key === "ArrowRight") nextBanner();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [banners.length]);

  return (
    <div className="mb-8">
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg"
        onMouseEnter={() => (isHoveringRef.current = true)}
        onMouseLeave={() => (isHoveringRef.current = false)}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="w-full flex-shrink-0">
              <div
                className="relative w-full h-80 md:h-96 lg:h-[28rem] cursor-pointer"
                onClick={() => banner.redirect_url && (window.location.href = banner.redirect_url)}
              >
                {/* blurred background layer */}
                <div
                  aria-hidden
                  style={{
                    backgroundImage: `url(${banner.image_url || ""})`,
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
                    <div className="text-sm md:text-base font-semibold opacity-90 mb-2">{banner.title}</div>
                    {/* <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">{banner.subtitle}</h2> */}
                    {banner.discount && (
                      <div className="mb-6">
                        {/* <span className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-md font-bold">{banner.discount}</span> */}
                      </div>
                    )}
                    <div>
                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (banner.redirect_url) window.location.href = banner.redirect_url;
                        }}
                        className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow transition"
                      >
                        {banner.buttonText || "Shop"}
                        <ChevronRight className="h-4 w-4" />
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          aria-label="Previous"
          onClick={(e) => {
            e.stopPropagation();
            prevBanner();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center transition"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>

        <button
          aria-label="Next"
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

      {/* category grid below unchanged (image-only look) */}
      <div className="mt-6">
        <DynamicCategoryGrid />
      </div>
    </div>
  );
}

/* copy your previously tweaked DynamicCategoryGrid function here */
function DynamicCategoryGrid() {
  const { getActiveCategories } = useCategories();
  const [categories, setCategories] = useState(() => getActiveCategories());

  useEffect(() => {
    const handler = () => setCategories(getActiveCategories());
    window.addEventListener("categoriesUpdated", handler);
    return () => window.removeEventListener("categoriesUpdated", handler);
  }, [getActiveCategories]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 2000,
    autoplay: true,
    autoplaySpeed: 2500,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Shop by Categories</h2>
        <button onClick={() => (window.location.href = "/categories")} className="text-green-600 hover:text-green-700 font-medium">
          see all
        </button>
      </div>

     <div className="w-full overflow-hidden">
      <Slider {...settings}>
        {categories.map((category) => (
          <div key={category.id} className="px-2">
            <button
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("categoryFilterChange", { detail: category.name })
                )
              }
              className="group flex flex-col items-center justify-center p-0 rounded-xl overflow-hidden transform transition-all duration-200 hover:scale-105"
            >
              <div className="w-full h-24 md:h-28 lg:h-32 relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-black/20 rounded-xl" />
              </div>
              <span className="text-xs md:text-sm font-medium text-center text-gray-700 py-2 w-full bg-white/0">
                {category.name}
              </span>
            </button>
          </div>
        ))}
      </Slider>
    </div>
    </>
  );
}
