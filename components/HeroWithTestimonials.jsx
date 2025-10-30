// "use client";

// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import { Star } from "lucide-react";
// import Banner from '@/assests/9nutz_about.jpg'
// import { LOCAL_API_BASE } from "@/lib/api";

// export default function HeroWithTestimonials({
//   heroImage ="https://9nutz.com/wp-content/uploads/2025/07/family-having-indian-food-scaled.jpg",
//   ctaHref = "/shop",
//   slides = null,
// }) {
//   const testimonialSlides = slides ?? [
//     {
//       id: "t1",
//       quote:
//         "I'm amazed at how 9Nutz manages to blend traditional flavors with a healthy twist. Their namkeens are now a must-have for every family get-together.",
//       name: "ANJALI DESHMUKH",
//       location: "Pune",
//     },
//     {
//       id: "t2",
//       quote:
//         "The textures and freshness are outstanding — you can taste the care in every bite. Delivery was fast and packaging thoughtful.",
//       name: "RAJ KUMAR",
//       location: "Mumbai",
//     },
//     {
//       id: "t3",
//       quote:
//         "Perfect balance of crunch and spices. I reorder every month for family gatherings — never disappoints!",
//       name: "PRIYA SAINI",
//       location: "Bengaluru",
//     },
//   ];

//   return (
//     <section className="w-full mt-10">
//       {/* HERO */}
//       <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="relative rounded-2xl overflow-hidden  shadow-sm">
//           <div className="relative w-full h-[320px] md:h-[420px] lg:h-[520px]">
//             <Image
//               src={heroImage}
//               alt="Hero banner"
//               fill
//               style={{ objectFit: "cover" }}
//               sizes="(max-width: 768px) 640px, (max-width: 1200px) 1200px, 1400px"
//               priority
//             />
//             <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25" />
//             <div className="absolute inset-0 flex items-center justify-center px-6">
//               <motion.div
//                 initial={{ opacity: 0, y: 12 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6 }}
//                 className="text-center max-w-3xl"
//               >
//                 <p className="text-xs tracking-widest text-orange-400 font-medium mb-2">
//                   BLACK FRIDAYS !
//                 </p>

//                 <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold leading-tight text-emerald-900 drop-shadow-lg">
//                   <span className="block">GET UP TO 25% OFF</span>
//                   <span className="block">FIRST PURCHASE</span>
//                 </h1>

//                 <div className="mt-6 flex justify-center">
//                   {/* CTAs removed/commented intentionally */}
//                 </div>
//               </motion.div>
//             </div>

//             <div className="pointer-events-none absolute inset-0 rounded-2xl" />
//           </div>
//         </div>
//       </div>

//       {/* TESTIMONIAL CAROUSEL */}
//       <div className="mt-20 mb-5">
//         <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className="flex flex-col items-center">
//             <div className="flex items-center gap-1 mb-4">
//               {[1, 2, 3, 4, 5].map((n) => (
//                 <Star key={n} className="w-5 h-5 text-yellow-400" />
//               ))}
//             </div>

//             <h2 className="font-heading text-2xl md:text-3xl text-[#C75B3A] font-bold mb-4 tracking-wide">
//               GREAT QUALITY!
//             </h2>
//           </div>

//           <div className="mt-4">
//             <Swiper
//               modules={[Autoplay, Pagination]}
//               slidesPerView={1}
//               autoplay={{ delay: 4500, disableOnInteraction: false }}
//               pagination={{ clickable: true }}
//               loop
//               className="testimonial-swiper"
//             >
//               {testimonialSlides.map((s) => (
//                 <SwiperSlide key={s.id}>
//                   <blockquote className="px-4 md:px-12">
//                     <p className="text-lg md:text-xl text-gray-600 leading-relaxed">“{s.quote}”</p>
//                     <footer className="mt-6 text-sm text-emerald-800 font-semibold">
//                       {s.name}, <span className="font-normal text-gray-500">- {s.location}</span>
//                     </footer>
//                   </blockquote>
//                 </SwiperSlide>
//               ))}
//             </Swiper>

//             <style jsx>{`
//               :global(.testimonial-swiper .swiper-pagination) {
//                 display: flex;
//                 justify-content: center;
//                 gap: 8px;
//                 /* moved further down */
//                 margin-top: 34px;
//                 /* add extra breathing room below the carousel so dots don't collide */
//                 padding-bottom: 14px;
//               }
//               :global(.testimonial-swiper .swiper-pagination-bullet) {
//                 width: 10px;
//                 height: 10px;
//                 background: rgba(0, 0, 0, 0.12);
//                 opacity: 1;
//                 border-radius: 999px;
//                 transform: translateY(0);
//                 transition: all 0.25s ease;
//               }
//               :global(.testimonial-swiper .swiper-pagination-bullet-active) {
//                 background: #C75B3A;
//                 width: 22px;
//                 height: 8px;
//                 border-radius: 999px;
//               }

//               @media (max-width: 1024px) {
//                 :global(.testimonial-swiper .swiper-pagination) {
//                   margin-top: 38px;
//                 }
//               }

