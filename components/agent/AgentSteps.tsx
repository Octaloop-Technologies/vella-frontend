'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import StepNavigation from './StepNavigation';
import { useAgentCreation } from '@/contexts/AgentCreationContext';
import Card from '@/components/shared/Card';
import Image from 'next/image';
import Input from '@/components/shared/Input';

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

  // Assume connect buttons update selected, but not implemented; reusing as is

  return (
    <div className='p-6'>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Channels</h1>
        <p className="text-[#717182] text-base">
          Connect your agent to communication channels
        </p>
      </div>

      <div className="py-5 px-3.5 text-sm text-[#2B231E] font-medium opacity-50 mb-6 bg-[#EBEBEB] border border-[#EBEBEB] rounded-lg">
        Choose which documents from your knowledge base this agent should have access to.
      </div>

      <Card className="p-5 space-y-8 mb-8">
        {/* Social Channels */}
        <div>
          <h3 className="text-lg font-medium mb-4">Social Channels</h3>
          <div className="space-y-1">
            {socialChannels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between p-2 border-b last:border-0 border-[#E5E7EB]">
                <div className="flex items-center space-x-3">
                  <Image
                    src={`/svgs/message.svg`}
                    alt={`${channel.name} Icon`}
                    width={20}
                    height={20}
                  />
                  <span className="font-medium text-sm">{channel.name}</span>
                </div>
                <button
                  className="px-6 py-2 rounded-[8px] border border-[#8266D4] text-[#8266D4] font-medium flex items-center space-x-2 shadow-card"
                >
                  <Image
                    src="/svgs/link.svg"
                    alt="Link Icon"
                    width={16}
                    height={16}
                  />
                  <span>Connect</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-5 space-y-8 mb-8">
        {/* CRM Integrations */}
        <div>
          <h3 className="text-lg font-medium mb-4">CRM Integrations</h3>
          <div className="space-y-1">
            {crmIntegrations.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-2 border-b last:border-0 border-[#E5E7EB]">
                <div className="flex items-center space-x-3">
                  <Image
                    src={`/svgs/lightning2.svg`}
                    alt={`${integration.name} Icon`}
                    width={16}
                    height={24}
                  />
                  <span className="font-medium text-sm">{integration.name}</span>
                </div>
                <button
                  className="px-6 py-2 rounded-[8px] border border-[#8266D4] text-[#8266D4] font-medium flex items-center space-x-2 shadow-card"
                >
                  <Image
                    src="/svgs/link.svg"
                    alt="Link Icon"
                    width={16}
                    height={16}
                  />
                  <span>Connect</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

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
    <div className='p-6'>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Phone Number</h1>
        <p className="text-[#717182] text-base">
          Assign a phone number for voice communication
        </p>
      </div>

        <div>
          <label className="block text-xs text-[#2B231E] mb-2">Available Phone Numbers</label>
          <div className="relative w-96">
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
        <Card className="p-5 mt-8">
          <div className="space-y-4">
            <h1 className="text-lg font-medium mb-6">Selected Number</h1>
            <div className="flex items-center space-x-3">
              <Image
                src="/svgs/phone.svg"
                alt="Phone Icon"
                width={18}
                height={18}
              />
              <span className="font-medium text-sm">{agentData.phoneNumber}</span>
            </div>
          </div>
        </Card>
      )}

      <StepNavigation
        onPrevious={() => router.push(`/dashboard/agent/create?type=${agentType}&step=3`)}
        onNext={() => router.push(`/dashboard/agent/create?type=${agentType}&step=5`)}
      />
    </div>
  );
}

export function Step3WidgetSettings() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentType = searchParams.get('type') || 'widget';
  const { agentData, updateAgentData } = useAgentCreation();
  const [selectedWidgetType, setSelectedWidgetType] = useState<'chat' | 'voice'>('chat');

  const positionOptions = ['Bottom Right', 'Bottom Left'];

  const positionMap: { [key: string]: string } = {
    'Bottom Right': 'bottom-right',
    'Bottom Left': 'bottom-left',
  };

  const embedCode = `
<script>
  (function(){
    var w = window;
    var d = document;
    var s = d.createElement('script');
    s.src = 'https://cdn.agentbuilder.com/widget.js';
    s.async = true;
    s.dataset.agentId = 'gfd';
    s.dataset.widgetType = 'chat';
    s.dataset.color = '#41288A';
    s.body.position = '${positionMap[agentData.widgetPosition] || 'bottom-left'}';
    d.body.appendChild(s);
  })();
</script>
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    // Add toast or feedback if needed
  };

  const previewPositionStyle = agentData.widgetPosition === 'Bottom Right' ? 'right-4' : 'left-4';

  return (
    <div className='p-6'>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Widget Settings</h1>
        <p className="text-[#717182] text-base">
          Customize your widget appearance and behavior
        </p>
      </div>

      <div className='grid grid-cols-2 gap-6 mb-6'>
        <Card className={`p-4 flex flex-col gap-1 cursor-pointer ${selectedWidgetType === 'chat' ? 'border border-[#41288A] bg-[#007BFF1A]' : 'border border-[#E5E7EB]'}`} onClick={() => setSelectedWidgetType('chat')}>
          <Image src="/svgs/message.svg" alt="Chat Icon" width={24} height={24} className="object-contain mb-2" />
          <h3 className='text-base font-medium'>Chat Bubble</h3>
          <p className='text-xs font-medium'>
            Text based chat widget
          </p>
        </Card>
        <Card className={`p-4 flex flex-col gap-1 cursor-pointer ${selectedWidgetType === 'voice' ? 'border border-[#41288A] bg-[#007BFF1A]' : 'border border-[#E5E7EB]'}`} onClick={() => setSelectedWidgetType('voice')}>
          <Image src="/svgs/phone.svg" alt="Call Icon" width={24} height={24} className="object-contain mb-2" />
          <h3 className='text-base font-medium'>Voice Call Button</h3>
          <p className='text-xs font-medium'>
            Voice calling widget
          </p>
        </Card>
      </div>

      <div className=" space-y-4">
        <div className='grid grid-cols-2 gap-6'>
          {/* Voice Call Button */}
          <Input
            type="text"
            label="Button Text"
            placeholder="Type..."
            value={selectedWidgetType === 'chat' ? agentData.buttonText : agentData.voiceButtonText}
            onChange={(e) => {
              selectedWidgetType === 'chat' ? updateAgentData({ buttonText: e.target.value }) : updateAgentData({ voiceButtonText: e.target.value });
            }}
          />

          {/* Widget Position */}
          <div>
            <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Widget Position</label>
            <div className="relative">
              <select
                value={agentData.widgetPosition}
                onChange={(e) => updateAgentData({ widgetPosition: e.target.value })}
                className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-[#1E1E1E] appearance-none cursor-pointer focus:bg-[#E0E0E0] transition-colors"
              >
                {positionOptions.map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {/* Live Preview */}
        <div>
          <h3 className="text-[#1E1E1E] text-sm font-medium mb-2">Live Preview</h3>
          <div className="relative h-64 bg-[#EBEBEB] rounded-lg overflow-hidden">
            {selectedWidgetType === 'chat' ? (
              <button className={`absolute bottom-4 ${previewPositionStyle} px-6 py-3 rounded-full bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white font-medium flex items-center justify-center space-x-2`}>
                <Image src="/svgs/message2.svg" alt="Chat Icon" width={16} height={16} />
                <span>{agentData.buttonText || 'Chat with Us'}</span>
              </button>
            ) : (
              <button className={`absolute bottom-4 ${previewPositionStyle} px-6 py-3 rounded-full bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white font-medium flex items-center justify-center space-x-2`}>
                <Image src="/svgs/phone2.svg" alt="Phone Icon" width={16} height={16} />
                <span>{agentData.voiceButtonText || 'Call Us'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Embed Code */}
        <div>
          <h3 className="text-[#1E1E1E] text-sm font-medium mb-2">Embed Code</h3>
          <div className="relative bg-[#EBEBEB] rounded-lg p-4 text-base font-medium text-[#1E1E1E]">
            <pre className="whitespace-pre-wrap">{embedCode}</pre>
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 px-7 py-2 rounded-[10px] bg-[#41288A1A] text-[#8266D4] border border-[#8266D4] font-medium shadow-card cursor-pointer"
            >
              Copy
              <Image src="/svgs/copy.svg" alt="Copy Icon" width={16} height={16} className="inline-block ml-2" />
            </button>
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

export function Step5ReviewPublish() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentType = searchParams.get('type') || 'inbound';
  const { agentData } = useAgentCreation();

  const handlePublish = () => {
    console.log('Publishing agent:', agentData);
    router.push('/dashboard/agent');
  };

  const previousStep = agentType === 'widget' ? 3 : 4;

  return (
    <div className='p-6'>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Review & Publish</h1>
        <p className="text-[#717182] text-base">
          Review your agent configuration before publishing
        </p>
      </div>

      <div className="bg-white rounded-[10px] border border-[#EBEBEB] p-5 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Agent Name</label>
            <p className="text-xs mt-1">{agentData.agentName || '-'}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Type</label>
            <p className="text-xs mt-1 capitalize">{agentType || '-'}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <p className="text-xs mt-1">{agentData.description || '-'}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Knowledge Base</label>
            <p className="text-xs mt-1">
              {(agentData.selectedDocuments || []).length} Documents selected
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">Integrations</label>
            <p className="text-xs mt-1">
              {(agentData.selectedIntegrations || []).length} CRM integration selected
            </p>
          </div>
        </div>


      </div>
      <div className="flex items-start space-x-3 p-4 rounded-[12px] bg-[#EBEBEB] mt-6">
        <p className="text-sm font-medium text-[#2B231E] opacity-50">
          ✓ Your agent is ready to be published. Once published, it will be available for use immediately.
        </p>
      </div>
      <StepNavigation
        onPrevious={() => router.push(`/dashboard/agent/create?type=${agentType}&step=${previousStep}`)}
        onNext={handlePublish}
        nextLabel="Publish Agent"
      />
    </div>
  );
}