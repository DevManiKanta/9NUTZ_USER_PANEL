


// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import apiAxios, { API_BASE } from "@/lib/api";
// import { Login_API_BASE } from "@/lib/api";
// import axios from "axios";
// // removed react-slick imports
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// const PLACEHOLDER =
//   "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Crect fill='%23f3f4f6' width='1200' height='800'/%3E%3Ctext fill='%239ca3af' font-family='Arial, Helvetica, sans-serif' font-size='28' x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'%3EImage not available%3C/text%3E%3C/svg%3E";

// /** Convert backend image paths to absolute URLs (uses API_BASE or NEXT_PUBLIC_API_BASE) */
// function toFullImageUrl(img) {
//   const val = img ?? "";
//   if (!val) return "";
//   if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:")) return val;
//   const base = (API_BASE || process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
//   if (!base) return val;
//   if (val.startsWith("/")) return `${base}${val}`;
//   return `${base}/${val}`;
// }

// export async function getCategoriesPublicAPI() {
//   try {
//     const res = await axios.get(`${Login_API_BASE}/category/show`, { headers: { "Content-Type": "application/json" } });
//     return Array.isArray(res.data?.data) ? res.data.data : [];
//   } catch (err) {
//     console.error("getCategoriesPublicAPI error:", err?.response?.data ?? err?.message ?? err);
//     throw err;
//   }
// }

// export default function Hero() {
//   const [banners, setBanners] = useState([]);
//   const [currentBanner, setCurrentBanner] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [categoriesLoading, setCategoriesLoading] = useState(true);
//   const [categoriesError, setCategoriesError] = useState(null);

//   const autoplayRef = useRef(null);
//   const isHoveringRef = useRef(false);

//   // Fetch banners
//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);
//     setError(null);

//     const fetchBanners = async () => {
//       try {
//         let res;
//         try {
//           res = await apiAxios.get("list-banners");
//         } catch (e) {
//           // fallback (kept same as original)
//           res = await apiAxios.get("list-banners");
//         }

//         if (cancelled) return;

//         const payload = res?.data ?? null;
//         const rows = Array.isArray(payload?.data)
//           ? payload.data
//           : Array.isArray(payload)
//           ? payload
//           : Array.isArray(payload?.banners)
//           ? payload.banners
//           : [];

//         const active = rows.filter((b) => b && (b.is_active === 1 || b.is_active === true || b.is_active === "1"));
//         const source = active.length ? active : rows;

//         const mapped = (source || []).map((b) => {
//           const redirect = b?.redirect_url ? String(b.redirect_url) : "";
//           const imageCandidate =
//             redirect && (redirect.startsWith("http://") || redirect.startsWith("https://"))
//               ? redirect
//               : toFullImageUrl(b?.image_url ?? b?.image ?? "");

//           return {
//             id: b?.id ?? `${b?.title ?? "banner"}-${Math.random().toString(36).slice(2, 8)}`,
//             title: b?.title ?? "",
//             subtitle: b?.subtitle ?? "",
//             discount: b?.discount ?? "",
//             image_url: imageCandidate || "",
//             redirect_url: redirect || "",
//             is_active: b?.is_active ?? 0,
//             raw: b,
//           };
//         });

//         setBanners(mapped);
//       } catch (err) {
//         console.error("Hero: failed to load banners:", err?.response?.data ?? err?.message ?? err);
//         if (!cancelled) {
//           setError("Failed to load banners.");
//           setBanners([]);
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };

//     fetchBanners();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // Fetch categories for the carousel
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       setCategoriesLoading(true);
//       setCategoriesError(null);
//       try {
//         const rows = await getCategoriesPublicAPI();
//         if (cancelled) return;
//         const norm = (rows || []).map((r) => ({
//           id: r.id,
//           name: r.name ?? r.title ?? "",
//           image: r.image ?? "",
//           image_url: r.image_url ?? toFullImageUrl(r.image ?? ""),
//           products_count: r.products_count ?? 0,
//         }));
//         setCategories(norm);
//       } catch (err) {
//         setCategoriesError(String(err?.message ?? err) || "Failed to load categories");
//         setCategories([]);
//       } finally {
//         if (!cancelled) setCategoriesLoading(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // Autoplay logic for banner (original)
//   useEffect(() => {
//     const start = () => {
//       stop();
//       autoplayRef.current = window.setInterval(() => {
//         if (!isHoveringRef.current) {
//           setCurrentBanner((p) => (banners.length ? (p + 1) % banners.length : 0));
//         }
//       }, 5000);
//     };
//     const stop = () => {
//       if (autoplayRef.current) {
//         clearInterval(autoplayRef.current);
//         autoplayRef.current = null;
//       }
//     };
//     start();
//     return () => stop();
//   }, [banners.length]);

