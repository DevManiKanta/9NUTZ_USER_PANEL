// import React, { useState } from 'react';
// import { X, ArrowLeft, CreditCard, Wallet, Building2, MapPin, Edit, CheckCircle, Trash2 } from 'lucide-react';
// import { useAddresses } from '@/contexts/AddressContext';
// import { useAuth } from '@/contexts/AuthContext';
// import ReviewModal from '@/components/ReviewModal';

// interface PaymentFlowProps {
//   isOpen: boolean;
//   onClose: () => void;
//   cartTotal: number;
//   onPaymentComplete: () => void;
// }

// export default function PaymentFlow({ isOpen, onClose, cartTotal, onPaymentComplete }: PaymentFlowProps) {
//   const [currentStep, setCurrentStep] = useState<'address' | 'payment' | 'confirmation'>('address');
//   const [selectedPayment, setSelectedPayment] = useState('card');
//   const [selectedAddress, setSelectedAddress] = useState('');
//   const [showAddAddressForm, setShowAddAddressForm] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
//   const [editingAddress, setEditingAddress] = useState<string | null>(null);
//   const [couponCode, setCouponCode] = useState('');
//   const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
//   const [couponError, setCouponError] = useState('');
//   const [showReviewModal, setShowReviewModal] = useState(false);

//   const { user } = useAuth();
//   const { getUserAddresses, addAddress, updateAddress, deleteAddress } = useAddresses();

//   const deliveryCharge = 25;
//   const handlingCharge = 2;
//   const couponDiscount = appliedCoupon ? 
//     (appliedCoupon.discountType === 'percentage' 
//       ? Math.min((cartTotal * appliedCoupon.discountValue) / 100, appliedCoupon.maxDiscount || Infinity)
//       : appliedCoupon.discountValue) : 0;
//   const grandTotal = cartTotal + deliveryCharge + handlingCharge - couponDiscount;

//   const userAddresses = user ? getUserAddresses(user.id) : [];
  
//   // Set default selected address
//   React.useEffect(() => {
//     if (userAddresses.length > 0 && !selectedAddress) {
//       const defaultAddress = userAddresses.find(addr => addr.isDefault);
//       setSelectedAddress(defaultAddress?.id || userAddresses[0].id);
//     }
//   }, [userAddresses, selectedAddress]);

//   const [addressForm, setAddressForm] = useState({
//     type: 'Home' as 'Home' | 'Work' | 'Other',
//     name: '',
//     address: '',
//     phone: ''
//   });
//   const paymentMethods = [
//     {
//       id: 'card',
//       name: 'Credit/Debit Card',
//       icon: CreditCard,
//       description: 'Pay securely with your card'
//     },
//     {
//       id: 'upi',
//       name: 'UPI Payment',
//       icon: Wallet,
//       description: 'Pay using UPI apps like GPay, PhonePe'
//     },
//     {
//       id: 'netbanking',
//       name: 'Net Banking',
//       icon: Building2,
//       description: 'Pay using your bank account'
//     }
//   ];

//   const handleAddAddress = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return;
    
//     if (editingAddress) {
//       updateAddress(editingAddress, addressForm);
//     } else {
//       addAddress({
//         ...addressForm,
//         userId: user.id
//       });
//     }
    
//     setShowAddAddressForm(false);
//     setEditingAddress(null);
//     setAddressForm({ type: 'Home', name: '', address: '', phone: '' });
//   };

//   const applyCoupon = () => {
//     setCouponError('');
    
//     // Mock coupon validation
//     const mockCoupons = [
//       {
//         code: 'WELCOME20',
//         discountType: 'percentage',
//         discountValue: 20,
//         minOrderAmount: 199,
//         maxDiscount: 100
//       },
//       {
//         code: 'SAVE50',
//         discountType: 'fixed',
//         discountValue: 50,
//         minOrderAmount: 299
//       }
//     ];
    
//     const coupon = mockCoupons.find(c => c.code === couponCode.toUpperCase());
    
//     if (!coupon) {
//       setCouponError('Invalid coupon code');
//       return;
//     }
    
//     if (cartTotal < coupon.minOrderAmount) {
//       setCouponError(`Minimum order amount is ₹${coupon.minOrderAmount}`);
//       return;
//     }
    
//     setAppliedCoupon(coupon);
//     setCouponCode('');
//   };

//   const removeCoupon = () => {
//     setAppliedCoupon(null);
//     setCouponCode('');
//     setCouponError('');
//   };

//   const handleEditAddress = (addressId: string) => {
//     const address = userAddresses.find(addr => addr.id === addressId);
//     if (address) {
//       setAddressForm({
//         type: address.type,
//         name: address.name,
//         address: address.address,
//         phone: address.phone
//       });
//       setEditingAddress(addressId);
//       setShowAddAddressForm(true);
//     }
//   };

//   const handleDeleteAddress = (addressId: string) => {
//     deleteAddress(addressId);
//     if (selectedAddress === addressId) {
//       const remainingAddresses = userAddresses.filter(addr => addr.id !== addressId);
//       setSelectedAddress(remainingAddresses.length > 0 ? remainingAddresses[0].id : '');
//     }
//     setShowDeleteConfirm(null);
//   };

//   const handlePayment = () => {
//     setCurrentStep('confirmation');
//     setTimeout(() => {
//       setShowReviewModal(true);
//     }, 2000);
//   };

//   const handleReviewComplete = () => {
//     setShowReviewModal(false);
//     onPaymentComplete();
//     onClose();
//     setCurrentStep('address');
//     setAppliedCoupon(null);
//     setCouponCode('');
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-100">
//           <div className="flex items-center space-x-4">
//             {currentStep !== 'address' && currentStep !== 'confirmation' && (
//               <button
//                 onClick={() => setCurrentStep('address')}
//                 className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <ArrowLeft className="h-5 w-5 text-gray-600" />
//               </button>
//             )}
//             <h2 className="text-lg font-semibold text-gray-900">
//               {currentStep === 'address' && 'Delivery Address'}
//               {currentStep === 'payment' && 'Payment Method'}
//               {currentStep === 'confirmation' && 'Order Confirmation'}
//             </h2>
//           </div>
//           {currentStep !== 'confirmation' && (
//             <button
//               onClick={onClose}
//               className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//             >
//               <X className="h-5 w-5 text-gray-600" />
//             </button>
//           )}
//         </div>

//         {/* Progress Indicator */}
//         <div className="px-6 py-4 bg-gray-50">
//           <div className="flex items-center justify-between">
//             <div className={`flex items-center space-x-2 ${
//               currentStep === 'address' ? 'text-green-600' : 'text-gray-400'
//             }`}>
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                 currentStep === 'address' ? 'bg-green-600 text-white' : 'bg-gray-200'
//               }`}>1</div>
//               <span className="text-sm font-medium">Address</span>
//             </div>
//             <div className={`flex items-center space-x-2 ${
//               currentStep === 'payment' ? 'text-green-600' : 'text-gray-400'
//             }`}>
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                 currentStep === 'payment' ? 'bg-green-600 text-white' : 'bg-gray-200'
//               }`}>2</div>
//               <span className="text-sm font-medium">Payment</span>
//             </div>
//             <div className={`flex items-center space-x-2 ${
//               currentStep === 'confirmation' ? 'text-green-600' : 'text-gray-400'
//             }`}>
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                 currentStep === 'confirmation' ? 'bg-green-600 text-white' : 'bg-gray-200'
//               }`}>
//                 {currentStep === 'confirmation' ? <CheckCircle className="h-4 w-4" /> : '3'}
//               </div>
//               <span className="text-sm font-medium">Done</span>
//             </div>
//           </div>
//         </div>

//         {/* Step Content */}
//         <div className="p-6">
//           {/* Address Selection Step */}
//           {currentStep === 'address' && (
//             <div className="space-y-4">
//               <div className="text-sm text-gray-600 mb-4">
//                 Select delivery address for your order
//               </div>
              
