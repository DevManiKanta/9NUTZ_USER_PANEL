import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { OrderProvider } from '@/contexts/OrderContext';
import { AddressProvider } from '@/contexts/AddressContext';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { ProductProvider } from '@/contexts/ProductContext';
export const metadata: Metadata = {
  title: '9NUTZ',
  description: 'Grocery delivery in minutes. Order from thousands of products and get delivery within 8 minutes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CategoryProvider>
            <ProductProvider>
              <OrderProvider>
                <AddressProvider>
                  {children}
                </AddressProvider>
              </OrderProvider>
            </ProductProvider>
          </CategoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

