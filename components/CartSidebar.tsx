// "use client";

// import { X, Plus, Minus, Clock } from "lucide-react";
// import { useEffect } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { CartItem, ID } from "@/types";

// interface CartSidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
//   items: CartItem[];
//   // allow string or number id (matches shared type)
//   onUpdateQuantity: (id: ID, quantity: number) => void;
//   isLoggedIn?: boolean;
//   onProceedToPay?: () => void;
// }

// export default function CartSidebar({
//   isOpen,
//   onClose,
//   items,
//   onUpdateQuantity,
//   isLoggedIn = false,
//   onProceedToPay,
// }: CartSidebarProps) {
//   const { user } = useAuth();
//   const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
//   const totalPrice = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
//   const savings = items.reduce(
//     (sum, item) => sum + (((item.originalPrice ?? item.price) - (item.price ?? 0)) * (item.quantity || 0)),
//     0
//   );

//   const deliveryCharge = 25;
//   const handlingCharge = 2;
//   const smallCartCharge = totalPrice < 200 ? 20 : 0;
//   const grandTotal = Math.round(totalPrice + deliveryCharge + handlingCharge + smallCartCharge);

//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [isOpen]);

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
//           isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//         }`}
//         onClick={onClose}
//       />

//       {/* Cart Sidebar */}
//       <div
//         className={`fixed top-0 right-0 h-full w-96 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         } flex flex-col`}
//       >
//         {/* Header */}
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-gray-900">My Cart</h2>
//             <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
//               <X className="h-5 w-5 text-gray-600" />
//             </button>
//           </div>

//           {/* Delivery Info */}
//           <div className="flex items-center space-x-2 mt-4 p-3 bg-green-50 rounded-lg">
//             <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
//               <Clock className="h-4 w-4 text-white" />
//             </div>
//             <div>
//               <div className="font-semibold text-green-800">Delivery in 8 minutes</div>
//               <div className="text-sm text-green-600">
//                 Shipment of {totalItems} item{totalItems !== 1 ? "s" : ""}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Cart Items */}
//         <div className="flex-1 overflow-y-auto">
//           {items.length === 0 ? (
//             <div className="flex items-center justify-center h-full">
//               <p className="text-gray-500">Your cart is empty</p>
//             </div>
//           ) : (
//             <div className="p-4 space-y-4">
//               {items.map((item) => (
//                 <div key={String(item.id)} className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
//                   <img
//                     src={item.image ?? "/placeholder.png"}
//                     alt={item.name}
//                     className="w-12 h-12 object-cover rounded-lg"
//                   />
//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{item.name}</h3>
//                     <p className="text-xs text-gray-500 mt-1">{item.weight}</p>
//                   </div>
//                   <div className="flex flex-col items-end space-y-2">
//                     <div className="flex items-center bg-green-600 text-white rounded-lg">
//                       <button
//                         onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
//                         className="p-1 hover:bg-green-700 rounded-l-lg transition-colors"
//                       >
//                         <Minus className="h-3 w-3" />
//                       </button>
//                       <span className="px-2 text-sm font-medium">{item.quantity}</span>
//                       <button
//                         onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
//                         className="p-1 hover:bg-green-700 rounded-r-lg transition-colors"
//                       >
//                         <Plus className="h-3 w-3" />
//                       </button>
//                     </div>
//                     <div className="text-right">
//                       <div className="font-bold text-sm">₹{(item.price * item.quantity).toFixed(0)}</div>
//                       {item.originalPrice && (
//                         <div className="text-xs text-gray-400 line-through">₹{(item.originalPrice * item.quantity).toFixed(0)}</div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Bill Details */}
//         {items.length > 0 && (
//           <div className="border-t border-gray-200">
//             <div className="p-4">
//               <h3 className="font-semibold text-gray-900 mb-3">Bill details</h3>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="flex items-center space-x-1">
//                     <span>Items total</span>
//                     {savings > 0 && (
//                       <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Saved ₹{Math.round(savings)}</span>
//                     )}
//                   </span>
//                   <span className="font-semibold">₹{Math.round(totalPrice)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Delivery charge</span>
//                   <span>₹{deliveryCharge}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Handling charge</span>
//                   <span>₹{handlingCharge}</span>
//                 </div>
//                 {smallCartCharge > 0 && (
//                   <div className="flex justify-between">
//                     <span>Small cart charge</span>
//                     <span>₹{smallCartCharge}</span>
//                   </div>
//                 )}
//                 <div className="border-t border-gray-200 pt-2 mt-3">
//                   <div className="flex justify-between font-bold text-lg">
//                     <span>Grand total</span>
//                     <span>₹{grandTotal}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Cancellation Policy */}
//               <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//                 <h4 className="font-semibold text-sm mb-1">Cancellation Policy</h4>
//                 <p className="text-xs text-gray-600">
//                   Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable.
//                 </p>
//               </div>

