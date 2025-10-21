"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Conversation } from '@/types/chat';
import Input from '@/components/shared/Input';
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
    <div className="w-[30%] bg-white flex flex-col rounded-[10px]">
      {/* Header */}
      <div className="p-3">
        <h2 className="text-lg font-semibold mb-4">Conversations</h2>

        {/* Search Input */}
        <div className="relative ">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <Input placeholder='Search conversations...' value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} icon={<SearchIcon />} />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredConversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`w-full px-6 py-4 flex items-start gap-3 hover:bg-[#F9FAFB] rounded-[10px] transition-colors ${activeConversationId === conversation.id ? 'bg-[#007BFF1A]' : ''
              }`}
          >
            <div className="relative flex-shrink-0">
              <div className="w-[42px] h-[42px] rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={conversation.avatar}
                  alt={conversation.name}
                  width={42}
                  height={42}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{conversation.name}</h3>
              </div>
              <p className="text-xs opacity-70 truncate">{conversation.lastMessage}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}