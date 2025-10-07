// "use client";

// import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

// const usefulLinks = [
//   { label: 'Blog', href: '/blog' },
//   { label: 'Privacy', href: '/privacy' },
//   { label: 'Terms', href: '/terms' },
//   { label: 'FAQs', href: '/faqs' },
//   { label: 'Security', href: '/security' },
//   { label: 'Contact', href: '/contact' },
//   { label: 'Partner', href: '/partner' },
//   { label: 'Franchise', href: '/franchise' },
//   { label: 'Seller', href: '/seller' },
//   { label: 'Warehouse', href: '/warehouse' },
//   { label: 'Deliver', href: '/deliver' },
//   { label: 'Resources', href: '/resources' },
//   { label: 'Recipes', href: '/recipes' },
//   { label: 'Bistro', href: '/bistro' },
//   { label: 'District', href: '/district' }
// ];

// const categories = [
//   'Vegetables & Fruits', 'Dairy & Breakfast', 'Munchies', 'Cold Drinks & Juices',
//   'Instant & Frozen Food', 'Tea Coffee & Health Drinks', 'Bakery & Biscuits',
//   'Sweet Tooth', 'Atta Rice & Dal', 'Masala Oil & More', 'Sauce & Spreads',
//   'Chicken Meat & Fish', 'Paan Corner', 'Organic & Premium', 'Baby Care',
//   'Pharma & Wellness', 'Cleaning Essentials', 'Home & Office', 'Personal Care', 'Pet Care'
// ];

// export default function Footer() {
//   const handleLinkClick = (href: string) => {
//     if (href.startsWith('/')) {
//       window.location.href = href;
//     }
//   };

//   const handleCategoryClick = (category: string) => {
//     // Convert category name to slug format for navigation
//     const slug = category.toLowerCase().replace(/[&\s]+/g, '-').replace(/[^a-z0-9-]/g, '');
//     window.location.href = `/category/${slug}`;
//   };

//   return (
//     <footer className="bg-white border-t border-gray-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Compact Link Sections - Organized in horizontal rows */}
//         <div className="mb-6">
//           {/* Row 1: Main Navigation Links */}
//           <div className="mb-4">
//             <h3 className="font-semibold text-gray-900 mb-3 text-sm">Quick Links</h3>
//             <div className="flex flex-wrap gap-x-6 gap-y-2">
//               {usefulLinks.slice(0, 8).map((link, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleLinkClick(link.href)}
//                   className="text-gray-600 hover:text-gray-900 transition-colors text-sm py-1 cursor-pointer"
//                 >
//                   {link.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Row 2: Business Links */}
//           <div className="mb-4">
//             <h3 className="font-semibold text-gray-900 mb-3 text-sm">Business</h3>
//             <div className="flex flex-wrap gap-x-6 gap-y-2">
//               {usefulLinks.slice(8).map((link, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleLinkClick(link.href)}
//                   className="text-gray-600 hover:text-gray-900 transition-colors text-sm py-1 cursor-pointer"
//                 >
//                   {link.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Row 3: Categories - Compact horizontal layout */}
//           <div className="mb-4">
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="font-semibold text-gray-900 text-sm">Categories</h3>
//               <button 
//                 onClick={() => window.location.href = '/categories'}
//                 className="text-green-600 hover:text-green-700 font-medium text-sm"
//               >
//                 see all
//               </button>
//             </div>
//             <div className="flex flex-wrap gap-x-4 gap-y-1">
//               {categories.slice(0, 12).map((category, index) => (
//                 <button
//                   key={index}
//                   onClick={() => handleCategoryClick(category)}
//                   className="text-gray-600 hover:text-gray-900 transition-colors text-sm py-1"
//                 >
//                   {category}
//                 </button>
//               ))}
//               <button
//                 onClick={() => window.location.href = '/categories'}
//                 className="text-green-600 hover:text-green-700 transition-colors text-sm py-1 font-medium"
//               >
//                 +{categories.length - 12} more
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* App Download and Social Links - Compact row */}
//         <div className="flex flex-col lg:flex-row items-center justify-between py-4 border-t border-gray-200 gap-4">
//           <div className="flex items-center space-x-4">
//             <span className="text-gray-700 font-medium text-sm">Download JBasket App</span>
//             <a 
//               href="https://apps.apple.com/app/jbasket" 
//               target="_blank" 
//               rel="noopener noreferrer"
//               className="hover:opacity-80 transition-opacity"
//             >
//               <div className="bg-black text-white rounded-lg px-3 py-2 flex items-center space-x-2 h-9">
//                 <div className="text-white">
//                   <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
//                   </svg>
//                 </div>
//                 <div className="text-xs">
//                   <div className="text-xs opacity-80 leading-tight">Download</div>
//                   <div className="font-semibold -mt-1 leading-tight">App Store</div>
//                 </div>
//               </div>
//             </a>
//             <a 
//               href="https://play.google.com/store/apps/details?id=com.jbasket" 
//               target="_blank" 
//               rel="noopener noreferrer"
//               className="hover:opacity-80 transition-opacity"
//             >
//               <div className="bg-black text-white rounded-lg px-3 py-2 flex items-center space-x-2 h-9">
//                 <div className="text-white">
//                   <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
//                   </svg>
//                 </div>
//                 <div className="text-xs">
//                   <div className="text-xs opacity-80 leading-tight">Get it on</div>
//                   <div className="font-semibold -mt-1 leading-tight">Google Play</div>
//                 </div>
//               </div>
//             </a>
//           </div>

