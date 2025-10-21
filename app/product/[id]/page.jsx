// app/product/[id]/page.jsx
// Minimal static-safe placeholder. Replace with static data or SSG as needed.
export async function generateStaticParams() { 
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ]; 
}
export const dynamicParams = false;

export default function ProductPage({ params }) {
  const { id } = params;
  return (
    <main className="max-w-5xl mx-auto px-6 py-24">
      <h1 className="text-2xl font-semibold mb-2">Product: {id}</h1>
      <p className="text-gray-600">Static export placeholder. Hook up data to enable product details.</p>
    </main>
  );
}
