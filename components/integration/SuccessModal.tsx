'use client';

import React from 'react';
import BaseModal from '@/components/shared/BaseModal';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrationName: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ 
  isOpen, 
  onClose,
  integrationName
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showCloseButton={false}>
      <div className="p-10 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#D1FAE5] rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path 
                d="M28 9L12 25L4 17" 
                stroke="#059669" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-[#1F2937] mb-3">Successfully Connected!</h2>
        
        {/* Description */}
        <p className="text-sm text-[#6B7280] mb-6">
          {integrationName} is now connected to your account. Your agents can now use this integration.
        </p>

        {/* Next Steps */}
        <div className="bg-[#F9FAFB] rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-medium text-[#1F2937] mb-2">Next Steps:</p>
          <ul className="space-y-2 text-sm text-[#6B7280]">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Configure integration settings</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Assign to specific agents</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Test the connection</span>
            </li>
          </ul>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Done
        </button>
      </div>
    </BaseModal>
  );
};

export default SuccessModal;
