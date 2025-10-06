"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  // Countdown target: 30 days from now (keeps the demo fresh)
  const target = React.useMemo(
    () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    []
  );
  const [timeLeft, setTimeLeft] = useState(getDelta(target));
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getDelta(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  function getDelta(t: Date) {
    const diff = Math.max(0, t.getTime() - Date.now());
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    return { d, h, m, s };
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const simpleEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!simpleEmailRegex.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    setSubscribed(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#0b1220] to-[#081126] text-white flex items-center justify-center p-6 relative">
      {/* Back Arrow Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 flex items-center space-x-2 text-white hover:text-emerald-400 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="max-w-4xl w-full bg-white/5 backdrop-blur rounded-3xl shadow-xl border border-white/10 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Banner */}
          <div className="p-10 md:p-12 flex flex-col justify-center space-y-6 relative">
            <div className="inline-flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-black text-xs font-semibold">
                Launching Soon
              </span>
              <span className="text-xs text-white/60">
                Stay tuned — big things are coming
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Something great is coming online
            </h1>
            <p className="text-sm text-white/80">
              We're working hard to build an amazing experience. Join the
              waitlist to get notified the moment we go live.
            </p>

            <div className="flex items-center space-x-4">
              <form
                onSubmit={handleSubscribe}
                className="flex-1 flex gap-2 items-center"
              >
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/10 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold text-sm shadow-sm"
                >
                  {subscribed ? "Subscribed" : "Notify Me"}
                </button>
              </form>
              <div className="text-xs text-white/60">
                No spam. Unsubscribe anytime.
              </div>
            </div>

            {error && <div className="text-sm text-rose-400">{error}</div>}

            {/* Countdown */}
            <div className="mt-4 inline-flex items-center gap-3 text-center">
              <TimeBox label="Days" value={timeLeft.d} />
              <TimeBox label="Hours" value={timeLeft.h} />
              <TimeBox label="Mins" value={timeLeft.m} />
              <TimeBox label="Secs" value={timeLeft.s} />
            </div>

            {/* decorative wave */}
            <svg
              className="absolute -right-10 -bottom-6 opacity-30 w-56"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <path
                fill="url(#g1)"
                d="M44.8,-38.7C56.8,-29,64.8,-14.5,63.4,-1.1C62,12.3,51.2,24.6,39.2,34.2C27.2,43.8,13.6,50.6,0.6,49.7C-12.5,48.8,-25,40.2,-36.1,30.3C-47.3,20.3,-57.1,9,-58.5,-3.7C-59.9,-16.4,-53,-30.6,-41.8,-40.4C-30.6,-50.3,-15.3,-55.8,-0.4,-55.3C14.6,-54.9,29.1,-48.4,44.8,-38.7Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>

          {/* Right: Visual / Mockup */}
          <div className="p-8 md:p-12 bg-gradient-to-br from-white/3 to-white/5 flex items-center justify-center">
            <div className="w-full max-w-xs text-center">
              <div className="rounded-xl p-6 bg-gradient-to-b from-white/5 to-white/3 border border-white/10 shadow-lg">
                <div className="h-40 w-full bg-gradient-to-tr from-emerald-400 to-cyan-400 rounded-lg mb-4 flex items-center justify-center text-black font-bold">
                  Online Banner Preview
                </div>
                <div className="text-sm text-white/80">
                  Bold, clear banners help convert visitors — this is a preview
                  of your future online banner and hero area.
                </div>
                <div className="mt-4 flex justify-center gap-2">
                  <button className="px-3 py-2 bg-white/10 rounded-lg text-sm">
                    Preview
                  </button>
                  <button className="px-3 py-2 bg-white/10 rounded-lg text-sm">
                    Customize
                  </button>
                </div>
              </div>

              <div className="mt-6 text-xs text-white/60">Follow us:</div>
              <div className="mt-2 flex items-center justify-center gap-3">
                <a
                  href="#"
                  aria-label="twitter"
                  className="w-8 h-8 rounded-full bg-white/6 flex items-center justify-center"
                >
                  T
                </a>
                <a
                  href="#"
                  aria-label="instagram"
                  className="w-8 h-8 rounded-full bg-white/6 flex items-center justify-center"
                >
                  I
                </a>
                <a
                  href="#"
                  aria-label="facebook"
                  className="w-8 h-8 rounded-full bg-white/6 flex items-center justify-center"
                >
                  F
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function TimeBox({ label, value }: { label: string; value: number }) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/6 px-3 py-2 rounded-lg font-mono text-lg font-semibold">
        {pad(value)}
      </div>
      <div className="text-xs text-white/60 mt-1">{label}</div>
    </div>
  );
}
