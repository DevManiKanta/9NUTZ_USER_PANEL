// lib/product.ts
export function normalizeToDetailProduct(p: any) {
  if (!p) return null;

  const images = Array.isArray(p.images) && p.images.length ? p.images : (p.image ? [p.image] : []);
  const offerPrice = p.offerPrice ?? p.offer_price ?? p.offer ?? undefined;
  const price = p.price ?? p.price_cents ?? p.originalPrice ?? p.original_price ?? 0;
  const finalPrice = offerPrice ?? price;

  // units: if quantityPrices present (array or JSON string) use it
  let units = [];
  if (p.quantityPrices || p.quantity_prices) {
    try {
      const qp = typeof p.quantityPrices === "string" ? JSON.parse(p.quantityPrices) : (typeof p.quantity_prices === "string" ? JSON.parse(p.quantity_prices) : (p.quantityPrices ?? p.quantity_prices));
      if (Array.isArray(qp)) {
        units = qp.map((q: any) => ({ size: q.size ?? q.quantity ?? q.label ?? String(q.quantity), price: Number(q.price ?? q.amount ?? finalPrice) }));
      }
    } catch (e) {
      // ignore parse errors
    }
  }

  if (!units.length) {
    units = [{ size: p.weight ?? "1 kg", price: Number(finalPrice) }];
    // add simple 2x fallback if desired
    units.push({ size: `2 x ${p.weight ?? "1 kg"}`, price: Math.round(Number(finalPrice) * 2) });
  }

  return {
    id: String(p.id ?? p._id ?? p.productId ?? Math.random()),
    name: p.name ?? p.title,
    brand: p.brand ?? p.manufacturer ?? "Brand",
    price: Number(finalPrice),
    originalPrice: Number(price),
    discount: p.discount ?? 0,
    images,
    image: images[0] ?? "",
    weight: p.weight,
    category: p.category ?? p.categoryId ?? p.category_id,
    description: p.description ?? p.summary ?? "",
    units,
    rating: p.rating ?? 4.5,
    reviews: p.reviews ?? 0,
  };
}
