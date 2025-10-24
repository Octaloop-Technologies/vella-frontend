'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AgentCreationLayout from '@/components/agent/AgentCreationLayout';
import StepNavigation from '@/components/agent/StepNavigation';
import { AgentCreationProvider, useAgentCreation } from '@/contexts/AgentCreationContext';
import { Step3Channels, Step3WidgetSettings, Step4PhoneNumber, Step5ReviewPublish } from '@/components/agent/AgentSteps';
import Input from '@/components/shared/Input';
import Card from '@/components/shared/Card';
import Image from 'next/image';
import { useAgentTypes, useLanguages, useGenders, usePersonasByGender, useVoiceDetails } from '@/hooks/useConfig';
import { useToast } from '@/contexts/ToastContext';

// Step Components
function Step1() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentType = searchParams.get('type') || 'inbound';
  const { agentData, updateAgentData } = useAgentCreation();
  const { addToast } = useToast();

  // Configuration hooks
  const { agentTypes, loading: agentTypesLoading, error: agentTypesError } = useAgentTypes();
  const { languages, loading: languagesLoading, error: languagesError } = useLanguages();
  const { genders, loading: gendersLoading, error: gendersError } = useGenders();
  const { personas, loading: personasLoading, error: personasError } = usePersonasByGender(agentData.gender);
  const { voiceDetails, loading: voiceLoading } = useVoiceDetails(agentData.voiceId);

  // Auto-set tune from voice details
  React.useEffect(() => {
    if (voiceDetails?.success && voiceDetails.voice.labels.descriptive && 
        agentData.tune !== voiceDetails.voice.labels.descriptive) {
      updateAgentData({ tune: voiceDetails.voice.labels.descriptive });
    }
  }, [voiceDetails, agentData.tune, updateAgentData]);

  const handleNext = () => {
    // Validate required fields
    const requiredFields = [
      { field: agentData.agentName, name: 'Agent Name' },
      { field: agentData.agentTypeDropdown, name: 'Agent Type' },
      { field: agentData.description, name: 'Description' },
      { field: agentData.language, name: 'Language' },
      { field: agentData.gender, name: 'Gender' },
      { field: agentData.persona, name: 'Persona' },
    ];

    const missingFields = requiredFields.filter(({ field }) => !field || field.trim() === '');

    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(({ name }) => name).join(', ');
      addToast({
        message: `Please fill in the following required fields: ${fieldNames}`,
        type: 'error'
      });
      return;
    }

    router.push(`/dashboard/agent/create?type=${agentType}&step=2`);
  };

  const handlePrevious = () => {
    router.push('/dashboard/agent');
  };

  return (
    <div className='p-6 overflow-auto h-[80vh] '>
      {/* Header */}
      <div className="mb-8 ">
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
                disabled={agentTypesLoading}
              >
                <option value="">
                  {agentTypesLoading ? 'Loading agent types...' : 'Select Agent Type'}
                </option>
                {agentTypes && Object.entries(agentTypes).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.name}
                  </option>
                ))}
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
            {agentTypesError && (
              <p className="text-red-500 text-xs mt-1">{agentTypesError}</p>
            )}
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
                disabled={languagesLoading}
              >
                <option value="">
                  {languagesLoading ? 'Loading languages...' : 'Select Language'}
                </option>
                {languages.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.name} ({language.voice_count} voices)
                  </option>
                ))}
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
            {languagesError && (
              <p className="text-red-500 text-xs mt-1">{languagesError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
              Gender
            </label>
            <div className="relative">
              <select
                value={agentData.gender}
                onChange={(e) => {
                  updateAgentData({ 
                    gender: e.target.value,
                    persona: '',
                    voiceId: '',
                    tune: ''
                  });
                }}
                className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-[#1E1E1E] appearance-none cursor-pointer focus:bg-[#E0E0E0] transition-colors"
                disabled={gendersLoading}
              >
                <option value="">
                  {gendersLoading ? 'Loading genders...' : 'Select Gender'}
                </option>
                {genders.map((gender) => (
                  <option key={gender.code} value={gender.code}>
                    {gender.name} ({gender.voice_count} voices)
                  </option>
                ))}
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
            {gendersError && (
              <p className="text-red-500 text-xs mt-1">{gendersError}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1E1E1E] mb-2">
            Persona
          </label>
          <div className="relative">
            <select
              value={agentData.persona}
              onChange={(e) => {
                updateAgentData({ persona: e.target.value });
                // Find the selected persona and set the voice_id
                const selectedPersona = personas.find(p => p.code === e.target.value);
                if (selectedPersona) {
                  updateAgentData({ voiceId: selectedPersona.voice_id });
                }
              }}
              className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-[#1E1E1E] appearance-none cursor-pointer focus:bg-[#E0E0E0] transition-colors"
              disabled={personasLoading || !agentData.gender}
            >
              <option value="">
                {!agentData.gender 
                  ? 'Select gender first' 
                  : personasLoading 
                  ? 'Loading personas...' 
                  : 'Select Persona'
                }
              </option>
              {personas.map((persona, index) => (
                <option key={`${persona.code}-${index}`} value={persona.code}>
                  {persona.name}
                </option>
              ))}
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
          {personasError && (
            <p className="text-red-500 text-xs mt-1">{personasError}</p>
          )}
        </div>
      </div>

      {/* Voice Preview Section */}
      {agentData.voiceId && (
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-medium mb-4">Selected Voice & Tune</h3>
          {voiceLoading ? (
            <p className="text-sm text-gray-500">Loading voice details...</p>
          ) : voiceDetails?.success ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-[#1E1E1E]">Voice Name:</span>
                  <p className="text-[#717182] mt-1">{voiceDetails.voice.name}</p>
                </div>
                <div>
                  <span className="font-medium text-[#1E1E1E]">Tune (Tone):</span>
                  <p className="text-[#717182] mt-1 capitalize">{voiceDetails.voice.labels.descriptive}</p>
                </div>
                <div>
                  <span className="font-medium text-[#1E1E1E]">Accent:</span>
                  <p className="text-[#717182] mt-1 capitalize">{voiceDetails.voice.labels.accent}</p>
                </div>
                <div>
                  <span className="font-medium text-[#1E1E1E]">Age:</span>
                  <p className="text-[#717182] mt-1 capitalize">{voiceDetails.voice.labels.age}</p>
                </div>
              </div>

              <div>
                <span className="font-medium text-[#1E1E1E] text-sm">Description:</span>
                <p className="text-[#717182] text-sm mt-1">{voiceDetails.voice.description}</p>
              </div>
              
              {voiceDetails.voice.preview_url && (
                <div>
                  <span className="font-medium text-[#1E1E1E] text-sm">Voice Sample:</span>
                  <div className="mt-2 p-4 bg-[#F7F7F7] rounded-[10px]">
                    <audio controls className="w-full">
                      <source src={voiceDetails.voice.preview_url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-red-500">Failed to load voice details</p>
          )}
        </Card>
      )}

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

  console.log('CreateAgentContent - agentType:', agentType, 'step:', step); // Debug log

  const renderStep = () => {
    console.log('Rendering step:', step, 'for agentType:', agentType); // Debug log
    
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
          console.log('Widget - defaulting to Step1, step was:', step);
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
          console.log('Inbound/Outbound - defaulting to Step1, step was:', step);
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