//   // Keyboard nav for banners
//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "ArrowLeft") setCurrentBanner((p) => (banners.length ? (p - 1 + banners.length) % banners.length : 0));
//       if (e.key === "ArrowRight") setCurrentBanner((p) => (banners.length ? (p + 1) % banners.length : 0));
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [banners.length]);

//   const nextBanner = () => setCurrentBanner((p) => (banners.length ? (p + 1) % banners.length : 0));
//   const prevBanner = () => setCurrentBanner((p) => (banners.length ? (p - 1 + banners.length) % banners.length : 0));

//   return (
//     <div className="mb-4 mt-1">
//       <div
//         className="relative rounded-2xl overflow-hidden shadow-lg left-1/2 -translate-x-1/2 w-screen"
//         onMouseEnter={() => (isHoveringRef.current = true)}
//         onMouseLeave={() => (isHoveringRef.current = false)}
//       >
//         {/* States */}
//         {loading ? (
//           <div className="w-full h-90 md:h-96 lg:h-[28rem] flex items-center justify-center">
//             <div className="text-gray-500">Loading banners...</div>
//           </div>
//         ) : error ? (
//           <div className="w-full h-80 md:h-96 lg:h-[28rem] bg-red-50 text-red-600 flex items-center justify-center">
//             <div className="text-center">
//               <div className="font-semibold mb-2">Could not load banners</div>
//               <div className="text-sm">{String(error)}</div>
//             </div>
//           </div>
//         ) : banners.length === 0 ? (
//           <div className="w-full h-80 md:h-96 lg:h-[28rem] flex items-center justify-center">
//             <span className="text-gray-500">No banners available</span>
//           </div>
//         ) : (
//           // Carousel: we render each slide with an <img> to keep it crisp
//           <div
//             className="flex transition-transform duration-700 ease-in-out"
//             style={{ transform: `translateX(-${currentBanner * 100}%)`, width: `${Math.max(1, banners.length) * 100}%` }}
//           >
//             {banners.map((banner) => {
//               const src = banner.image_url || PLACEHOLDER;
//               return (
//                 <div key={banner.id} className="w-full flex-shrink-0">
//                   <div
//                     role="img"
//                     aria-label={`${banner.title ?? ""} ${banner.subtitle ?? ""}`.trim()}
//                     className="relative w-full h-200 md:h-96 lg:h-[40rem]"
//                     tabIndex={-1}
//                   >
//                     <img
//                       src={src}
//                       alt={banner.title || banner.subtitle || "Banner"}
//                       loading="eager"
//                       decoding="async"
//                       // onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
//                       className="w-full h-full object-cover object-center block"
//                     />
//                     <div className="absolute inset-0" />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Controls and dots */}
//         {!loading && banners.length > 0 && (
//           <>
//             <button
//               aria-label="Previous banner"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 prevBanner();
//               }}
//               className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center transition"
//             >
//               <ChevronLeft className="h-5 w-5 text-gray-700" />
//             </button>

//             <button
//               aria-label="Next banner"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 nextBanner();
//               }}
//               className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center transition"
//             >
//               <ChevronRight className="h-5 w-5 text-gray-700" />
//             </button>

//             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
//               {banners.map((_, i) => (
//                 <button
//                   key={i}
//                   aria-label={`go to slide ${i + 1}`}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setCurrentBanner(i);
//                   }}
//                   className={`w-3 h-3 rounded-full transition ${currentBanner === i ? "bg-white" : "bg-white/60"}`}
//                 />
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       <div className="mt-6 left-1/2 -translate-x-1/2 w-screen relative">
//         <CategoryCarousel categories={categories} loading={categoriesLoading} error={categoriesError} />
//       </div>
//     </div>
//   );
// }

