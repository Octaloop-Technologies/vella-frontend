"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Message } from '@/types/chat';
import Input from '@/components/shared/Input';
import { useRouter } from 'next/navigation';

export default function TestAgent() {
    const router = useRouter();
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
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
    ]);

    const agentDetails = {
        name: 'Sales Assistant',
        status: 'Active',
        persona: 'Adam',
        tune: 'Professional and helpful',
        lastUpdated: '2 minutes ago'
    };

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            const newMessage: Message = {
                id: String(messages.length + 1),
                sender: 'user',
                content: messageInput,
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMessage]);
            setMessageInput('');
        }
    };



    const handleClearChat = () => {
        setMessages([]);
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="h-screen bg-[#F9FAFB] flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-[#E5E7EB] px-5 py-6">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-3 transition-colors"
                >
                    <Image src="/svgs/back.svg" alt="Back" width={16} height={16} className='mb-1' />
                    <span className="font-medium">Test {agentDetails.name}</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                <div className='flex-1 flex flex-col'>
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
                                            src="/dashboard/png/user-avatar.png"
                                            alt="Agent Avatar"
                                            width={40}
                                            height={40}
                                            className="object-cover"
                                        />
                                    </div>
                                )}

                                <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} max-w-[40%]`}>
                                    <div
                                        className={`px-5 py-3 rounded-[10px] font-medium text-sm opacity-70 ${message.sender === 'user'
                                                ? 'bg-[#007BFF1A] border border-[#8266D4]'
                                                : 'bg-[#FAF8F8] text-black'
                                            }`}
                                    >
                                        <p className="mb-3 leading-tight">{message.content}</p>
                                        <span className="text-xs opacity-70">{message.timestamp}</span>
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

                {/* Agent Details Panel */}
                <div className="w-[20%] max-w-[400px] bg-white p-6 border-l border-[#0000001A]">
                    <h2 className="text-lg font-medium mb-6">Agent Details</h2>

                    <div className="space-y-6">
                        {/* Status */}
                        <div>
                            <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Status</label>
                            <div className="w-full px-4 py-4 bg-[#EBEBEB] rounded-[10px] text-sm">
                                {agentDetails.status}
                            </div>
                        </div>

                        {/* Persona */}
                        <div>
                            <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Persona</label>
                            <div className="w-full px-4 py-4 bg-[#EBEBEB] rounded-[10px] text-sm">
                                {agentDetails.persona}
                            </div>
                        </div>

                        {/* Tune */}
                        <div>
                            <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Tune</label>
                            <div className="w-full px-4 py-4 bg-[#EBEBEB] rounded-[10px] text-sm">
                                {agentDetails.tune}
                            </div>
                        </div>

                        {/* Last Updated */}
                        <div>
                            <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Last Updated</label>
                            <div className="w-full px-4 py-4 bg-[#EBEBEB] rounded-[10px] text-sm">
                                {agentDetails.lastUpdated}
                            </div>
                        </div>

                        {/* Clear Chat Button */}
                        <button
                            onClick={handleClearChat}
                            className="w-full px-6 py-3 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-[10px] font-medium hover:opacity-90 transition-all mt-"
                        >
                            Clear Chat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
