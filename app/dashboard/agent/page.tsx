"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import FilterDropdown from '@/components/shared/FilterDropdown';
import { AgentIcon } from '@/components/icons';
import ItemCard from '@/components/shared/ItemCard';
import CopyIcon from '@/components/icons/CopyIcon';
import EyeIcon from '@/components/icons/EyeIcon';
import FileEditIcon from '@/components/icons/FileEditIcon';
import PauseIcon from '@/components/icons/PauseIcon';
import TrashIcon from '@/components/icons/TrashIcon';

export default function Agent() {
  const router = useRouter();
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

  const handleTestAgent = (agent: AgentsTable) => {
    router.push('/dashboard/agent/test');
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
    onDelete: () => handleDeleteAgent(agent),
    onTestAgent: () => handleTestAgent(agent)
  }));

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-brand-black">Agent Management</h1>
              <p className="text-black mt-2 font-medium text-sm opacity-70">Create and manage your AI agents</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 w-60 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-[10px] font-medium hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-sm"
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
              <FilterDropdown
                isOpen={isDropdownOpen}
                setIsOpen={setIsDropdownOpen}
                value={filterStatus}
                setValue={setFilterStatus}
                options={['All Agents', 'Active', 'Draft', 'Disabled']}
              />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredData.map((agent, index) => (
                <ItemCard
                  key={index}
                  icon={
                    <div className="w-16 h-16 bg-gradient-to-b from-[#41288A] to-[#301971] rounded-xl flex items-center justify-center">
                      <AgentIcon color='white' className="w-10 h-10" />
                    </div>
                  }
                  title={agent.name}
                  description="Helps qualify leads and schedule demos"
                  badges={[
                    { label: agent.type, variant: agent.typeVariant },
                    { label: agent.status, variant: agent.statusVariant }
                  ]}
                  stats={[
                    { label: 'Conversations', value: agent.conversations },
                    { label: 'Success Rate', value: agent.successRate },
                    { label: 'Last Active', value: agent.lastActive }
                  ]}
                  menuItems={[
                    { icon: <FileEditIcon />, label: 'Edit Agent' },
                    { icon: <CopyIcon />, label: 'Duplicate Agent' },
                    { icon: <EyeIcon />, label: 'View Details', onClick: () => handleViewDetails(agent) },
                    { icon: <PauseIcon />, label: 'Deactivate Agent' },
                    { icon: <AgentIcon className="w-4 h-4 text-[#1F2937]"  />, label: 'Test Agent', onClick: () => handleTestAgent(agent) },
                    { icon: <TrashIcon />, label: 'Delete Agent', className: 'text-[#DC2626]', onClick: () => handleDeleteAgent(agent) }
                  ]}
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