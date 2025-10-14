  
"use client";

import React from "react";
import Image from "next/image";
import LOGO from "../assests/LOGO.jpg";

export default function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 bg-white z-50 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="text-center px-6">
        {/* Logo container above the brand name */}
        <div
          className="mx-auto mb-4 rounded-lg shadow-[0_10px_30px_rgba(16,24,40,0.06)] bg-white p-3 flex items-center justify-center"
          style={{ width: 320, height: 120 }}
        >
          <Image
            src={LOGO}
            alt="9NUTZ logo"
            className="object-contain"
            width={280}
            height={90}
            priority
          />
        </div>

        {/* Brand name */}
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            9 NUTZ
          </h1>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center items-center space-x-2 mb-3" aria-hidden>
          <span className="w-3 h-3 bg-green-600 rounded-full animate-bounce" />
          <span
            className="w-3 h-3 bg-green-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.12s" }}
          />
          <span
            className="w-3 h-3 bg-green-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.24s" }}
          />
        </div>

        <p className="text-gray-500 text-sm">Loading fresh groceries...</p>
      </div>
      <style jsx>{`
        /* no-op here besides keeping consistent look — tailwind's animate-bounce is used for dots */
      `}</style>
    </div>
  );
}
