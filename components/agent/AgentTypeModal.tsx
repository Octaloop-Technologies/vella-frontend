'use client';

import React from 'react';
import BaseModal from '@/components/shared/BaseModal';
import { useRouter } from 'next/navigation';
import Card from '@/components/shared/Card';
import Image from 'next/image';

interface AgentTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AgentTypeModal: React.FC<AgentTypeModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const agentTypes = [
    {
      id: 'inbound',
      title: 'Inbound Agent',
      description: 'Handles incoming customer inquiries across multiple channels',
      icon: (
        <Image
          src="/svgs/call-incoming.svg"
          alt="Inbound Agent"
          width={32}
          height={32}
        />
      ),
      features: [
        '24/7 Availability',
        'Multi-channel Support',
        'Instant Responses',
        'CRM Integration',
      ],
    },
    {
      id: 'outbound',
      title: 'Outbound Agent',
      description: 'Proactively reaches out to prospects and customers',
      icon: (
        <Image
          src="/svgs/call-outgoing.svg"
          alt="Outbound Agent"
          width={32}
          height={32}
        />
      ),
      features: [
        'Lead Qualification',
        'Follow-up Calls',
        'Sales Outreach',
        'Appointment Setting',
      ],
    },
    {
      id: 'widget',
      title: 'Widget',
      description: 'Embeddable chat or voice widget for your website',
      icon: (
        <Image
          src="/svgs/magic-wand.svg"
          alt="Widget"
          width={32}
          height={32}
        />
      ),
      features: [
        'Easy Integration',
        'Customizable Design',
        'Live Preview',
        'Code Embed',
      ],
    },
  ];

  const handleSelectType = (typeId: string) => {
    onClose();
    router.push(`/dashboard/agent/create?type=${typeId}`);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-6xl" title="Create New Agent" subtitle="Follow the steps to create and configure your new AI agent">
      <div className="p-12">
        {/* Title */}
        <h3 className="text-lg font-medium mb-8 text-center text-black">
          Choose Agent Type
        </h3>

        {/* Agent Type Cards */}
        <div className="grid grid-cols-3 gap-6">
          {agentTypes.map((type) => (
            <Card
              key={type.id}
              onClick={() => handleSelectType(type.id)}
              className="group relative p-4 hover:border-[#41288A] hover:bg-[#007BFF1A] transition-all duration-200 text-left"
            >
              <div className="relative">
                {/* Icon */}
                <div className="mb-4 w-16 h-16 bg-gradient-to-b from-[#41288A] to-[#301971] flex items-center justify-center rounded-xl">{type.icon}</div>

                {/* Title */}
                <h4 className="text-lg font-semibold mb-2 text-black">{type.title}</h4>

                {/* Description */}
                <p className="text-sm font-medium mb-4 text-black">{type.description}</p>

                {/* Features */}
                <ul className="space-y-1 list-disc pl-5">
                  {type.features.map((feature, index) => (
                    <li key={index} className="text-xs font-medium text-black">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </BaseModal>
  );
};

export default AgentTypeModal;
