"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SharedTable from '@/components/shared/SharedTable';
import { WorkflowsTable } from '@/types/table';
import Card from '@/components/shared/Card';
import Input from '@/components/shared/Input';
import SearchIcon from '@/components/icons/SearchIcon';
import Link from 'next/link';
import StatsCard from '@/components/shared/StatsCard';
import FilterDropdown from '@/components/shared/FilterDropdown';

export default function Workflows() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNavigateToCreate = () => {
    window.location.href = '/dashboard/workflows/create';
  }

  const workflowsData: WorkflowsTable[] = [
    {
      name: 'Sales Qualification Flow',
      linkedAgent: 'Sales Assistant',
      status: 'Published',
      statusVariant: 'published',
      nodes: 12,
      lastEdited: '2024-01-20%'
    },
    {
      name: 'Support Ticket Routing',
      linkedAgent: 'Support Bot',
      status: 'Published',
      statusVariant: 'published',
      nodes: 12,
      lastEdited: '2024-01-20%'
    },
    {
      name: 'Onboarding Welcome',
      linkedAgent: 'Website Widget',
      status: 'Published',
      statusVariant: 'published',
      nodes: 12,
      lastEdited: '2024-01-20%'
    },
    {
      name: 'Appointment Scheduling',
      linkedAgent: 'Website Widget',
      status: 'Published',
      statusVariant: 'published',
      nodes: 12,
      lastEdited: '2024-01-20%'
    },
  ];

  const statsCards = [
    {
      title: "Total Workflows",
      value: "5",
    },
    {
      title: "Active",
      value: "2",
    },
    {
      title: "Inactive",
      value: "1",
    },
    {
      title: "Avg. Nodes",
      value: "1",
    },
  ];

  const filteredData = workflowsData.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All Status' || workflow.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const tableData = filteredData.map(workflow => ({
    ...workflow,
    onViewDetails: () => console.log('View workflow:', workflow.name),
    onEdit: () => console.log('Edit workflow:', workflow.name),
    onDelete: () => console.log('Delete workflow:', workflow.name)
  }));

  return (
    <DashboardLayout>

      <div className="p-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-black">Workflows</h1>
              <p className="text-black mt-2 font-medium text-sm opacity-70">Create and manage your workflows</p>
            </div>
            <button
              onClick={() => handleNavigateToCreate()}
              className="px-6 py-3 w-60 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-[10px] font-medium hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              <span>Create Workflow</span>
            </button>
          </div>

          {/* Stats Cards */}
          <Card className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8 py-6'>
            {
              statsCards.map((card) => (
                <StatsCard key={card.title} {...card} />
              ))
            }
          </Card>

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
                placeholder="Search workflows..."
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
                options={['All Status', 'Published', 'Draft', 'Inactive']}
              />
            </div>
          </Card>
        </div>

        {/* Workflows Table */}
        <SharedTable<WorkflowsTable>
          type="workflows"
          data={tableData}
        />
      </div>
    </DashboardLayout>
  );
}