"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, AlertTriangle } from 'lucide-react';



const DELETE_REASONS = [
  'I found a better alternative',
  'I no longer need the service',
  'Too expensive',
  'Poor delivery experience',
  'Privacy concerns',
  'Account security issues',
  'Technical problems',
  'Other'
];

export default function DeleteAccountModal({ isOpen, onClose }) {
  const [step, setStep] = useState<'reason' | 'confirm'>('reason');
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const { user, logout } = useAuth();

  const handleDeleteAccount = async () => {
    if (!user || confirmText !== 'DELETE') return;

    setIsDeleting(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would delete the account from the backend
      logout();
      onClose();
      setIsDeleting(false);
      alert('Your account has been deleted successfully.');
    }, 2000);
  };

  const handleClose = () => {
    setStep('reason');
    setSelectedReason('');
    setOtherReason('');
    setConfirmText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Delete Account</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {step === 'reason' ? (
            <div className="space-y-6">
              <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Account Deletion</p>
                  <p className="text-sm text-red-700 mt-1">
                    This action is permanent and cannot be undone. All your data will be deleted.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Why are you deleting your account?
                </label>
                <div className="space-y-2">
                  {DELETE_REASONS.map((reason) => (
                    <label key={reason} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="deleteReason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="mt-0.5"
                      />
                      <span className="text-sm text-gray-700">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {selectedReason === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please specify
                  </label>
                  <textarea
                    rows={3}
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    placeholder="Tell us why you're leaving..."
                  />
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep('confirm')}
                  disabled={!selectedReason || (selectedReason === 'Other' && !otherReason.trim())}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Final Confirmation</p>
                  <p className="text-sm text-red-700 mt-1">
                    This will permanently delete your account and all associated data.
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-700 mb-2">
                  To confirm deletion, type <strong>DELETE</strong> in the field below:
                </p>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Type DELETE to confirm"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">What will be deleted:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Your account and profile information</li>
                  <li>• Order history and preferences</li>
                  <li>• Saved addresses and payment methods</li>
                  <li>• Account settings and preferences</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep('reason')}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={confirmText !== 'DELETE' || isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}