//               {/* Add Address Form */}
//               {showAddAddressForm && (
//                 <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50">
//                   <h3 className="font-semibold text-gray-900 mb-4">
//                     {editingAddress ? 'Edit Address' : 'Add New Address'}
//                   </h3>
//                   <form onSubmit={handleAddAddress} className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
//                         <select
//                           value={addressForm.type}
//                           onChange={(e) => setAddressForm(prev => ({ ...prev, type: e.target.value as any }))}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
//                         >
//                           <option value="Home">Home</option>
//                           <option value="Work">Work</option>
//                           <option value="Other">Other</option>
//                         </select>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                         <input
//                           type="text"
//                           required
//                           value={addressForm.name}
//                           onChange={(e) => setAddressForm(prev => ({ ...prev, name: e.target.value }))}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
//                           placeholder="Full name"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                       <textarea
//                         required
//                         rows={2}
//                         value={addressForm.address}
//                         onChange={(e) => setAddressForm(prev => ({ ...prev, address: e.target.value }))}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
//                         placeholder="Complete address"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                       <input
//                         type="tel"
//                         required
//                         value={addressForm.phone}
//                         onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
//                         placeholder="+91 9876543210"
//                       />
//                     </div>
//                     <div className="flex space-x-3">
//                       <button
//                         type="submit"
//                         className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
//                       >
//                         {editingAddress ? 'Update' : 'Save'}
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setShowAddAddressForm(false);
//                           setEditingAddress(null);
//                           setAddressForm({ type: 'Home', name: '', address: '', phone: '' });
//                         }}
//                         className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               )}

//               {userAddresses.map((address) => (
//                 <div
//                   key={address.id}
//                   onClick={() => setSelectedAddress(address.id)}
//                   className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
//                     selectedAddress === address.id 
//                       ? 'border-green-500 bg-green-50' 
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <div className="flex items-center space-x-2 mb-2">
//                         <MapPin className="h-4 w-4 text-gray-500" />
//                         <span className="font-semibold text-gray-900">{address.type}</span>
//                         {address.isDefault && (
//                           <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">Default</span>
//                         )}
//                       </div>
//                       <p className="text-sm text-gray-600">{address.name}</p>
//                       <p className="text-sm text-gray-600">{address.address}</p>
//                       <p className="text-sm text-gray-600">{address.phone}</p>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <button 
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleEditAddress(address.id);
//                         }}
//                         className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
//                         title="Edit Address"
//                       >
//                         <Edit className="h-4 w-4" />
//                       </button>
//                       <button 
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setShowDeleteConfirm(address.id);
//                         }}
//                         className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
//                         title="Delete Address"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
              
//               <button 
//                 onClick={() => setShowAddAddressForm(true)}
//                 className="w-full py-3 text-green-600 border border-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
//               >
//                 + Add New Address
//               </button>

//               <button
//                 onClick={() => selectedAddress && setCurrentStep('payment')}
//                 disabled={!selectedAddress}
//                 className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-colors mt-6"
//               >
//                 Continue to Payment
//               </button>
//             </div>
//           )}

//           {/* Payment Method Step */}
//           {currentStep === 'payment' && (
//             <div className="space-y-6">
//               <div className="text-sm text-gray-600 mb-4">
//                 Choose your preferred payment method
//               </div>

