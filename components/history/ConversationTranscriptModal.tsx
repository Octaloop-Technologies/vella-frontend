import React from 'react';
import BaseModal from '@/components/shared/BaseModal';
import Badge from '../shared/Badge';
import Image from 'next/image';
import Card from '../shared/Card';

interface ConversationTranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation?: {
    customerName: string;
    customerEmail?: string;
    agent: string;
    channel?: string;
    duration: string;
    status: string;
    statusVariant: 'completed' | 'abandoned';
    date?: string;
    time?: string;
  } | null;
}

const ConversationTranscriptModal: React.FC<ConversationTranscriptModalProps> = ({
  isOpen,
  onClose,
  conversation
}) => {
  if (!conversation) return null;

  const messages = [
    {
      sender: 'agent',
      text: "Hello Sarah! I'm your Sales Assistant. I see you're interested in our platform. How can I help you today?",
      time: '09:53 AM',
      avatar: '/dashboard/png/user-avatar.png'
    },
    {
      sender: 'user',
      text: "Hi! Yes, I'm looking for a solution to automate our customer support. Can you tell me more about your features?",
      time: '09:57 AM',
      avatar: '/dashboard/png/user-avatar.png'
    }
  ];

  const summary = "Customer left before agent could fully assist with product questions.";
  const tags = ['abandoned', 'product'];

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl" title="Conversation Transcript">
      <div className="p-8">
        {/* Info Card */}
        <div className="bg-[#EBEBEB] rounded-[10px] p-6 mb-8">
          <div className="flex justify-between gap-6 text-sm">
            <div>
              <div className="text-xs opacity-70 mb-3">Customer</div>
              <div className="font-medium">{conversation.customerName}</div>
            </div>
            <div>
              <div className="text-xs opacity-70 mb-3">Agent</div>
              <div className="font-semibold mb-4">{conversation.agent}</div>
              <Badge variant="connected">
              Connected
            </Badge>
            </div>
            <div>
              <div className="text-xs opacity-70 mb-3">Duration</div>
              <div className="font-semibold mb-4">{conversation.duration}</div>
              <Badge variant="abandoned">
              Abandoned
            </Badge>
            </div>
          </div>
        </div>

        <Card className="flex-1 overflow-y-auto p-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 mb-6 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'agent' && (
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image
                    src={message.avatar}
                    alt="Agent"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              )}

              <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} max-w-[60%]`}>
                <div
                  className={`px-5 py-3 rounded-[10px] font-medium text-sm opacity-70 ${message.sender === 'user'
                      ? 'bg-[#007BFF1A] border border-[#8266D4]'
                      : 'bg-[#FAF8F8] text-black'
                    }`}
                >
                  <p className="mb-2 leading-tight">{message.text}</p>
                  <span className="text-xs opacity-70">{message.time}</span>
                </div>

              </div>

              {message.sender === 'user' && (
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image
                    src="/dashboard/png/user-avatar.png"
                    alt="User"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </Card>

        {/* Summary */}
        <div className="mb-6 mt-6">
          <h3 className="text-base font-medium mb-2">Summary</h3>
          <p className="text-sm font-medium opacity-70">{summary}</p>
        </div>

        {/* Tags */}
        <div className="mb-8">
          <h3 className="text-base font-semibold text-[#1F2937] mb-3">Tags</h3>
          <div className="flex gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-[#FFFFFF1A] text-[#1F2937] border border-[#EBEBEB] rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 max-w-lg mx-auto">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-[#8266D4] text-[#41288A] rounded-lg font-medium hover:bg-[#F5F3FF] transition-colors"
          >
            Close
          </button>
          <button className="flex-1 px-6 py-3 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium hover:opacity-90 transition-all">
            Export
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConversationTranscriptModal;