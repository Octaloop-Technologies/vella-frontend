'use client';

import React from 'react';
import BaseModal from '@/components/shared/BaseModal';
import Card from '@/components/shared/Card';
import Image from 'next/image';

interface Integration {
  name: string;
  description: string;
  icon: React.ReactNode;
  badges: Array<{
    label: string;
    variant?: string;
  }>;
  connectedDate?: string;
  lastSync?: string;
  footerTags: string[];
  isConnected?: boolean;
  onConnect?: () => void;
  onConfigure?: () => void;
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
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl" title={`Connect ${integration.name}`} subtitle={`Securely connect ${integration.name} to your AgentBuilder account`}>
      <div className="p-10">
        {/* Features List */}
        <Card className="mb-6 border border-[#EBEBEB] p-5">
          <p className="font-medium mb-3 text-black">What you'll get:</p>
          <div className="space-y-4">
            {integration.footerTags.map((feature, index) => (
              <div key={index} className="flex items-start">
                <Image src="/svgs/tick.svg" alt="Feature" width={24} height={24} className="inline-block mr-2 mt-1 flex-shrink-0"/>
                <span className="text-sm font-medium text-black">{feature}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Security Notice */}
        <div className="bg-[#007BFF1A] border border-[#8266D4] rounded-[10px] p-4 mb-6 shadow-card">
          <div className="flex items-start">
            <Image src="/svgs/shield2.svg" alt="Security" width={18} height={18} className="inline-block mr-2 mt-1 flex-shrink-0"/>
            <div>
              <p className="font-semibold text-[#8266D4] mb-2">Secure Connection</p>
              <p className="text-sm text-[#8266D4]">We use OAuth 2.0 to securely connect to your account. We never store your passwords.</p>
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