//               <div className="space-y-3">
//                 {paymentMethods.map((method) => {
//                   const Icon = method.icon;
//                   return (
//                     <div
//                       key={method.id}
//                       onClick={() => setSelectedPayment(method.id)}
//                       className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
//                         selectedPayment === method.id 
//                           ? 'border-green-500 bg-green-50' 
//                           : 'border-gray-200 hover:border-gray-300'
//                       }`}
//                     >
//                       <div className="flex items-center space-x-3">
//                         <Icon className="h-6 w-6 text-gray-600" />
//                         <div>
//                           <div className="font-medium text-gray-900">{method.name}</div>
//                           <div className="text-sm text-gray-500">{method.description}</div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Order Summary */}
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span>Items Total</span>
//                     <span>₹{cartTotal}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Delivery Charge</span>
//                     <span>₹{deliveryCharge}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Handling Charge</span>
//                     <span>₹{handlingCharge}</span>
//                   </div>
//                   {appliedCoupon && (
//                     <div className="flex justify-between text-green-600">
//                       <span>Coupon Discount ({appliedCoupon.code})</span>
//                       <span>-₹{couponDiscount}</span>
//                     </div>
//                   )}
//                   <div className="border-t border-gray-200 pt-2 mt-3">
//                     <div className="flex justify-between font-bold text-lg">
//                       <span>Total</span>
//                       <span>₹{grandTotal}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Coupon Section */}
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h4 className="font-semibold text-gray-900 mb-3">Apply Coupon</h4>
//                 {appliedCoupon ? (
//                   <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
//                     <div>
//                       <span className="font-medium text-green-800">{appliedCoupon.code}</span>
//                       <p className="text-sm text-green-600">
//                         You saved ₹{couponDiscount}!
//                       </p>
//                     </div>
//                     <button
//                       onClick={removeCoupon}
//                       className="text-green-600 hover:text-green-700 text-sm font-medium"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     <div className="flex space-x-2">
//                       <input
//                         type="text"
//                         placeholder="Enter coupon code"
//                         value={couponCode}
//                         onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
//                         className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
//                       />
//                       <button
//                         onClick={applyCoupon}
//                         disabled={!couponCode.trim()}
//                         className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
//                       >
//                         Apply
//                       </button>
//                     </div>
//                     {couponError && (
//                       <p className="text-red-600 text-sm">{couponError}</p>
//                     )}
//                     <div className="flex flex-wrap gap-2">
//                       <button 
//                         onClick={() => setCouponCode('WELCOME20')}
//                         className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
//                       >
//                         WELCOME20
//                       </button>
//                       <button 
//                         onClick={() => setCouponCode('SAVE50')}
//                         className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
//                       >
//                         SAVE50
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <button
//                 onClick={handlePayment}
//                 className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
//               >
//                 Pay ₹{grandTotal}
//               </button>
//             </div>
//           )}

//           {/* Confirmation Step */}
//           {currentStep === 'confirmation' && (
//             <div className="text-center py-8">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <CheckCircle className="h-8 w-8 text-green-600" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
//               <p className="text-gray-600 mb-6">
//                 Your order has been placed successfully. You will receive a confirmation shortly.
//               </p>
//               <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                 <div className="text-sm text-gray-600">Order Total</div>
//                 <div className="text-2xl font-bold text-green-600">₹{grandTotal}</div>
//               </div>
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
//               <p className="text-sm text-gray-500 mt-2">Processing your order...</p>
//             </div>
//           )}
//         </div>

//         {/* Review Modal */}
//         <ReviewModal
//           isOpen={showReviewModal}
//           onClose={handleReviewComplete}
//           orderTotal={grandTotal}
//         />

//         {/* Delete Address Confirmation */}
//         {showDeleteConfirm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
//             <div className="bg-white rounded-2xl w-full max-w-sm p-6">
//               <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Address</h3>
//               <p className="text-gray-600 mb-6">Are you sure you want to delete this address?</p>
              
//               <div className="flex space-x-4">
//                 <button
//                   onClick={() => setShowDeleteConfirm(null)}
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => handleDeleteAddress(showDeleteConfirm)}
//                   className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { X, CreditCard, Wallet, Building2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ReviewModal from '@/components/ReviewModal';

interface PaymentFlowProps {
  isOpen: boolean;
  onClose: () => void;
  cartTotal: number;
  onPaymentComplete: () => void;
  cartItems: [];
}

