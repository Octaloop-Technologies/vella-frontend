"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SharedTable from '@/components/shared/SharedTable';
import { Conversation } from '@/types/table';
import Card from '@/components/shared/Card';
import SearchIcon from '@/components/icons/SearchIcon';
import ConversationTranscriptModal from '@/components/history/ConversationTranscriptModal';
import StatsCard from '@/components/shared/StatsCard';
import Image from 'next/image';
import Input from '@/components/shared/Input';

export default function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTranscript, setSelectedTranscript] = useState<Conversation | null>(null);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);

  // Filter states
  const [timeFilter, setTimeFilter] = useState('Today');
  const [agentFilter, setAgentFilter] = useState('All Agents');
  const [channelFilter, setChannelFilter] = useState('All Channels');
  const [outcomeFilter, setOutcomeFilter] = useState('All Outcomes');

  // Dropdown states
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isAgentDropdownOpen, setIsAgentDropdownOpen] = useState(false);
  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);
  const [isOutcomeDropdownOpen, setIsOutcomeDropdownOpen] = useState(false);

  const conversationsData: Conversation[] = [
    {
      customerName: 'John Smith',
      customerEmail: 'john.smith@example.com',
      agent: 'Sales Assistant',
      channel: 'website',
      duration: '15m 32s',
      status: 'Completed',
      statusVariant: 'completed',
      stars: 5,
      rating: '5/5',
      date: '22/01/2024',
      time: '14:30:00'
    },
    {
      customerName: 'Sarah Johnson',
      customerEmail: 'john.smith@example.com',
      agent: 'Support Bot',
      channel: 'phone',
      duration: '15m 32s',
      status: 'Abandoned',
      statusVariant: 'abandoned',
      stars: 3,
      rating: '3/5',
      date: '22/01/2024',
      time: '14:30:00'
    },
    {
      customerName: 'Emma Davis',
      customerEmail: 'john.smith@example.com',
      agent: 'Lead Qualifier',
      channel: 'whatsapp',
      duration: '15m 32s',
      status: 'Completed',
      statusVariant: 'completed',
      stars: 5,
      rating: '5/5',
      date: '22/01/2024',
      time: '14:30:00'
    },
  ];

  const statsCards = [
    {
      title: "Total Conversations",
      value: "5",
    },
    {
      title: "Completed",
      value: "2",
    },
    {
      title: "Avg. Duration",
      value: "18m 32s",
    },
  ];

  const timeOptions = ['Today', 'Last 7 days', 'Last 30 days', 'Last 90 days'];
  const agentOptions = ['All Agents', 'Sales Assistant', 'Supports Bot', 'Lead Qualifier'];
  const channelOptions = ['All Channels', 'Website', 'Wahtsapp', 'Facebook'];
  const outcomeOptions = ['All Outcomes', 'Resolved', 'Escalated', 'No Action'];

  const handleViewTranscript = (conversation: Conversation) => {
    setSelectedTranscript(conversation);
    setIsTranscriptModalOpen(true);
  };

  const filteredData = conversationsData.filter(conv => {
    const matchesSearch =
      conv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAgent = agentFilter === 'All Agents' || conv.agent === agentFilter;
    const matchesChannel = channelFilter === 'All Channels' || conv.channel === channelFilter;
    const matchesOutcome = outcomeFilter === 'All Outcomes' || conv.status === outcomeFilter;

    return matchesSearch && matchesAgent && matchesChannel && matchesOutcome;
  });

  const tableData = filteredData.map(conv => ({
    ...conv,
    onViewDetails: () => handleViewTranscript(conv)
  }));

  const FilterDropdown = ({
    isOpen,
    setIsOpen,
    value,
    setValue,
    options
  }: {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
    value: string;
    setValue: (val: string) => void;
    options: string[];
  }) => (
    <div className="relative flex-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3 border border-[#41288A80] bg-white rounded-lg text-sm font-medium text-[#1F2937] flex items-center justify-between"
      >
        <span className="text-base font-medium">{value}</span>
        <svg
          width="16"
          height="9"
          viewBox="0 0 16 9"
          fill="none"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M8.35413 5.54331C8.30768 5.58988 8.2525 5.62682 8.19176 5.65203C8.13101 5.67723 8.06589 5.69021 8.00013 5.69021C7.93436 5.69021 7.86924 5.67723 7.80849 5.65203C7.74775 5.62682 7.69257 5.58988 7.64613 5.54331L3.06113 0.957314C2.77986 0.675919 2.39834 0.51778 2.00048 0.517687C1.60262 0.517593 1.22102 0.675551 0.939627 0.956814C0.658232 1.23808 0.500094 1.6196 0.5 2.01746C0.499906 2.41532 0.657865 2.79692 0.939127 3.07831L5.52513 7.66431C6.18216 8.31955 7.07221 8.6875 8.00013 8.6875C8.92804 8.6875 9.81809 8.31955 10.4751 7.66431L15.0611 3.07831C15.3424 2.79692 15.5003 2.41532 15.5003 2.01746C15.5002 1.6196 15.342 1.23808 15.0606 0.956814C14.7792 0.675551 14.3976 0.517593 13.9998 0.517687C13.6019 0.51778 13.2204 0.675919 12.9391 0.957314L8.35413 5.54331Z" fill="black" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setValue(option);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#F3F4F6] flex items-center justify-between ${value === option ? 'bg-[#EEF2FF]' : ''
                  }`}
              >
                <span className={value === option ? 'font-medium text-[#1F2937]' : 'text-[#6B7280]'}>
                  {option}
                </span>
                {value === option && (
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
  );

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-black">Conversation History</h1>
              <p className="text-black mt-2 font-medium text-sm opacity-70">Review past chats and call transcripts</p>
            </div>
            <button
              className="px-6 py-3 w-60 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-[10px] font-medium hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
              <Image src="/svgs/upload3.svg" alt="Export" width={24} height={24} className='inline-block' />
              <span>Export All</span>
            </button>
          </div>

          {/* Stats Cards */}
          <Card className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8 py-6'>
            {
              statsCards.map((card) => (
                <StatsCard key={card.title} {...card} />
              ))
            }
          </Card>

          {/* Filters Section */}
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Image src="/svgs/filter.svg" alt="Filters" width={24} height={24} />
                <span className="font-medium">Filters</span>
              </div>
              <div className="flex-1 flex items-center gap-4">
                <FilterDropdown
                  isOpen={isTimeDropdownOpen}
                  setIsOpen={setIsTimeDropdownOpen}
                  value={timeFilter}
                  setValue={setTimeFilter}
                  options={timeOptions}
                />
                <FilterDropdown
                  isOpen={isAgentDropdownOpen}
                  setIsOpen={setIsAgentDropdownOpen}
                  value={agentFilter}
                  setValue={setAgentFilter}
                  options={agentOptions}
                />
                <FilterDropdown
                  isOpen={isChannelDropdownOpen}
                  setIsOpen={setIsChannelDropdownOpen}
                  value={channelFilter}
                  setValue={setChannelFilter}
                  options={channelOptions}
                />
                <FilterDropdown
                  isOpen={isOutcomeDropdownOpen}
                  setIsOpen={setIsOutcomeDropdownOpen}
                  value={outcomeFilter}
                  setValue={setOutcomeFilter}
                  options={outcomeOptions}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Conversations Table */}
        <Card className='flex flex-col p-6'>
          <Input containerClassName='mb-4' placeholder='Search conversations...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} icon={<SearchIcon />} />
          <SharedTable<Conversation>
            type="conversations"
            data={tableData}
          />
        </Card>

      </div>

      {/* Transcript Modal */}
      <ConversationTranscriptModal
        isOpen={isTranscriptModalOpen}
        onClose={() => setIsTranscriptModalOpen(false)}
        conversation={selectedTranscript}
      />
    </DashboardLayout>
  );
}