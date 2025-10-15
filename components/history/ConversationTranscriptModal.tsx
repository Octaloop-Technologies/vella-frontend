import React from 'react';
import BaseModal from '@/components/shared/BaseModal';

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
      avatar: '/agent-avatar.png'
    },
    {
      sender: 'customer',
      text: "Hi! Yes, I'm looking for a solution to automate our customer support. Can you tell me more about your features?",
      time: '09:57 AM',
      avatar: '/customer-avatar.png'
    }
  ];

  const summary = "Customer left before agent could fully assist with product questions.";
  const tags = ['abandoned', 'product'];

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl" showCloseButton={true}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#1F2937] mb-2">Conversation Transcript</h2>
        </div>

        {/* Info Card */}
        <div className="bg-[#F9FAFB] rounded-lg p-6 mb-8">
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-[#6B7280] mb-2">Customer</div>
              <div className="font-semibold text-[#1F2937]">{conversation.customerName}</div>
            </div>
            <div>
              <div className="text-[#6B7280] mb-2">Agent</div>
              <div className="font-semibold text-[#1F2937]">{conversation.agent}</div>
            </div>
            <div>
              <div className="text-[#6B7280] mb-2">Duration</div>
              <div className="font-semibold text-[#1F2937]">{conversation.duration}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${
              conversation.statusVariant === 'completed'
                ? 'bg-[#D1FAE5] text-[#059669]'
                : 'bg-[#FEE2E2] text-[#DC2626]'
            }`}>
              {conversation.status}
            </div>
            <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${
              conversation.statusVariant === 'abandoned'
                ? 'bg-[#FEE2E2] text-[#DC2626]'
                : 'bg-[#D1FAE5] text-[#059669]'
            }`}>
              {conversation.statusVariant === 'completed' ? 'Connected' : 'Abandoned'}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="mb-8 space-y-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
              {message.sender === 'agent' && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#8266D4] to-[#41288A] flex items-center justify-center mr-3 flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                    <path d="M10 10c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
              <div className={`max-w-[70%] ${message.sender === 'customer' ? 'order-1' : ''}`}>
                <div className={`p-4 rounded-lg ${
                  message.sender === 'customer' 
                    ? 'bg-[#EEF2FF] border border-[#C7D2FE]' 
                    : 'bg-white border border-[#E5E7EB]'
                }`}>
                  <p className="text-sm text-[#1F2937]">{message.text}</p>
                </div>
                <div className="text-xs text-[#6B7280] mt-2 px-1">{message.time}</div>
              </div>
              {message.sender === 'customer' && (
                <div className="w-10 h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center ml-3 flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="#6B7280">
                    <path d="M10 10c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-[#1F2937] mb-3">Summary</h3>
          <p className="text-sm text-[#6B7280]">{summary}</p>
        </div>

        {/* Tags */}
        <div className="mb-8">
          <h3 className="text-base font-semibold text-[#1F2937] mb-3">Tags</h3>
          <div className="flex gap-2">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-[#F3F4F6] text-[#1F2937] rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-[#41288A] text-[#41288A] rounded-lg font-medium hover:bg-[#F5F3FF] transition-colors"
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