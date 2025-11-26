import React from 'react';
import BaseModal from '@/components/shared/BaseModal';
import Card from '@/components/shared/Card';  
import Image from 'next/image';
import { AgentsTable } from '@/types/table';
import Badge from '@/components/shared/Badge';

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
 console.log('Agent Detail Modal - Agent Data:', agent);  
  const assistantStats = [
    {
      label: "Type",
      value: agent.type || 'N/A',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      )
    },
    {
      label: "Status",
      value: agent.status || 'N/A',
      variant: agent.statusVariant,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: "Conversations",
      value: agent.conversations || '0',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      label: "Success Rate",
      value: agent.successRate || '0%',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

  const agentInfo = [
    {
      label: "Gender",
      value: agent.gender ? String(agent.gender).charAt(0).toUpperCase() + String(agent.gender).slice(1) : 'N/A',
      icon: "👤"
    },
    {
      label: "Language",
      value: agent.language ? String(agent.language).toUpperCase() : 'N/A',
      icon: "🌐"
    },
    {
      label: "Persona",
      value: agent.persona ? String(agent.persona).replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'N/A',
      icon: "🎭"
    },
    {
      label: "Phone Number",
      value: agent.phoneNumber ? String(agent.phoneNumber) : 'Not Assigned',
      icon: "📞"
    },
    {
      label: "Last Active",
      value: agent.lastActive ? String(agent.lastActive) : 'N/A',
      icon: "⏰"
    },
    {
      label: "Created At",
      value: agent.createdAt ? new Date(agent.createdAt).toLocaleString() : 'N/A',
      icon: "📅"
    },
    {
      label: "Updated At",
      value: agent.updatedAt ? new Date(agent.updatedAt).toLocaleString() : 'N/A',
      icon: "🔄"
    }
  ];

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-5xl" 
      showCloseButton={true} 
      title={agent.name} 
      subtitle='Detailed view of agent configuration and performance'
    >
      <div className="p-8 max-h-[75vh] overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
        {/* Stats Grid - Modern Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {assistantStats.map((stat, index) => (
            <div 
              key={stat.label}
              className="relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-[#8266D4]/10 to-[#41288A]/10 rounded-xl text-[#8266D4]">
                  {stat.icon}
                </div>
              </div>
              <div className="text-xs font-medium text-gray-500 mb-1">{stat.label}</div>
              {stat.label === 'Status' && stat.variant ? (
                <Badge variant={stat.variant as any}>
                  {stat.value}
                </Badge>
              ) : (
                <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
              )}
            </div>
          ))}
        </div>

        {/* Agent Information - Enhanced Grid */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-gradient-to-br from-[#8266D4] to-[#41288A] rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Agent Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {agentInfo.map((info) => (
              <div 
                key={info.label} 
                className="group p-4 rounded-xl border border-gray-100 hover:border-[#8266D4]/30 hover:bg-gradient-to-br hover:from-[#8266D4]/5 hover:to-transparent transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{info.icon}</span>
                  <div className="text-xs font-medium text-gray-500">{info.label}</div>
                </div>
                <div className="text-sm font-semibold text-gray-900 break-all pl-7">
                  {info.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge Base Documents */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-gradient-to-br from-[#8266D4] to-[#41288A] rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Knowledge Base Documents</h3>
          </div>
          {agent.knowledgeBaseDocuments && Array.isArray(agent.knowledgeBaseDocuments) && agent.knowledgeBaseDocuments.length > 0 ? (
            <div className="space-y-3">
              {agent.knowledgeBaseDocuments.map((doc: any, index: number) => (
                <div 
                  key={doc.id || index}
                  className="group p-4 rounded-xl border border-gray-100 hover:border-[#8266D4]/30 hover:bg-gradient-to-br hover:from-[#8266D4]/5 hover:to-transparent transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-[#8266D4]/10 to-[#41288A]/10 rounded-lg">
                      <svg className="w-4 h-4 text-[#8266D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{doc.name || 'Untitled Document'}</div>
                      <div className="text-xs text-gray-500 font-mono">{doc.id}</div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-xs text-gray-500 mt-2">
                Total documents: {agent.knowledgeBaseDocuments.length}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-sm">No knowledge base documents found</div>
            </div>
          )}
        </div>

        {/* Description - Enhanced Card */}
        {agent.description && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-[#8266D4] to-[#41288A] rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Agent Description</h3>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto border border-gray-100">
              {agent.description}
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default AgentDetailModal;