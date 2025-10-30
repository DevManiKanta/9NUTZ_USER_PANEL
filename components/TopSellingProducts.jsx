// "use client";

// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import ImageTest from "@/assests/9nutz_about.jpg"
// import Image_2 from "@/assests/test.jpg"


// export default function TopSellingProducts({ products = null }) {
//   const defaultProducts = [
//     {
//       id: "s1",
//       title: "ORGANIC SNACKS",
//       tag: "HEALTHY FOOD",
//       cta: "SHOP NOW",
//       href: "organic-snacks",
//       image: ImageTest,
//       alt: "People enjoying food - organic snacks",
//     },
//     {
//       id: "s2",
//       title: "MILLET & HEALTHY NUTS",
//       tag: "ON ALL SALES",
//       cta: "SHOP NOW",
//       href: "healthy-nuts",
//       image:"https://cdn.fcglcdn.com/brainbees/images/products/583x720/19999371a.webp",
//       alt: "Child eating millet snack",
//     },
//     {
//       id: "s3",
//       title: "HOME BASED NAMKEENS",
//       tag: "ON ALL SALES",
//       cta: "SHOP NOW",
//       href: "namkeens",
//       image: "https://th.bing.com/th/id/OIP.wppk6rpvNGN0_5aiqjF-MQHaFE?w=269&h=184&c=7&r=0&o=7&pid=1.7&rm=3",
//       alt: "Bowl of namkeens",
//     },
//   ];

//   const items = Array.isArray(products) && products.length ? products : defaultProducts;

//   return (
//     <section className="w-full bg-[#fff] py-8">
//       <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
//         <div
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//           aria-label="Top selling products"
//         >
//           {items.map((p) => (
//             <article
//               key={p.id}
//               className="relative rounded-2xl overflow-hidden shadow-sm bg-white group"
//             >
//               {/* image container: responsive heights that ramp up on larger screens */}
//               <div className="relative w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[360px] xl:h-[420px]">
//                 <Image
//                   src={p.image}
//                   alt={p.alt || p.title}
//                   fill
//                   sizes="(max-width: 640px) 640px, (max-width: 1024px) 768px, 1024px"
//                   style={{ objectFit: "cover", objectPosition: "center" }}
//                   className="transition-transform duration-700 ease-out group-hover:scale-105"
//                   priority={false}
//                 />
//                 {/* subtle gradient overlay to keep text readable */}
//                 <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
//               </div>
//               {/* content overlay */}
//               <div className="absolute inset-0 flex flex-col justify-center items-start px-5 sm:px-6 md:px-8 pb-6 pt-6">
//                 {/* small tag */}
//                 <span className="inline-block bg-white/85 text-[11px] sm:text-xs font-medium px-3 py-1 rounded-full text-emerald-800 mb-3 backdrop-blur-sm">
//                   {p.tag}
//                 </span>

//                 {/* title: center on small screens, left on md+; fluid sizing via clamp */}
//                 <h5
//   className="w-full text-white font-heading font-extrabold leading-tight tracking-wide"
//   style={{
//     // fluid text size: min 0.9rem → max 1.8rem (smaller than before)
//     fontSize: "clamp(0.9rem, 0.8rem + 1.4vw, 1.8rem)",
//     WebkitTextStroke: "0.8px #163B32", // slightly thinner stroke for smaller text
//     textShadow: "0 1px 0 rgba(0,0,0,0.12)",
//   }}
// >
//   <span className="block text-center sm:text-left">{p.title}</span>
// </h5>
//                 {/* CTA */}
//                 <div className="mt-4 md:mt-6">
//                   <Link
//                     href={p.href}
//                     className="inline-block bg-[#C75B3A] hover:bg-[#b24f33] text-white font-semibold rounded-full px-5 py-2 sm:px-6 sm:py-3 text-sm sm:text-base transition-transform transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C75B3A]"
//                     aria-label={`Shop ${p.title}`}
//                   >
//                     {p.cta}
//                   </Link>
//                 </div>
//               </div>

//               {/* rounded mask to ensure card corners are rounded (over the overlay) */}
//               <div className="pointer-events-none absolute inset-0 rounded-2xl" />
//             </article>
//           ))}
//         </div>
//       </div>

//       {/* CSS tweaks for accessibility & exact responsive behavior */}
//       <style jsx>{`
//         .font-heading {
//           /* use your Tailwind font mapping (font-heading), fallback to serif stack */
//           font-family: "Cinzel", "Playfair Display", Georgia, serif;
//         }

//         /* make title stroke gentler on smaller devices (stroke can be heavy) */
//         @media (max-width: 640px) {
//           :global(.font-heading) {
//             -webkit-text-stroke-width: 0.7px;
//           }
//           /* ensure tag and CTA spacing suits small screens */
//           :global(.group) .inline-block {
//             /* noop; placeholder if you want additional overrides */
//           }
//         }

//         /* keyboard focus visible for Links inside cards */
//         :global(a:focus) {
//           outline: 3px solid rgba(199, 91, 58, 0.18);
//           outline-offset: 2px;
//         }
//       `}</style>
//     </section>
//   );
// }

"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import ImageTest from "@/assests/9nutz_about.jpg";
import Image_2 from "@/assests/test.jpg";
import { useCategoryDataContext } from "@/contexts/CategoryDataContext";

export default function TopSellingProducts() {
  const { categories = [], loading: categoriesLoading = false } =
    useCategoryDataContext() || { categories: [], loading: false };

  // fallback images for categories without image_url
  const fallbackImages = useMemo(
    () => [
      ImageTest,
      Image_2,
      "https://images.unsplash.com/photo-1516685304081-de7947d419d5?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80&auto=format&fit=crop",
    ],
    []
  );

  // return a valid image for each category
  const getImage = (c, i) => {
    if (c?.image_url) return c.image_url;
    if (c?.image) return /^https?:\/\//.test(c.image)
      ? c.image
      : `https://9nutsapi.nearbydoctors.in/public/storage/${c.image}`;
    return fallbackImages[i % fallbackImages.length];
  };

  // build only first 3 categories
  const items = useMemo(() => {
    if (!Array.isArray(categories) || categories.length === 0) return [];
    return categories.slice(0, 3).map((c, i) => {
      const id = String(c.id ?? c._id ?? "").trim();
      const name = String(c.name ?? "Category").trim();

      return {
        id: id || `cat-${i}`,
        title: name.toUpperCase(),
        tag: "SHOP BY CATEGORY",
        cta: "SHOP NOW",
        href: `/category/${encodeURIComponent(id)}`,
        image: getImage(c, i),
        alt: `${name} category`,
      };
    });
  }, [categories]);

  return (
    <section className="w-full py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {categoriesLoading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No categories found.
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            aria-label="Top selling categories"
          >
            {items.map((p) => (
              <article
                key={p.id}
                className="relative rounded-2xl overflow-hidden shadow-sm bg-white group"
              >
                {/* image container */}
                <div className="relative w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[360px] xl:h-[420px]">
                  <Image
                    src={p.image}
                    alt={p.alt || p.title}
                    fill
                    sizes="(max-width: 640px) 640px, (max-width: 1024px) 768px, 1024px"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    className="transition-transform duration-700 ease-out group-hover:scale-105"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />
                </div>

                {/* content overlay */}
                <div className="absolute inset-0 flex flex-col justify-center items-start px-5 sm:px-6 md:px-8 pb-6 pt-6">
                  <span className="inline-block bg-white/85 text-[11px] sm:text-xs font-medium px-3 py-1 rounded-full text-emerald-800 mb-3 backdrop-blur-sm">
                    {p.tag}
                  </span>

                  <h5
                    className="w-full text-white font-heading font-extrabold leading-tight tracking-wide"
                    style={{
                      fontSize: "clamp(0.9rem, 0.8rem + 1.4vw, 1.8rem)",
                      WebkitTextStroke: "0.8px #163B32",
                      textShadow: "0 1px 0 rgba(0,0,0,0.12)",
                    }}
                  >
                    <span className="block text-center sm:text-left">
                      {p.title}
                    </span>
                  </h5>

                  <div className="mt-4 md:mt-6">
                    <Link
                      href={p.href}
                      className="inline-block bg-[#C75B3A] hover:bg-[#b24f33] text-white font-semibold rounded-full px-5 py-2 sm:px-6 sm:py-3 text-sm sm:text-base transition-transform transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C75B3A]"
                      aria-label={`Shop ${p.title}`}
                    >
                      {p.cta}
                    </Link>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-2xl pointer-events-none" />
              </article>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .font-heading {
          font-family: "Cinzel", "Playfair Display", Georgia, serif;
        }
        @media (max-width: 640px) {
          :global(.font-heading) {
            -webkit-text-stroke-width: 0.7px;
          }
        }
        :global(a:focus) {
          outline: 3px solid rgba(199, 91, 58, 0.18);
          outline-offset: 2px;
        }
      `}</style>
    </section>
  );
}

/* helper for safe slugs if needed */
function slugify(s = "") {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-")
    .replace(/[^a-z0-9\-]+/g, "-")
    .replace(/\-+/g, "-")
    .replace(/^\-+|\-+$/g, "");
}
