'use client';

import React from 'react';
import Header from '@/components/Header';

/**
 * Client Component wrapper for Header to be used in Server Components
 * Provides default handlers and state for minimal header functionality
 */
export default function MinimalHeaderClient() {
  return (
    <Header
      onLoginClick={() => {}}
      onLocationClick={() => {}}
      onCartClick={() => {}}
      cartItemCount={0}
      cartTotal={0}
    />
  );
}