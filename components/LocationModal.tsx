"use client";

import { X, MapPin } from 'lucide-react';
import { useState } from 'react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Change Location</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex space-x-3 mb-6">
            <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
              Detect my location
            </button>
            <span className="text-gray-400 self-center">OR</span>
            <input
              type="text"
              placeholder="search delivery location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Recent Locations */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Recent Locations</h3>
            <div className="space-y-3">
              {[
                'Home - B62, Pocket B, Sector 7, Rohini, Delhi',
                'Work - Connaught Place, New Delhi',
                'Other - Karol Bagh, New Delhi'
              ].map((location, index) => (
                <button
                  key={index}
                  className="w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  onClick={onClose}
                >
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{location}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}