
// "use client";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Facebook, Instagram, Youtube, Linkedin, PhoneCall, ArrowUp } from "lucide-react";
// import LogoFallback from "../assests/LOGO.jpg";
// import apiAxios, { API_BASE } from "@/lib/api";
// import Logo from "@/assests/LOGO.jpg"


// const CACHE_KEY = "site_settings_v1";
// const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// const DEFAULTS = {
//   site_name: "9nutz",
//   email: "info.9nutz@gmail.com",
//   phone: "8790598525",
//   altphone: "9533875237",
//   whatappnumber: "9988776655",
//   address: "suraram colony, muthaiah nagar, Hyderabad, Telangana, 500055",
//   logo_url: Logo, // fallback to local asset
//   favicon_url: "",
// };

// export default function Footer() {
//   const [settings, setSettings] = useState({
//     ...DEFAULTS,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Helper: build absolute URL from returned url if it's relative
//   const toAbsolute = (val) => {
//     if (!val) return "";
//     try {
//       // if absolute already, return as-is
//       const s = String(val);
//       if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:")) return s;
//       // if API_BASE is defined, use it (strip trailing slash)
//       const base = (API_BASE || process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
//       if (!base) return s;
//       // ensure slash separation
//       if (s.startsWith("/")) return `${base}${s}`;
//       return `${base}/${s}`;
//     } catch {
//       return String(val);
//     }
//   };

//   // Read cache from localStorage (if present & not expired)
//   const readCache = () => {
//     try {
//       if (typeof window === "undefined") return null;
//       const raw = localStorage.getItem(CACHE_KEY);
//       if (!raw) return null;
//       const parsed = JSON.parse(raw);
//       if (!parsed || !parsed.ts || !parsed.data) return null;
//       if (Date.now() - parsed.ts > (parsed.ttl ?? CACHE_TTL_MS)) {
//         // expired
//         localStorage.removeItem(CACHE_KEY);
//         return null;
//       }
//       return parsed.data;
//     } catch (e) {
//       console.warn("Footer: failed to read cache", e);
//       return null;
//     }
//   };

//   // Write cache
//   const writeCache = (data) => {
//     try {
//       if (typeof window === "undefined") return;
//       localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), ttl: CACHE_TTL_MS, data }));
//     } catch (e) {
//       console.warn("Footer: failed to write cache", e);
//     }
//   };
//   useEffect(() => {
//     let cancelled = false;
//     const load = async () => {
//       setLoading(true);
//       setError(null);

//       // Try cache first
//       const cached = readCache();
//       if (cached) {
//         setSettings((prev) => ({ ...prev, ...cached }));
//         setLoading(false);
//         return;
//       }

//       try {
//         // Use apiAxios if available (keeps baseURL, auth headers)
//         // Endpoint in your message: http://192.168.29.100:8000/api/settings
//         // If apiAxios is configured with baseURL '/api', then use '/settings'.
//         // Otherwise fall back to full URL.
//         let res;
//         try {
//           res = await apiAxios.get("settings");
//         } catch (innerErr) {
//           // If axios call fails (maybe baseURL not set), try absolute URL
//           try {
//             res = await apiAxios.get("settings");
//           } catch (e) {
//             // rethrow original innerErr if second attempt fails
//             throw innerErr;
//           }
//         }
//         if (cancelled) return;
//         // Normalize response shapes:
//         // Example you provided: { status: true, settings: { ... } }
//         const payload = res?.data ?? null;
//         const incoming = payload?.settings ?? payload?.data ?? payload ?? null;
//         if (!incoming || typeof incoming !== "object") {
//           throw new Error("Invalid settings response");
//         }
//         // Some fields might be nested or missing; pick safely
//         const normalized = {
//           site_name: incoming.site_name ?? incoming.name ?? DEFAULTS.site_name,
//           email: incoming.email ?? DEFAULTS.email,
//           phone: incoming.phone ?? DEFAULTS.phone,
//           altphone: incoming.altphone ?? incoming.alt_phone ?? DEFAULTS.altphone,
//           whatappnumber: incoming.whatappnumber ?? incoming.whatsapp ?? DEFAULTS.whatappnumber,
//           address: incoming.address ?? DEFAULTS.address,
//           logo_url: toAbsolute(incoming.logo_url ?? incoming.logo ?? incoming.logo_url ?? incoming.logoUrl ?? ""),
//           favicon_url: toAbsolute(incoming.favicon_url ?? incoming.favicon ?? incoming.favicon_url ?? incoming.faviconUrl ?? ""),
//           raw: incoming,
//         };

