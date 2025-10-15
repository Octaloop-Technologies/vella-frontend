"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SharedTable from '@/components/shared/SharedTable';
import { WorkflowsTable } from '@/types/table';
import Card from '@/components/shared/Card';
import Input from '@/components/shared/Input';
import SearchIcon from '@/components/icons/SearchIcon';
import Link from 'next/link';

export default function Workflows() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
              <h1 className="text-2xl font-semibold text-black">Workflows</h1>
              <p className="text-[#6B7280] mt-1 text-sm">Create and manage your workflows</p>
            </div>
            <Link href="/dashboard/workflows/create">
              <button className="px-6 py-3 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center space-x-2 shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                <span>Create Workflow</span>
              </button>
            </Link>
          </div>

          {/* Stats Cards */}
          <Card className="grid grid-cols-1 md:grid-cols-4 mb-6">
            <div className="px-8 py-6 border-r border-[#0000001A]">
              <div className="text-[#6B7280] text-sm mb-2">Total Workflows</div>
              <div className="text-3xl font-semibold text-black">5</div>
            </div>
            <div className="px-8 py-6 border-r border-[#0000001A]">
              <div className="text-[#6B7280] text-sm mb-2">Active</div>
              <div className="text-3xl font-semibold text-black">2</div>
            </div>
            <div className="px-8 py-6 border-r border-[#0000001A]">
              <div className="text-[#6B7280] text-sm mb-2">Inactive</div>
              <div className="text-3xl font-semibold text-black">1</div>
            </div>
            <div className="px-8 py-6">
              <div className="text-[#6B7280] text-sm mb-2">Avg. Nodes</div>
              <div className="text-3xl font-semibold text-black">1</div>
            </div>
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
                    {['All Status', 'Published', 'Draft', 'Inactive'].map((option) => (
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

        {/* Workflows Table */}
        <SharedTable<WorkflowsTable>
          type="workflows"
          data={tableData}
        />
      </div>
    </DashboardLayout>
  );
}