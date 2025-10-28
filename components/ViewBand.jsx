// components/FeatureStrip.jsx
"use client";

import React from "react";
import { Award, Sparkles, Truck } from "lucide-react"; // icons used; change if needed
import Image from "next/image";

const features = [
  {
    id: "quality",
    icon: <Award className="icon" />,
    title: "HIGH-QUALITY NUTZ",
    description: "Nourish Your Body with the Best: Sustainably Sourced Proteins for Your Well-being!",
  },
  {
    id: "value",
    icon: <Sparkles className="icon" />,
    title: "UNBEATABLE VALUE",
    description: "Get a range of high-quality cuts, from ground beef to filet mignon, at an amazing value.",
  },
  {
    id: "flex",
    icon: <Truck className="icon" />,
    title: "COMPLETE FLEXIBILITY",
    description: "Shipping is always FREE, we deliver to your door on your schedule, and you can cancel anytime.",
  },
];

export default function ViewBand() {
  return (
    <section className="feature-strip bg-[#EED5C2] w-[100%] mt-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 sm:py-8 md:py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-y-0 md:gap-x-6 items-start">
            {features.map((f) => (
              <article key={f.id} className="flex items-start gap-5">
                {/* ICON */}
                <div className="icon-box flex-shrink-0 w-14 h-14 rounded-full bg-white/80 shadow-md flex items-center justify-center mt-1">
                  {/* use lucide-react icons which are SVGs */}
                  <div className="text-brand-green">
                    {/* icon passed in have className 'icon' for sizing in globals.css */}
                    {f.icon}
                  </div>
                </div>

                {/* TEXT */}
                <div className="flex-1">
                  <h3 className="font-heading text-brand-green uppercase text-[14px] md:text-[16px] tracking-widest font-semibold leading-tight">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm md:text-[15px] text-gray-700 max-w-xl leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* subtle border top and bottom spacing to match screenshot */
        .feature-strip {
          border-top: 6px solid rgba(0,0,0,0.03);
        }

        /* make the white circle slightly translucent and aligned like example */
        .icon-box {
          box-shadow: 0 6px 18px rgba(14, 23, 36, 0.06);
        }

        /* adjust icon stroke color */
        .icon {
          stroke: currentColor;
          color: #1E4E3E; /* same as brand-green */
        }

        @media (max-width: 767px) {
          .feature-strip .icon-box {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </section>
  );
}
