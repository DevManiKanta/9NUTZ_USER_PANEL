// app/franchise/page.jsx
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Franchise With Us – 9Nutz",
  description: "Franchise & business opportunity — join 9Nutz for healthy snacks, sweets & namkeens.",
};

const HIGHLIGHTS = [
  "Low Investment, High Returns",
  "Strong Brand Support",
  "Premium Quality Products",
  "Bulk Supply Network for Events & Functions",
  "Growing Demand for Healthy, Natural Foods",
];

const FREE_IMAGE_SMALL = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=60";
const FREE_IMAGE_MEDIUM = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=60";
const FREE_IMAGE_LARGE = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=60";

export default function Page() {
  return (
    <>
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="p-8 sm:p-12">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 mt-1">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-100 text-yellow-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M10 2a1 1 0 01.894.553l1.618 3.237 3.578.52a1 1 0 01.554 1.705l-2.588 2.525.611 3.561a1 1 0 01-1.451 1.054L10 14.347l-3.316 1.846a1 1 0 01-1.451-1.054l.611-3.561L3.456 7.995a1 1 0 01.554-1.705l3.578-.52L9.106 2.553A1 1 0 0110 2z" />
                    </svg>
                  </span>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-800 leading-tight">
                    Franchise With Us
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Be a Part of the <span className="font-semibold text-gray-800">9Nutz</span> Success Story — Healthy Snacking & Traditional Taste.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Step into the world of Healthy Snacking & Traditional Taste. Join hands with <strong className="text-emerald-800">9Nutz</strong> — a trusted name in Millets,
                Healthy Nuts, Sweets & Namkeens.
              </p>

              <ul className="space-y-3 mb-6">
                {HIGHLIGHTS.map((h) => (
                  <li key={h} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex items-center justify-center w-7 h-7 rounded-md bg-emerald-50 text-emerald-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M20.285 6.709a1 1 0 00-1.414-1.418l-8.163 8.163-3.288-3.288a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l9.865-9.865z" />
                      </svg>
                    </span>
                    <span className="text-gray-800">{h}</span>
                  </li>
                ))}
              </ul>

              <p className="text-gray-700 font-medium mb-4">
                Own your business. Spread wellness. Taste success!
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 text-white font-medium shadow-sm hover:bg-emerald-600 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18-2h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6z" />
                  </svg>
                  Contact us to get started
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-700 text-emerald-700 font-medium hover:bg-emerald-50 transition"
                >
                  Franchise Application
                </a>
              </div>
            </div>

            <div className="relative h-64 md:h-80 lg:h-full w-full">
              <img
                src={FREE_IMAGE_MEDIUM}
                srcSet={`${FREE_IMAGE_SMALL} 600w, ${FREE_IMAGE_MEDIUM} 1000w, ${FREE_IMAGE_LARGE} 1600w`}
                sizes="(max-width: 1024px) 100vw, 50vw"
                alt="Franchise illustration – join 9Nutz"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-emerald-800 mb-3">Business Opportunity</h2>

          <p className="text-gray-700 mb-4">
            We at <strong className="text-emerald-800">9Nutz Millets</strong> believe in creating opportunities that
            empower entrepreneurs with a low-risk, scalable model. Our products are prepared with wholesome ingredients
            by people who care about delivering quality in every bag and every bite.
          </p>

          <p className="text-gray-700 mb-4">
            We focus on supporting budding women entrepreneurs — our model is designed so owners can run the business
            alongside other commitments. This convenient and affordable business model includes brand support,
            training, and access to our supply network.
          </p>

          <p className="text-gray-700 mb-4">
            The approach encourages steady growth while keeping operations simple: product quality, attractive margins,
            and demand for healthy, traditional foods make it a promising venture.
          </p>
          <div className="mt-4 text-sm text-gray-600">
            <strong>Why it works:</strong>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Low entry barrier & flexible operating hours</li>
              <li>Support & training from the 9Nutz team</li>
              <li>Access to bulk-event channels and gifting segments</li>
            </ul>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a
              href="/contact"
              className="text-sm text-gray-700 hover:underline"
            >
              Or contact our franchise team →
            </a>
          </div>
        </section>
      </div>
    </main>
    </>
  );
}
