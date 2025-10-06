'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, UserCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
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
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
              <p className="text-gray-600">Last updated: January 16, 2025</p>
            </div>
          </div>

          {/* Quick Overview */}
          <div className="bg-green-50 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-green-900 mb-4">Privacy at a Glance</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <Lock className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-800 text-sm">Data Protection</h3>
                  <p className="text-green-700 text-xs">We use industry-standard encryption to protect your information.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Eye className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-800 text-sm">Transparency</h3>
                  <p className="text-green-700 text-xs">Clear information about how we collect and use your data.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <UserCheck className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-800 text-sm">Your Control</h3>
                  <p className="text-green-700 text-xs">You can access, update, or delete your information anytime.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <p className="text-gray-600 mb-4">
                    We collect information you provide directly to us, such as when you create an account, 
                    make a purchase, or contact us for support.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Name and contact information (phone, email, address)</li>
                      <li>Payment information (processed securely through third parties)</li>
                      <li>Order history and preferences</li>
                      <li>Communication preferences</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Automatic Information</h3>
                  <p className="text-gray-600 mb-4">
                    We automatically collect certain information when you use our services:
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <ul className="list-disc list-inside text-blue-700 space-y-1">
                      <li>Device information (IP address, browser type, operating system)</li>
                      <li>Usage data (pages visited, time spent, features used)</li>
                      <li>Location information (with your permission)</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-6">
                We use the information we collect to provide, maintain, and improve our services:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Service Delivery</h4>
                      <p className="text-gray-600 text-sm">Process orders, payments, and deliveries</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Communication</h4>
                      <p className="text-gray-600 text-sm">Send order updates, support responses, and notifications</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Personalization</h4>
                      <p className="text-gray-600 text-sm">Customize your experience and recommend products</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Security</h4>
                      <p className="text-gray-600 text-sm">Detect and prevent fraud and abuse</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Analytics</h4>
                      <p className="text-gray-600 text-sm">Understand usage patterns and improve our services</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Legal Compliance</h4>
                      <p className="text-gray-600 text-sm">Meet regulatory requirements and legal obligations</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in these situations:
              </p>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Service Providers</h4>
                  <p className="text-gray-600 text-sm">
                    With trusted third parties who help us operate our platform (payment processors, delivery partners, customer support).
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Legal Requirements</h4>
                  <p className="text-gray-600 text-sm">
                    When required by law, court order, or government regulations.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Business Transfers</h4>
                  <p className="text-gray-600 text-sm">
                    In connection with a merger, acquisition, or sale of assets.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-blue-800 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Technical Measures</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• SSL/TLS encryption</li>
                      <li>• Secure data centers</li>
                      <li>• Access controls</li>
                      <li>• Regular security audits</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Organizational Measures</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Employee training</li>
                      <li>• Data handling policies</li>
                      <li>• Incident response procedures</li>
                      <li>• Regular compliance reviews</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights and Choices</h2>
              <p className="text-gray-600 mb-4">You have the following rights regarding your personal information:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Access & Portability</h4>
                  <p className="text-gray-600 text-sm">Request a copy of your personal data in a portable format.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Correction</h4>
                  <p className="text-gray-600 text-sm">Update or correct inaccurate personal information.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Deletion</h4>
                  <p className="text-gray-600 text-sm">Request deletion of your personal data (subject to legal requirements).</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Marketing Opt-out</h4>
                  <p className="text-gray-600 text-sm">Unsubscribe from marketing communications at any time.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="text-green-800 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-green-700">
                  <p><strong>Email:</strong> privacy@jbasket.com</p>
                  <p><strong>Phone:</strong> +91-11-4759-8900</p>
                  <p><strong>Address:</strong> Data Protection Officer, JBasket Commerce Private Limited, Gurgaon, India</p>
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