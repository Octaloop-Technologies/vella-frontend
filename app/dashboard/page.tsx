"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/shared/Card';
import ConversionIcon from '@/components/icons/ConversionIcon';
import { KnowledgeIcon, ChatIcon, AgentIcon } from '@/components/icons';
import StatsCard from '@/components/dashboard/StatsCard';
import SharedTable from '@/components/shared/SharedTable';
import { TopAgent } from '@/types/table';

const ActionCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <Card className="p-5">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-black mb-1.5">{title}</h3>
        <p className="text-xs text-black">{description}</p>
      </div>
      <div className="w-6 h-6 bg-[#007BFF1A] rounded-sm flex items-center justify-center cursor-pointer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#41288A">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      </div>
    </div>
  </Card>
);

const statsCards = [
  {
    title: "Active Agents",
    icon: <AgentIcon gradient={{ from: "#8266D4", to: "#41288A" }} />,
    value: "12",
    change: "+2 this month",
  },
  {
    title: "Inbound Chats",
    icon: <ChatIcon gradient={{ from: "#8266D4", to: "#41288A" }} />,
    value: "1,247",
    change: "+18% from last week",
  },
  {
    title: "Knowledge Docs",
    icon: <KnowledgeIcon gradient={{ from: "#8266D4", to: "#41288A" }} />,
    value: "89",
    change: "+5 added today",
  },
  {
    title: "Conversion Rate",
    icon: <ConversionIcon gradient={{ from: "#8266D4", to: "#41288A" }} />,
    value: "23.4%",
    change: "+5 added today",
  },
];

const topAgentsData: TopAgent[] = [
  { name: 'Sales Assistant', conversations: '342 conversations', progress: 89, success: '89% success', status: 'Active', statusVariant: 'active' },
  { name: 'Support Bot', conversations: '256 conversations', progress: 60, success: '89% success', status: 'Active', statusVariant: 'active' },
  { name: 'Lead Qualifier', conversations: '342 conversations', progress: 75, success: '89% success', status: 'Active', statusVariant: 'active' },
  { name: 'FAQ Helper', conversations: '342 conversations', progress: 15, success: '89% success', status: 'Draft', statusVariant: 'draft' },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-brand-black">Dashboard</h1>
          <p className="text-black mt-2 font-medium text-sm">Welcome back! Here's what's happening with your agents.</p>
        </div>

        <Card className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8'>
          {
            statsCards.map((card) => (
              <StatsCard key={card.title} {...card} />
            ))
          }
        </Card>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ActionCard title="Create New Agent" description="Set up a new AI agent in minutes" />
          <ActionCard title="Connect CRM" description="Integrate with your favorite tools" />
          <ActionCard title="Upload Documents" description="Expand your knowledge base" />
        </div>

        {/* Top Performing Agents */}
        <SharedTable<TopAgent>
          type="topAgents"
          title="Top Performing Agents"
          data={topAgentsData}
        />
      </div>
    </DashboardLayout>
  );
}