//           <div className="flex items-center space-x-3">
//             {[
//               { Icon: Facebook, href: 'https://facebook.com/jbasket' },
//               { Icon: Twitter, href: 'https://twitter.com/jbasket' },
//               { Icon: Instagram, href: 'https://instagram.com/jbasket' },
//               { Icon: Linkedin, href: 'https://linkedin.com/company/jbasket' },
//               { Icon: Github, href: 'https://github.com/jbasket' }
//             ].map(({ Icon, href }, index) => (
//               <a
//                 key={index}
//                 href={href}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
//               >
//                 <Icon className="h-4 w-4" />
//               </a>
//             ))}
//           </div>
//         </div>

//         {/* Copyright - Minimal */}
//         <div className="text-center pt-4 border-t border-gray-200">
//           <p className="text-sm text-gray-600 mb-2">
//             © JBasket Commerce Private Limited, 2016-2025
//           </p>
//           <p className="text-xs text-gray-500 leading-relaxed max-w-4xl mx-auto">
//             "JBasket" is owned & managed by "JBasket Commerce Private Limited" and is not related to "GROFFR.COM" 
//             which is a real estate services business operated by "Redstone Consultancy Services Private Limited".
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  PhoneCall,
  ArrowUp,
} from "lucide-react";
import Logo from "../assests/LOGO.jpg"; // adjust path if required

