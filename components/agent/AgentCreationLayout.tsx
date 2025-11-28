'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAgentCreation } from '@/contexts/AgentCreationContext';

interface Step {
  number: number;
  title: string;
  subtitle: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface AgentCreationLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  agentType: string;
}

const AgentCreationLayout: React.FC<AgentCreationLayoutProps> = ({
  children,
  currentStep,
  agentType,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentId = searchParams.get('id');
  const isEditMode = !!agentId;
  const { agentData } = useAgentCreation();

  // Validation logic for Step 1
  const isStep1Valid = React.useMemo(() => {
    const requiredFields = [
      agentData.agentName,
      agentData.agentTypeDropdown || agentType,
      agentData.channelType,
      agentData.description,
      agentData.language,
      agentData.gender,
      agentData.accent,
      agentData.persona,
    ];

    const areFieldsFilled = requiredFields.every(field => field && field.trim() !== '');
    const isDescriptionValid = (agentData.description?.length || 0) >= 30;

    return areFieldsFilled && isDescriptionValid;
  }, [agentData, agentType]);

  let steps: Step[] = [];

  if (agentType === 'widget') {
    steps = [
      {
        number: 1,
        title: 'Basic Details',
        subtitle: 'Agent name and configuration',
        isActive: currentStep === 1,
        isCompleted: currentStep > 1,
      },
      {
        number: 2,
        title: 'Knowledge Base',
        subtitle: 'Upload documents and data',
        isActive: currentStep === 2,
        isCompleted: currentStep > 2,
      },
      // {
      //   number: 3,
      //   title: 'Widget Settings',
      //   subtitle: 'Customize widget appearance',
      //   isActive: currentStep === 3,
      //   isCompleted: currentStep > 3,
      // },
      {
        number: 3,
        title: 'Review & Publish',
        subtitle: 'Review and publish agent',
        isActive: currentStep === 3,
        isCompleted: currentStep > 3,
      },
    ];
  } else if (agentType === 'inbound') {
    // Inbound agent steps
    steps = [
      {
        number: 1,
        title: 'Basic Details',
        subtitle: 'Agent name and configuration',
        isActive: currentStep === 1,
        isCompleted: currentStep > 1,
      },
      {
        number: 2,
        title: 'Knowledge Base',
        subtitle: 'Upload documents and data',
        isActive: currentStep === 2,
        isCompleted: currentStep > 2,
      },
      {
        number: 3,
        title: 'Channels',
        subtitle: 'Connect integration',
        isActive: currentStep === 3,
        isCompleted: currentStep > 3,
      },
      {
        number: 4,
        title: 'Phone Number',
        subtitle: 'Assign phone number',
        isActive: currentStep === 4,
        isCompleted: currentStep > 4,
      },
      {
        number: 5,
        title: 'Review & Publish',
        subtitle: 'Review and publish agent',
        isActive: currentStep === 5,
        isCompleted: currentStep > 5,
      },
    ];
  } else {
    // Outbound agent steps (no phone number step)
    steps = [
      {
        number: 1,
        title: 'Basic Details',
        subtitle: 'Agent name and configuration',
        isActive: currentStep === 1,
        isCompleted: currentStep > 1,
      },
      {
        number: 2,
        title: 'Knowledge Base',
        subtitle: 'Upload documents and data',
        isActive: currentStep === 2,
        isCompleted: currentStep > 2,
      },
      {
        number: 3,
        title: 'Channels',
        subtitle: 'Connect integration',
        isActive: currentStep === 3,
        isCompleted: currentStep > 3,
      },
      {
        number: 4,
        title: 'Review & Publish',
        subtitle: 'Review and publish agent',
        isActive: currentStep === 4,
        isCompleted: currentStep > 4,
      },
    ];
  }

  return (
    <DashboardLayout>
      <div className="h-full flex">
        
        {/* Stepper Sidebar */}
        <div className="w-80 flex-shrink-0 border-r border-[#0000001A] p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-1 text-black">Create New Agent</h2>
            <p className="text-sm capitalize text-black">{agentType} Agent</p>
          </div>

          <div className="space-y-3">
            {steps.map((step) => {
              const isAccessible = step.number === 1 || isStep1Valid || isEditMode;
              
              return (
                <div
                  key={step.number}
                  onClick={() => {
                    if (isAccessible) {
                      router.push(`/dashboard/agent/create?type=${agentType}&step=${step.number}${agentId ? `&id=${agentId}` : ''}`);
                    }
                  }}
                  className={`flex items-start space-x-3 p-4 rounded-[10px] transition-all ${
                    isAccessible ? 'cursor-pointer' : ''
                  } ${
                    step.isActive
                      ? 'bg-white border border-[#8266D4]'
                      : isAccessible
                      ? 'bg-white border border-[#8266D4]'
                      : 'bg-white border border-[#0000001A] opacity-60'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-base ${
                      step.isCompleted
                        ? 'bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white'
                        : step.isActive
                        ? 'bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white'
                        : 'bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white'
                    }`}
                  >
                    {step.isCompleted ? (
                      <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M13.3332 4L5.99984 11.3333L2.6665 8"
                          stroke="#FFFFFF"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-base ${
                        step.isActive || isAccessible ? 'text-[#0A0A0A]' : 'text-black'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-xs ${
                        step.isActive || isAccessible ? 'text-[#717182]' : 'text-black'
                      }`}
                    >
                      {step.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 relative ">
          {children}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentCreationLayout;