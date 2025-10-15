"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Conversation } from '@/types/chat';
import SearchIcon from '@/components/icons/SearchIcon';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-[40%] border-r border-[#E5E7EB] bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#E5E7EB]">
        <h2 className="text-xl font-semibold text-black mb-4">Conversations</h2>
        
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8266D4] text-sm bg-[#F9FAFB]"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`w-full px-6 py-4 flex items-start gap-3 hover:bg-[#F9FAFB] transition-colors border-b border-[#F3F4F6] ${
              activeConversationId === conversation.id ? 'bg-[#EEF2FF]' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={conversation.avatar}
                  alt={conversation.name}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-black text-sm">{conversation.name}</h3>
              </div>
              <p className="text-xs text-[#6B7280] mb-1">{conversation.role}</p>
              <p className="text-sm text-[#6B7280] truncate">{conversation.lastMessage}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}