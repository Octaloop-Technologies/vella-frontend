'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import StepNavigation from './StepNavigation';
import { useAgentCreation } from '@/contexts/AgentCreationContext';
import Card from '@/components/shared/Card';
import Image from 'next/image';
import Input from '@/components/shared/Input';
import { useToast } from '@/contexts/ToastContext';
import { configService, CreateAgentRequest } from '@/lib/configApi';
import { apiService } from '@/lib/api';

export function Step3Channels() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentType = searchParams.get('type') || 'inbound';
  const agentId = searchParams.get('id');
  const { agentData, updateAgentData } = useAgentCreation();
  const { addToast } = useToast();

  const socialChannels = [
    { id: 'facebook', name: 'Facebook Messenger' },
    { id: 'instagram', name: 'Instagram DM' },
    { id: 'whatsapp', name: 'Whatsapp Business' },
  ];

  const crmIntegrations = [
    // { id: 'hubspot', name: 'HubSpot' },
    // { id: 'keap', name: 'Keap' },
    { id: 'gohighlevel', name: 'GoHighLevel' },
  ];

  const [ghlStatus, setGhlStatus] = useState<{ is_connected: boolean; connected_at?: string } | null>(null);

  React.useEffect(() => {
    const fetchGHLStatus = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const tokenType = localStorage.getItem('token_type') || 'Bearer';
        
        const response = await fetch('/api/ghl/status', {
          headers: {
            'Authorization': `${tokenType} ${token}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setGhlStatus(data);
        }
      } catch (error) {
        console.error('Failed to fetch GHL status', error);
      }
    };
    fetchGHLStatus();
  }, []);

  const handleGHLConnect = async () => {
    try {
      // Save current URL to return to after auth
      if (typeof window !== 'undefined') {
        localStorage.setItem('ghl_return_url', window.location.href);
      }
      
      const token = localStorage.getItem('access_token');
      const tokenType = localStorage.getItem('token_type') || 'Bearer';

      const response = await fetch('/api/ghl/auth-url', {
        headers: {
          'Authorization': `${tokenType} ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        addToast({ message: 'Failed to get authorization URL', type: 'error' });
      }
    } catch (error) {
      addToast({ message: 'Something went wrong', type: 'error' });
    }
  };

  // Assume connect buttons update selected, but not implemented; reusing as is

  return (
    <div className='p-6 overflow-auto h-[80vh]'>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Integrations</h1>
        <p className="text-[#717182] text-base">
          Connect your agent to CRM integrations
        </p>
      </div>

      <div className="py-5 px-3.5 text-sm text-[#2B231E] font-medium opacity-50 mb-6 bg-[#EBEBEB] border border-[#EBEBEB] rounded-lg">
        Choose which CRM integrations this agent should have access to.
      </div>

      {/* <Card className="p-5 space-y-8 mb-8">
        <div>
          <h3 className="text-lg font-medium mb-4 text-black">Social Channels</h3>
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
                  <span className="font-medium text-sm text-black">{channel.name}</span>
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
                  <span className="text-black">Connect</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card> */}

      <Card className="p-5 space-y-8 mb-8">
        {/* CRM Integrations */}
        <div>
          <h3 className="text-lg font-medium mb-4 text-black">CRM Integrations</h3>
          <div className="space-y-1">
            {crmIntegrations.map((integration) => {
              const isGHL = integration.id === 'gohighlevel';
              const isGHLConnected = isGHL && ghlStatus?.is_connected;

              return (
                <div key={integration.id} className="flex items-center justify-between p-2 border-b last:border-0 border-[#E5E7EB]">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={`/svgs/lightning2.svg`}
                      alt={`${integration.name} Icon`}
                      width={16}
                      height={24}
                    />
                    <span className="font-medium text-sm text-black">{integration.name}</span>
                  </div>
                  
                  {isGHLConnected ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-black">{agentData.ghl_enabled ? 'Enabled' : 'Disabled'}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agentData.ghl_enabled || false}
                          onChange={(e) => updateAgentData({ ghl_enabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8266D4]"></div>
                      </label>
                    </div>
                  ) : (
                    <button
                      onClick={handleGHLConnect}
                      className="px-6 py-2 rounded-[8px] border border-[#8266D4] text-[#8266D4] font-medium flex items-center space-x-2 shadow-card"
                    >
                      <Image
                        src="/svgs/link.svg"
                        alt="Link Icon"
                        width={16}
                        height={16}
                      />
                      <span className="text-black">Connect</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <StepNavigation
        onPrevious={() => router.push(`/dashboard/agent/create?type=${agentType}&step=2${agentId ? `&id=${agentId}` : ''}`)}
        onNext={() => router.push(`/dashboard/agent/create?type=${agentType}&step=4${agentId ? `&id=${agentId}` : ''}`)}
      />
    </div>
  );
}

export function Step4PhoneNumber() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentType = searchParams.get('type') || 'inbound';
  const agentId = searchParams.get('id');
  const { agentData, updateAgentData } = useAgentCreation();
  const [phoneNumbers, setPhoneNumbers] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch inbound phone numbers
  React.useEffect(() => {
    const fetchPhoneNumbers = async () => {
      try {
        setLoading(true);
        console.log('Fetching phone numbers from API...');
        const response = await fetch('https://ai-voice-agent-backend.octaloop.dev/numbers/inbound', {
          method: 'GET',
          headers: {
            'accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch phone numbers');
        }

        const data = await response.json();
        console.log('Phone numbers received:', data);
        if (data.numbers && Array.isArray(data.numbers)) {
          setPhoneNumbers(data.numbers);
          console.log('Phone numbers set to state:', data.numbers);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load phone numbers');
        console.error('Error fetching phone numbers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoneNumbers();
  }, []);

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
          <label className="block text-xs text-[#2B231E] mb-2">Available Phone Numbers *</label>
          <div className="relative w-96">
            <select
              value={agentData.phoneNumber || ''}
              onChange={(e) => {
                console.log('Phone number selected:', e.target.value);
                updateAgentData({ phoneNumber: e.target.value });
              }}
              className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-[#1E1E1E] appearance-none cursor-pointer focus:bg-[#E0E0E0] transition-colors"
              disabled={loading}
            >
              <option value="">
                {loading ? 'Loading phone numbers...' : `Choose a phone no (${phoneNumbers.length} available)`}
              </option>
              {phoneNumbers.map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-xs mt-2">{error}</p>
          )}
          {!loading && phoneNumbers.length === 0 && (
            <p className="text-yellow-600 text-xs mt-2">No phone numbers available</p>
          )}
        </div>

      {agentData.phoneNumber && (
        <Card className="p-5 mt-8">
          <div className="space-y-4">
            <h1 className="text-lg font-medium mb-6 text-black">Selected Number</h1>
            <div className="flex items-center space-x-3">
              <Image
                src="/svgs/phone.svg"
                alt="Phone Icon"
                width={18}
                height={18}
              />
              <span className="font-medium text-sm text-black">{agentData.phoneNumber}</span>
            </div>
          </div>
        </Card>
      )}

      <StepNavigation
        onPrevious={() => router.push(`/dashboard/agent/create?type=${agentType}&step=3${agentId ? `&id=${agentId}` : ''}`)}
        onNext={() => router.push(`/dashboard/agent/create?type=${agentType}&step=5${agentId ? `&id=${agentId}` : ''}`)}
      />
    </div>
  );
}

export function Step3WidgetSettings() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentType = searchParams.get('type') || 'widget';
  const agentId = searchParams.get('id');
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
          <h3 className='text-base font-medium text-black'>Chat Bubble</h3>
          <p className='text-xs font-medium text-black'>
            Text based chat widget
          </p>
        </Card>
        <Card className={`p-4 flex flex-col gap-1 cursor-pointer ${selectedWidgetType === 'voice' ? 'border border-[#41288A] bg-[#007BFF1A]' : 'border border-[#E5E7EB]'}`} onClick={() => setSelectedWidgetType('voice')}>
          <Image src="/svgs/phone.svg" alt="Call Icon" width={24} height={24} className="object-contain mb-2" />
          <h3 className='text-base font-medium text-black'>Voice Call Button</h3>
          <p className='text-xs font-medium text-black'>
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
                <span className="text-white">{agentData.voiceButtonText || 'Call Us'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Embed Code */}
        <div>
          <h3 className="text-[#1E1E1E] text-sm font-medium mb-2">Embed Code</h3>
          <div className="relative bg-[#EBEBEB] rounded-lg p-4 text-base font-medium text-[#1E1E1E]">
            <pre className="whitespace-pre-wrap text-black">{embedCode}</pre>
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
        onPrevious={() => router.push(`/dashboard/agent/create?type=${agentType}&step=2${agentId ? `&id=${agentId}` : ''}`)}
        onNext={() => router.push(`/dashboard/agent/create?type=${agentType}&step=4${agentId ? `&id=${agentId}` : ''}`)}
      />
    </div>
  );
}

export function Step5ReviewPublish() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentType = searchParams.get('type') || 'inbound';
  const agentId = searchParams.get('id');
  const { agentData } = useAgentCreation();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePublish = async () => {
    try {
      setIsLoading(true);
      console.log('Publishing agent:', agentData);
      
      // Transform the agentData to match the API requirements
      const createAgentData: CreateAgentRequest = {
        name: agentData.agentName || '',
        description: agentData.description || '',
        agent_type: agentType as 'inbound' | 'outbound' | 'widget',
        channel_type: agentData.channelType  as 'phone_only' | 'chat_only' | 'omnichannel',
        language: agentData.language || '',
        gender: agentData.gender as 'Male' | 'Female',
        persona: agentData.persona || '',
        tune: agentData.tune || '',
        voice_id: agentData.voiceId || '',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0,
          use_speaker_boost: true
        },
        model_id: 'eleven_monolingual_v1',
        phone_number: agentData.phoneNumber || null,
        knowledge_base_document_ids: agentData.selectedDocuments || [],
        ghl_enabled: agentData.ghl_enabled || false
      };

      console.log('Sending agent data to API:', createAgentData);
      
      if (agentId) {
        await apiService.updateAgent(agentId, createAgentData as any);
        addToast({
          message: `Agent "${agentData.agentName}" updated successfully!`,
          type: 'success'
        });
      } else {
        await configService.createAgent(createAgentData);
        addToast({
          message: `Agent "${agentData.agentName}" created successfully!`,
          type: 'success'
        });
      }
      
      // Navigate back to agents list
      router.push('/dashboard/agent');
    } catch (error) {
      console.error('Failed to save agent:', error);
      addToast({
        message: `Failed to save agent: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPreviousStep = () => {
    if (agentType === 'widget') return 2;
    if (agentType === 'outbound') return 3;
    return 4; // inbound
  };

  const previousStep = getPreviousStep();

  return (
    <div className='p-6 overflow-auto h-[80vh]'>
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
            <label className="text-sm font-medium text-black">Agent Name</label>
            <p className="text-xs mt-1 text-black">{agentData.agentName || '-'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-black">Type</label>
            <p className="text-xs mt-1 capitalize text-black">{agentType || '-'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-black">Description</label>
            <p className="text-xs mt-1 text-black">{agentData.description || '-'}</p>
          </div>

          {agentType !== 'widget' && agentData.phoneNumber && (
            <div>
              <label className="text-sm font-medium text-black">Phone Number</label>
              <p className="text-xs mt-1 text-black">{agentData.phoneNumber}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-black">Knowledge Base</label>
            <p className="text-xs mt-1 text-black">
              {(agentData.selectedDocuments || []).length} Documents selected
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-black">Integrations</label>
            <p className="text-xs mt-1 text-black">
              {agentData.ghl_enabled ? '1' : '0'} CRM integration selected
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
        onPrevious={() => router.push(`/dashboard/agent/create?type=${agentType}&step=${previousStep}${agentId ? `&id=${agentId}` : ''}`)}
        onNext={handlePublish}
        nextLabel={isLoading ? (agentId ? "Updating Agent..." : "Creating Agent...") : (agentId ? "Update Agent" : "Publish Agent")}
        disabled={isLoading}
      />
    </div>
  );
}