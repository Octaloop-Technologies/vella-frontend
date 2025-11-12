import React from 'react';
import BaseModal from '@/components/shared/BaseModal';
import Card from '@/components/shared/Card';
import Image from 'next/image';

interface ActivationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  activationData?: {
    success: boolean;
    message: string;
    agent: {
      id: string;
      name: string;
      phone_number: string;
      type: string;
      voice_id: string;
    };
    previously_active_agents?: Array<{
      id: string;
      name: string;
      phone_number: string;
    }>;
    total_deactivated?: number;
  };
}

const ActivationSuccessModal: React.FC<ActivationSuccessModalProps> = ({ 
  isOpen, 
  onClose,
  activationData
}) => {
  if (!activationData) return null;

  const { agent, message, previously_active_agents, total_deactivated } = activationData;

  const copyPhoneNumber = () => {
    if (agent.phone_number) {
      navigator.clipboard.writeText(agent.phone_number);
      // You can add a toast notification here
      console.log('Phone number copied to clipboard');
    }
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-2xl" 
      showCloseButton={true}
    >
      <div className="p-8">
        {/* Success Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-black mb-2">Agent Activated Successfully!</h2>
          <p className="text-sm text-gray-600 text-center">{message}</p>
        </div>

        {/* Agent Details Card */}
        <Card className="mb-6 p-6 border border-[#EBEBEB] bg-gradient-to-br from-[#8266D4]/5 to-[#41288A]/5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-black">{agent.name}</h3>
                <p className="text-sm text-gray-600 capitalize">Type: {agent.type}</p>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Active
              </div>
            </div>

            {/* Phone Number Section */}
            <div className="bg-white rounded-lg p-4 border border-[#EBEBEB]">
              <p className="text-sm text-gray-600 mb-2">Call this number to test your agent:</p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-b from-[#8266D4] to-[#41288A] rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="text-lg font-semibold text-black">{agent.phone_number}</p>
                  </div>
                </div>
                <button
                  onClick={copyPhoneNumber}
                  className="px-4 py-2 bg-white border border-[#EBEBEB] rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Copy</span>
                </button>
              </div>
            </div>

            {/* Agent ID */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">Agent ID</p>
                <p className="text-sm font-medium text-black truncate">{agent.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Voice ID</p>
                <p className="text-sm font-medium text-black truncate">{agent.voice_id}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Previously Active Agents Alert */}
        {previously_active_agents && previously_active_agents.length > 0 && (
          <Card className="mb-6 p-4 border border-orange-200 bg-orange-50">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-800 mb-1">
                  {total_deactivated} agent{total_deactivated && total_deactivated > 1 ? 's' : ''} automatically deactivated
                </p>
                <p className="text-xs text-orange-700">
                  The following agent{previously_active_agents.length > 1 ? 's were' : ' was'} deactivated to activate {agent.name}:
                </p>
                <ul className="mt-2 space-y-1">
                  {previously_active_agents.map((prevAgent, index) => (
                    <li key={index} className="text-xs text-orange-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                      <span className="font-medium">{prevAgent.name}</span>
                      {prevAgent.phone_number && (
                        <span className="text-orange-600">({prevAgent.phone_number})</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium hover:opacity-90 transition-all"
          >
            Got it!
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ActivationSuccessModal;
