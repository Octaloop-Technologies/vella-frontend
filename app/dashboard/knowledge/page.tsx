"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SharedTable from '@/components/shared/SharedTable';
import { Document } from '@/types/table';
import Card from '@/components/shared/Card';
import Input from '@/components/shared/Input';
import ListViewIcon from '@/components/icons/ListViewIcon';
import CardViewIcon from '@/components/icons/CardViewIcon';
import SearchIcon from '@/components/icons/SearchIcon';
import UploadDocumentModal from '@/components/knowledge/UploadDocumentModal';
import Image from 'next/image';
import StatsCard from '@/components/shared/StatsCard';
import ItemCard from '@/components/shared/ItemCard';
import Badge from '@/components/shared/Badge';

// Document icons mapping
const getDocumentIcon = (type: string) => {
  const lowerType = type.toLowerCase();

  if (lowerType === 'pdf') {
    return (
      <div className="w-16 h-16 bg-gradient-to-b from-[#41288A] to-[#301971] rounded-xl flex items-center justify-center">
        <Image src="/svgs/question.svg" alt="PDF Document" width={42} height={42} />
      </div>
    );
  } else if (lowerType === 'faq') {
    return (
      <div className="w-16 h-16 bg-gradient-to-b from-[#41288A] to-[#301971] rounded-xl flex items-center justify-center">
        <Image src="/svgs/page2.svg" alt="FAQ Document" width={42} height={42} />
      </div>
    );
  } else if (lowerType === 'csv') {
    return (
      <div className="w-16 h-16 bg-gradient-to-b from-[#41288A] to-[#301971] rounded-xl flex items-center justify-center">
        <Image src="/svgs/stats2.svg" alt="CSV Document" width={42} height={42} />
      </div>
    );
  } else if (lowerType === 'guidelines') {
    return (
      <div className="w-16 h-16 bg-gradient-to-b from-[#41288A] to-[#301971] rounded-xl flex items-center justify-center">
        <Image src="/svgs/journal.svg" alt="Guidelines Document" width={42} height={42} />
      </div>
    );
  } else {
    return (
      <div className="w-16 h-16 bg-gradient-to-b from-[#41288A] to-[#301971] rounded-xl flex items-center justify-center">
        <Image src="/svgs/page2.svg" alt="Document" width={42} height={42} />
      </div>
    );
  }
};

const getDocumentDescription = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return 'Frequently asked questions about our product features';
    case 'faq':
      return 'Complete sales process and objection handling guide';
    case 'csv':
      return 'Customer contact information and preferences';
    case 'guidelines':
      return 'Internal support team guidelines and procedures';
    default:
      return 'Technical API documentation for developers';
  }
};

