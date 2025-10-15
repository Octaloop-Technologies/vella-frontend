"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Message, ActiveChat } from '@/types/chat';

interface ChatMessageAreaProps {
  activeChat: ActiveChat | null;
  messages: Message[];
}

export default function ChatMessageArea({ activeChat, messages }: ChatMessageAreaProps) {
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <p className="text-[#6B7280] text-lg">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="px-8 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              <Image
                src={activeChat.avatar}
                alt={activeChat.name}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-black">{activeChat.name}</h2>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-[#6B7280]">{activeChat.role}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[#6B7280]">{activeChat.platform}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#DC2626]"></div>
                <span className="text-[#6B7280]">{activeChat.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 mb-6 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'agent' && (
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <Image
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            )}
            
            <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} max-w-[60%]`}>
              <div
                className={`px-5 py-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white'
                    : 'bg-[#F3F4F6] text-black'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              <span className="text-xs text-[#6B7280] mt-1">{message.timestamp}</span>
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
      </div>

      {/* Message Input */}
      <div className="px-8 py-6 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <button className="p-3 hover:bg-[#F3F4F6] rounded-lg transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>

          <input
            type="text"
            placeholder="Type your message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-5 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8266D4] text-sm"
          />

          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="p-3 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}