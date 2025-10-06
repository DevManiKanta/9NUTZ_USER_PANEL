"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User } from 'lucide-react';
import Link from 'next/link';

interface AccountDropdownProps {
  onLoginClick: () => void;
}

export default function AccountDropdown({ onLoginClick }: AccountDropdownProps) {
  const { user } = useAuth();

  if (!user) {
    return (
      <button
        onClick={onLoginClick}
        className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        Login
      </button>
    );
  }

  return (
    <Link
      href="/dashboard"
      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
    >
      <User className="h-4 w-4" />
      <span>Dashboard</span>
    </Link>
  );
}