export default function Knowledge() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const documentsData: Document[] = [
    {
      name: 'Product FAQ',
      type: 'pdf',
      status: 'Published',
      statusVariant: 'published',
      size: '125 KB',
      lastUpdated: '2024-01-20'
    },
    {
      name: 'Sales Playbook',
      type: 'faq',
      status: 'Published',
      statusVariant: 'published',
      size: '125 KB',
      lastUpdated: '2024-01-20'
    },
    {
      name: 'Customer Data Export',
      type: 'csv',
      status: 'Processing',
      statusVariant: 'processing',
      size: '125 KB',
      lastUpdated: '2024-01-20'
    },
    {
      name: 'Support Guidelines',
      type: 'guidelines',
      status: 'Draft',
      statusVariant: 'draft',
      size: '125 KB',
      lastUpdated: '2024-01-20'
    },
    {
      name: 'API Documentation',
      type: 'text',
      status: 'Error',
      statusVariant: 'error',
      size: '125 KB',
      lastUpdated: '2024-01-20'
    },
  ];

  const statsCards = [
    {
      title: "Total Documents",
      icon: <Image src="/svgs/page.svg" alt="Total Documents" width={20} height={20} />,
      value: "5",
    },
    {
      title: "Published Documents",
      icon: <Image src="/svgs/badge-check.svg" alt="Published Documents" width={20} height={20} />,
      value: "2",
    },
    {
      title: "Processing",
      icon: <Image src="/svgs/clock-five.svg" alt="Processing" width={20} height={20} />,
      value: "1",
    },
    {
      title: "Errors",
      icon: <Image src="/svgs/exclamation.svg" alt="Errors" width={20} height={20} />,
      value: "1",
    },
  ];

  const filteredData = documentsData.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All Types' || doc.type === filterType;
    const matchesStatus = filterStatus === 'All Status' || doc.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-brand-black">Knowledge Base</h1>
              <p className="text-black mt-2 font-medium text-sm opacity-70">Manage documents and content for your AI agents</p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-6 py-3 w-60 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-[10px] font-medium hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
              <Image src="/svgs/upload.svg" alt="Upload Document" width={24} height={24} />
              <span>Upload Document</span>
            </button>
          </div>

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
              <Input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full'
                icon={<SearchIcon />}
              />
            </div>

            <div className="relative w-[15%]">
              <button
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                className="px-5 py-3 border border-[#41288A80] bg-white rounded-lg text-sm font-medium text-[#1F2937] flex items-center gap-2 min-w-[140px] w-full justify-between"
              >
                <span className='text-base font-medium'>{filterType}</span>
                <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`}>
                  <path d="M8.35413 5.54331C8.30768 5.58988 8.2525 5.62682 8.19176 5.65203C8.13101 5.67723 8.06589 5.69021 8.00013 5.69021C7.93436 5.69021 7.86924 5.67723 7.80849 5.65203C7.74775 5.62682 7.69257 5.58988 7.64613 5.54331L3.06113 0.957314C2.77986 0.675919 2.39834 0.51778 2.00048 0.517687C1.60262 0.517593 1.22102 0.675551 0.939627 0.956814C0.658232 1.23808 0.500094 1.6196 0.5 2.01746C0.499906 2.41532 0.657865 2.79692 0.939127 3.07831L5.52513 7.66431C6.18216 8.31955 7.07221 8.6875 8.00013 8.6875C8.92804 8.6875 9.81809 8.31955 10.4751 7.66431L15.0611 3.07831C15.3424 2.79692 15.5003 2.41532 15.5003 2.01746C15.5002 1.6196 15.342 1.23808 15.0606 0.956814C14.7792 0.675551 14.3976 0.517593 13.9998 0.517687C13.6019 0.51778 13.2204 0.675919 12.9391 0.957314L8.35413 5.54331Z" fill="black" />
                </svg>
              </button>

              {isTypeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[200px] bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    {['All Types', 'pdf', 'faq', 'csv', 'text'].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setFilterType(option);
                          setIsTypeDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#F3F4F6] flex items-center justify-between ${filterType === option ? 'bg-[#EEF2FF]' : ''}`}
                      >
                        <span className={filterType === option ? 'font-medium text-[#1F2937]' : 'text-[#6B7280]'}>
                          {option}
                        </span>
                        {filterType === option && (
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

            <div className="relative w-[15%]">
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="px-5 py-3 border border-[#41288A80] bg-white rounded-lg focus:outline-none text-sm font-medium text-[#1F2937] flex items-center gap-2 min-w-[140px] w-full justify-between"
              >
                <span className='text-base font-medium'>{filterStatus}</span>
                <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`}>
                  <path d="M8.35413 5.54331C8.30768 5.58988 8.2525 5.62682 8.19176 5.65203C8.13101 5.67723 8.06589 5.69021 8.00013 5.69021C7.93436 5.69021 7.86924 5.67723 7.80849 5.65203C7.74775 5.62682 7.69257 5.58988 7.64613 5.54331L3.06113 0.957314C2.77986 0.675919 2.39834 0.51778 2.00048 0.517687C1.60262 0.517593 1.22102 0.675551 0.939627 0.956814C0.658232 1.23808 0.500094 1.6196 0.5 2.01746C0.499906 2.41532 0.657865 2.79692 0.939127 3.07831L5.52513 7.66431C6.18216 8.31955 7.07221 8.6875 8.00013 8.6875C8.92804 8.6875 9.81809 8.31955 10.4751 7.66431L15.0611 3.07831C15.3424 2.79692 15.5003 2.41532 15.5003 2.01746C15.5002 1.6196 15.342 1.23808 15.0606 0.956814C14.7792 0.675551 14.3976 0.517593 13.9998 0.517687C13.6019 0.51778 13.2204 0.675919 12.9391 0.957314L8.35413 5.54331Z" fill="black" />
                </svg>
              </button>

              {isStatusDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[200px] bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    {['All Status', 'Published', 'Processing', 'Draft', 'Error'].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setFilterStatus(option);
                          setIsStatusDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#F3F4F6] flex items-center justify-between ${filterStatus === option ? 'bg-[#EEF2FF]' : ''}`}
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
          {/* View Toggle and Documents Section */}
          <div className="">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-medium text-black">Knowledge Base</h2>
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
            <SharedTable<Document>
              type="documents"
              data={filteredData}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredData.map((document, index) => (
                <ItemCard
                  key={index}
                  icon={getDocumentIcon(document.type)}
                  title={document.name}
                  description={getDocumentDescription(document.type)}
                  badges={[
                    { label: document.status, variant: document.statusVariant }
                  ]}
                  stats={[
                    { label: 'Size', value: document.size },
                    { label: 'Modified', value: document.lastUpdated }
                  ]}
                  footerTags={['product', 'support', 'faq']}
                  menuItems={[
                    {
                      icon: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      ),
                      label: 'View Details'
                    },
                    {
                      icon: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                        </svg>
                      ),
                      label: 'Download'
                    },
                    {
                      icon: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      ),
                      label: 'Delete Document',
                      className: 'text-[#DC2626]'
                    }
                  ]}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Modals */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </DashboardLayout>
  );
}