'use client';

import React from 'react';
import BaseModal from '@/components/shared/BaseModal';

interface Integration {
  id: string;
  name: string;
  description: string;
  features: string[];
}

interface ConnectIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: Integration | null;
  onSuccess: () => void;
}

const ConnectIntegrationModal: React.FC<ConnectIntegrationModalProps> = ({ 
  isOpen, 
  onClose,
  integration,
  onSuccess
}) => {
  if (!integration) return null;

  const handleConnect = () => {
    // Add your connection logic here
    console.log('Connecting to:', integration.name);
    onSuccess();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="p-10">
        {/* Title */}
        <h2 className="text-xl font-semibold text-[#1F2937] mb-2">Connect {integration.name}</h2>
        <p className="text-sm text-[#6B7280] mb-6">Securely connect {integration.name} to your AgentBuilder account</p>

        {/* Features List */}
        <div className="mb-6">
          <p className="text-sm font-medium text-[#1F2937] mb-3">What you'll get:</p>
          <div className="space-y-3">
            {integration.features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mr-3 mt-0.5 flex-shrink-0">
                  <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-sm text-[#1F2937]">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mr-3 mt-0.5 flex-shrink-0">
              <path d="M10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17317C0.00433284 8.00043 -0.193701 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8079C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C20 8.68678 19.7413 7.38642 19.2388 6.17317C18.7362 4.95991 17.9997 3.85752 17.0711 2.92893C16.1425 2.00035 15.0401 1.26375 13.8268 0.761205C12.6136 0.258658 11.3132 0 10 0ZM10 18C8.41775 18 6.87103 17.5308 5.55544 16.6518C4.23985 15.7727 3.21447 14.5233 2.60897 13.0615C2.00347 11.5997 1.84504 9.99113 2.15372 8.43928C2.4624 6.88743 3.22433 5.46197 4.34315 4.34315C5.46197 3.22433 6.88743 2.4624 8.43928 2.15372C9.99113 1.84504 11.5997 2.00346 13.0615 2.60896C14.5233 3.21447 15.7727 4.23984 16.6518 5.55544C17.5308 6.87103 18 8.41775 18 10C18 12.1217 17.1571 14.1566 15.6569 15.6569C14.1566 17.1571 12.1217 18 10 18Z" fill="#3B82F6"/>
              <path d="M10 5C9.73478 5 9.48043 5.10536 9.29289 5.29289C9.10536 5.48043 9 5.73478 9 6C9 6.26522 9.10536 6.51957 9.29289 6.70711C9.48043 6.89464 9.73478 7 10 7C10.2652 7 10.5196 6.89464 10.7071 6.70711C10.8946 6.51957 11 6.26522 11 6C11 5.73478 10.8946 5.48043 10.7071 5.29289C10.5196 5.10536 10.2652 5 10 5ZM10 9C9.73478 9 9.48043 9.10536 9.29289 9.29289C9.10536 9.48043 9 9.73478 9 10V14C9 14.2652 9.10536 14.5196 9.29289 14.7071C9.48043 14.8946 9.73478 15 10 15C10.2652 15 10.5196 14.8946 10.7071 14.7071C10.8946 14.5196 11 14.2652 11 14V10C11 9.73478 10.8946 9.48043 10.7071 9.29289C10.5196 9.10536 10.2652 9 10 9Z" fill="#3B82F6"/>
            </svg>
            <div>
              <p className="text-sm font-medium text-[#1F2937] mb-1">Secure Connection</p>
              <p className="text-xs text-[#6B7280]">We use OAuth 2.0 to securely connect to your account. We never store your passwords.</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-[#E5E7EB] text-[#1F2937] rounded-lg font-medium hover:bg-[#F9FAFB] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConnect}
            className="flex-1 px-6 py-3 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Connect Account
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConnectIntegrationModal;
