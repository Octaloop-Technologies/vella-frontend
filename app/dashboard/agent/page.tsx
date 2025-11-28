"use client";

import { useState, useEffect, useCallback } from 'react';
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
import MakeCallModal from '@/components/agent/MakeCallModal';
import ActivationSuccessModal from '@/components/agent/ActivationSuccessModal';
import FilterDropdown from '@/components/shared/FilterDropdown';
import { AgentIcon } from '@/components/icons';
import ItemCard from '@/components/shared/ItemCard';
import CopyIcon from '@/components/icons/CopyIcon';
import EyeIcon from '@/components/icons/EyeIcon';
import FileEditIcon from '@/components/icons/FileEditIcon';
import PauseIcon from '@/components/icons/PauseIcon';
import PlayIcon from '@/components/icons/PlayIcon';
import TrashIcon from '@/components/icons/TrashIcon';
import { useAgents } from '@/hooks/useAgents';
import Button from '@/components/shared/Button';
import { useToast } from '@/contexts/ToastContext';


export default function Agent() {
  const router = useRouter();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Agents');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMakeCallModalOpen, setIsMakeCallModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentsTable | null>(null);
  const [agentToDelete, setAgentToDelete] = useState<AgentsTable | null>(null);
  const [agentToCall, setAgentToCall] = useState<AgentsTable | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [isActivationSuccessModalOpen, setIsActivationSuccessModalOpen] = useState(false);
  const [activationData, setActivationData] = useState<any>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Use the agents hook to fetch real data
  const { 
    agents: agentsData, 
    loading, 
    error, 
    total,
    searchAgents, 
    deleteAgent: apiDeleteAgent,
    refreshAgents 
  } = useAgents();
  console.log('Agents Data:', agentsData);
  // Fetch all agents on initial load only
  useEffect(() => {
    // Fetch with maximum allowed limit by API
    searchAgents({
      search: '',
      page: 1,
      limit: 100 // Maximum allowed by API
    });
  }, []); // Empty dependency array - only run once on mount

  // Filter data locally by search term and type
  const filteredData = agentsData.filter(agent => {
    // Filter by type
    const matchesType = filterStatus === 'All Agents' 
      ? true 
      : agent.type.toLowerCase() === filterStatus.toLowerCase();
    
    // Filter by search term
    const matchesSearch = searchTerm === '' 
      ? true 
      : agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (agent.phoneNumber && agent.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (agent.description && agent.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesType && matchesSearch;
  });

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleViewDetails = (agent: AgentsTable) => {
    // console.log('Agent Detail Modal - Agent Data:', agent); 
    setSelectedAgent(agent);
    setIsDetailModalOpen(true);
  };

  const handleEditAgent = (agent: AgentsTable) => {
    const params = new URLSearchParams({
      type: agent.type.toLowerCase(),
      id: agent.id || ''
    });
    router.push(`/dashboard/agent/create?${params.toString()}`);
  };

  const handleDeleteAgent = (agent: AgentsTable) => {
    setAgentToDelete(agent);
    setIsDeleteModalOpen(true);
  };

  const handleTestAgent = (agent: AgentsTable) => {
    // Pass agent data as URL parameters
    const params = new URLSearchParams({
      id: agent.id || '',
      name: agent.name || '',
      type: agent.type || '',
      status: agent.status || '',
      description: agent.description || ''
    });
    router.push(`/dashboard/agent/test?${params.toString()}`);
  };

  const handlePreviewWidget = (agent: AgentsTable) => {
    console.log('Previewing widget for agent:', agent);
    // Pass agent data as URL parameters for widget preview
    const params = new URLSearchParams({
      id: agent.id || '',
      name: agent.name || '',
      type: agent.type || '',
      typevariant: agent.typeVariant || '',
      channelType: agent.typeVariant || '',
      status: agent.status || '',
      description: agent.description || '',
    });
    router.push(`/dashboard/agent/preview-widget?${params.toString()}`);
  };

  const handleMakeCall = (agent: AgentsTable) => {
    setAgentToCall(agent);
    setIsMakeCallModalOpen(true);
  };

  const handleActivateAgent = async (agent: AgentsTable) => {
    if (!agent.id || isActivating) return;

    try {
      setIsActivating(true);
      const body = new URLSearchParams();
      body.append('agent_id', agent.id);

      const endpoint = agent.type.toLowerCase() === 'outbound' 
        ? 'https://ai-voice-agent-backend.octaloop.dev/twilio/outbound/activate-agent'
        : 'https://ai-voice-agent-backend.octaloop.dev/twilio/inbound/activate-agent';

      const token = localStorage.getItem('access_token');
      const tokenType = localStorage.getItem('token_type') || 'Bearer';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `${tokenType} ${token}`
        },
        body: body.toString()
      });

      if (!response.ok) {
        throw new Error('Failed to activate agent');
      }

      const data = await response.json();
      console.log('Agent activated successfully:', data);
      
      // Store activation data and show success modal
      setActivationData(data);
      setIsActivationSuccessModalOpen(true);
      
      // Refetch the agents table
      await refreshAgents();
    } catch (error) {
      console.error('Failed to activate agent:', error);
      
      addToast({
        message: 'Failed to activate agent. Please try again.',
        type: 'error'
      });
    } finally {
      setIsActivating(false);
    }
  };

  const handleDeactivateAgent = async (agent: AgentsTable) => {
    if (!agent.id || isActivating) return;

    try {
      setIsActivating(true);
      const body = new URLSearchParams();
      body.append('agent_id', agent.id);
      body.append('set_status_to_inactive', 'true');

      const endpoint = agent.type.toLowerCase() === 'outbound'
        ? 'https://ai-voice-agent-backend.octaloop.dev/twilio/outbound/deactivate-agent'
        : 'https://ai-voice-agent-backend.octaloop.dev/twilio/inbound/deactivate-agent';

      const token = localStorage.getItem('access_token');
      const tokenType = localStorage.getItem('token_type') || 'Bearer';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `${tokenType} ${token}`
        },
        body: body.toString()
      });

      if (!response.ok) {
        throw new Error('Failed to deactivate agent');
      }

      const data = await response.json();
      console.log('Agent deactivated successfully:', data);
      
      // Refetch the agents table
      await refreshAgents();
    } catch (error) {
      console.error('Failed to deactivate agent:', error);
      // You can add toast notification here
    } finally {
      setIsActivating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!agentToDelete?.id) {
      console.error('No agent ID to delete');
      return;
    }

    try {
      await apiDeleteAgent(agentToDelete.id);
      setAgentToDelete(null);
      setIsDeleteModalOpen(false);
      // Show success message (you can add toast notification here)
      console.log('Agent deleted successfully:', agentToDelete.name);
    } catch (error) {
      console.error('Failed to delete agent:', error);
      // Show error message (you can add toast notification here)
    }
  };

  // Updated SharedTable data with action handlers
  const tableData = paginatedData.map(agent => ({
    ...agent,
    phoneNumber: agent.type.toLowerCase() === 'outbound' ? '+447401092965' : agent.phoneNumber,
    onViewDetails: () => handleViewDetails(agent),
    onEdit: () => handleEditAgent(agent),
    onDelete: () => handleDeleteAgent(agent),
    onTestAgent: () => handleTestAgent(agent),
    onPreviewWidget: () => handlePreviewWidget(agent),
    onMakeCall: () => handleMakeCall(agent),
    onActivate: () => handleActivateAgent(agent),
    onDeactivate: () => handleDeactivateAgent(agent)
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
                options={['All Agents', 'Inbound', 'Outbound', 'Widget']}
              />
            </div>
          </Card>
        </div>

        <Card className='p-6'>
          {/* View Toggle and Agents Section */}
          <div className="">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-black">Agents</h2>
                {!loading && <p className="text-sm text-black mt-1">Total: {filteredData.length} agents {searchTerm || filterStatus !== 'All Agents' ? `(filtered from ${agentsData.length})` : ''}</p>}
              </div>
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

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
              <span className="ml-3 text-gray-600 text-black">Loading agents...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-red-500 mb-2 text-black">⚠️ Error loading agents</div>
              <p className="text-gray-600 text-sm mb-4 text-black">{error}</p>
              <button 
                onClick={refreshAgents}
                className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
            </div>
          )}

          {/* No Data State */}
          {!loading && !error && filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
           
              <h3 className="text-lg font-medium  mb-2 text-black">No agents found</h3>
              <p className=" text-sm mb-6 text-black">
                {searchTerm || filterStatus !== 'All Agents' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Get started by creating your first agent'}
              </p>
               <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 w-60 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-[10px] font-medium hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
            
              <span>Create Your First Agent</span>
            </button>
        
            </div>
          )}

          {/* Conditional Rendering: Table or Grid */}
          {!loading && !error && filteredData.length > 0 && (
            <>
              {view === 'list' ? (
                <SharedTable<AgentsTable>
                  type="agents"
                  data={tableData}
                />
              ) : (
                <div className="grid grid-cols-1 text-black md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {paginatedData.map((agent, index) => (
                    <ItemCard
                      key={agent.id || index}
                      icon={
                        <div className="w-16 h-16 bg-gradient-to-b from-[#41288A] to-[#301971] rounded-xl flex items-center justify-center">
                          <AgentIcon color='white' className="w-10 h-10" />
                        </div>
                      }
                      title={agent.name}
                      onTitleClick={() => handleViewDetails(agent)}
                      description={agent.description?.slice(0, 100) || "AI agent for customer interactions"}
                      phoneNumber={agent.type.toLowerCase() === 'outbound' ? '+447401092965' : agent.phoneNumber}
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
                        { icon: <FileEditIcon />, label: 'Edit Agent', onClick: () => handleEditAgent(agent) },
                        // { icon: <CopyIcon />, label: 'Duplicate Agent' },
                        { icon: <EyeIcon />, label: 'View Details', onClick: () => handleViewDetails(agent) },
                        ...((agent.type.toLowerCase() === 'inbound' || agent.type.toLowerCase() === 'outbound') && (agent.status === 'Draft' || agent.status === 'Inactive') ? [{
                          icon: <PlayIcon />,
                          label: 'Activate Agent',
                          onClick: () => handleActivateAgent(agent)
                        }] : []),
                        ...((agent.type.toLowerCase() === 'inbound' || agent.type.toLowerCase() === 'outbound') && agent.status === 'Active' ? [{
                          icon: <PauseIcon />,
                          label: 'Deactivate Agent',
                          onClick: () => handleDeactivateAgent(agent)
                        }] : []),
                        ...((agent.type === 'Inbound' || agent.type === 'Outbound') ? [{
                          icon: <AgentIcon className="w-4 h-4 text-[#1F2937]" />,
                          label: 'Test Agent',
                          onClick: () => handleTestAgent(agent)
                        }] : []),
                        ...(agent.type === 'Widget' ? [{
                          icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="9" cy="9" r="2"/>
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                          </svg>,
                          label: 'Preview Widget', 
                          onClick: () => handlePreviewWidget(agent) 
                        }] : []),
                        ...((agent.type === 'Outbound') ? [{
                          icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                          </svg>,
                          label: 'Make a Call', 
                          onClick: () => handleMakeCall(agent) 
                        }] : []),
                        { icon: <TrashIcon />, label: 'Delete Agent', className: 'text-[#DC2626]', onClick: () => handleDeleteAgent(agent) }
                      ]}
                    />
                  ))}
                </div>
              )}
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="text-sm text-black">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                        // Show first page, last page, current page, and pages around current
                        const showPage = pageNum === 1 || 
                                       pageNum === totalPages || 
                                       Math.abs(pageNum - currentPage) <= 1;
                        
                        const showEllipsis = (pageNum === 2 && currentPage > 3) || 
                                           (pageNum === totalPages - 1 && currentPage < totalPages - 2);
                        
                        if (showEllipsis) {
                          return <span key={pageNum} className="px-2 text-black">...</span>;
                        }
                        
                        if (!showPage) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white'
                                : 'border border-gray-300 text-black hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
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
      <MakeCallModal
        isOpen={isMakeCallModalOpen}
        onClose={() => setIsMakeCallModalOpen(false)}
        agentId={agentToCall?.id || ''}
        agentName={agentToCall?.name || ''}
      />
      <ActivationSuccessModal
        isOpen={isActivationSuccessModalOpen}
        onClose={() => {
          setIsActivationSuccessModalOpen(false);
          setActivationData(null);
        }}
        activationData={activationData}
      />
    </DashboardLayout>
  );
}