export default function PaymentFlow({ isOpen, onClose, cartTotal,cartItems, onPaymentComplete }: PaymentFlowProps) {
  // Start directly on payment step
  const [currentStep, setCurrentStep] = useState<'payment' | 'confirmation'>('payment');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { user } = useAuth();
  const deliveryCharge = 25;
  const handlingCharge = 2;
  const couponDiscount = appliedCoupon ? 
    (appliedCoupon.discountType === 'percentage' 
      ? Math.min((cartTotal * appliedCoupon.discountValue) / 100, appliedCoupon.maxDiscount || Infinity)
      : appliedCoupon.discountValue) : 0;
  const grandTotal = cartTotal
  const paymentMethods = [
    {
      id: 'card',
      // name: 'Credit/Debit Card',
      name:"Cash on Delivery",
      icon: CreditCard,
      // description: 'Pay securely with your card'
    },
    // {
    //   id: 'upi',
    //   name: 'UPI Payment',
    //   icon: Wallet,
    //   description: 'Pay using UPI apps like GPay, PhonePe'
    // },
    // {
    //   id: 'netbanking',
    //   name: 'Net Banking',
    //   icon: Building2,
    //   description: 'Pay using your bank account'
    // }
  ];

  const applyCoupon = () => {
    setCouponError('');
    
    // Mock coupon validation
    const mockCoupons = [
      {
        code: 'WELCOME20',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 199,
        maxDiscount: 100
      },
      {
        code: 'SAVE50',
        discountType: 'fixed',
        discountValue: 50,
        minOrderAmount: 299
      }
    ];
    
    const coupon = mockCoupons.find(c => c.code === couponCode.toUpperCase());
    
    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }
    
    if (cartTotal < coupon.minOrderAmount) {
      setCouponError(`Minimum order amount is ₹${coupon.minOrderAmount}`);
      return;
    }
    
    setAppliedCoupon(coupon);
    setCouponCode('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handlePayment = () => {
    setCurrentStep('confirmation');
    setTimeout(() => {
      setShowReviewModal(true);
    }, 2000);
  };

  const handleReviewComplete = () => {
    setShowReviewModal(false);
    onPaymentComplete();
    onClose();
    setCurrentStep('payment');
    setAppliedCoupon(null);
    setCouponCode('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {currentStep === 'payment' && 'Payment Method'}
              {currentStep === 'confirmation' && 'Order Confirmation'}
            </h2>
          </div>
          {currentStep !== 'confirmation' && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Step Content (direct to payment) */}
        <div className="p-6">
          {/* Payment Method Step */}
          {currentStep === 'payment' && (
            <div className="space-y-6">
              {/* <div className="text-sm text-gray-600 mb-4">
                Choose your preferred payment method
              </div> */}

              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedPayment === method.id 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-6 w-6 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">{method.name}</div>
                          <div className="text-sm text-gray-500">{method.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span>₹{deliveryCharge}</span>
                  </div> */}
                  {/* <div className="flex justify-between">
                    <span>Handling Charge</span>
                    <span>₹{handlingCharge}</span>
                  </div> */}
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount ({appliedCoupon.code})</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{grandTotal}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              {/* <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Apply Coupon</h4>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <span className="font-medium text-green-800">{appliedCoupon.code}</span>
                      <p className="text-sm text-green-600">
                        You saved ₹{couponDiscount}!
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={!couponCode.trim()}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-600 text-sm">{couponError}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => setCouponCode('WELCOME20')}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
                      >
                        WELCOME20
                      </button>
                      <button 
                        onClick={() => setCouponCode('SAVE50')}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
                      >
                        SAVE50
                      </button>
                    </div>
                  </div>
                )}
              </div> */}

              <button
                onClick={handlePayment}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Pay ₹{grandTotal}
              </button>
            </div>
          )}

          {/* Confirmation Step */}
          {currentStep === 'confirmation' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your order has been placed successfully. You will receive a confirmation shortly.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="text-sm text-gray-600">Order Total</div>
                <div className="text-2xl font-bold text-green-600">₹{grandTotal}</div>
              </div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Processing your order...</p>
            </div>
          )}
        </div>

        {/* Review Modal */}
        <ReviewModal
          isOpen={showReviewModal}
          onClose={handleReviewComplete}
          orderTotal={grandTotal}
        />
      </div>
    </div>
  );
}
