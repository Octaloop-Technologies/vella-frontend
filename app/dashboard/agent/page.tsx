"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SharedTable from '@/components/shared/SharedTable';
import { AgentsTable } from '@/types/table';
import Card from '@/components/shared/Card';
import Input from '@/components/shared/Input';
import ListViewIcon from '@/components/icons/ListViewIcon';
import CardViewIcon from '@/components/icons/CardViewIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import AgentTypeModal from '@/components/agent/AgentTypeModal';
import AgentDetailModal from '@/components/agent/AgentDetailModal';
import DeleteAgentModal from '@/components/agent/DeleteAgentModal';

// Agent Card Component for Grid View
const AgentCard = ({ 
  agent, 
  onViewDetails, 
  onDelete 
}: { 
  agent: AgentsTable;
  onViewDetails: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-b from-[#8266D4] to-[#41288A] rounded-xl flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[#1F2937] text-sm">{agent.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${agent.typeVariant === 'outbound'
                  ? 'bg-[#DBEAFE] text-[#2563EB]'
                  : 'bg-[#FCE7F3] text-[#DB2777]'
                  }`}>
                  {agent.type}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${agent.statusVariant === 'active'
                  ? 'bg-[#25A83D1A] text-[#25A83D] border border-[#25A83D]'
                  : 'bg-[#0000001A] text-black'
                  }`}>
                  {agent.status}
                </span>
              </div>
            </div>
          </div>
          <div className="relative group">
            <button className="text-[#9CA3AF] hover:text-[#6B7280]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="5" r="2" />
                <circle cx="10" cy="10" r="2" />
                <circle cx="10" cy="15" r="2" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10 hidden group-hover:block">
              <button
                onClick={onViewDetails}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#F3F4F6] flex items-center"
              >
                View Details
              </button>
              <button
                onClick={onDelete}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#F3F4F6] flex items-center text-[#DC2626]"
              >
                Delete Agent
              </button>
            </div>
          </div>
        </div>

        <p className="text-sm text-[#6B7280] mb-4">Helps qualify leads and schedule demos</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Conversations</span>
            <span className="font-medium text-[#1F2937]">{agent.conversations}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Success Rate</span>
            <span className="font-medium text-[#1F2937]">{agent.successRate}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Last Active</span>
            <span className="font-medium text-[#1F2937]">{agent.lastActive}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Agent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Agents');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentsTable | null>(null);
  const [agentToDelete, setAgentToDelete] = useState<AgentsTable | null>(null);

  const agentsData: AgentsTable[] = [
    {
      name: 'Sales Assistant',
      type: 'Outbound',
      typeVariant: 'outbound',
      status: 'Active',
      statusVariant: 'active',
      conversations: '342',
      successRate: '89%',
      lastActive: '2 minutes ago'
    },
    {
      name: 'Support Bot',
      type: 'Inbound',
      typeVariant: 'inbound',
      status: 'Active',
      statusVariant: 'active',
      conversations: '342',
      successRate: '89%',
      lastActive: '2 minutes ago'
    },
    {
      name: 'Lead Generator',
      type: 'Outbound',
      typeVariant: 'outbound',
      status: 'Active',
      statusVariant: 'active',
      conversations: '342',
      successRate: '89%',
      lastActive: '2 minutes ago'
    },
    {
      name: 'Customer Success',
      type: 'Outbound',
      typeVariant: 'outbound',
      status: 'Active',
      statusVariant: 'active',
      conversations: '342',
      successRate: '89%',
      lastActive: '2 minutes ago'
    },
  ];

  const filteredData = agentsData.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All Agents' || agent.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (agent: AgentsTable) => {
    setSelectedAgent(agent);
    setIsDetailModalOpen(true);
  };

  const handleDeleteAgent = (agent: AgentsTable) => {
    setAgentToDelete(agent);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Add your delete logic here
    console.log('Deleting agent:', agentToDelete?.name);
    setAgentToDelete(null);
  };

  // Updated SharedTable data with action handlers
  const tableData = filteredData.map(agent => ({
    ...agent,
    onViewDetails: () => handleViewDetails(agent),
    onDelete: () => handleDeleteAgent(agent)
  }));

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-black">Agent Management</h1>
              <p className="text-[#6B7280] mt-1 text-sm">Create and manage your AI agents</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center space-x-2 shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              <span>Create Agent</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <Card className="flex items-center gap-4 px-8 py-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <Input
                type="text"
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full'
                icon={<SearchIcon />}
              />
            </div>

            <div className="relative w-[15%]">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-5 py-3 border border-[#D1D5DB] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8266D4] text-sm font-medium text-[#1F2937] flex items-center gap-2 min-w-[140px] w-full justify-between"
              >
                <span className='text-base font-medium'>{filterStatus}</span>
                <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  <path d="M8.35413 5.54331C8.30768 5.58988 8.2525 5.62682 8.19176 5.65203C8.13101 5.67723 8.06589 5.69021 8.00013 5.69021C7.93436 5.69021 7.86924 5.67723 7.80849 5.65203C7.74775 5.62682 7.69257 5.58988 7.64613 5.54331L3.06113 0.957314C2.77986 0.675919 2.39834 0.51778 2.00048 0.517687C1.60262 0.517593 1.22102 0.675551 0.939627 0.956814C0.658232 1.23808 0.500094 1.6196 0.5 2.01746C0.499906 2.41532 0.657865 2.79692 0.939127 3.07831L5.52513 7.66431C6.18216 8.31955 7.07221 8.6875 8.00013 8.6875C8.92804 8.6875 9.81809 8.31955 10.4751 7.66431L15.0611 3.07831C15.3424 2.79692 15.5003 2.41532 15.5003 2.01746C15.5002 1.6196 15.342 1.23808 15.0606 0.956814C14.7792 0.675551 14.3976 0.517593 13.9998 0.517687C13.6019 0.51778 13.2204 0.675919 12.9391 0.957314L8.35413 5.54331Z" fill="black" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[200px] bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    {['All Agents', 'Active', 'Draft', 'Disabled'].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setFilterStatus(option);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#F3F4F6] flex items-center justify-between ${filterStatus === option ? 'bg-[#EEF2FF]' : ''
                          }`}
                      >
                        <span className={filterStatus === option ? 'font-medium text-[#1F2937]' : 'text-[#6B7280]'}>
                          {option}
                        </span>
                        {filterStatus === option && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13.3332 4L5.99984 11.3333L2.6665 8" stroke="#8266D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <Card className='p-6'>
          {/* View Toggle and Agents Section */}
          <div className="">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-medium text-black">Agents</h2>
              <div className="flex items-center space-x-2 border border-[#EBEBEB] p-[5px] rounded-[10px]">
                <button
                  onClick={() => setView('list')}
                  className={`px-4 py-2 rounded-[10px] cursor-pointer ${view === 'list' ? 'bg-[#007BFF1A] border border-[#41288A]' : ''}`}
                >
                  <ListViewIcon />
                </button>
                <button
                  onClick={() => setView('grid')}
                  className={`px-4 py-2 rounded-[10px] cursor-pointer ${view === 'grid' ? 'bg-[#007BFF1A] border border-[#41288A]' : ''}`}
                >
                  <CardViewIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Conditional Rendering: Table or Grid */}
          {view === 'list' ? (
            <SharedTable<AgentsTable>
              type="agents"
              data={tableData}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((agent, index) => (
                <AgentCard 
                  key={index} 
                  agent={agent} 
                  onViewDetails={() => handleViewDetails(agent)}
                  onDelete={() => handleDeleteAgent(agent)}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Modals */}
      <AgentTypeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AgentDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)}
        agent={selectedAgent || undefined}
      />
      <DeleteAgentModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        agentName={agentToDelete?.name}
        onConfirmDelete={handleConfirmDelete}
      />
    </DashboardLayout>
  );
}