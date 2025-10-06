'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Minus, HelpCircle, Clock, Truck, CreditCard, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function FAQsPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "How fast is your delivery?",
      answer: "We deliver groceries and essentials in 8-15 minutes. Our network of micro-warehouses ensures the fastest delivery times in your area.",
      category: "delivery"
    },
    {
      id: 2,
      question: "What are your delivery charges?",
      answer: "Delivery charges vary by location and order value. Typically, delivery charges start from ₹25. Free delivery may be available for orders above a certain amount.",
      category: "delivery"
    },
    {
      id: 3,
      question: "How can I track my order?",
      answer: "Once your order is confirmed, you'll receive real-time updates via SMS and in-app notifications. You can track your order status from 'My Orders' section in the app.",
      category: "orders"
    },
    {
      id: 4,
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including credit/debit cards, digital wallets (Paytm, PhonePe, Google Pay), UPI, and cash on delivery in select areas.",
      category: "payment"
    },
    {
      id: 5,
      question: "Can I cancel my order?",
      answer: "Orders can be cancelled before they are packed for delivery. Once packed, cancellation may not be possible. Please contact our support team for assistance.",
      category: "orders"
    },
    {
      id: 6,
      question: "What if I receive damaged or wrong items?",
      answer: "If you receive damaged or incorrect items, please report it immediately through the app or contact our customer support. We'll arrange for a replacement or refund.",
      category: "orders"
    },
    {
      id: 7,
      question: "Do you have a minimum order amount?",
      answer: "The minimum order amount varies by location, typically starting from ₹99. You can check the minimum order amount for your area during checkout.",
      category: "orders"
    },
    {
      id: 8,
      question: "How do refunds work?",
      answer: "Refunds are processed within 3-7 business days depending on your payment method. For digital payments, refunds are typically faster than cash/card payments.",
      category: "payment"
    },
    {
      id: 9,
      question: "Is my personal information secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your personal and payment information. We never share your data with unauthorized parties.",
      category: "account"
    },
    {
      id: 10,
      question: "How do I update my delivery address?",
      answer: "You can update your delivery address from the 'My Account' section in the app or website. You can also change it during checkout before placing an order.",
      category: "account"
    },
    {
      id: 11,
      question: "What are your operating hours?",
      answer: "We operate 7 days a week. Hours may vary by location, but typically we're available from 6:00 AM to 12:00 AM. Check the app for specific hours in your area.",
      category: "general"
    },
    {
      id: 12,
      question: "Do you deliver to my area?",
      answer: "We're rapidly expanding our delivery network. Enter your pincode on our website or app to check if we deliver to your location. If not, we're likely coming soon!",
      category: "delivery"
    }
  ];

  const categories = [
    { value: 'all', label: 'All Questions', icon: HelpCircle },
    { value: 'delivery', label: 'Delivery', icon: Truck },
    { value: 'orders', label: 'Orders', icon: Clock },
    { value: 'payment', label: 'Payment', icon: CreditCard },
    { value: 'account', label: 'Account', icon: Shield }
  ];

  const filteredFAQs = selectedCategory === 'all' ? faqs : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

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
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about JBasket's delivery service, orders, payments, and more.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search FAQs..."
                className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <HelpCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="p-6">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-8">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openFAQ === faq.id ? (
                        <Minus className="h-5 w-5 text-green-600" />
                      ) : (
                        <Plus className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {openFAQ === faq.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-12 bg-green-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our customer support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Contact Support
              </Link>
              <button className="bg-white text-green-600 px-6 py-3 rounded-lg border border-green-600 hover:bg-green-50 transition-colors font-medium">
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}