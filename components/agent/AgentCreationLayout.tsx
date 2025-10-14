'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

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
      {
        number: 3,
        title: 'Widget Settings',
        subtitle: 'Customize widget appearance',
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
  } else {
    // Same for inbound and outbound
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
  }

  return (
    <DashboardLayout>
      <div className="p-8 flex gap-6">
        
        {/* Stepper Sidebar */}
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-6 w-80 flex-shrink-0">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#1E1E1E] mb-1">Create New Agent</h2>
            <p className="text-sm text-[#6E6E6E] capitalize">{agentType} Agent</p>
          </div>

          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex items-start space-x-3 p-3 rounded-[10px] transition-all ${
                  step.isActive
                    ? 'bg-[#F3F0FF] border border-[#8266D4]'
                    : step.isCompleted
                    ? 'bg-white border border-[#E5E7EB]'
                    : 'bg-white border border-[#E5E7EB] opacity-50'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs ${
                    step.isCompleted
                      ? 'bg-[#8266D4] text-white'
                      : step.isActive
                      ? 'bg-[#8266D4] text-white'
                      : 'bg-[#E5E7EB] text-[#9CA3AF]'
                  }`}
                >
                  {step.isCompleted ? (
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.3332 4L5.99984 11.3333L2.6665 8"
                        stroke="white"
                        strokeWidth="2"
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
                    className={`font-semibold text-xs mb-0.5 ${
                      step.isActive || step.isCompleted ? 'text-[#1E1E1E]' : 'text-[#9CA3AF]'
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-[10px] ${
                      step.isActive || step.isCompleted ? 'text-[#6E6E6E]' : 'text-[#9CA3AF]'
                    }`}
                  >
                    {step.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentCreationLayout;