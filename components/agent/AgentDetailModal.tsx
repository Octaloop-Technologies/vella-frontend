import React from 'react';
import BaseModal from '@/components/shared/BaseModal';

interface AgentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent?: {
    name: string;
    type: string;
    typeVariant: 'outbound' | 'inbound';
    status: string;
    statusVariant: 'active' | 'draft';
    conversations: string;
    successRate: string;
  };
}

const AgentDetailModal: React.FC<AgentDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  agent = {
    name: 'Sales Assistant',
    type: 'Outbound',
    typeVariant: 'outbound',
    status: 'Active',
    statusVariant: 'active',
    conversations: '342',
    successRate: '89%'
  }
}) => {
  const linkedKnowledgeBase = [
    { id: 1, name: 'Product FAQ', checked: true },
    { id: 2, name: 'Sales Playbook', checked: true },
    { id: 3, name: 'Support Guidelines', checked: true },
  ];

  const activeIntegrations = [
    { id: 1, name: 'HubSpot CRM', checked: true },
    { id: 2, name: 'WhatsApp Business', checked: true },
    { id: 3, name: 'Slack', checked: true },
  ];

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl" showCloseButton={true}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#1F2937] mb-2">{agent.name}</h2>
          <p className="text-sm text-[#6B7280]">Detailed view of agent configuration and performance</p>
        </div>

        {/* Stats Table */}
        <div className="bg-[#F9FAFB] rounded-lg p-4 mb-8">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-[#6B7280] mb-1">Type</div>
              <div className={`inline-flex px-3 py-1 rounded-full font-medium ${
                agent.typeVariant === 'outbound' 
                  ? 'bg-[#DBEAFE] text-[#2563EB]' 
                  : 'bg-[#FCE7F3] text-[#DB2777]'
              }`}>
                {agent.type}
              </div>
            </div>
            <div>
              <div className="text-[#6B7280] mb-1">Status</div>
              <div className={`inline-flex px-3 py-1 rounded-full font-medium ${
                agent.statusVariant === 'active'
                  ? 'bg-[#25A83D1A] text-[#25A83D] border border-[#25A83D]'
                  : 'bg-[#0000001A] text-black'
              }`}>
                {agent.status}
              </div>
            </div>
            <div>
              <div className="text-[#6B7280] mb-1">Conversations</div>
              <div className="font-semibold text-[#1F2937]">{agent.conversations}</div>
            </div>
            <div>
              <div className="text-[#6B7280] mb-1">Success Rate</div>
              <div className="font-semibold text-[#1F2937]">{agent.successRate}</div>
            </div>
          </div>
        </div>

        {/* Linked Knowledge Base */}
        <div className="mb-8">
          <h3 className="text-base font-semibold text-[#1F2937] mb-4">Linked Knowledge Base</h3>
          <div className="space-y-3">
            {linkedKnowledgeBase.map((item) => (
              <div key={item.id} className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mr-3">
                  <circle cx="10" cy="10" r="10" fill="#10B981" />
                  <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm text-[#1F2937]">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Integrations */}
        <div>
          <h3 className="text-base font-semibold text-[#1F2937] mb-4">Active Integrations</h3>
          <div className="space-y-3">
            {activeIntegrations.map((item) => (
              <div key={item.id} className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mr-3">
                  <circle cx="10" cy="10" r="10" fill="#10B981" />
                  <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm text-[#1F2937]">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default AgentDetailModal;