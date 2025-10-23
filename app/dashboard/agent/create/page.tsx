'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AgentCreationLayout from '@/components/agent/AgentCreationLayout';
import StepNavigation from '@/components/agent/StepNavigation';
import { AgentCreationProvider, useAgentCreation } from '@/contexts/AgentCreationContext';
import { Step3Channels, Step3WidgetSettings, Step4PhoneNumber, Step5ReviewPublish } from '@/components/agent/AgentSteps';
import Input from '@/components/shared/Input';
import Card from '@/components/shared/Card';
import Image from 'next/image';

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
    <div className='p-6'>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Basic Details</h1>
        <p className="text-[#717182] text-base">
          Provide the basic information for your agent
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Agent Name and Agent Type in one row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Agent Name */}
          <div>
            <Input
              label="Agent Name"
              value={agentData.agentName}
              onChange={(e) => updateAgentData({ agentName: e.target.value })}
              placeholder="Type..."
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
        <div className='grid grid-cols-2 gap-6'>
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

          <div>
            <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
              Gender
            </label>
            <div className="relative">
              <select
                value={agentData.gender}
                onChange={(e) => updateAgentData({ gender: e.target.value })}
                className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-[#1E1E1E] appearance-none cursor-pointer focus:bg-[#E0E0E0] transition-colors"
              >
                <option>Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Prefer not to say</option>
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
        <div className='grid grid-cols-2 gap-6'>
          <div>
            <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
              Persona
            </label>
            <div className="relative">
              <select
                value={agentData.persona}
                onChange={(e) => updateAgentData({ persona: e.target.value })}
                className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-[#1E1E1E] appearance-none cursor-pointer focus:bg-[#E0E0E0] transition-colors"
              >
                <option>Select</option>
                <option>Witty</option>
                <option>Professional</option>
                <option>Friendly</option>
                <option>Formal</option>
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

          <div>
            <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
              Tune
            </label>
            <div className="relative">
              <select
                value={agentData.tune}
                onChange={(e) => updateAgentData({ tune: e.target.value })}
                className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-[#1E1E1E] appearance-none cursor-pointer focus:bg-[#E0E0E0] transition-colors"
              >
                <option>Select</option>
                <option>Balanced</option>
                <option>Creative</option>
                <option>Precise</option>
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
      </div>

      {/* Navigation Buttons */}
      <StepNavigation onPrevious={handlePrevious} onNext={handleNext} previousLabel='Back' />
    </div>
  );
}

// Step 2: Knowledge Base (same for all, updated onNext conditional)
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

  const nextStep = agentType === 'widget' ? 3 : 3; // For widget, next is 3 (widget settings), else 3 (channels)

  return (
    <div className='p-6'>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Knowledge Base</h1>
        <p className="text-[#717182] text-base">
          Select documents to power your agent's knowledge
        </p>
      </div>

      <div className="py-5 px-3.5 text-sm text-[#2B231E] font-medium opacity-50 mb-6 bg-[#EBEBEB] border border-[#EBEBEB] rounded-lg">
        Choose which documents from your knowledge base this agent should have access to.
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <Card
            key={doc.id}
            className="flex items-center justify-between p-4 rounded-[12px] border border-[#E5E7EB]"
          >
            <div className="flex items-center space-x-4">
              <Image
                src="/svgs/page.svg"
                alt="Document Icon"
                width={24}
                height={24}
              />
              <div className='space-y-1'>
                <h3 className="font-medium text-sm">{doc.name}</h3>
                <p className="text-xs text-[#2B231E] opacity-50">{doc.lastUpdated}</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={(agentData.selectedDocuments || []).includes(doc.id)}
                onChange={() => toggleDocument(doc.id)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#E5E7EB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-b from-[#8266D4] to-[#41288A]"></div>
            </label>
          </Card>
        ))}
      </div>

      <StepNavigation
        onPrevious={() => router.push(`/dashboard/agent/create?type=${agentType}&step=1`)}
        onNext={() => router.push(`/dashboard/agent/create?type=${agentType}&step=${nextStep}`)}
      />
    </div>
  );
}

function CreateAgentContent() {
  const searchParams = useSearchParams();
  const agentType = searchParams.get('type') || 'inbound';
  const step = parseInt(searchParams.get('step') || '1');

  const renderStep = () => {
    if (agentType === 'widget') {
      switch (step) {
        case 1:
          return <Step1 />;
        case 2:
          return <Step2 />;
        case 3:
          return <Step3WidgetSettings />;
        case 4:
          return <Step5ReviewPublish />;
        default:
          return <Step1 />;
      }
    } else {
      // inbound or outbound
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