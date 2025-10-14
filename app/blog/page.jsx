'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "10 Quick and Healthy Breakfast Ideas for Busy Mornings",
      excerpt: "Start your day right with these nutritious breakfast options that can be prepared in minutes.",
      image: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
      author: "Nutritionist Sarah",
      date: "January 15, 2025",
      views: 1250,
      category: "Health & Nutrition",
    },
    {
      id: 2,
      title: "Grocery Shopping Tips: How to Save Money and Reduce Food Waste",
      excerpt: "Learn expert strategies to shop smarter, save money, and contribute to a sustainable future.",
      image: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
      author: "Budget Expert Mike",
      date: "January 12, 2025",
      views: 890,
      category: "Shopping Tips",
    },
    {
      id: 3,
      title: "Seasonal Produce Guide: What to Buy in January",
      excerpt: "Discover the freshest fruits and vegetables available this month for maximum flavor and nutrition.",
      image: "https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
      author: "Chef Maria",
      date: "January 10, 2025",
      views: 675,
      category: "Seasonal",
    },
    {
      id: 4,
      title: "5-Minute Snacks That Actually Keep You Full",
      excerpt: "Quick, satisfying snacks that will curb your hunger between meals without compromising your health.",
      image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
      author: "Wellness Coach Amy",
      date: "January 8, 2025",
      views: 1120,
      category: "Recipes",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLoginClick={() => {}} onLocationClick={() => {}} onCartClick={() => {}} cartItemCount={0} cartTotal={0} />
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">JBasket Blog</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Fresh insights, recipes, and tips for a healthier, more convenient lifestyle</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-[4/3] md:aspect-auto">
                <img src={blogPosts[0].image} alt={blogPosts[0].title} className="w-full h-full object-cover" />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">Featured</span>
                  <span className="text-gray-500 text-sm">{blogPosts[0].category}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{blogPosts[0].title}</h2>
                <p className="text-gray-600 mb-6">{blogPosts[0].excerpt}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{blogPosts[0].author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{blogPosts[0].date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{blogPosts[0].views} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">{post.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                      <span>{post.author}</span>
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="bg-green-50 rounded-2xl p-8 mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h3>
            <p className="text-gray-600 mb-6">Subscribe to our newsletter for the latest recipes, tips, and exclusive offers.</p>
            <div className="flex max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              <button className="bg-green-600 text-white px-6 py-3 rounded-r-lg hover:bg-green-700 transition-colors font-medium">Subscribe</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


