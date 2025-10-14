'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
  const steps: Step[] = [
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

  return (
    <div className="flex h-screen bg-[#F7F7F7]">
      {/* Sidebar with Steps */}
      <div className="w-[380px] bg-white border-r border-[#E5E7EB] flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[#E5E7EB]">
          <Link href="/dashboard/agent">
            <Image
              src="/dashboard/png/logo.png"
              alt="Logo"
              width={60}
              height={60}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Title */}
        <div className="p-6 border-b border-[#E5E7EB]">
          <h2 className="text-xl font-bold text-[#1E1E1E] mb-1">Create New Agent</h2>
          <p className="text-sm text-[#6E6E6E] capitalize">{agentType} Agent</p>
        </div>

        {/* Steps */}
        <div className="flex-1 p-6 space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`flex items-start space-x-4 p-4 rounded-[12px] transition-all ${
                step.isActive
                  ? 'bg-[#F3F0FF] border border-[#8266D4]'
                  : step.isCompleted
                  ? 'bg-white border border-[#E5E7EB]'
                  : 'bg-white border border-[#E5E7EB] opacity-50'
              }`}
            >
              {/* Step Number/Check */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                  step.isCompleted
                    ? 'bg-[#8266D4] text-white'
                    : step.isActive
                    ? 'bg-[#8266D4] text-white'
                    : 'bg-[#E5E7EB] text-[#9CA3AF]'
                }`}
              >
                {step.isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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

              {/* Step Info */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-semibold text-sm mb-1 ${
                    step.isActive || step.isCompleted ? 'text-[#1E1E1E]' : 'text-[#9CA3AF]'
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-xs ${
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Search and User */}
        <header className="bg-white border-b border-[#E5E7EB] px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280">
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search agents, docs, chats..."
                className="w-full pl-12 pr-4 py-3 bg-[#F9FAFB] rounded-[10px] outline-none text-sm text-[#1E1E1E] placeholder:text-[#9CA3AF] focus:bg-[#F3F4F6] transition-colors border border-[#E5E7EB]"
              />
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 bg-[#F9FAFB] rounded-full hover:bg-[#F3F4F6]">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M1.68792 9.84632C1.54615 10.7757 2.17997 11.4207 2.956 11.7422C5.93118 12.9747 10.0714 12.9747 13.0466 11.7422C13.8226 11.4207 14.4564 10.7757 14.3147 9.84632C14.2276 9.27518 13.7968 8.79958 13.4776 8.33518C13.0595 7.71945 13.018 7.04778 13.0179 6.33325C13.0179 3.57183 10.7719 1.33325 8.0013 1.33325C5.23072 1.33325 2.98472 3.57183 2.98472 6.33325C2.98466 7.04778 2.94312 7.71945 2.52504 8.33518C2.20586 8.79958 1.77504 9.27518 1.68792 9.84632Z"
                    stroke="black"
                    strokeWidth="1.125"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.33203 12.6667C5.63769 13.8169 6.7157 14.6667 7.9987 14.6667C9.2817 14.6667 10.3597 13.8169 10.6654 12.6667"
                    stroke="black"
                    strokeWidth="1.125"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="flex items-center space-x-3">
                <Image
                  src="/dashboard/png/user-avatar.png"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-[#1E1E1E]">Anas Ali</p>
                  <p className="text-xs text-[#9CA3AF]">abc.xyz.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AgentCreationLayout;
