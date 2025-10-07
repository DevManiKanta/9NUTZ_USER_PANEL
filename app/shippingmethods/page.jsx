

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FREE_SHIPPING_THRESHOLD = 799; 

export const metadata = {
  title: "Shipping Methods – 9Nutz",
  description:
    "Shipping options, delivery areas, bulk orders, tracking and timings for 9Nutz.",
};

export default function ShippingMethods() {
  return (
    <>
    <Header/>
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Shipping Methods</h1>
        <p className="mt-2 text-sm text-gray-600">
          At <span className="font-semibold">9Nutz</span>, we ensure your favorite Millets, Healthy Nuts,
          Sweets, and Namkeens are delivered safely and on time across India.
        </p>
      </header>

      <section className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Shipping Options</h2>
        <p className="text-sm text-gray-600 mb-4">
          We offer reliable delivery services through trusted logistics partners. Based on your location and order type,
          we provide:
        </p>

        <ul className="space-y-3 text-gray-700">
          <li>
            <strong>Standard Delivery:</strong> 3–7 business days (for regular orders).
          </li>
          <li>
            <strong>Express Delivery:</strong> 1–3 business days (available in select locations).
          </li>
          <li>
            <strong>Bulk & Event Orders:</strong> Custom delivery schedules are arranged based on event dates and volume.
          </li>
        </ul>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Delivery Areas</h2>
        <p className="text-sm text-gray-600 mb-3">
          We currently ship across India — covering metros, tier-2, and tier-3 cities.
        </p>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>For remote areas or custom delivery requests, our team will reach out after order confirmation.</li>
          <li>International shipping is currently not available.</li>
        </ul>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Bulk Orders & Event Deliveries</h2>
        <p className="text-sm text-gray-600 mb-3">
          For large orders (e.g., weddings, functions, or office events):
        </p>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>Orders must be placed at least <strong>7 days</strong> in advance.</li>
          <li>Custom packaging and scheduled deliveries can be arranged.</li>
          <li>Shipping charges may vary depending on quantity and distance.</li>
        </ul>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Shipping Charges</h2>
        <p className="text-sm text-gray-600 mb-3">
          <strong>Free shipping</strong> on orders above <strong>₹{Number(FREE_SHIPPING_THRESHOLD).toLocaleString("en-IN")}</strong>.
        </p>
        <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-3">
          <li>For orders below this amount, a nominal shipping fee will apply based on location and weight.</li>
          <li>Any extra delivery charges (for express or special handling) will be notified during checkout.</li>
        </ul>

        <div className="text-sm text-gray-500">
          Tip: You can update the free shipping threshold by editing the <code className="bg-gray-100 px-1 rounded">FREE_SHIPPING_THRESHOLD</code> constant in this file.
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Order Tracking</h2>
        <p className="text-sm text-gray-600 mb-3">
          Once your order is shipped, a tracking ID and courier details will be shared via email / SMS. You can track the status of your shipment on the courier’s website.
        </p>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Delivery Delays</h2>
        <p className="text-sm text-gray-600 mb-3">
          While we strive to ensure timely delivery, delays may occur due to:
        </p>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>Weather conditions</li>
          <li>Courier issues</li>
          <li>Festive rush or public holidays</li>
          <li>Remote or restricted delivery zones</li>
        </ul>
        <p className="text-sm text-gray-500 mt-3">
          We will keep you informed in case of any delay.
        </p>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Delivery Hours</h2>
        <p className="text-sm text-gray-600">
          Deliveries are typically made between <strong>9:00 AM to 8:00 PM</strong>, Monday to Saturday.
          Sunday or holiday delivery depends on local courier policies.
        </p>
      </section>

      <footer className="mt-4 text-sm text-gray-500">
        <p>
          For special requests, custom packaging, or help with an order, reach out to our support team at{" "}
          <a href="mailto:support@9nutz.example" className="text-rose-600 hover:underline">support@9nutz.example</a>.
        </p>
      </footer>
    </main>
    <Footer/>   
    </>
  );
}
