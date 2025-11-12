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
  agent
}) => {
  if (!agent) return null;

  const assistantStats = [
    {
      label: "Type",
      value: agent.type || 'N/A'
    },
    {
      label: "Status",
      value: agent.status || 'N/A'
    },
    {
      label: "Conversations",
      value: agent.conversations || '0'
    },
    {
      label: "Success Rate",
      value: agent.successRate || '0%'
    }
  ];

  const agentInfo = [
    {
      label: "Agent ID",
      value: agent.id || 'N/A'
    },
    {
      label: "Gender",
      value: agent.gender ? String(agent.gender).charAt(0).toUpperCase() + String(agent.gender).slice(1) : 'N/A'
    },
    {
      label: "Language",
      value: agent.language ? String(agent.language).toUpperCase() : 'N/A'
    },
    {
      label: "Persona",
      value: agent.persona ? String(agent.persona).replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'N/A'
    },
    {
      label: "Phone Number",
      value: agent.phoneNumber ? String(agent.phoneNumber) : 'Not Assigned'
    },
    {
      label: "Last Active",
      value: agent.lastActive ? String(agent.lastActive) : 'N/A'
    },
    {
      label: "Created At",
      value: agent.createdAt ? new Date(agent.createdAt).toLocaleString() : 'N/A'
    },
    {
      label: "Updated At",
      value: agent.updatedAt ? new Date(agent.updatedAt).toLocaleString() : 'N/A'
    }
  ];

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-4xl" 
      showCloseButton={true} 
      title={agent.name} 
      subtitle='Detailed view of agent configuration and performance'
    >
      <div className="p-8 max-h-[70vh] overflow-y-auto">
        {/* Stats Grid */}
        <div className="bg-[#EBEBEB] rounded-[10px] p-4 mb-6">
          <div className="grid grid-cols-4 gap-4 text-sm">
           {assistantStats.map((stat) => (
              <div key={stat.label}>
                <div className="text-xs opacity-70 mb-2 text-black">{stat.label}</div>
                <div className="font-medium text-black">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Information */}
        <Card className="mb-6 p-5 border border-[#EBEBEB]">
          <h3 className="text-base font-medium mb-4 text-black">Agent Information</h3>
          <div className="grid grid-cols-2 gap-4">
            {agentInfo.map((info) => (
              <div key={info.label} className="space-y-1">
                <div className="text-xs opacity-70 text-black">{info.label}</div>
                <div className="text-sm font-medium text-black break-all">{info.value}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Description */}
        {agent.description && (
          <Card className="mb-6 p-5 border border-[#EBEBEB]">
            <h3 className="text-base font-medium mb-4 text-black">Agent Description</h3>
            <div className="text-sm text-black whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {agent.description}
            </div>
          </Card>
        )}
      </div>
    </BaseModal>
  );
};

export default AgentDetailModal;