export default function Footer() {
  // scroll to top handler for the round button
  const scrollToTop = () => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="bg-[#FBF2F1] text-gray-700 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 3-column grid on md+, stacked on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            {/* LEFT: Logo / Email / Social */}
            <div className="flex flex-col items-start space-y-6">
              <div className="w-40">
                <Link href="/" aria-label="9NUTZ home" className="inline-block">
                  {/* next/image requires width/height props for static imports; adjust if necessary */}
                  <Image src={Logo} alt="9NUTZ" priority className="object-contain" />
                </Link>
              </div>

              <a
                href="mailto:info.9nutz@gmail.com"
                className="text-[#b24f2f] underline font-medium text-sm"
              >
                info.9nutz@gmail.com
              </a>

              <div className="flex items-center space-x-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="facebook"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[#4267B2] text-white shadow-sm"
                >
                  <Facebook className="h-4 w-4" />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="instagram"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[#111111] text-white shadow-sm"
                >
                  <Instagram className="h-4 w-4" />
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="youtube"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[#e53935] text-white shadow-sm"
                >
                  <Youtube className="h-4 w-4" />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="linkedin"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[#0A66C2] text-white shadow-sm"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* CENTER: Quick Links */}
            <div className="flex flex-col md:items-start">
              <h4 className="text-[#0f6b4d] font-semibold text-sm mb-4">QUICK LINKS</h4>
              <ul className="space-y-3">
                {/* <li><Link href="/" className="text-base text-gray-700 hover:text-gray-900">Home</Link></li> */}
                <li><Link href="/" className="text-base text-gray-700 hover:text-gray-900"></Link></li>
                <li><Link href="/about" className="text-base text-gray-700 hover:text-gray-900">Our Journey</Link></li>
                <li><Link href="/" className="text-base text-gray-700 hover:text-gray-900">Shop</Link></li>
                <li><Link href="/shippingmethods" className="text-base text-gray-700 hover:text-gray-900">Shipping Methods</Link></li>
                <li><Link href="/franchise" className="text-base text-gray-700 hover:text-gray-900">Franchise With Us</Link></li>
                {/* <li><Link href="/" className="text-base text-gray-700 hover:text-gray-900">Brochure</Link></li> */}
                <li><Link href="/contact" className="text-base text-gray-700 hover:text-gray-900">Contact</Link></li>
              </ul>
            </div>
            {/* RIGHT: Useful Links and Store Location SIDE BY SIDE on md+, stacked on mobile */}
            <div className="flex flex-col md:items-end md:text-right">
              <div className="w-full">
                {/* make two columns inside this right area on md+ */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-end md:space-x-8 gap-6">
                  {/* Useful Links (left of the two) */}
                  <div className="flex-1 md:flex-none md:w-48">
                    <h4 className="text-[#0f6b4d] font-semibold text-sm mb-4">USEFUL LINKS</h4>
                    <ul className="space-y-3 text-left md:text-right">
                      <li><Link href="/terms" className="text-base text-gray-700 hover:text-gray-900">Terms and Condition</Link></li>
                      <li><Link href="/shipping-methods" className="text-base text-gray-700 hover:text-gray-900">Shipping Methods</Link></li>
                      <li><Link href="/privacy" className="text-base text-gray-700 hover:text-gray-900">Privacy policy</Link></li>
                    </ul>
                  </div>

                  {/* Store Location (right of the two) */}
                  <div className="flex-1 md:flex-none md:w-[420px]">
                    <h4 className="text-[#b24f2f] font-serif text-lg md:text-xl mb-4 leading-tight">
                      suraram colony, muthaiah nagar,<br />Hyderabad, Telangana, 500055
                    </h4>

                    <div className="space-y-4">
                      {/* Phone card 1 */}
                      <a href="tel:8790598525" className="group block">
                        <div className="flex items-center border rounded-lg p-3 bg-white shadow-sm transition-transform transform group-hover:-translate-y-0.5">
                          <div className="bg-[#b24f2f] text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 shrink-0">
                            <PhoneCall className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="text-base font-semibold text-gray-800">8790598525</div>
                          </div>
                        </div>
                      </a>

                      {/* Phone card 2 */}
                      <a href="tel:9533875237" className="group block relative">
                        <div className="flex items-center border rounded-lg p-3 bg-white shadow-sm transition-transform transform group-hover:-translate-y-0.5">
                          <div className="bg-[#b24f2f] text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 shrink-0">
                            <PhoneCall className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="text-base font-semibold text-gray-800">9533875237</div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div> {/* end two-column right area */}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-10 border-t border-gray-200" />

          {/* Bottom copyright */}
          <div className="pt-6 text-center">
            <p className="text-sm text-gray-600">Copyright © 2025 9nutz– All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp bubble (right-middle) */}
      <a
        href="https://wa.me/919530000000" /* replace with real number */
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="fixed right-5 md:right-8 bottom-28 z-50"
      >
        <div className="w-14 h-14 rounded-full bg-green-500 shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform">
          {/* WhatsApp SVG (simple) */}
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.672.15-.198.297-.768.966-.942 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.173.198-.297.298-.495.099-.198 0-.372-.05-.521-.05-.149-.672-1.611-.92-2.207-.242-.579-.487-.5-.672-.51l-.573-.01c-.198 0-.52.074-.792.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.064 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487  .709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.718 2.006-1.412.248-.694.248-1.289.173-1.412-.074-.124-.273-.198-.57-.347z"/>
            <path d="M20.52 3.48A11.95 11.95 0 0012 0C5.373 0 0 5.373 0 12c0 2.116.556 4.08 1.52 5.82L0 24l6.36-1.66A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12 0-3.192-1.253-6.172-3.48-8.52zM12 22.08c-1.46 0-2.896-.395-4.146-1.141l-.296-.18-3.78.99.998-3.682-.186-.302A9.08 9.08 0 0 1 2.92 12 9.08 9.08 0 0 1 12 2.92 9.08 9.08 0 0 1 21.08 12 9.08 9.08 0 0 1 12 22.08z" />
          </svg>
        </div>
      </a>

      {/* Scroll to top button bottom-right (circular) */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed right-5 md:right-8 bottom-6 z-50 w-12 h-12 rounded-full bg-[#d98b7f] text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </>
  );
}