// /* ---------- CategoryCarousel: Swiper-based, styled to match screenshot ---------- */
// function CategoryCarousel({ categories = [], loading, error }) {
//   if (loading) {
//     return (
//       <div className="left-1/2 -translate-x-1/2 w-screen relative">
//         <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
//           <div className="w-full h-36 flex items-center justify-center bg-gray-100 text-gray-500 rounded-xl">
//             Loading categories...
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="left-1/2 -translate-x-1/2 w-screen relative">
//         <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
//           <div className="w-full h-36 flex items-center justify-center bg-red-50 text-red-600 rounded-xl">
//             Failed to load categories: {error}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!categories || categories.length === 0) {
//     return (
//       <div className="left-1/2 -translate-x-1/2 w-screen relative">
//         <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
//           <div className="w-full h-36 flex items-center justify-center bg-gray-100 text-gray-500 rounded-xl">
//             No categories to display
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // choose slidesPerView responsive to match design
//   const breakpoints = {
//     320: { slidesPerView: 1.2, spaceBetween: 12 },
//     640: { slidesPerView: 2.2, spaceBetween: 16 },
//     768: { slidesPerView: 3.2, spaceBetween: 20 },
//     1024: { slidesPerView: 4.2, spaceBetween: 24 },
//     1280: { slidesPerView: 5.2, spaceBetween: 26 },
//     1536: { slidesPerView: 6, spaceBetween: 28 },
//   };

//   return (
//     <div className="relative left-1/2 -translate-x-1/2 w-screen">
//       <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
//         <div className="mb-4 flex items-center justify-between">
//           <h2 className="text-2xl font-bold text-gray-900">Shop by Categories</h2>
//         </div>

//         <Swiper
//           modules={[Autoplay, Pagination, Navigation]}
//           breakpoints={breakpoints}
//           navigation
//           loop={categories.length > 6}
//           autoplay={{ delay: 2800, disableOnInteraction: true }}
//           pagination={{ clickable: true }}
//           className="category-swiper py-6"
//           aria-label="Shop by categories"
//         >
//           {categories.map((category) => {
//             const src = category.image_url || category.image || PLACEHOLDER;
//             return (
//               <SwiperSlide key={String(category.id)} className="flex items-start justify-center">
//                 <div className="flex flex-col items-center w-full max-w-[220px]">
//                   {/* circular image with white background and subtle shadow */}
//                   <div className="rounded-full bg-white p-4  flex items-center justify-center w-[130px] h-[130px] overflow-hidden" >
//                     <img
//                       src={src}
//                       alt={category.name}
//                       loading="lazy"
//                       decoding="async"
//                       onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
//                       className="w-full h-full object-cover object-center rounded-full"
//                     />
//                   </div>

//                   <div className="mt-4 text-center">
//                     {/* Title styling matches screenshot: uppercase, small-serif/condensed feel using tracking & weight */}
//                     <span className="block text-sm md:text-base tracking-widest font-semibold text-emerald-800 uppercase">
//                       {category.name}
//                     </span>
//                     <span className="block text-xs text-gray-500 mt-1">{category.products_count ?? 0} Products</span>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             );
//           })}
//         </Swiper>
//         <style jsx>{`
//           :global(.category-swiper .swiper-pagination) {
//             bottom: 6px;
//             left: 50%;
//             transform: translateX(-50%);
//             width: auto;
//           }
//           :global(.category-swiper .swiper-pagination-bullet) {
//             width: 10px;
//             height: 6px;
//             border-radius: 999px;
//             background: rgba(0,0,0,0.08);
//             opacity: 1;
//             margin: 0 6px !important;
//             transition: transform .25s ease, background .25s ease;
//           }
//           :global(.category-swiper .swiper-pagination-bullet-active) {
//             background: #C75B3A; /* accent color, similar to screenshot small orange bar */
//             width: 26px;
//             height: 8px;
//             border-radius: 999px;
//           }
//           /* navigation arrows smaller and subtle */
//           :global(.category-swiper .swiper-button-next),
//           :global(.category-swiper .swiper-button-prev) {
//             color: #374151;
//             opacity: 0.9;
//             width: 20px;
//             height: 20px;
//             background: white;
//             border-radius: 999px;
//             box-shadow: 0 4px 10px rgba(15,23,42,0.08);
//           }
//           :global(.category-swiper .swiper-button-next::after),
//           :global(.category-swiper .swiper-button-prev::after) {
//             font-size: 14px;
//           }