//         setSettings((prev) => ({ ...prev, ...normalized }));
//         writeCache(normalized); // write to cache
//       } catch (err) {
//         console.error("Footer: failed to load settings:", err?.response?.data ?? err?.message ?? err);
//         setError("Failed to load site settings");
//         // keep defaults in state — do not override them with undefined
//         setSettings((prev) => ({ ...prev }));
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };

//     load();

//     return () => {
//       cancelled = true;
//     };
//   }, []); // run once on mount

//   const scrollToTop = () => {
//     if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // pick logo to show: settings.logo_url if present, otherwise local fallback
//   const logoSrc = settings.logo_url || LogoFallback;
//   const emailToShow = settings.email || DEFAULTS.email;
//   const primaryPhone = settings.phone || DEFAULTS.phone;
//   const secondaryPhone = settings.altphone || DEFAULTS.altphone;
//   const whatsApp = settings.whatappnumber || DEFAULTS.whatappnumber;
//   const address = settings.address || DEFAULTS.address;

//   return (
//     <>
//       <footer className="bg-[#FBF2F1] text-gray-700 border-t border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
//             <div className="flex flex-col items-start space-y-6">
//               <div className="w-40">
//                 <Link href="/" aria-label={`${settings.site_name ?? "Home"} home`} className="inline-block">
//                   {/* Use next/image for the logo; if logoSrc is an external URL ensure next.config.js allows that domain */}
//                   <Image
//                     src={logoSrc}
//                     alt={settings.site_name ?? "9NUTZ"}
//                     width={240}
//                     height={64}
//                     className="object-contain"
//                     // priority only if needed
//                     priority={true}
//                   />
//                 </Link>
//               </div>

//               {/* Email: clickable mailto; fallback to default */}
//               <a href={`mailto:${emailToShow}`} className="text-[#b24f2f] underline font-medium text-sm">
//                 {emailToShow}
//               </a>

//               <div className="flex items-center space-x-3">
//                 <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="facebook" className="w-10 h-10 rounded-full flex items-center justify-center bg-[#4267B2] text-white shadow-sm">
//                   <Facebook className="h-4 w-4" />
//                 </a>
//                 <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="instagram" className="w-10 h-10 rounded-full flex items-center justify-center bg-[#111111] text_white shadow-sm">
//                   <Instagram className="h-4 w-4" />
//                 </a>
//                 <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="youtube" className="w-10 h-10 rounded-full flex items-center justify-center bg-[#e53935] text-white shadow-sm">
//                   <Youtube className="h-4 w-4" />
//                 </a>
//                 <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="linkedin" className="w-10 h-10 rounded-full flex items-center justify-center bg-[#0A66C2] text-white shadow-sm">
//                   <Linkedin className="h-4 w-4" />
//                 </a>
//               </div>
//             </div>

//             <div className="flex flex-col md:items-start">
//               <h4 className="text-[#0f6b4d] font-semibold text-sm mb-4">QUICK LINKS</h4>
//               <ul className="space-y-3">
//                 <li><Link href="/about" className="text-base text-gray-700 hover:text-gray-900">Our Journey</Link></li>
//                 <li><Link href="/" className="text-base text-gray-700 hover:text-gray-900">Shop</Link></li>
//                 <li><Link href="/shippingmethods" className="text-base text-gray-700 hover:text-gray-900">Shipping Methods</Link></li>
//                 <li><Link href="/franchise" className="text-base text-gray-700 hover:text-gray-900">Franchise With Us</Link></li>
//                 <li><Link href="/contact" className="text-base text-gray-700 hover:text-gray-900">Contact</Link></li>
//               </ul>
//             </div>

