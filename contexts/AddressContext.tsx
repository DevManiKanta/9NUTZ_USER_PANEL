"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Address {
  id: string;
  userId: string;
  type: 'Home' | 'Work' | 'Other';
  name: string;
  address: string;
  phone: string;
  isDefault?: boolean;
}

interface AddressContextType {
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  getUserAddresses: (userId: string) => Address[];
  setDefaultAddress: (id: string, userId: string) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const useAddresses = () => {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddresses must be used within an AddressProvider');
  }
  return context;
};

// Mock default addresses
const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    userId: 'user-1',
    type: 'Home',
    name: 'John Doe',
    address: 'B62, Pocket B, Sector 7, Rohini, Delhi - 110085',
    phone: '+91 9876543210',
    isDefault: true
  },
  {
    id: 'addr-2',
    userId: 'user-1',
    type: 'Work',
    name: 'John Doe',
    address: 'Connaught Place, New Delhi - 110001',
    phone: '+91 9876543210'
  }
];

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);

  useEffect(() => {
    // Load addresses from localStorage
    const savedAddresses = localStorage.getItem('addresses');
    if (savedAddresses) {
      const parsedAddresses = JSON.parse(savedAddresses);
      setAddresses([...mockAddresses, ...parsedAddresses]);
    }
  }, []);

  const saveToLocalStorage = (updatedAddresses: Address[]) => {
    const addressesToSave = updatedAddresses.filter(addr => !mockAddresses.find(mock => mock.id === addr.id));
    localStorage.setItem('addresses', JSON.stringify(addressesToSave));
  };

  const addAddress = (addressData: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...addressData,
      id: `addr-${Date.now()}`
    };
    
    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);
    saveToLocalStorage(updatedAddresses);
  };

  const updateAddress = (id: string, addressData: Partial<Address>) => {
    const updatedAddresses = addresses.map(address =>
      address.id === id ? { ...address, ...addressData } : address
    );
    setAddresses(updatedAddresses);
    saveToLocalStorage(updatedAddresses);
  };

  const deleteAddress = (id: string) => {
    const updatedAddresses = addresses.filter(address => address.id !== id);
    setAddresses(updatedAddresses);
    saveToLocalStorage(updatedAddresses);
  };

  const getUserAddresses = (userId: string) => {
    return addresses.filter(address => address.userId === userId);
  };

  const setDefaultAddress = (id: string, userId: string) => {
    const updatedAddresses = addresses.map(address => ({
      ...address,
      isDefault: address.userId === userId ? address.id === id : address.isDefault
    }));
    setAddresses(updatedAddresses);
    saveToLocalStorage(updatedAddresses);
  };

  const value: AddressContextType = {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    getUserAddresses,
    setDefaultAddress
  };

  return (
    <AddressContext.Provider value={value}>
      {children}
    </AddressContext.Provider>
  );
};