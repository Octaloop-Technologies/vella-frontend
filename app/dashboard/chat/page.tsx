"use client";

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ConversationList from '@/components/chat/ConversationList';
import ChatMessageArea from '@/components/chat/ChatMessageArea';
import { Conversation, Message, ActiveChat } from '@/types/chat';

export default function Chat() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>('1');

  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '/dashboard/png/user-avatar.png',
      role: 'Sales Assistant',
      lastMessage: 'Thank you for the information! When can we...'
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: '/dashboard/png/user-avatar.png',
      role: 'Support Bot',
      lastMessage: 'I need help with my account settings.'
    },
    {
      id: '3',
      name: 'Emma Davis',
      avatar: '/dashboard/png/user-avatar.png',
      role: 'Website Widget',
      lastMessage: 'What pricing plans do you offer?'
    },
    {
      id: '4',
      name: 'John Smith',
      avatar: '/dashboard/png/user-avatar.png',
      role: 'Sales Assistant',
      lastMessage: 'Perfect! Looking forward to our call tomorrow'
    }
  ];

  const activeChat: ActiveChat | null = activeConversationId
    ? {
        name: 'Sarah Johnson',
        role: 'Sales Assistant',
        avatar: '/dashboard/png/user-avatar.png',
        platform: 'WhatsApp',
        status: 'Active'
      }
    : null;

  const messages: Message[] = [
    {
      id: '1',
      sender: 'agent',
      content: "Hello Sarah! I'm your Sales Assistant. I see you're interested in our platform. How can I help you today?",
      timestamp: '09:53 AM'
    },
    {
      id: '2',
      sender: 'user',
      content: "Hi! Yes, I'm looking for a solution to automate our customer support. Can you tell me more about your features?",
      timestamp: '09:57 AM'
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-80px)] p-8 gap-3">
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
        />
        <ChatMessageArea
          activeChat={activeChat}
          messages={messages}
        />
      </div>
    </DashboardLayout>
  );
}