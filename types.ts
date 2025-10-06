// Frontend/types.ts
export type ID = string | number;

export interface CartItem {
  id: ID;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string;  // optional to avoid mismatch when product lacks image
  weight?: string;
}

/** optional Product type used across UI */
export interface Product {
  id: ID;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image?: string;
  weight?: string;
  category?: string;
  // add other fields you need
}
