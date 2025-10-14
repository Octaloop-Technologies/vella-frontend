'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import StepNavigation from './StepNavigation';
import { useAgentCreation } from '@/contexts/AgentCreationContext';

export function Step3Channels() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentType = searchParams.get('type') || 'inbound';
  const { agentData, updateAgentData } = useAgentCreation();

  const socialChannels = [
    { id: 'facebook', name: 'Facebook Messenger' },
    { id: 'instagram', name: 'Instagram DM' },
    { id: 'whatsapp', name: 'Whatsapp Business' },
  ];

  const crmIntegrations = [
    { id: 'hubspot', name: 'HubSpot' },
    { id: 'keap', name: 'Keap' },
    { id: 'gohighlevel', name: 'GoHighLevel' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E1E1E] mb-2">Channels</h1>
        <p className="text-[#6E6E6E] text-sm">Connect your agent to communication channels</p>
      </div>

      <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-8 space-y-8">
        <p className="text-sm text-[#6E6E6E]">
          Choose which documents from your knowledge base this agent should have access to.
        </p>

        {/* Social Channels */}
        <div>
          <h3 className="text-lg font-semibold text-[#1E1E1E] mb-4">Social Channels</h3>
          <div className="space-y-4">
            {socialChannels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between p-4 rounded-[12px] border border-[#E5E7EB]">
                <div className="flex items-center space-x-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="4" fill="#E5E7EB" />
                  </svg>
                  <span className="font-medium text-[#1E1E1E]">{channel.name}</span>
                </div>
                <button
                  className="px-6 py-2 rounded-[8px] border border-[#8266D4] text-[#8266D4] font-medium hover:bg-[#F3F0FF] transition-colors flex items-center space-x-2"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Connect</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CRM Integrations */}
        <div>
          <h3 className="text-lg font-semibold text-[#1E1E1E] mb-4">CRM Integrations</h3>
          <div className="space-y-4">
            {crmIntegrations.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-4 rounded-[12px] border border-[#E5E7EB]">
                <div className="flex items-center space-x-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="4" fill="#8266D4" fillOpacity="0.1" />
                    <path d="M12 7L14 12L12 17M12 7L10 12L12 17M12 7V17" stroke="#8266D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-medium text-[#1E1E1E]">{integration.name}</span>
                </div>
                <button
                  className="px-6 py-2 rounded-[8px] border border-[#8266D4] text-[#8266D4] font-medium hover:bg-[#F3F0FF] transition-colors flex items-center space-x-2"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Connect</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <StepNavigation
        onPrevious={() => router.push(`/dashboard/agent/create?type=${agentType}&step=2`)}
        onNext={() => router.push(`/dashboard/agent/create?type=${agentType}&step=4`)}
      />
    </div>
  );
}

export function Step4PhoneNumber() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentType = searchParams.get('type') || 'inbound';
  const { agentData, updateAgentData } = useAgentCreation();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E1E1E] mb-2">Phone Number</h1>
        <p className="text-[#6E6E6E] text-sm">Assign a phone number for voice communication</p>
      </div>

      <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Availble Phone Numbers</label>
          <div className="relative">
            <select
              value={agentData.phoneNumber}
              onChange={(e) => updateAgentData({ phoneNumber: e.target.value })}
              className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-[#1E1E1E] appearance-none cursor-pointer focus:bg-[#E0E0E0] transition-colors"
            >
              <option value="">Choose a phone no</option>
              <option value="+92 555 123 4564">+92 555 123 4564</option>
              <option value="+92 555 123 4565">+92 555 123 4565</option>
              <option value="+92 555 123 4566">+92 555 123 4566</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {agentData.phoneNumber && (
          <div>
            <label className="block text-sm font-medium text-[#1E1E1E] mb-4">Selected Number</label>
            <div className="flex items-center space-x-3 p-4 rounded-[12px] border border-[#8266D4] bg-[#F3F0FF]">
              <div className="w-10 h-10 bg-[#8266D4] rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M18.3332 14.1V16.6C18.3341 16.8321 18.2866 17.0618 18.1936 17.2745C18.1006 17.4871 17.9643 17.678 17.7933 17.8349C17.6222 17.9918 17.4203 18.1112 17.2005 18.1856C16.9806 18.26 16.7477 18.288 16.5165 18.2683C13.9522 17.9892 11.489 17.1117 9.32486 15.7083C7.31139 14.4288 5.60431 12.7217 4.32486 10.7083C2.91651 8.53432 2.03898 6.05908 1.76653 3.48332C1.7469 3.25281 1.77477 3.02055 1.84895 2.80127C1.92313 2.58199 2.04214 2.38049 2.19862 2.2096C2.3551 2.03871 2.54548 1.90218 2.75768 1.80869C2.96988 1.7152 3.19913 1.66696 3.43153 1.66666H5.93153C6.32967 1.66286 6.71497 1.80582 7.0168 2.06953C7.31863 2.33324 7.51541 2.69946 7.56819 3.09499C7.66725 3.88464 7.85656 4.66126 8.13236 5.40832C8.24117 5.68967 8.27129 5.99579 8.21952 6.29257C8.16775 6.58935 8.03613 6.86621 7.83986 7.09166L6.79153 8.13999C7.97795 10.2286 9.77127 12.0219 11.8599 13.2083L12.9082 12.16C13.1337 11.9637 13.4105 11.8321 13.7073 11.7804C14.0041 11.7286 14.3102 11.7587 14.5915 11.8675C15.3386 12.1433 16.1152 12.3326 16.9049 12.4317C17.3048 12.4849 17.6745 12.6855 17.9388 12.9927C18.2032 13.3 18.3433 13.6913 18.3332 14.1Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-medium text-[#1E1E1E]">{agentData.phoneNumber}</span>
            </div>
          </div>
        )}
      </div>

      <StepNavigation
        onPrevious={() => router.push(`/dashboard/agent/create?type=${agentType}&step=3`)}
        onNext={() => router.push(`/dashboard/agent/create?type=${agentType}&step=5`)}
      />
    </div>
  );
}

