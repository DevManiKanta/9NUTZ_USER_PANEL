"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setSending(true);
    // Replace with real submit logic / API call
    await new Promise((r) => setTimeout(r, 700));
    alert("Thank you — we received your message and will get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        onLoginClick={() => {}}
        onLocationClick={() => {}}
        onCartClick={() => {}}
        cartItemCount={0}
        cartTotal={0}
      />

      <main className="pt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: contact details (DESIGN: left column in screenshot) */}
            <aside className="lg:col-span-5 xl:col-span-4">
              <h2 className="text-lg font-semibold text-emerald-800 mb-6">CONTACT INFORMATION</h2>

              <div className="grid grid-cols-1 gap-6">
                {/* Address */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-md bg-emerald-50 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">ADDRESS</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Suraram colony, Muthaiah Nagar, Hyderabad, Telangana, India
                        <br />
                        500055
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">EMAIL US</h3>
                      <p className="text-sm text-gray-600">hello@example.co</p>
                      <p className="text-sm text-gray-600">support@example.com</p>
                    </div>
                  </div>
                </div>

                {/* Telephone */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-md bg-green-50 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-700" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">TELEPHONE</h3>
                      <p className="text-sm text-gray-600 font-semibold">+91-8790598525</p>
                      <p className="text-sm text-gray-600 font-semibold">+91-9533875237</p>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-md bg-orange-50 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">WORKING HOURS</h3>
                      <p className="text-sm text-gray-600">Open: 9:00 AM – Close: 8:00 PM</p>
                      <p className="text-sm text-gray-500">Saturday – Sunday: Close</p>
                    </div>
                  </div>
                </div>

                {/* Follow Us */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">FOLLOW US</h3>
                  <div className="flex items-center gap-3">
                    <a
                      href="#"
                      className="w-9 h-9 rounded-full bg-blue-700/10 flex items-center justify-center hover:scale-105 transition"
                      aria-label="facebook"
                    >
                      <Facebook className="w-4 h-4 text-blue-700" />
                    </a>
                    <a
                      href="#"
                      className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center hover:scale-105 transition"
                      aria-label="instagram"
                    >
                      <Instagram className="w-4 h-4 text-black" />
                    </a>
                    <a
                      href="#"
                      className="w-9 h-9 rounded-full bg-red-600/10 flex items-center justify-center hover:scale-105 transition"
                      aria-label="youtube"
                    >
                      <Youtube className="w-4 h-4 text-red-600" />
                    </a>
                    <a
                      href="#"
                      className="w-9 h-9 rounded-full bg-sky-600/10 flex items-center justify-center hover:scale-105 transition"
                      aria-label="linkedin"
                    >
                      <Linkedin className="w-4 h-4 text-sky-600" />
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right: large form (DESIGN: right big heading 'LEAVE A MESSAGE' and pill inputs) */}
            <section className="lg:col-span-7 xl:col-span-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-800 mb-6 text-center md:text-left">
                  LEAVE A MESSAGE
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="w-full px-6 py-4 rounded-full border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      required
                      className="w-full px-6 py-4 rounded-full border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>

                  <div>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      className="w-full px-6 py-4 rounded-full border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>

                  <div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={8}
                      placeholder="Your message"
                      required
                      className="w-full px-6 py-5 rounded-xl border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 resize-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={sending}
                      className="inline-flex items-center gap-3 bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-medium transition"
                    >
                      <Send className="w-4 h-4" />
                      <span>{sending ? "Sending..." : "Send Message"}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Info strip below form to match screenshot spacing */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">ADDRESS</h4>
                  <p className="text-sm text-gray-600">
                    Suraram colony, Muthaiah nagar, Hyderabad, Telangana, India
                    <br />
                    500055
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">EMAIL US</h4>
                  <p className="text-sm text-gray-600">hello@example.co</p>
                  <p className="text-sm text-gray-600">support@example.com</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">WORKING HOURS</h4>
                  <p className="text-sm text-gray-600">Open: 9:00 AM – Close: 8:00 PM</p>
                  <p className="text-sm text-gray-500">Saturday – Sunday: Close</p>
                </div>
              </div>
            </section>
          </div>

          {/* Bottom additional content */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">We Value Your Feedback</h3>
              <p className="text-gray-600 max-w-3xl mx-auto mt-2">
                Your experience matters to us. Whether it's a compliment, complaint, or suggestion for improvement,
                we're committed to listening and improving your experience every day.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl text-center shadow-sm">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Quick Response</h4>
                <p className="text-sm text-gray-600">We typically respond within 2-4 hours during business hours.</p>
              </div>

              <div className="bg-white p-6 rounded-xl text-center shadow-sm">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❤️</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Personal Touch</h4>
                <p className="text-sm text-gray-600">Every message is read by our team—no bots, just real people.</p>
              </div>

              <div className="bg-white p-6 rounded-xl text-center shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Action-Oriented</h4>
                <p className="text-sm text-gray-600">We take action to resolve issues and improve our service.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