//             <div className="flex flex-col md:items-end md:text-right">
//               <div className="w-full">
//                 <div className="flex flex-col md:flex-row md:items-start md:justify-end md:space-x-8 gap-6">
//                   <div className="flex-1 md:flex-none md:w-48">
//                     <h4 className="text-[#0f6b4d] font-semibold text-sm mb-4">USEFUL LINKS</h4>
//                     <ul className="space-y-3 text-left md:text-right">
//                       <li><Link href="/terms" className="text-base text-gray-700 hover:text-gray-900">Terms and Condition</Link></li>
//                       <li><Link href="/shipping-methods" className="text-base text-gray-700 hover:text-gray-900">Shipping Methods</Link></li>
//                       <li><Link href="/privacy" className="text-base text-gray-700 hover:text-gray-900">Privacy policy</Link></li>
//                     </ul>
//                   </div>
//                   <div className="flex-1 md:flex-none md:w-[420px]">
//                     <h4 className="text-[#b24f2f] font-serif text-lg md:text-xl mb-4 leading-tight">
//                   suraram colony, muthaiah nagar, Hyderabad, Telangana, 500055
//                     </h4>
//                     <div className="space-y-4">
//                       <a href={`tel:${primaryPhone}`} className="group block">
//                         <div className="flex items-center border rounded-lg p-3 bg-white shadow-sm transition-transform transform group-hover:-translate-y-0.5">
//                           <div className="bg-[#b24f2f] text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 shrink-0">
//                             <PhoneCall className="w-6 h-6" />
//                           </div>
//                           <div className="flex-1">
//                             <div className="text-base font-semibold text-gray-800">{primaryPhone}</div>
//                           </div>
//                         </div>
//                       </a>

//                       <a href={`tel:${secondaryPhone}`} className="group block relative">
//                         <div className="flex items-center border rounded-lg p-3 bg-white shadow-sm transition-transform transform group-hover:-translate-y-0.5">
//                           <div className="bg-[#b24f2f] text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 shrink-0">
//                             <PhoneCall className="w-6 h-6" />
//                           </div>
//                           <div className="flex-1">
//                             <div className="text-base font-semibold text-gray-800">{secondaryPhone}</div>
//                           </div>
//                         </div>
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mt-10 border-t border-gray-200" />
//           <div className="pt-6 text-center">
//             <p className="text-sm text-gray-600">Copyright © {new Date().getFullYear()} {settings.site_name ?? DEFAULTS.site_name} – All Rights Reserved.</p>
//           </div>
//         </div>
//       </footer>

//       {/* WhatsApp floating button (preserve existing design) */}
//       <a
//         href={whatsApp ? `https://wa.me/${whatsApp.replace(/\D/g, "")}` : "https://wa.me/919530000000"}
//         target="_blank"
//         rel="noreferrer"
//         aria-label="WhatsApp"
//         className="fixed right-5 md:right-8 bottom-28 z-50"
//       >
//         <div className="w-14 h-14 rounded-full bg-green-500 shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform">
//           <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor" aria-hidden>
//             <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.672.15-.198.297-.768.966-.942 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.173.198-.297.298-.495.099-.198 0-.372-.05-.521-.05-.149-.672-1.611-.92-2.207-.242-.579-.487-.5-.672-.51l-.573-.01c-.198 0-.52.074-.792.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.064 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487  .709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.718 2.006-1.412.248-.694.248-1.289.173-1.412-.074-.124-.273-.198-.57-.347z"/>
//             <path d="M20.52 3.48A11.95 11.95 0 0012 0C5.373 0 0 5.373 0 12c0 2.116.556 4.08 1.52 5.82L0 24l6.36-1.66A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12 0-3.192-1.253-6.172-3.48-8.52zM12 22.08c-1.46 0-2.896-.395-4.146-1.141l-.296-.18-3.78.99.998-3.682-.186-.302A9.08 9.08 0 0 1 2.92 12 9.08 9.08 0 0 1 12 2.92 9.08 9.08 0 0 1 21.08 12 9.08 9.08 0 0 1 12 22.08z" />
//           </svg>
//         </div>
//       </a>

