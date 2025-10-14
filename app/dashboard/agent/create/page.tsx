'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AgentCreationLayout from '@/components/agent/AgentCreationLayout';
import StepNavigation from '@/components/agent/StepNavigation';
import { AgentCreationProvider, useAgentCreation } from '@/contexts/AgentCreationContext';
import { Step3Channels, Step4PhoneNumber, Step5ReviewPublish } from '@/components/agent/AgentSteps';

// Step Components
function Step1() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentType = searchParams.get('type') || 'inbound';
  const { agentData, updateAgentData } = useAgentCreation();

  const handleNext = () => {
    router.push(`/dashboard/agent/create?type=${agentType}&step=2`);
  };

  const handlePrevious = () => {
    router.push('/dashboard/agent');
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1E1E1E] mb-2">Basic Details</h1>
          <p className="text-[#6E6E6E] text-sm">
            Provide the basic information for your agent
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-8 space-y-6">
          {/* Agent Name and Agent Type in one row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Agent Name */}
            <div>
              <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                Agent Name
              </label>
              <input
                type="text"
                placeholder="Type..."
                value={agentData.agentName}
                onChange={(e) => updateAgentData({ agentName: e.target.value })}
                className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-[#1E1E1E] placeholder:text-[#9CA3AF] focus:bg-[#E0E0E0] transition-colors"
              />
            </div>

            {/* Agent Type Dropdown */}
            <div>
              <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
                Agent Type
              </label>
              <div className="relative">
                <select
                  value={agentData.agentTypeDropdown}
                  onChange={(e) => updateAgentData({ agentTypeDropdown: e.target.value })}
                  className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-[#1E1E1E] appearance-none cursor-pointer focus:bg-[#E0E0E0] transition-colors"
                >
                  <option>Agent Type</option>
                  <option>Inbound</option>
                  <option>Outbound</option>
                  <option>Widget</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path
                      d="M1 1.5L6 6.5L11 1.5"
                      stroke="#1E1E1E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
              Description
            </label>
            <textarea
              placeholder="Type..."
              value={agentData.description}
              onChange={(e) => updateAgentData({ description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-[#1E1E1E] placeholder:text-[#9CA3AF] focus:bg-[#E0E0E0] transition-colors resize-none"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
              Language
            </label>
            <div className="relative">
              <select
                value={agentData.language}
                onChange={(e) => updateAgentData({ language: e.target.value })}
                className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-[#1E1E1E] appearance-none cursor-pointer focus:bg-[#E0E0E0] transition-colors"
              >
                <option>Select</option>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Chinese</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="#1E1E1E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Persona & Tune */}
          <div>
            <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
              Persona & Tune
            </label>
            <textarea
              placeholder="Type..."
              value={agentData.personaTune}
              onChange={(e) => updateAgentData({ personaTune: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-[#1E1E1E] placeholder:text-[#9CA3AF] focus:bg-[#E0E0E0] transition-colors resize-none"
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <StepNavigation onPrevious={handlePrevious} onNext={handleNext} />
      </div>
  );
}

// Step 2: Knowledge Base (simplified - add full implementation)
function Step2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentType = searchParams.get('type') || 'inbound';
  const { agentData, updateAgentData } = useAgentCreation();

  const documents = [
    { id: 'product-faq', name: 'Product FAQ', lastUpdated: 'Last updated 2 days ago' },
    { id: 'sales-playbook', name: 'Sales Playbook', lastUpdated: 'Last updated 2 days ago' },
    { id: 'support-guidelines', name: 'Support Guidelines', lastUpdated: 'Last updated 2 days ago' },
  ];

  const toggleDocument = (docId: string) => {
    const current = agentData.selectedDocuments || [];
    if (current.includes(docId)) {
      updateAgentData({ selectedDocuments: current.filter(id => id !== docId) });
    } else {
      updateAgentData({ selectedDocuments: [...current, docId] });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E1E1E] mb-2">Knowledge Base</h1>
        <p className="text-[#6E6E6E] text-sm">Select documents to power your agent's knowledge</p>
      </div>

      <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-8">
        <p className="text-sm text-[#6E6E6E] mb-6">
          Choose which documents from your knowledge base this agent should have access to.
        </p>

        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 rounded-[12px] border border-[#E5E7EB] hover:border-[#8266D4] transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-[#F3F0FF] rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M11.6667 2.5H5.83333C5.39131 2.5 4.96738 2.67559 4.65482 2.98816C4.34226 3.30072 4.16667 3.72464 4.16667 4.16667V15.8333C4.16667 16.2754 4.34226 16.6993 4.65482 17.0118C4.96738 17.3244 5.39131 17.5 5.83333 17.5H14.1667C14.6087 17.5 15.0326 17.3244 15.3452 17.0118C15.6577 16.6993 15.8333 16.2754 15.8333 15.8333V6.66667L11.6667 2.5Z" stroke="#8266D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11.6667 2.5V6.66667H15.8333" stroke="#8266D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-[#1E1E1E]">{doc.name}</h3>
                  <p className="text-xs text-[#9CA3AF]">{doc.lastUpdated}</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={(agentData.selectedDocuments || []).includes(doc.id)}
                  onChange={() => toggleDocument(doc.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8266D4]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <StepNavigation
        onPrevious={() => router.push(`/dashboard/agent/create?type=${agentType}&step=1`)}
        onNext={() => router.push(`/dashboard/agent/create?type=${agentType}&step=3`)}
      />
    </div>
  );
}

function CreateAgentContent() {
  const searchParams = useSearchParams();
  const agentType = searchParams.get('type') || 'inbound';
  const step = parseInt(searchParams.get('step') || '1');

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3Channels />;
      case 4:
        return <Step4PhoneNumber />;
      case 5:
        return <Step5ReviewPublish />;
      default:
        return <Step1 />;
    }
  };

  return (
    <AgentCreationLayout currentStep={step} agentType={agentType}>
      {renderStep()}
    </AgentCreationLayout>
  );
}

export default function CreateAgentPage() {
  return (
    <AgentCreationProvider>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <CreateAgentContent />
      </Suspense>
    </AgentCreationProvider>
  );
}
