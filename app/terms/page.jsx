'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, Shield, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLoginClick={() => {}}
        onLocationClick={() => {}}
        onCartClick={() => {}}
        cartItemCount={0}
        cartTotal={0}
      />
      
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
              <p className="text-gray-600">Last updated: January 16, 2025</p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                By accessing and using JBasket's services, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-gray-600 leading-relaxed">
                These Terms of Service ("Terms") govern your use of our website and mobile application operated by Blink Commerce Private Limited.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                JBasket is an online platform that facilitates the purchase and delivery of groceries, household items, 
                and other consumer products. We act as an intermediary between customers and our partner stores.
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Our Services Include:</h3>
                <ul className="list-disc list-inside text-green-700 space-y-1">
                  <li>Online grocery ordering and delivery</li>
                  <li>Real-time order tracking</li>
                  <li>Customer support services</li>
                  <li>Payment processing</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                To use certain features of our service, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and up-to-date information</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Orders and Payment</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Process</h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• Orders are subject to availability</li>
                    <li>• We reserve the right to refuse or cancel orders</li>
                    <li>• Prices are subject to change without notice</li>
                    <li>• Delivery times are estimates</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Terms</h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• Payment required at time of order</li>
                    <li>• Multiple payment methods accepted</li>
                    <li>• All prices include applicable taxes</li>
                    <li>• Refunds processed per our policy</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Delivery Policy</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We strive to deliver orders within the specified timeframe, typically 8-15 minutes. However, 
                delivery times may vary due to factors beyond our control including weather, traffic, and product availability.
              </p>
              <div className="flex items-start space-x-3 bg-yellow-50 p-4 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Delivery Commitment</h4>
                  <p className="text-yellow-700 text-sm">
                    While we aim for our promised delivery times, unforeseen circumstances may cause delays. 
                    We'll keep you updated throughout the process.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Prohibited Uses</h2>
              <p className="text-gray-600 leading-relaxed mb-4">You may not use our service:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>For any unlawful purpose or to solicit others to engage in unlawful acts</li>
                <li>To violate any international, federal, provincial or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <div className="bg-red-50 p-6 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">Important Notice</h4>
                    <p className="text-red-700 text-sm leading-relaxed">
                      In no case shall JBasket, our directors, officers, employees, affiliates, agents, contractors, 
                      interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or 
                      any direct, indirect, incidental, punitive, special, or consequential damages of any kind.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Email:</strong> legal@jbasket.com</p>
                  <p><strong>Phone:</strong> +91-11-4759-8900</p>
                  <p><strong>Address:</strong> JBasket Commerce Private Limited, Gurgaon, India</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}