//       <button onClick={scrollToTop} aria-label="Scroll to top" className="fixed right-5 md:right-8 bottom-6 z-50 w-12 h-12 rounded-full bg-[#d98b7f] text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform">
//         <ArrowUp className="w-5 h-5" />
//       </button>
//     </>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, Linkedin, PhoneCall, ArrowUp } from "lucide-react";
import LogoFallback from "../assests/LOGO.jpg";
import apiAxios, { API_BASE } from "@/lib/api";
import Logo from "@/assests/LOGO.jpg"

const CACHE_KEY = "site_settings_v1";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const DEFAULTS = {
  site_name: "9nutz",
  email: "info.9nutz@gmail.com",
  phone: "8790598525",
  altphone: "9533875237",
  whatappnumber: "9988776655",
  address: "suraram colony, muthaiah nagar, Hyderabad, Telangana, 500055",
  logo_url: Logo, // fallback to local asset
  favicon_url: "",
};

export default function Footer() {
  const [settings, setSettings] = useState({ ...DEFAULTS });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper: build absolute URL from returned url if it's relative
  const toAbsolute = (val) => {
    if (!val) return "";
    try {
      const s = String(val);
      if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:")) return s;
      const base = (API_BASE || process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
      if (!base) return s;
      if (s.startsWith("/")) return `${base}${s}`;
      return `${base}/${s}`;
    } catch {
      return String(val);
    }
  };

  // Read cache from localStorage (if present)
  const readCache = (allowExpired = false) => {
    try {
      if (typeof window === "undefined") return null;
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.ts || !parsed.data) return null;
      if (!allowExpired && Date.now() - parsed.ts > (parsed.ttl ?? CACHE_TTL_MS)) {
        // expired
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
      return parsed.data;
    } catch (e) {
      
      return null;
    }
  };

  // Write cache
  const writeCache = (data) => {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), ttl: CACHE_TTL_MS, data }));
    } catch (e) {
      
    }
  };

  useEffect(() => {
    let cancelled = false;
    // We'll keep a reference to AbortController so we can cancel fetches when unmounting
    let controller = null;

    const fetchWithTimeout = async (url, axiosInstance, timeoutMs = 3500) => {
      // Try axios first with timeout config (if axios instance exists)
      try {
        if (axiosInstance && typeof axiosInstance.get === "function") {
          // axios get with timeout should reject if slow
          // const res = await axiosInstance.get(url, { timeout: timeoutMs });
          return res;
        }
      } catch (axErr) {
        // fallthrough to fetch fallback
        // console.warn("axios failed, will fallback to fetch:", axErr);
      }

      // fallback to fetch with AbortController + timeout
      controller = new AbortController();
      const signal = controller.signal;
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const base = (API_BASE || process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
        const fullUrl = base ? `${base}/${url.replace(/^\/+/, "")}` : url;
        // const r = await fetch(fullUrl, { signal, credentials: "include" });
        clearTimeout(timeout);
        // mimic axios response shape minimally
        const data = await r.json().catch(() => null);
        return { data, status: r.status, ok: r.ok };
      } catch (e) {
        clearTimeout(timeout);
        throw e;
      }
    };

    const load = async () => {
      setError(null);
      const stale = readCache(true); 
      if (stale) {
        setSettings((prev) => ({ ...prev, ...stale }));
        setLoading(false); // show UI fast
      } else {
        // if no cache at all, show defaults (already in state), but ensure spinner is off quickly to avoid blocking UI
        setLoading(false);
      }

      // 2) Now revalidate in background. This will update state when fresh data arrives.
      try {
        // prefer passing 'settings' to apiAxios (relative) — fallback to 'http://.../api/settings' is handled by fetchWithTimeout
        const res = await fetchWithTimeout("settings", apiAxios, 3500);
        if (cancelled) return;

        const payload = res?.data ?? null;
        const incoming = payload?.settings ?? payload?.data ?? payload ?? null;
        if (!incoming || typeof incoming !== "object") {
          throw new Error("Invalid settings response");
        }

        const normalized = {
          site_name: incoming.site_name ?? incoming.name ?? DEFAULTS.site_name,
          email: incoming.email ?? DEFAULTS.email,
          phone: incoming.phone ?? DEFAULTS.phone,
          altphone: incoming.altphone ?? incoming.alt_phone ?? DEFAULTS.altphone,
          whatappnumber: incoming.whatappnumber ?? incoming.whatsapp ?? DEFAULTS.whatappnumber,
          address: incoming.address ?? DEFAULTS.address,
          logo_url: toAbsolute(incoming.logo_url ?? incoming.logo ?? incoming.logo_url ?? incoming.logoUrl ?? ""),
          favicon_url: toAbsolute(incoming.favicon_url ?? incoming.favicon ?? incoming.favicon_url ?? incoming.faviconUrl ?? ""),
          raw: incoming,
        };

        // Only update if something changed (small optimization)
        setSettings((prev) => {
          const keys = ["site_name", "email", "phone", "altphone", "whatappnumber", "address", "logo_url", "favicon_url"];
          let changed = false;
          for (const k of keys) {
            if ((prev[k] ?? "") !== (normalized[k] ?? "")) {
              changed = true;
              break;
            }
          }
          if (changed) {
            writeCache(normalized);
            return { ...prev, ...normalized };
          }
          return prev;
        });
      } catch (err) {
        // If background fetch fails, keep stale/default data visible. Do not override.
        
        setError("Failed to refresh site settings");
        // don't set loading true — we already displayed cached/default
      } finally {
        // ensure loading is false (we already set it earlier so this is safe)
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
      try {
        if (controller) controller.abort();
      } catch (e) {}
    };
  }, []); // run once on mount

  const scrollToTop = () => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // pick logo to show: settings.logo_url if present, otherwise local fallback
  const logoSrc = settings.logo_url || LogoFallback;
  const emailToShow = settings.email || DEFAULTS.email;
  const primaryPhone = settings.phone || DEFAULTS.phone;
  const secondaryPhone = settings.altphone || DEFAULTS.altphone;
  const whatsApp = settings.whatappnumber || DEFAULTS.whatappnumber;
  const address = settings.address || DEFAULTS.address;

  return (
    <>
      <footer className="bg-[#FBF2F1] text-gray-700 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div className="flex flex-col items-start space-y-6">
              <div className="w-40">
                <Link href="/" aria-label={`${settings.site_name ?? "Home"} home`} className="inline-block">
                  {/* Use next/image for the logo; if logoSrc is an external URL ensure next.config.js allows that domain */}
                  <Image
                    src={logoSrc}
                    alt={settings.site_name ?? "9NUTZ"}
                      width={50}
                    height={50}
                    className="object-contain"
                    // priority only if needed
                    priority={true}
                  />
                </Link>
              </div>

              {/* Email: clickable mailto; fallback to default */}
              <a href={`mailto:${emailToShow}`} className="text-[#b24f2f] underline font-medium text-sm">
                {emailToShow}
              </a>

              <div className="flex items-center space-x-3">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="facebook" className="w-10 h-10 rounded-full flex items-center justify-center bg-[#4267B2] text-white shadow-sm">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="instagram" className="w-10 h-10 rounded-full flex items-center justify-center bg-[#111111] text_white shadow-sm">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="youtube" className="w-10 h-10 rounded-full flex items-center justify-center bg-[#e53935] text-white shadow-sm">
                  <Youtube className="h-4 w-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="linkedin" className="w-10 h-10 rounded-full flex items-center justify-center bg-[#0A66C2] text-white shadow-sm">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="flex flex-col md:items-start">
              <h4 className="text-[#0f6b4d] font-semibold text-sm mb-4">QUICK LINKS</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-base text-gray-700 hover:text-gray-900">Our Journey</Link></li>
                <li><Link href="/" className="text-base text-gray-700 hover:text-gray-900">Shop</Link></li>
                <li><Link href="/shippingmethods" className="text-base text-gray-700 hover:text-gray-900">Shipping Methods</Link></li>
                <li><Link href="/franchise" className="text-base text-gray-700 hover:text-gray-900">Franchise With Us</Link></li>
                <li><Link href="/contact" className="text-base text-gray-700 hover:text-gray-900">Contact</Link></li>
              </ul>
            </div>

            <div className="flex flex-col md:items-end md:text-right">
              <div className="w-full">
                <div className="flex flex-col md:flex-row md:items-start md:justify-end md:space-x-8 gap-6">
                  <div className="flex-1 md:flex-none md:w-48">
                    <h4 className="text-[#0f6b4d] font-semibold text-sm mb-4">USEFUL LINKS</h4>
                    <ul className="space-y-3 text-left md:text-right">
                      <li><Link href="/terms" className="text-base text-gray-700 hover:text-gray-900">Terms and Condition</Link></li>
                      <li><Link href="/shipping-methods" className="text-base text-gray-700 hover:text-gray-900">Shipping Methods</Link></li>
                      <li><Link href="/privacy" className="text-base text-gray-700 hover:text-gray-900">Privacy policy</Link></li>
                    </ul>
                  </div>
                  <div className="flex-1 md:flex-none md:w-[420px]">
                    <h4 className="text-[#b24f2f] font-serif text-lg md:text-xl mb-4 leading-tight">
                    {address}
                    </h4>
                    <div className="space-y-4">
                      <a href={`tel:${primaryPhone}`} className="group block">
                        <div className="flex items-center border rounded-lg p-3 bg-white shadow-sm transition-transform transform group-hover:-translate-y-0.5">
                          <div className="bg-[#b24f2f] text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 shrink-0">
                            <PhoneCall className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="text-base font-semibold text-gray-800">{primaryPhone}</div>
                          </div>
                        </div>
                      </a>

                      <a href={`tel:${secondaryPhone}`} className="group block relative">
                        <div className="flex items-center border rounded-lg p-3 bg-white shadow-sm transition-transform transform group-hover:-translate-y-0.5">
                          <div className="bg-[#b24f2f] text-white rounded-full w-12 h-12 flex items-center justify-center mr-4 shrink-0">
                            <PhoneCall className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="text-base font-semibold text-gray-800">{secondaryPhone}</div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-200" />
          <div className="pt-6 text-center">
            <p className="text-sm text-gray-600">Copyright © {new Date().getFullYear()} {settings.site_name ?? DEFAULTS.site_name} – All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp floating button (preserve existing design) */}
      <a
        href={whatsApp ? `https://wa.me/${whatsApp.replace(/\D/g, "")}` : "https://wa.me/919530000000"}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="fixed right-5 md:right-8 bottom-28 z-50"
      >
        <div className="w-14 h-14 rounded-full bg-green-500 shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.672.15-.198.297-.768.966-.942 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.173.198-.297.298-.495.099-.198 0-.372-.05-.521-.05-.149-.672-1.611-.92-2.207-.242-.579-.487-.5-.672-.51l-.573-.01c-.198 0-.52.074-.792.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.064 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487  .709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.718 2.006-1.412.248-.694.248-1.289.173-1.412-.074-.124-.273-.198-.57-.347z"/>
            <path d="M20.52 3.48A11.95 11.95 0 0012 0C5.373 0 0 5.373 0 12c0 2.116.556 4.08 1.52 5.82L0 24l6.36-1.66A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12 0-3.192-1.253-6.172-3.48-8.52zM12 22.08c-1.46 0-2.896-.395-4.146-1.141l-.296-.18-3.78.99.998-3.682-.186-.302A9.08 9.08 0 0 1 2.92 12 9.08 9.08 0 0 1 12 2.92 9.08 9.08 0 0 1 21.08 12 9.08 9.08 0 0 1 12 22.08z" />
          </svg>
        </div>
      </a>

      <button onClick={scrollToTop} aria-label="Scroll to top" className="fixed right-5 md:right-8 bottom-6 z-50 w-12 h-12 rounded-full bg-[#d98b7f] text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform">
        <ArrowUp className="w-5 h-5" />
      </button>
    </>
  );
}