export function Step5ReviewPublish() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentType = searchParams.get('type') || 'inbound';
  const { agentData } = useAgentCreation();

  const handlePublish = () => {
    console.log('Publishing agent:', agentData);
    router.push('/dashboard/agent');
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E1E1E] mb-2">Review & Publish</h1>
        <p className="text-[#6E6E6E] text-sm">Review your agent configuration before publishing</p>
      </div>

      <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#6E6E6E]">Agent Name</label>
            <p className="text-base text-[#1E1E1E] mt-1">{agentData.agentName || '-'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-[#6E6E6E]">Type</label>
            <p className="text-base text-[#1E1E1E] mt-1 capitalize">{agentType || '-'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-[#6E6E6E]">Description</label>
            <p className="text-base text-[#1E1E1E] mt-1">{agentData.description || '-'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-[#6E6E6E]">Knowledge Base</label>
            <p className="text-base text-[#1E1E1E] mt-1">
              {(agentData.selectedDocuments || []).length} Documents selected
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-[#6E6E6E]">Integrations</label>
            <p className="text-base text-[#1E1E1E] mt-1">
              {(agentData.selectedIntegrations || []).length} CRM integration selected
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E5E7EB]">
          <div className="flex items-start space-x-3 p-4 rounded-[12px] bg-[#F3F0FF]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mt-0.5 flex-shrink-0">
              <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="#8266D4" strokeWidth="1.5" />
              <path d="M10 7V10L12 12" stroke="#8266D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm text-[#1E1E1E]">
              Your agent is ready to be published. Once published, it will be available for use immediately.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => router.push(`/dashboard/agent/create?type=${agentType}&step=4`)}
          className="px-8 py-3 rounded-[10px] border border-[#E5E7EB] bg-white text-[#1E1E1E] font-medium hover:bg-[#F9FAFB] transition-colors flex items-center space-x-2"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Previous</span>
        </button>

        <button
          onClick={handlePublish}
          className="px-8 py-3 rounded-[10px] bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white font-medium hover:opacity-90 transition-opacity"
        >
          Publish Agent
        </button>
      </div>
    </div>
  );
}
