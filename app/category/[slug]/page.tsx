import React from 'react';
import { categories, sampleProducts } from '@/lib/categories';
import CategoryClientPage from '@/components/CategoryClientPage';

export async function generateStaticParams() {
  console.log('generateStaticParams - all category slugs:', categories.map(c => c.slug));
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const category = categories.find(cat => cat.slug === slug);
  const categoryProducts = sampleProducts.filter(p => p.categoryId === category?.id);

  return (
    <>
      <CategoryClientPage category={category} categoryProducts={categoryProducts} slug={slug} />
    </>
  );
}