//               {/* Checkout Button */}
//               <button
//                 onClick={user ? onProceedToPay : undefined}
//                 className={`w-full py-4 px-4 rounded-lg font-semibold text-lg mt-4 flex items-center justify-between transition-colors ${
//                   user ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"
//                 }`}
//                 disabled={!user}
//               >
//                 <span>₹{grandTotal}</span>
//                 <div className="flex items-center space-x-1">
//                   <span>{user ? "Proceed to Pay" : "Login to Proceed"}</span>
//                   <span>→</span>
//                 </div>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

"use client";

import { X, Plus, Minus, Clock } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CartItem, ID } from "@/types";

/**
 * CartSidebar - improved numeric handling
 *
 * - All currency calculations are done in paise (integer) to avoid floating-point errors.
 * - Defensive parsing for price, originalPrice, and quantity (handles strings).
 * - Displays currency with two decimals.
 */

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[]; // expects { id, name, price, originalPrice?, quantity, image/imageUrl?, weight? }
  onUpdateQuantity: (id: ID, quantity: number) => void;
  isLoggedIn?: boolean;
  onProceedToPay?: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  isLoggedIn = false,
  onProceedToPay,
}: CartSidebarProps) {
  const { user } = useAuth();

  // ---------- Helpers (paise-based) ----------
  const parseNumber = (v: any): number => {
    // Parse a number-like input, return Number or 0
    if (v === null || v === undefined || v === "") return 0;
    const n = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const rupeesToPaise = (v: any): number => {
    // Convert rupees (string/number) to integer paise
    const n = parseNumber(v);
    return Math.round(n * 100);
  };

  const paiseToRupeesString = (p: number): string => {
    const rupees = p / 100;
    // show two decimals consistently
    return `₹${rupees.toFixed(2)}`;
  };

  const qtyOf = (q: any): number => {
    const n = Number(q ?? 0);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.trunc(n));
  };

  // ---------- Calculations (paise) ----------
  // subtotal per item = item.price * qty (in paise)
  const itemsWithPaise = items.map((item) => {
    const pricePaise = rupeesToPaise(item.price);
    const originalPricePaise =
      rupeesToPaise((item as any).originalPrice ?? (item as any).original_price ?? 0);
    const quantity = qtyOf(item.quantity);
    const subtotalPaise = pricePaise * quantity;
    const savedPerUnitPaise = Math.max(0, originalPricePaise - pricePaise);
    const savedTotalPaise = savedPerUnitPaise * quantity;
    return {
      item,
      pricePaise,
      originalPricePaise,
      quantity,
      subtotalPaise,
      savedTotalPaise,
    };
  });

  const totalItems = itemsWithPaise.reduce((s, it) => s + it.quantity, 0);
  const totalPricePaise = itemsWithPaise.reduce((s, it) => s + it.subtotalPaise, 0);
  const totalSavingsPaise = itemsWithPaise.reduce((s, it) => s + it.savedTotalPaise, 0);

  const deliveryChargePaise = 25 * 100; // ₹25
  const handlingChargePaise = 2 * 100; // ₹2
  const smallCartChargePaise = totalPricePaise > 0 && totalPricePaise < 200 * 100 ? 20 * 100 : 0; // ₹20 if < ₹200

  // ==== CHANGE: grand total should be items total only (no extra charges) ====
  const grandTotalPaise = totalPricePaise;

  // ---------- Effects ----------
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // ---------- Quantity change wrappers ----------
  const decrease = (id: ID, currentQty: number) => {
    const newQty = Math.max(0, Math.trunc(currentQty) - 1);
    onUpdateQuantity(id, newQty);
  };

  const increase = (id: ID, currentQty: number) => {
    const newQty = Math.max(0, Math.trunc(currentQty) + 1);
    onUpdateQuantity(id, newQty);
  };

  // ---------- Render ----------
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Cart Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-96 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
        aria-hidden={!isOpen}
        aria-labelledby="cart-title"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 id="cart-title" className="text-lg font-semibold text-gray-900">
              My Cart
            </h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Close cart">
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Delivery Info */}
          <div className="flex items-center space-x-2 mt-4 p-3 bg-green-50 rounded-lg">
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {itemsWithPaise.map(({ item, quantity, subtotalPaise, originalPricePaise }) => {
                const imageSrc = (item as any).imageUrl ?? (item as any).image ?? "/placeholder.png";
                return (
                  <div key={String(item.id)} className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                    <img
                      src={imageSrc}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{item.name}</h3>
                      {item.weight && <p className="text-xs text-gray-500 mt-1">{item.weight}</p>}
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center bg-green-600 text-white rounded-lg">
                        <button
                          onClick={() => decrease(item.id, quantity)}
                          className="p-1 hover:bg-green-700 rounded-l-lg transition-colors"
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-sm font-medium">{quantity}</span>
                        <button
                          onClick={() => increase(item.id, quantity)}
                          className="p-1 hover:bg-green-700 rounded-r-lg transition-colors"
                          aria-label={`Increase quantity for ${item.name}`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">{paiseToRupeesString(subtotalPaise)}</div>
                        {originalPricePaise > 0 && originalPricePaise > rupeesToPaise(item.price) && (
                          <div className="text-xs text-gray-400 line-through">
                            {paiseToRupeesString(originalPricePaise * quantity)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bill Details */}
        {items.length > 0 && (
          <div className="border-t border-gray-200">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Bill details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="flex items-center space-x-1">
                    <span>Items total</span>
                    {totalSavingsPaise > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                        Saved {paiseToRupeesString(totalSavingsPaise)}
                      </span>
                    )}
                  </span>
                  <span className="font-semibold">{paiseToRupeesString(totalPricePaise)}</span>
                </div>

                {/* <div className="flex justify-between">
                  <span>Delivery charge</span>
                  <span>{paiseToRupeesString(deliveryChargePaise)}</span>
                </div> */}

                {/* <div className="flex justify-between">
                  <span>Handling charge</span>
                  <span>{paiseToRupeesString(handlingChargePaise)}</span>
                </div> */}
{/* 
                {smallCartChargePaise > 0 && (
                  <div className="flex justify-between">
                    <span>Small cart charge</span>
                    <span>{paiseToRupeesString(smallCartChargePaise)}</span>
                  </div>
                )} */}

                <div className="border-t border-gray-200 pt-2 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Grand total</span>
                    <span> {paiseToRupeesString(grandTotalPaise)}</span>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-sm mb-1">Cancellation Policy</h4>
                <p className="text-xs text-gray-600">
                  Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable.
                </p>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  if (user && onProceedToPay) onProceedToPay();
                }}
                className={`w-full py-4 px-4 rounded-lg font-semibold text-lg mt-4 flex items-center justify-between transition-colors ${
                  user ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                disabled={!user || !onProceedToPay}
                aria-disabled={!user || !onProceedToPay}
              >
                <span>{paiseToRupeesString(grandTotalPaise)}</span>
                <div className="flex items-center space-x-1">
                  <span>{user ? "" : "Login to Proceed"}</span>
                  <span>→</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

