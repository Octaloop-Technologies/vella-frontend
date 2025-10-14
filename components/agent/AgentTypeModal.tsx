'use client';

import React from 'react';
import BaseModal from '@/components/shared/BaseModal';
import { useRouter } from 'next/navigation';

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
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="8" fill="#41288A" />
          <path
            d="M20 12C19.2089 12 18.4355 12.2346 17.7777 12.6741C17.1199 13.1136 16.6072 13.7384 16.3045 14.4693C16.0017 15.2002 15.9225 16.0044 16.0769 16.7804C16.2312 17.5563 16.6122 18.269 17.1716 18.8284C17.731 19.3878 18.4437 19.7688 19.2196 19.9231C19.9956 20.0775 20.7998 19.9983 21.5307 19.6955C22.2616 19.3928 22.8864 18.8801 23.3259 18.2223C23.7654 17.5645 24 16.7911 24 16C24 14.9391 23.5786 13.9217 22.8284 13.1716C22.0783 12.4214 21.0609 12 20 12ZM20 18C19.6044 18 19.2178 17.8827 18.8889 17.6629C18.56 17.4432 18.3036 17.1308 18.1522 16.7654C18.0009 16.3999 17.9613 15.9978 18.0384 15.6098C18.1156 15.2219 18.3061 14.8655 18.5858 14.5858C18.8655 14.3061 19.2219 14.1156 19.6098 14.0384C19.9978 13.9613 20.3999 14.0009 20.7654 14.1522C21.1308 14.3036 21.4432 14.56 21.6629 14.8889C21.8827 15.2178 22 15.6044 22 16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18ZM26 12H25V11C25 10.7348 24.8946 10.4804 24.7071 10.2929C24.5196 10.1054 24.2652 10 24 10C23.7348 10 23.4804 10.1054 23.2929 10.2929C23.1054 10.4804 23 10.7348 23 11V12.36C22.1813 11.4989 21.1718 10.8464 20.0527 10.4558C18.9335 10.0653 17.7367 9.94756 16.5635 10.1081C15.3903 10.2687 14.2727 10.7024 13.2988 11.3759C12.325 12.0494 11.5225 12.9439 10.958 13.9851C10.3934 15.0263 10.0824 16.1854 10.0502 17.3693C10.018 18.5532 10.2656 19.7275 10.7731 20.7963C11.2805 21.865 12.0335 22.7981 12.9693 23.5193C13.905 24.2406 15 24.7296 16.16 24.946V27C16.16 27.2652 16.2654 27.5196 16.4529 27.7071C16.6404 27.8946 16.8948 28 17.16 28C17.4252 28 17.6796 27.8946 17.8671 27.7071C18.0546 27.5196 18.16 27.2652 18.16 27V24.946C19.6529 24.6789 20.9999 23.8949 21.9679 22.7349C22.9358 21.5749 23.4603 20.1146 23.446 18.606V11C23.446 10.7348 23.3406 10.4804 23.1531 10.2929C22.9656 10.1054 22.7112 10 22.446 10C22.1808 10 21.9264 10.1054 21.7389 10.2929C21.5514 10.4804 21.446 10.7348 21.446 11V12H20.5C19.5717 12 18.6815 12.3687 18.0251 13.0251C17.3687 13.6815 17 14.5717 17 15.5V16.5C17 17.4283 17.3687 18.3185 18.0251 18.9749C18.6815 19.6313 19.5717 20 20.5 20H21.446V18H20.5C20.1022 18 19.7206 17.842 19.4393 17.5607C19.158 17.2794 19 16.8978 19 16.5V15.5C19 15.1022 19.158 14.7206 19.4393 14.4393C19.7206 14.158 20.1022 14 20.5 14H21.446V16.5C21.446 17.1278 21.5829 17.7481 21.8467 18.3179C22.1106 18.8877 22.4952 19.3936 22.9747 19.8012C23.4542 20.2088 24.0178 20.508 24.6267 20.6781C25.2357 20.8482 25.8758 20.8854 26.5 20.787V27C26.5 27.2652 26.6054 27.5196 26.7929 27.7071C26.9804 27.8946 27.2348 28 27.5 28C27.7652 28 28.0196 27.8946 28.2071 27.7071C28.3946 27.5196 28.5 27.2652 28.5 27V20.787C29.3613 20.6567 30.1707 20.2907 30.8388 19.7298C31.5069 19.1688 32.0066 18.4341 32.2817 17.6066C32.5568 16.7791 32.5962 15.8908 32.395 15.0427C32.1937 14.1947 31.7596 13.4197 31.1404 12.8004C30.5211 12.1812 29.7461 11.7471 28.8981 11.5458C28.05 11.3446 27.1617 11.384 26.3342 11.6591C25.5067 11.9342 24.772 12.4339 24.211 13.102C23.65 13.7701 23.284 14.5795 23.1537 15.4408L25.1197 15.7408C25.2055 15.2472 25.4331 14.7907 25.7747 14.4285C26.1163 14.0662 26.5562 13.8144 27.0409 13.7053C27.5255 13.5962 28.0334 13.6346 28.4971 13.8159C28.9608 13.9972 29.3599 14.3138 29.6444 14.7257C29.9289 15.1375 30.0867 15.6264 30.0988 16.1298C30.1109 16.6331 29.9767 17.1293 29.7126 17.5546C29.4485 17.9799 29.0658 18.3154 28.6113 18.5195C28.1569 18.7235 27.6509 18.7872 27.16 18.702L26 18.5V12H26Z"
            fill="white"
          />
        </svg>
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
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="8" fill="#41288A" />
          <path
            d="M27.707 19.293L22.707 14.293C22.5195 14.1055 22.2652 14.0002 22 14.0002C21.7348 14.0002 21.4805 14.1055 21.293 14.293C21.1055 14.4805 21.0002 14.7348 21.0002 15C21.0002 15.2652 21.1055 15.5195 21.293 15.707L24.586 19H12C11.7348 19 11.4804 19.1054 11.2929 19.2929C11.1054 19.4804 11 19.7348 11 20C11 20.2652 11.1054 20.5196 11.2929 20.7071C11.4804 20.8946 11.7348 21 12 21H24.586L21.293 24.293C21.1055 24.4805 21.0002 24.7348 21.0002 25C21.0002 25.2652 21.1055 25.5195 21.293 25.707C21.4805 25.8945 21.7348 25.9998 22 25.9998C22.2652 25.9998 22.5195 25.8945 22.707 25.707L27.707 20.707C27.8002 20.6148 27.8741 20.5044 27.9246 20.3827C27.9751 20.261 28.001 20.1303 28.001 19.998C28.001 19.8657 27.9751 19.735 27.9246 19.6133C27.8741 19.4916 27.8002 19.3812 27.707 19.289V19.293Z"
            fill="white"
          />
        </svg>
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
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="8" fill="#41288A" />
          <path
            d="M25 12H15C13.3431 12 12 13.3431 12 15V21C12 22.6569 13.3431 24 15 24H17V27C17 27.1857 17.0633 27.3663 17.1792 27.5133C17.2951 27.6603 17.4572 27.7655 17.6402 27.8127C17.8232 27.8599 18.0169 27.8465 18.1917 27.7744C18.3665 27.7024 18.5126 27.5756 18.608 27.414L21.277 23H25C26.6569 23 28 21.6569 28 20V15C28 13.3431 26.6569 12 25 12ZM26 20C26 20.5304 25.7893 21.0391 25.4142 21.4142C25.0391 21.7893 24.5304 22 24 22H21C20.7659 22.0004 20.5391 22.0822 20.3584 22.2324C20.1777 22.3825 20.0542 22.5921 20.008 22.826L19 26.434L19 23C19 22.7348 18.8946 22.4804 18.7071 22.2929C18.5196 22.1054 18.2652 22 18 22H15C14.4696 22 13.9609 21.7893 13.5858 21.4142C13.2107 21.0391 13 20.5304 13 20V15C13 14.4696 13.2107 13.9609 13.5858 13.5858C13.9609 13.2107 14.4696 13 15 13H25C25.5304 13 26.0391 13.2107 26.4142 13.5858C26.7893 13.9609 27 14.4696 27 15V20H26Z"
            fill="white"
          />
          <circle cx="16.5" cy="17.5" r="1.5" fill="white" />
          <circle cx="20" cy="17.5" r="1.5" fill="white" />
          <circle cx="23.5" cy="17.5" r="1.5" fill="white" />
        </svg>
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
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-6xl">
      <div className="p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#1E1E1E] mb-2">Create New Agent</h2>
          <p className="text-[#6E6E6E] text-sm">
            Follow the steps to create and configure your new AI agent
          </p>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-[#1E1E1E] mb-8 text-center">
          Choose Agent Type
        </h3>

        {/* Agent Type Cards */}
        <div className="grid grid-cols-3 gap-6">
          {agentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleSelectType(type.id)}
              className="group relative bg-white border-2 border-[#E5E7EB] rounded-[16px] p-6 hover:border-[#8266D4] hover:shadow-lg transition-all duration-200 text-left"
            >
              {/* Selected state - border is handled by hover */}
              {type.id === 'inbound' && (
                <div className="absolute inset-0 border-2 border-[#8266D4] rounded-[16px] bg-[#F3F0FF] opacity-10" />
              )}

              <div className="relative">
                {/* Icon */}
                <div className="mb-4">{type.icon}</div>

                {/* Title */}
                <h4 className="text-lg font-semibold text-[#1E1E1E] mb-2">{type.title}</h4>

                {/* Description */}
                <p className="text-sm text-[#6E6E6E] mb-4">{type.description}</p>

                {/* Features */}
                <ul className="space-y-2">
                  {type.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-[#6E6E6E]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="mr-2 flex-shrink-0"
                      >
                        <circle cx="8" cy="8" r="8" fill="#F3F0FF" />
                        <path
                          d="M5 8L7 10L11 6"
                          stroke="#8266D4"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          ))}
        </div>
      </div>
    </BaseModal>
  );
};

export default AgentTypeModal;
