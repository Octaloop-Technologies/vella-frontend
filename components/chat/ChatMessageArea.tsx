"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Message, ActiveChat } from '@/types/chat';
import Input from '../shared/Input';

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
          <p className="text-[#6B7280] text-lg text-black">Select a conversation to start chatting</p>
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
            <h2 className="font-medium mb-1 text-black">{activeChat.name}</h2>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-xs opacity-70 text-black">{activeChat.role}</span>
              <div className="flex items-center gap-1.5">
                <Image src="/svgs/messenger.svg" alt="Platform" width={16} height={16} />
                <span className="text-xs opacity-70 text-black">{activeChat.platform}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#25A83D]"></div>
                <span className="text-xs opacity-70 text-black">{activeChat.status}</span>
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
            
            <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} max-w-[50%]`}>
              <div
                className={`px-5 py-3 rounded-[10px] font-medium text-sm opacity-70 ${
                  message.sender === 'user'
                    ? 'bg-[#007BFF1A] border border-[#8266D4]'
                    : 'bg-[#FAF8F8] text-black'
                }`}
              >
                <p className="mb-2 leading-tight text-black">{message.content}</p>
                <span className="text-xs opacity-70 text-black">{message.timestamp}</span>
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
      </div>

      {/* Message Input */}
      <div className="px-4 py-6 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <button className="p-3 hover:bg-[#F3F4F6] rounded-lg transition-colors">
            <Image src="/svgs/clip.svg" alt="Attach" width={24} height={24} />
          </button>

          <Input 
            placeholder="Type your message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            containerClassName='w-full'
            className='py-4'
          />

          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="p-3 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Image src="/svgs/send.svg" alt="Send" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
}