//           /* ensure slides vertically align nicely */
//           :global(.category-swiper .swiper-slide) {
//             display: flex;
//             align-items: flex-start;
//             justify-content: center;
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import apiAxios, { API_BASE } from "@/lib/api";
import { Login_API_BASE } from "@/lib/api";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Crect fill='%23f3f4f6' width='1200' height='800'/%3E%3Ctext fill='%239ca3af' font-family='Arial, Helvetica, sans-serif' font-size='28' x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'%3EImage not available%3C/text%3E%3C/svg%3E";

/** Helper: Convert backend image path to full URL */
function toFullImageUrl(img) {
  const val = img ?? "";
  if (!val) return "";
  if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:")) return val;
  const base = (API_BASE || process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
  if (!base) return val;
  if (val.startsWith("/")) return `${base}${val}`;
  return `${base}/${val}`;
}

/** Public API call */
export async function getCategoriesPublicAPI() {
  try {
    const res = await axios.get(`${Login_API_BASE}/category/show`, { headers: { "Content-Type": "application/json" } });
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (err) {
    console.error("getCategoriesPublicAPI error:", err?.response?.data ?? err?.message ?? err);
    throw err;
  }
}

/** Main Hero Component */
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

  // Fetch banners from API
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchBanners = async () => {
      try {
        const res = await apiAxios.get("list-banners");
        if (cancelled) return;

        const payload = res?.data ?? null;
        const rows =
          Array.isArray(payload?.data) ?
            payload.data :
            Array.isArray(payload?.banners) ?
              payload.banners :
              Array.isArray(payload) ?
                payload :
                [];

        const active = rows.filter((b) => b && (b.is_active === 1 || b.is_active === true || b.is_active === "1"));
        const source = active.length ? active : rows;

        const mapped = (source || []).map((b) => ({
          id: b?.id ?? `${b?.title ?? "banner"}-${Math.random().toString(36).slice(2, 8)}`,
          title: b?.title ?? "",
          subtitle: b?.subtitle ?? "",
          discount: b?.discount ?? "",
          image_url: toFullImageUrl(b?.image_url ?? b?.image ?? ""),
          redirect_url: b?.redirect_url ?? "",
          is_active: b?.is_active ?? 0,
        }));

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

  // Fetch categories
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

  // Auto slide logic
  useEffect(() => {
    const start = () => {
      stop();
      autoplayRef.current = window.setInterval(() => {
        if (!isHoveringRef.current) {
          setCurrentBanner((p) => (banners.length ? (p + 1) % banners.length : 0));
        }
      }, 4500);
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
    <div className="mb-4 mt-1">
      <div
        className="relative overflow-hidden left-1/2 -translate-x-1/2 w-screen rounded-2xl shadow-lg"
        onMouseEnter={() => (isHoveringRef.current = true)}
        onMouseLeave={() => (isHoveringRef.current = false)}
      >
        {/* Loading / Error / Empty States */}
        {loading ? (
          <div className="w-full h-[72vh] flex items-center justify-center text-gray-500">Loading banners...</div>
        ) : error ? (
          <div className="w-full h-[72vh] flex items-center justify-center bg-red-50 text-red-600">{error}</div>
        ) : banners.length === 0 ? (
          <div className="w-full h-[72vh] flex items-center justify-center text-gray-500">No banners available</div>
        ) : (
          // ✅ Updated HeroCarousel layout using dynamic API banners
          <section className="relative w-full h-[72vh] min-h-[420px] overflow-hidden">
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentBanner * 100}%)` }}
            >
              {banners.map((b) => (
                <div key={b.id} className="relative flex-shrink-0 w-full h-full">
                  {/* Blurred background */}
                  <div
                    className="absolute inset-0 bg-center bg-cover scale-110 filter blur-[20px] brightness-95"
                    style={{ backgroundImage: `url(${b.image_url || PLACEHOLDER})` }}
                    aria-hidden="true"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f8f8f8] via-white/70 to-transparent" />

                  {/* Content */}
                  <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
                    {/* Left: Text */}
                    <div className="flex-1 max-w-2xl text-left">
                      <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                        {b.title}
                      </h2>
                      {b.subtitle && <p className="mt-4 text-lg sm:text-xl text-slate-700">{b.subtitle}</p>}
                      {b.discount && <p className="mt-2 text-sm text-emerald-700 font-medium">{b.discount}</p>}

                      {b.redirect_url && (
                        <div className="mt-8">
                          <a
                            href={b.redirect_url}
                            className="inline-block bg-slate-900 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-slate-800 transition"
                          >
                            Shop Now
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Right: Poster image */}
                    <div className="flex-shrink-0 ml-8 hidden sm:block">
                      <div className="w-[260px] sm:w-[300px] md:w-[360px] rounded-xl overflow-hidden shadow-2xl bg-white">
                        <Image
                          src={b.image_url || PLACEHOLDER}
                          alt={`${b.title || "Banner"} poster`}
                          width={360}
                          height={540}
                          className="w-full h-auto object-cover block"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <button
              aria-label="Previous"
              onClick={prevBanner}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-md text-xl z-20"
            >
              ‹
            </button>
            <button
              aria-label="Next"
              onClick={nextBanner}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-md text-xl z-20"
            >
              ›
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBanner(i)}
                  className={`w-3 h-3 rounded-full transition-transform transform ${
                    i === currentBanner ? "scale-125 bg-slate-900" : "bg-white/70"
                  }`}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Category Carousel */}
      <div className="mt-6 left-1/2 -translate-x-1/2 w-screen relative">
        <CategoryCarousel categories={categories} loading={categoriesLoading} error={categoriesError} />
      </div>
    </div>
  );
}

/* ---------- Category Carousel (unchanged) ---------- */
function CategoryCarousel({ categories = [], loading, error }) {
  if (loading)
    return (
      <div className="left-1/2 -translate-x-1/2 w-screen relative text-center py-10 text-gray-500">
        Loading categories...
      </div>
    );
  if (error)
    return (
      <div className="left-1/2 -translate-x-1/2 w-screen relative text-center py-10 text-red-600">
        Failed to load categories: {error}
      </div>
    );

  if (!categories.length)
    return (
      <div className="left-1/2 -translate-x-1/2 w-screen relative text-center py-10 text-gray-500">
        No categories to display
      </div>
    );

  const breakpoints = {
    320: { slidesPerView: 1.2, spaceBetween: 12 },
    640: { slidesPerView: 2.2, spaceBetween: 16 },
    768: { slidesPerView: 3.2, spaceBetween: 20 },
    1024: { slidesPerView: 4.2, spaceBetween: 24 },
    1280: { slidesPerView: 5.2, spaceBetween: 26 },
    1536: { slidesPerView: 6, spaceBetween: 28 },
  };

  return (
    <div className="relative left-1/2 -translate-x-1/2 w-screen">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Categories</h2>
        </div>
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          breakpoints={breakpoints}
          navigation
          loop={categories.length > 6}
          autoplay={{ delay: 2800, disableOnInteraction: true }}
          pagination={{ clickable: true }}
          className="category-swiper py-6"
        >
          {categories.map((category) => {
            const src = category.image_url || category.image || PLACEHOLDER;
            return (
              <SwiperSlide key={category.id}>
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-white p-4 flex items-center justify-center w-[130px] h-[130px] overflow-hidden shadow-sm">
                    <img
                      src={src}
                      alt={category.name}
                      className="w-full h-full object-cover object-center rounded-full"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <span className="block text-sm md:text-base tracking-widest font-semibold text-emerald-800 uppercase">
                      {category.name}
                    </span>
                    <span className="block text-xs text-gray-500 mt-1">{category.products_count ?? 0} Products</span>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
