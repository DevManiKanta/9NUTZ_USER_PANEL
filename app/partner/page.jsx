'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Store, Truck, Users, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PartnerPage() {
  const [partnerType, setPartnerType] = useState('store');

  const benefits = [
    {
      icon: TrendingUp,
      title: "Increased Sales",
      description: "Access to our large customer base and boost your revenue significantly."
    },
    {
      icon: Truck,
      title: "Fast Delivery Network",
      description: "Leverage our quick delivery infrastructure to reach customers in minutes."
    },
    {
      icon: Users,
      title: "Marketing Support",
      description: "Benefit from our marketing campaigns and promotional activities."
    },
    {
      icon: CheckCircle,
      title: "Easy Integration",
      description: "Simple onboarding process with dedicated support throughout."
    }
  ];

  const steps = [
    {
      step: 1,
      title: "Apply Online",
      description: "Fill out our partnership application form with your business details."
    },
    {
      step: 2,
      title: "Verification",
      description: "Our team will verify your documents and business credentials."
    },
    {
      step: 3,
      title: "Onboarding",
      description: "Complete the setup process and product listing with our support."
    },
    {
      step: 4,
      title: "Go Live",
      description: "Start receiving orders and growing your business with JBasket."
    }
  ];

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Hero Stats */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">20+</div>
              <div className="text-gray-600">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
              <div className="text-gray-600">Dark Stores</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">10M+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">8 min</div>
              <div className="text-gray-600">Average Delivery</div>
            </div>
          </div>

          {/* Partnership Types */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Choose Your Partnership</h2>
            
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setPartnerType('store')}
                  className={`px-6 py-3 rounded-md font-medium transition-colors ${
                    partnerType === 'store' 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Store Partner
                </button>
                <button
                  onClick={() => setPartnerType('delivery')}
                  className={`px-6 py-3 rounded-md font-medium transition-colors ${
                    partnerType === 'delivery' 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Delivery Partner
                </button>
              </div>
            </div>

            {partnerType === 'store' ? (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Become a Store Partner</h3>
                    <p className="text-gray-600 mb-6">
                      List your products on JBasket and reach millions of customers. Whether you're a local grocery store, 
                      pharmacy, or any retail business, we'll help you grow your sales exponentially.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">Zero Commission for First Month</div>
                          <div className="text-sm text-gray-600">No fees for your initial 30 days</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">Inventory Management</div>
                          <div className="text-sm text-gray-600">Track stock levels and automate reordering</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">Marketing Support</div>
                          <div className="text-sm text-gray-600">Feature in promotions and campaigns</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-8 rounded-xl">
                    <h4 className="text-xl font-bold text-gray-900 mb-6">Requirements:</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li>• Valid business license and GST registration</li>
                      <li>• Physical store or warehouse space</li>
                      <li>• Quality products with proper packaging</li>
                      <li>• Commitment to maintain inventory levels</li>
                      <li>• Basic smartphone for order management</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Become a Delivery Partner</h3>
                    <p className="text-gray-600 mb-6">
                      Join our delivery fleet and earn attractive income with flexible working hours. 
                      Be part of the team that makes 8-minute deliveries possible.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">Competitive Earnings</div>
                          <div className="text-sm text-gray-600">₹15,000 - ₹30,000 per month potential</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">Flexible Hours</div>
                          <div className="text-sm text-gray-600">Choose your working schedule</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">Weekly Payouts</div>
                          <div className="text-sm text-gray-600">Get paid every week, guaranteed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-8 rounded-xl">
                    <h4 className="text-xl font-bold text-gray-900 mb-6">Requirements:</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li>• Own a smartphone (Android 6.0+)</li>
                      <li>• Two-wheeler with valid registration</li>
                      <li>• Valid driving license</li>
                      <li>• 18+ years of age</li>
                      <li>• Basic English/local language skills</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Partner With Us?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={step.step} className="relative">
                  <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                      {step.step}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Partner With Us?</h2>
            <p className="text-xl mb-8 text-green-100">
              Join thousands of successful partners and start growing your business today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Apply as Store Partner
              </button>
              <button className="bg-green-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-400 transition-colors">
                Apply as Delivery Partner
              </button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-green-500">
              <p className="text-green-100 mb-4">Need more information?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
                <a href="tel:+911147598900" className="text-white hover:text-green-200">
                  📞 +91-11-4759-8900
                </a>
                <a href="mailto:partnerships@JBasket.com" className="text-white hover:text-green-200">
                  ✉️ partnerships@JBasket.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}