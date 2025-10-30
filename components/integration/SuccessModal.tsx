'use client';

import React from 'react';
import BaseModal from '@/components/shared/BaseModal';
import Image from 'next/image';

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
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl" title={`Connect ${integrationName}`} subtitle={`Securely connect ${integrationName} to your AgentBuilder account`}>
      <div className="p-10 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-[#25A83D] rounded-full flex items-center justify-center">
            <Image src="/svgs/tick2.svg" alt="Success" width={24} height={24} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-medium mb-1 text-black">Successfully Connected!</h2>
        
        {/* Description */}
        <p className="text-xs opacity-70 mb-6 text-black">
          {integrationName} is now connected to your account. Your agents can now use this integration.
        </p>

        {/* Next Steps */}
        <div className="bg-[#EBEBEB] rounded-lg p-4 mb-6 text-left">
          <p className="font-medium mb-2 text-black">Next Steps:</p>
          <ul className="space-y-2 text-xs opacity-70">
            <li className="flex items-start">
              <span className="text-black">Configure integration settings</span>
            </li>
            <li className="flex items-start">
              <span className="text-black">Assign to specific agents</span>
            </li>
            <li className="flex items-start">
              <span className="text-black">Test the connection</span>
            </li>
          </ul>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-3xs px-6 py-3 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Done
        </button>
      </div>
    </BaseModal>
  );
};

export default SuccessModal;