//               @media (max-width: 640px) {
//                 :global(.testimonial-swiper .swiper-slide) {
//                   padding: 0 8px;
//                 }
//                 :global(.testimonial-swiper .swiper-pagination) {
//                   margin-top: 44px;
//                   padding-bottom: 18px;
//                 }
//               }
//             `}</style>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Star } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { Login_API_BASE } from "@/lib/api";

export default function HeroWithTestimonials() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const ASSET_BASE = (process.env.NEXT_PUBLIC_API_BASE || "https://9nutsapi.nearbydoctors.in/public").replace(/\/+$/, "");
  const API_BASE = (Login_API_BASE || "https://9nutsapi.nearbydoctors.in/public/api").replace(/\/+$/, "");

  useEffect(() => {
    let cancelled = false;

    async function fetchBanners() {
      try {
        const res = await fetch(`${API_BASE}/show-all-sales-banner`, {
          headers: { "Content-Type": "application/json" },
        });

        const text = await res.text();
        const json = text ? JSON.parse(text) : {};

        if (!res.ok) {
          throw new Error(json?.message || `API error ${res.status}`);
        }

        const rows = Array.isArray(json?.data) ? json.data : [];
        const mapped = rows.map((r) => {
          // Prefer full `url` from API; fallback to image_url/image; ensure it's an absolute URL
          const maybeFull = r.url || r.image_url || r.image || "";
          const image_url = /^https?:\/\//.test(maybeFull)
            ? maybeFull
            : maybeFull
            ? `${ASSET_BASE}/${maybeFull.replace(/^\/+/, "")}`
            : "";

          return {
            id: r.id,
            title: r.title,
            subtitle: r.subtitle,
            link: r.link,
            image_url,
          };
        });

        if (!cancelled) {
          setBanners(mapped);
          // toast.success(`Loaded ${mapped.length} hero banner(s)`);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          toast.error(`Failed to load banners: ${err.message}`);
          setLoading(false);
        }
      }
    }

    fetchBanners();
    return () => {
      cancelled = true;
    };
  }, [API_BASE, ASSET_BASE]);

  // testimonials (unchanged)
  const testimonialSlides = [
    {
      id: "t1",
      quote:
        "I'm amazed at how 9Nutz manages to blend traditional flavors with a healthy twist. Their namkeens are now a must-have for every family get-together.",
      name: "ANJALI DESHMUKH",
      location: "Pune",
    },
    {
      id: "t2",
      quote:
        "The textures and freshness are outstanding — you can taste the care in every bite. Delivery was fast and packaging thoughtful.",
      name: "RAJ KUMAR",
      location: "Mumbai",
    },
    {
      id: "t3",
      quote:
        "Perfect balance of crunch and spices. I reorder every month for family gatherings — never disappoints!",
      name: "PRIYA SAINI",
      location: "Bengaluru",
    },
  ];

  return (
    <section className="w-full mt-10">
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />

      {/* HERO CAROUSEL */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop
              className="hero-swiper"
            >
              {(banners.length > 0 ? banners : []).map((b) => (
                <SwiperSlide key={b.id}>
                  <div className="relative w-full h-[320px] md:h-[420px] lg:h-[520px]">
                    {b.image_url ? (
                      <Image
                        src={b.image_url}
                        alt={b.title || "Sale banner"}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 640px, (max-width: 1200px) 1200px, 1400px"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-500">No banner image</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-white">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="max-w-2xl"
                      >
                        {b.title && (
                          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
                            {b.title}
                          </h2>
                        )}
                        {b.subtitle && (
                          <p className="text-lg md:text-xl mb-4 opacity-90">
                            {b.subtitle}
                          </p>
                        )}
                        {/* {b.link && (
                          <a
                            href={b.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-full transition"
                          >
                            Shop Now
                          </a>
                        )} */}
                      </motion.div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>

      {/* TESTIMONIAL CAROUSEL */}
      <div className="mt-20 mb-5">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className="w-5 h-5 text-yellow-400" />
              ))}
            </div>
            <h2 className="font-heading text-2xl md:text-3xl text-[#C75B3A] font-bold mb-4 tracking-wide">
              GREAT QUALITY!
            </h2>
          </div>
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            className="testimonial-swiper mt-4"
          >
            {testimonialSlides.map((s) => (
              <SwiperSlide key={s.id}>
                <blockquote className="px-4 md:px-12">
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                    “{s.quote}”
                  </p>
                  <footer className="mt-6 text-sm text-emerald-800 font-semibold">
                    {s.name},{" "}
                    <span className="font-normal text-gray-500">
                      - {s.location}
                    </span>
                  </footer>
                </blockquote>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* styles for dots */}
          <style jsx>{`
            :global(.hero-swiper .swiper-pagination-bullet),
            :global(.testimonial-swiper .swiper-pagination-bullet) {
              background: rgba(255, 255, 255, 0.5);
              opacity: 1;
              transition: all 0.25s;
            }
            :global(.hero-swiper .swiper-pagination-bullet-active),
            :global(.testimonial-swiper .swiper-pagination-bullet-active) {
              background: #c75b3a;
              width: 22px;
              height: 8px;
              border-radius: 999px;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
