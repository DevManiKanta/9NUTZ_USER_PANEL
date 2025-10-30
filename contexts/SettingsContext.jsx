// app/contexts/SettingsContext.jsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import apiAxios, { API_BASE } from "@/lib/api";

const CACHE_KEY = "site_settings_v1";
const CACHE_TTL_MS = 10 * 60 * 1000;

const DEFAULTS = {
  site_name: "9nutz",
  email: "info.9nutz@gmail.com",
  phone: "8790598525",
  altphone: "9533875237",
  whatappnumber: "9988776655",
  address: "suraram colony, muthaiah nagar, Hyderabad, Telangana, 500055",
  logo_url: null,
  favicon_url: "",
};

const SettingsContext = createContext({
  settings: DEFAULTS,
  loading: true,
  refresh: async () => {},
});

export const useSettings = () => useContext(SettingsContext);

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

const readCache = (allowExpired = false) => {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.ts || !parsed.data) return null;
    if (!allowExpired && Date.now() - parsed.ts > (parsed.ttl ?? CACHE_TTL_MS)) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return parsed.data;
  } catch (e) {
    
    return null;
  }
};

const writeCache = (data) => {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), ttl: CACHE_TTL_MS, data }));
  } catch (e) {
    
  }
};

const fetchWithTimeout = async (url, axiosInstance, timeoutMs = 3500) => {
  try {
    if (axiosInstance && typeof axiosInstance.get === "function") {
      return await axiosInstance.get(url, { timeout: timeoutMs });
    }
  } catch (_) {
    // fallthrough to fetch
  }

  const controller = new AbortController();
  const signal = controller.signal;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const base = (API_BASE || process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
    const fullUrl = base ? `${base}/${url.replace(/^\/+/, "")}` : url;
    const r = await fetch(fullUrl, { signal, credentials: "include" });
    clearTimeout(timeout);
    const data = await r.json().catch(() => null);
    return { data, status: r.status, ok: r.ok };
  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const normalize = (incoming) => {
    if (!incoming || typeof incoming !== "object") return DEFAULTS;
    return {
      site_name: incoming.site_name ?? incoming.name ?? DEFAULTS.site_name,
      email: incoming.email ?? DEFAULTS.email,
      phone: incoming.phone ?? DEFAULTS.phone,
      altphone: incoming.altphone ?? incoming.alt_phone ?? DEFAULTS.altphone,
      whatappnumber: incoming.whatappnumber ?? incoming.whatsapp ?? DEFAULTS.whatappnumber,
      address: incoming.address ?? DEFAULTS.address,
      logo_url: toAbsolute(incoming.logo_url ?? incoming.logo ?? incoming.logoUrl ?? ""),
      favicon_url: toAbsolute(incoming.favicon_url ?? incoming.favicon ?? incoming.faviconUrl ?? ""),
      raw: incoming,
    };
  };

  const refresh = async () => {
    try {
      const res = await fetchWithTimeout("settings", apiAxios, 3500);
      const payload = res?.data ?? null;
      const incoming = payload?.settings ?? payload?.data ?? payload ?? null;
      if (!incoming || typeof incoming !== "object") return;
      const normalized = normalize(incoming);
      writeCache(normalized);
      setSettings((prev) => ({ ...prev, ...normalized }));
    } catch (err) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const stale = readCache(true);
      if (stale) {
        setSettings((prev) => ({ ...prev, ...stale }));
        setLoading(false);
      } else {
        setLoading(false);
      }
      // revalidate in background
      await refresh();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
