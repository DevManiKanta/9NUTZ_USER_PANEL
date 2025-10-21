import React from 'react';
import MinimalHeaderClient from '@/components/MinimalHeaderClient';
import Footer from '@/components/Footer';

export async function generateStaticParams() { 
  return [
    { slug: 'nuts' },
    { slug: 'seeds' },
    { slug: 'dried-fruits' },
    { slug: 'snacks' }
  ]; 
}
export const dynamicParams = false;

export default function CategoryPage({ params }) {
  const { slug } = params;

  return (
    <div className="min-h-screen bg-gray-50">
      <MinimalHeaderClient />
      <main className="pt-20">
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Category: {slug}</h1>
            <p className="text-gray-600">This page will display products for this category once data is connected.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


