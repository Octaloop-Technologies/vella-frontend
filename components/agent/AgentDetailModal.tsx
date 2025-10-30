import React from 'react';
import BaseModal from '@/components/shared/BaseModal';
import Card from '@/components/shared/Card';  
import Image from 'next/image';
import { AgentsTable } from '@/types/table';

interface AgentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent?: AgentsTable;
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
    successRate: '89%',
    lastActive: '2 minutes ago'
  }
}) => {
  const assistantStats = [
    {
      label: "Type",
      value: agent.type
    },
    {
      label: "Status",
      value: agent.status
    },
    {
      label: "Conversations",
      value: agent.conversations
    },
    {
      label: "Success Rate",
      value: agent.successRate
    }
  ]

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
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl" showCloseButton={true} title={agent.name} subtitle='Detailed view of agent configuration and performance'>
      <div className="p-8">
        {/* Stats Table */}
        <div className="bg-[#EBEBEB] rounded-[10px] p-4 mb-8">
          <div className="grid grid-cols-4 gap-4 text-sm">
           {
              assistantStats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-xs opacity-70 mb-2 text-black">{stat.label}</div>
                  <div className="font-medium text-black">{stat.value}</div>
                </div>
              ))
           }
          </div>
        </div>

        {/* Linked Knowledge Base */}
        <Card className="mb-8 p-5 border border-[#EBEBEB]">
          <h3 className="text-base font-medium mb-4 text-black">Linked Knowledge Base</h3>
          <div className="space-y-3">
            {linkedKnowledgeBase.map((item) => (
              <div key={item.id} className="flex items-center">
                <Image src="/svgs/tick.svg" alt="Tick" width={24} height={20} className="mr-3" />
                <span className="text-sm font-medium text-black">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Integrations */}
        <Card className='p-5 border border-[#EBEBEB]'>
          <h3 className="text-base font-medium mb-4 text-black">Active Integrations</h3>
          <div className="space-y-3">
            {activeIntegrations.map((item) => (
              <div key={item.id} className="flex items-center">
                <Image src="/svgs/tick.svg" alt="Tick" width={24} height={20} className="mr-3" />
                <span className="text-sm font-medium text-black">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </BaseModal>
  );
};

export default AgentDetailModal;