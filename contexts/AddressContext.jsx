"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AddressContext = createContext(undefined);

export const useAddresses = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddresses must be used within an AddressProvider");
  }
  return context;
};

const mockAddresses = [
  {
    id: "addr-1",
    userId: "user-1",
    type: "Home",
    name: "John Doe",
    address: "B62, Pocket B, Sector 7, Rohini, Delhi - 110085",
    phone: "+91 9876543210",
    isDefault: true,
  },
  {
    id: "addr-2",
    userId: "user-1",
    type: "Work",
    name: "John Doe",
    address: "Connaught Place, New Delhi - 110001",
    phone: "+91 9876543210",
  },
];

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState(mockAddresses);

  useEffect(() => {
    const savedAddresses = localStorage.getItem("addresses");
    if (savedAddresses) {
      try {
        const parsedAddresses = JSON.parse(savedAddresses);
        setAddresses([...mockAddresses, ...parsedAddresses]);
      } catch (err) {
    
      }
    }
  }, []);

  const saveToLocalStorage = (updatedAddresses) => {
    const addressesToSave = updatedAddresses.filter(
      (addr) => !mockAddresses.find((mock) => mock.id === addr.id)
    );
    localStorage.setItem("addresses", JSON.stringify(addressesToSave));
  };

  const addAddress = (addressData) => {
    const newAddress = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);
    saveToLocalStorage(updatedAddresses);
  };

  const updateAddress = (id, addressData) => {
    const updatedAddresses = addresses.map((address) =>
      address.id === id ? { ...address, ...addressData } : address
    );
    setAddresses(updatedAddresses);
    saveToLocalStorage(updatedAddresses);
  };

  const deleteAddress = (id) => {
    const updatedAddresses = addresses.filter((address) => address.id !== id);
    setAddresses(updatedAddresses);
    saveToLocalStorage(updatedAddresses);
  };

  const getUserAddresses = (userId) => {
    return addresses.filter((address) => address.userId === userId);
  };

  const setDefaultAddress = (id, userId) => {
    const updatedAddresses = addresses.map((address) => ({
      ...address,
      isDefault: address.userId === userId ? address.id === id : address.isDefault,
    }));
    setAddresses(updatedAddresses);
    saveToLocalStorage(updatedAddresses);
  };

  const value = {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    getUserAddresses,
    setDefaultAddress,
  };

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
};


