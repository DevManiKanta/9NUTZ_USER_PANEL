import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { OrderProvider } from '@/contexts/OrderContext';
import { AddressProvider } from '@/contexts/AddressContext';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { CartProvider } from "@/contexts/CartContext";
import { SettingsProvider } from "@/contexts/SettingsContext"
import { ProductProvider } from '@/contexts/ProductContext';
import { CategoryDataProvider } from "@/contexts/CategoryDataContext";
export const metadata = {
  title: '9NUTZ',
  description: 'Grocery delivery in minutes. Order from thousands of products and get delivery within 8 minutes.',
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CategoryProvider>
            <ProductProvider>
              <OrderProvider>
                <AddressProvider>
                  <CartProvider>
                    <SettingsProvider>
                      <CategoryDataProvider>
                  {children}
                  </CategoryDataProvider>
                  </SettingsProvider>
                  </CartProvider>
                </AddressProvider>
              </OrderProvider>
            </ProductProvider>
          </CategoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

