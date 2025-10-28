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
// export default function HeroWithTestimonials({
//   heroImage = "/images/hero-people.jpg",
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
//     <section className="w-full">
//       {/* HERO */}
//       <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm">
//           {/* background image - using next/image for performance */}
//           <div className="relative w-full h-[320px] md:h-[420px] lg:h-[520px]">
//             <Image
//               src={heroImage}
//               alt="Hero banner"
//               fill
//               style={{ objectFit: "cover" }}
//               sizes="(max-width: 768px) 640px, (max-width: 1200px) 1200px, 1400px"
//               priority
//             />
//             {/* soft overlay for contrast */}
//             <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25" />
//             {/* content */}
//             <div className="absolute inset-0 flex items-center justify-center px-6">
//               <motion.div
//                 initial={{ opacity: 0, y: 12 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6 }}
//                 className="text-center max-w-3xl"
//               >
//                 <p className="text-xs tracking-widest text-orange-400 font-medium mb-2">BLACK FRIDAYS !</p>

//                 {/* headline with decorative style */}
//                 <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold leading-tight text-emerald-900 drop-shadow-lg">
//                   <span className="block">GET UP TO 25% OFF</span>
//                   <span className="block">FIRST PURCHASE</span>
//                 </h1>

//                 <p className="mt-4 text-sm md:text-base text-white/90 max-w-2xl mx-auto">
//                   Freshly prepared sweets and namkeens — handcrafted, healthy, and delivered fast.
//                 </p>

//                 <div className="mt-6 flex justify-center">
//                   <Link href={ctaHref} aria-label="Shop now">
//                     <a className="inline-block bg-[#C75B3A] hover:bg-[#b24f33] text-white font-semibold rounded-full px-6 py-3 md:px-8 md:py-4 transition-transform transform hover:-translate-y-0.5">
//                       SHOP NOW
//                     </a>
//                   </Link>
//                 </div>
//               </motion.div>
//             </div>

//             {/* rounded corners mask to ensure outer container rounded */}
//             <div className="pointer-events-none absolute inset-0 rounded-2xl" />
//           </div>
//         </div>
//       </div>

//       {/* TESTIMONIAL CAROUSEL */}
//       <div className="mt-12">
//         <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className="flex flex-col items-center">
//             {/* stars */}
//             <div className="flex items-center gap-1 mb-4">
//               {[1, 2, 3, 4, 5].map((n) => (
//                 <Star key={n} className="w-5 h-5 text-yellow-400" />
//               ))}
//             </div>

//             <h2 className="font-heading text-2xl md:text-3xl text-[#C75B3A] font-bold mb-4 tracking-wide">GREAT QUALITY!</h2>
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
//                     <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
//                       “{s.quote}”
//                     </p>
//                     <footer className="mt-6 text-sm text-emerald-800 font-semibold">
//                       {s.name}, <span className="font-normal text-gray-500">- {s.location}</span>
//                     </footer>
//                   </blockquote>
//                 </SwiperSlide>
//               ))}
//             </Swiper>

//             {/* custom pagination styling - placed inline */}
//             <style jsx>{`
//               :global(.testimonial-swiper .swiper-pagination) {
//                 display: flex;
//                 justify-content: center;
//                 gap: 8px;
//                 margin-top: 18px;
//               }
//               :global(.testimonial-swiper .swiper-pagination-bullet) {
//                 width: 10px;
//                 height: 10px;
//                 background: rgba(0,0,0,0.12);
//                 opacity: 1;
//                 border-radius: 999px;
//                 transform: translateY(0);
//                 transition: all .25s ease;
//               }
//               :global(.testimonial-swiper .swiper-pagination-bullet-active) {
//                 background: #C75B3A;
//                 width: 22px;
//                 height: 8px;
//                 border-radius: 999px;
//               }

//               /* hero rounded corners and container spacing at narrower sizes */
//               @media (max-width: 640px) {
//                 :global(.testimonial-swiper .swiper-slide) {
//                   padding: 0 8px;
//                 }
//               }
//             `}</style>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// components/HeroWithTestimonials.jsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Star } from "lucide-react";
import Banner from '@/assests/9nutz_about.jpg'

export default function HeroWithTestimonials({
  heroImage ="https://9nutz.com/wp-content/uploads/2025/07/family-having-indian-food-scaled.jpg",
  ctaHref = "/shop",
  slides = null,
}) {
  const testimonialSlides = slides ?? [
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
      {/* HERO */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden  shadow-sm">
          <div className="relative w-full h-[320px] md:h-[420px] lg:h-[520px]">
            <Image
              src={heroImage}
              alt="Hero banner"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 640px, (max-width: 1200px) 1200px, 1400px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25" />
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-3xl"
              >
                <p className="text-xs tracking-widest text-orange-400 font-medium mb-2">
                  BLACK FRIDAYS !
                </p>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold leading-tight text-emerald-900 drop-shadow-lg">
                  <span className="block">GET UP TO 25% OFF</span>
                  <span className="block">FIRST PURCHASE</span>
                </h1>

                {/* <p className="mt-4 text-sm md:text-base text-white/90 max-w-2xl mx-auto">
                  Freshly prepared sweets and namkeens — handcrafted, healthy, and delivered fast.
                </p> */}

                <div className="mt-6 flex justify-center">
                  {/* <--- Use Link without nested <a> to satisfy Next.js App Router --->
                      Put classes directly on Link */}
                  {/* <Link
                    href={ctaHref}
                    className="inline-block bg-[#C75B3A] hover:bg-[#b24f33] text-white font-semibold rounded-full px-6 py-3 md:px-8 md:py-4 transition-transform transform hover:-translate-y-0.5"
                    aria-label="Shop now"
                  >
                    SHOP NOW
                  </Link> */}
                </div>
              </motion.div>
            </div>

            <div className="pointer-events-none absolute inset-0 rounded-2xl" />
          </div>
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

          <div className="mt-4">
            <Swiper
              modules={[Autoplay, Pagination]}
              slidesPerView={1}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop
              className="testimonial-swiper"
            >
              {testimonialSlides.map((s) => (
                <SwiperSlide key={s.id}>
                  <blockquote className="px-4 md:px-12">
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed">“{s.quote}”</p>
                    <footer className="mt-6 text-sm text-emerald-800 font-semibold">
                      {s.name}, <span className="font-normal text-gray-500">- {s.location}</span>
                    </footer>
                  </blockquote>
                </SwiperSlide>
              ))}
            </Swiper>

            <style jsx>{`
              :global(.testimonial-swiper .swiper-pagination) {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-top: 18px;
              }
              :global(.testimonial-swiper .swiper-pagination-bullet) {
                width: 10px;
                height: 10px;
                background: rgba(0, 0, 0, 0.12);
                opacity: 1;
                border-radius: 999px;
                transform: translateY(0);
                transition: all 0.25s ease;
              }
              :global(.testimonial-swiper .swiper-pagination-bullet-active) {
                background: #C75B3A;
                width: 22px;
                height: 8px;
                border-radius: 999px;
              }

              @media (max-width: 640px) {
                :global(.testimonial-swiper .swiper-slide) {
                  padding: 0 8px;
                }
              }
            `}</style>
          </div>
        </div>
      </div>
    </section>
  );
}

