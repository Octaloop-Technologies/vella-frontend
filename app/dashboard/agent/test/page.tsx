"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import Image from 'next/image';
import { Message } from '@/types/chat';
import Input from '@/components/shared/Input';
import { useRouter, useSearchParams } from 'next/navigation';

function TestAgentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Get agent data from URL parameters
    const agentId = searchParams.get('id') || '';
    const agentName = searchParams.get('name') || 'Sales Assistant';
    const agentType = searchParams.get('type') || 'Inbound';
    const agentStatus = searchParams.get('status') || 'Active';
    const agentDescription = searchParams.get('description') || 'AI agent for customer interactions';
    
    const [messageInput, setMessageInput] = useState('');
    const [activeTab, setActiveTab] = useState<'chat' | 'call'>('chat');
    const [isCallActive, setIsCallActive] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [resolvedAgentName, setResolvedAgentName] = useState(agentName);
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversationId, setConversationId] = useState('');
    const [isStartingConversation, setIsStartingConversation] = useState(false);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [error, setError] = useState('');
    
    // Audio recording state
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessingAudio, setIsProcessingAudio] = useState(false);
    const [liveTranscript, setLiveTranscript] = useState('');
    const [callMessages, setCallMessages] = useState<Message[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const currentAudioRef = useRef<HTMLAudioElement | null>(null);
    const recognitionRef = useRef<any>(null);
    const chatMessagesEndRef = useRef<HTMLDivElement | null>(null);
    const callMessagesEndRef = useRef<HTMLDivElement | null>(null);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastTranscriptRef = useRef<string>('');
    const currentTranscriptRef = useRef<string>(''); // Store current transcript for immediate access

    const generateMessageId = () => {
        if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
            return crypto.randomUUID();
        }
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    };

    const agentDetails = {
        name: resolvedAgentName,
        status: agentStatus,
        type: agentType,
        description: agentDescription,
        lastUpdated: '2 minutes ago'
    };

    const startConversation = useCallback(async (targetAgentId: string) => {
        if (!targetAgentId) {
            setError('Agent information is missing. Navigate here from the Agents list.');
            return;
        }

        setIsStartingConversation(true);
        setError('');
        setConversationId('');
        setMessages([]);

        try {
            const response = await fetch(`https://ai-voice-agent-backend.octaloop.dev/conversations/start/${targetAgentId}?channel=phone`, {
                method: 'POST',
                headers: {
                    accept: 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to start conversation');
            }

            const data = await response.json();
            const conversation = data?.conversation;

            if (!conversation?.conversation_id) {
                throw new Error('Conversation response missing ID');
            }

            setConversationId(conversation.conversation_id);
            if (conversation.agent_name) {
                setResolvedAgentName(conversation.agent_name);
            }

            if (conversation.greeting) {
                const greetingMessage: Message = {
                    id: generateMessageId(),
                    sender: 'agent',
                    content: conversation.greeting,
                    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    audioBase64: conversation.greeting_audio || undefined
                };
                setMessages([greetingMessage]);
            } else {
                setMessages([]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to start conversation');
        } finally {
            setIsStartingConversation(false);
        }
    }, []);

    // Send text message (used by typing in chat tab)
    const sendTextMessage = async (text: string) => {
        if (!conversationId) {
            return;
        }

        const userMessage: Message = {
            id: generateMessageId(),
            sender: 'user',
            content: text,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsSendingMessage(true);
        setError('');

        try {
            const response = await fetch(`https://ai-voice-agent-backend.octaloop.dev/conversations/${conversationId}/message?message=${encodeURIComponent(text)}`, {
                method: 'POST',
                headers: {
                    accept: 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();
            const agentResponse = data?.response?.agent_response;

            if (agentResponse) {
                const agentMessage: Message = {
                    id: generateMessageId(),
                    sender: 'agent',
                    content: agentResponse,
                    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                };
                setMessages((prev) => [...prev, agentMessage]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to send message');
        } finally {
            setIsSendingMessage(false);
        }
    };

    const handleSendMessage = async () => {
        const trimmedMessage = messageInput.trim();
        if (!trimmedMessage || !conversationId) {
            return;
        }

        setMessageInput('');
        await sendTextMessage(trimmedMessage);
    };

    // Convert base64 audio to blob and play it
    const playBase64Audio = (base64Audio: string, onAudioEnd?: () => void) => {
        return new Promise<void>((resolve, reject) => {
            try {
                // Don't play if muted
                if (isMuted) {
                    console.log('Audio muted, skipping playback');
                    resolve();
                    return;
                }
                
                // Stop any currently playing audio
                if (currentAudioRef.current) {
                    currentAudioRef.current.pause();
                    currentAudioRef.current = null;
                }

                // Decode base64 to binary
                const binaryString = atob(base64Audio);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                
                const blob = new Blob([bytes], { type: 'audio/mpeg' });
                const audioUrl = URL.createObjectURL(blob);
                
                const audio = new Audio(audioUrl);
                currentAudioRef.current = audio;
                
                audio.onended = () => {
                    URL.revokeObjectURL(audioUrl);
                    currentAudioRef.current = null;
                    if (onAudioEnd) {
                        onAudioEnd();
                    }
                    resolve();
                };
                
                audio.onerror = (err) => {
                    console.error('Audio playback error:', err);
                    URL.revokeObjectURL(audioUrl);
                    currentAudioRef.current = null;
                    reject(err);
                };
                
                console.log('Playing audio...');
                audio.play().catch(err => {
                    console.error('Audio playback failed:', err);
                    reject(err);
                });
            } catch (err) {
                console.error('Failed to play base64 audio:', err);
                reject(err);
            }
        });
    };

    // Start recording audio with live transcription
    const startRecording = async () => {
        try {
            setLiveTranscript('Listening...');
            lastTranscriptRef.current = '';
            currentTranscriptRef.current = '';
            
            // Initialize Web Speech API for live transcription
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.lang = 'en-US';
                recognition.continuous = true;
                recognition.interimResults = true;

                recognition.onresult = (event: any) => {
                    let interimTranscript = '';
                    let finalTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript + ' ';
                        } else {
                            interimTranscript += transcript;
                        }
                    }

                    const currentTranscript = finalTranscript + interimTranscript;
                    const trimmedTranscript = currentTranscript.trim();
                    
                    // Update both state and ref
                    setLiveTranscript(currentTranscript || 'Listening...');
                    currentTranscriptRef.current = trimmedTranscript;
                    
                    // Reset silence timer if we detect speech
                    if (trimmedTranscript && trimmedTranscript !== lastTranscriptRef.current.trim()) {
                        lastTranscriptRef.current = currentTranscript;
                        
                        // Clear existing timer
                        if (silenceTimerRef.current) {
                            clearTimeout(silenceTimerRef.current);
                        }
                        
                        // Start new silence timer (2.5 seconds of silence)
                        silenceTimerRef.current = setTimeout(() => {
                            console.log('Silence detected, auto-stopping recording');
                            stopRecording();
                        }, 2500);
                    }
                };

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    if (event.error !== 'no-speech') {
                        setError('Speech recognition error: ' + event.error);
                    }
                };

                recognition.onend = () => {
                    console.log('Speech recognition ended');
                };

                recognition.start();
                recognitionRef.current = recognition;
            } else {
                setLiveTranscript('Speak now...');
            }

            setIsRecording(true);
        } catch (err) {
            setError('Microphone access denied or not available');
            console.error('Recording error:', err);
        }
    };

    // Stop recording audio and send message
    const stopRecording = async () => {
        // Clear silence timer
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }
        
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        
        setIsRecording(false);
        
        // Use the ref value instead of state to get the most recent transcript
        const transcript = currentTranscriptRef.current;
        
        console.log('Stopping recording. Transcript:', transcript);
        
        if (!transcript || transcript === '') {
            setLiveTranscript('');
            console.log('No speech detected in transcript');
            // Don't show error, just restart recording after a short delay
            setTimeout(() => {
                if (isCallActive) {
                    console.log('Restarting recording after no speech...');
                    startRecording();
                }
            }, 1000);
            return;
        }

        // Only for audio call tab
        await sendVoiceMessage(transcript);
        setLiveTranscript('');
        currentTranscriptRef.current = '';
    };

    // Send voice message to backend (for audio call tab)
    const sendVoiceMessage = async (text: string) => {
        if (!conversationId) {
            setError('No active conversation');
            return;
        }

        setIsProcessingAudio(true);
        setError('');

        try {
            // Add user message to call messages
            const userMessage: Message = {
                id: generateMessageId(),
                sender: 'user',
                content: text,
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
            setCallMessages((prev) => [...prev, userMessage]);

            console.log('Sending message to API:', text);

            // Send to backend
            const response = await fetch(`https://ai-voice-agent-backend.octaloop.dev/conversations/${conversationId}/message?message=${encodeURIComponent(text)}`, {
                method: 'POST',
                headers: {
                    accept: 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();
            console.log('API Response:', data);
            
            const agentResponse = data?.response?.agent_response;
            const responseAudio = data?.response?.response_audio;

            if (agentResponse) {
                const agentMessage: Message = {
                    id: generateMessageId(),
                    sender: 'agent',
                    content: agentResponse,
                    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    audioBase64: responseAudio || undefined
                };
                setCallMessages((prev) => [...prev, agentMessage]);
                
                // Auto-play response audio and restart recording when done
                if (responseAudio) {
                    console.log('Playing response audio...');
                    setIsProcessingAudio(false); // Stop showing processing state
                    
                    try {
                        await playBase64Audio(responseAudio, () => {
                            console.log('Audio finished playing, starting new recording...');
                            // Automatically start recording again for next question
                            setTimeout(() => {
                                startRecording();
                            }, 500); // Small delay before starting new recording
                        });
                    } catch (err) {
                        console.error('Audio playback failed:', err);
                        setError('Audio playback failed');
                        // Still start recording even if audio fails
                        setTimeout(() => {
                            startRecording();
                        }, 500);
                    }
                } else {
                    console.log('No audio in response');
                    setIsProcessingAudio(false);
                    // If no audio, still start recording again
                    setTimeout(() => {
                        startRecording();
                    }, 500);
                }
            } else {
                setIsProcessingAudio(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to send message');
            setIsProcessingAudio(false);
        }
    };

    const handleClearChat = () => {
        setMessages([]);
        setCallMessages([]);
    };

    const handleStartCall = () => {
        setIsCallActive(true);
        setCallDuration(0);
        setCallMessages([]);
        setLiveTranscript('');
        
        // Play greeting audio from first message if available
        if (messages.length > 0 && messages[0].sender === 'agent' && messages[0].audioBase64) {
            // Add greeting to call messages
            setCallMessages([{
                id: generateMessageId(),
                sender: 'agent',
                content: messages[0].content,
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                audioBase64: messages[0].audioBase64
            }]);
            
            // Play greeting audio and start recording when done
            playBase64Audio(messages[0].audioBase64, () => {
                console.log('Greeting finished, starting recording...');
                setTimeout(() => {
                    startRecording();
                }, 500);
            }).catch(err => {
                console.error('Failed to play greeting:', err);
                // Still start recording even if greeting fails
                setTimeout(() => {
                    startRecording();
                }, 500);
            });
        } else {
            // No greeting, start recording immediately
            setTimeout(() => {
                startRecording();
            }, 500);
        }
    };

    const handleEndCall = () => {
        setIsCallActive(false);
        setCallDuration(0);
        setIsMuted(false);
        setLiveTranscript('');
        
        // Clear silence timer
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }
        
        // Stop any ongoing recording
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        
        // Stop any playing audio
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current = null;
        }
        
        setIsRecording(false);
    };

    const toggleMute = () => {
        const newMuteState = !isMuted;
        setIsMuted(newMuteState);
        
        // Mute/unmute current audio
        if (currentAudioRef.current) {
            currentAudioRef.current.muted = newMuteState;
        }
    };

    // Timer effect for call duration
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isCallActive) {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isCallActive]);

    // Format call duration as MM:SS
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleBack = () => {
        router.back();
    };

    const handleRetryConversation = () => {
        if (agentId) {
            startConversation(agentId);
        }
    };

    const isInitializingConversationRef = useRef(false);

    useEffect(() => {
        if (!agentId) {
            setError('Agent information is missing. Navigate here from the Agents list.');
            setConversationId('');
            setMessages([]);
            return;
        }

        if (isInitializingConversationRef.current) {
            return;
        }

        isInitializingConversationRef.current = true;

        startConversation(agentId).finally(() => {
            isInitializingConversationRef.current = false;
        });
    }, [agentId, startConversation]);

    useEffect(() => {
        setResolvedAgentName(agentName);
    }, [agentName]);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (currentAudioRef.current) {
                currentAudioRef.current.pause();
                currentAudioRef.current = null;
            }
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = null;
            }
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                recognitionRef.current = null;
            }
        };
    }, []);

    // Auto-scroll to latest message in chat
    useEffect(() => {
        if (activeTab === 'chat' && chatMessagesEndRef.current) {
            chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isSendingMessage, activeTab]);

    // Auto-scroll to latest message in call
    useEffect(() => {
        if (activeTab === 'call' && isCallActive && callMessagesEndRef.current) {
            callMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [callMessages, isProcessingAudio, isRecording, liveTranscript, activeTab, isCallActive]);

    return (
        <div className="h-screen bg-[#F9FAFB] flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-[#E5E7EB] px-5 py-6">
            <button
                onClick={handleBack}
                className="flex items-center gap-3 transition-colors"
            >
                <Image src="/svgs/back.svg" alt="Back" width={16} height={16} className='mb-1' />
                <span className="font-medium text-black">Test {agentDetails.name}</span>
            </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                <div className='flex-1 flex flex-col'>
                    <div className="bg-white border-b border-[#E5E7EB] px-5 py-3">
                        {/* Tab Navigation */}
                        <div className="flex items-center gap-4 shadow-card rounded-[10px] bg-white p-1 w-fit border border-[#EBEBEB]">
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={`px-8 py-2 rounded-[10px] font-medium transition-all w-56 cursor-pointer ${activeTab === 'chat'
                                    ? 'bg-[#007BFF1A] text-[#8266D4] border border-[#8266D4]'
                                    : 'bg-white text-[#6B7280] border border-white'
                                    }`}
                            >
                                Test Chat
                            </button>
                            <button
                                onClick={() => setActiveTab('call')}
                                className={`px-8 py-2 rounded-[10px] font-medium text-base transition-all w-56 cursor-pointer ${activeTab === 'call'
                                    ? 'bg-[#007BFF1A] text-[#8266D4] border border-[#8266D4]'
                                    : 'bg-white text-[#6B7280] border border-white'
                                    }`}
                            >
                                Test Audio
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-1 h-[80vh] overflow-auto'>
                        {
                            activeTab === 'chat' ? (
                                <div className='flex flex-col flex-1'>
                                    {/* Messages Area */}
                                    <div className="flex-1 overflow-y-auto px-8 py-6">
                                        {error && (
                                            <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                                                <span>{error}</span>
                                                {agentId && (
                                                    <button
                                                        onClick={handleRetryConversation}
                                                        className="rounded border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
                                                    >
                                                        Retry
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        {!error && isStartingConversation && (
                                            <div className="mb-4 text-sm text-[#717182] text-black">
                                                Initializing conversation...
                                            </div>
                                        )}
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
                                                        <p className="mb-3 leading-tight text-black">{message.content}</p>
                                                        <span className="text-xs opacity-70 block text-black">{message.timestamp}</span>
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
                                        {isSendingMessage && (
                                            <div className="flex gap-3 mb-6 justify-start">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                                    <Image
                                                        src="/dashboard/png/user-avatar.png"
                                                        alt="Agent Avatar"
                                                        width={40}
                                                        height={40}
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col items-start max-w-[40%]">
                                                    <div className="px-5 py-3 rounded-[10px] font-medium text-sm bg-[#FAF8F8] text-black opacity-70">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-[#8266D4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                            <div className="w-2 h-2 bg-[#8266D4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                            <div className="w-2 h-2 bg-[#8266D4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={chatMessagesEndRef} />
                                    </div>

                                    {/* Message Input */}
                                    <div className="px-4 py-6 border-t border-[#E5E7EB]">
                                        <div className="flex items-center gap-3">
                                            <Input
                                                placeholder={isSendingMessage ? "Sending message..." : "Type your message"}
                                                value={messageInput}
                                                onChange={(e) => !isSendingMessage && setMessageInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey && !isSendingMessage) {
                                                        e.preventDefault();
                                                        handleSendMessage();
                                                    }
                                                }}
                                                disabled={isSendingMessage}
                                                containerClassName='w-full'
                                                className={`py-4 ${isSendingMessage ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            />

                                            <button
                                                onClick={handleSendMessage}
                                                disabled={!messageInput.trim() || !conversationId || isSendingMessage}
                                                className="p-3 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Image src="/svgs/send.svg" alt="Send" width={24} height={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) :
                                (<div className="flex flex-1 flex-col">
                                    {!isCallActive ? (
                                        <div className="flex flex-1 flex-col items-center justify-center">
                                            {error && (
                                                <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                                                    <span>{error}</span>
                                                    {agentId && (
                                                        <button
                                                            onClick={handleRetryConversation}
                                                            className="rounded border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
                                                        >
                                                            Retry
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                            {/* <p className='text-sm text-[#717182] mb-4'>Ready to start call</p> */}
                                            <div className='w-9 h-9 rounded-full bg-gradient-to-b from-[#8266D4] to-[#41288A] flex items-center justify-center mb-4'>
                                                <Image
                                                    src="/svgs/bot.svg"
                                                    alt="Bot Illustration"
                                                    width={19}
                                                    height={19}
                                                />
                                            </div>
                                            <h2 className="text-lg mb-7 text-[#0A0A0A] text-black">Testing: {agentDetails.name}</h2>
                                            <button
                                                onClick={handleStartCall}
                                                disabled={!conversationId}
                                                className="w-3xs px-6 py-3 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-[10px] font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Image src="/svgs/phone3.svg" alt="Phone" width={24} height={24} className='inline-block mr-3' />
                                                Test Audio 
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Call Conversation Area */}
                                            <div className="flex-1 overflow-y-auto px-8 py-6">
                                                {error && (
                                                    <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                                                        <span>{error}</span>
                                                    </div>
                                                )}
                                                
                                                {/* Call Messages */}
                                                {callMessages.map((message) => (
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
                                                                <p className="mb-2 leading-tight text-black">{message.content}</p>
                                                                <span className="text-xs opacity-70 block text-black">{message.timestamp}</span>
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
                                                
                                                {/* Live Transcript */}
                                                {isRecording && liveTranscript && (
                                                    <div className="flex gap-3 mb-6 justify-end">
                                                        <div className="flex flex-col items-end max-w-[40%]">
                                                            <div className="px-5 py-3 rounded-[10px] font-medium text-sm bg-[#007BFF1A] border border-[#8266D4] opacity-50">
                                                                <p className="mb-2 leading-tight italic text-black">{liveTranscript}</p>
                                                                <span className="text-xs opacity-70 block text-black">Speaking...</span>
                                                            </div>
                                                        </div>
                                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                                            <Image
                                                                src="/dashboard/png/user-avatar.png"
                                                                alt="User"
                                                                width={40}
                                                                height={40}
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {isProcessingAudio && (
                                                    <div className="text-center text-sm text-[#717182] mb-4 text-black">
                                                        Processing your message...
                                                    </div>
                                                )}
                                                <div ref={callMessagesEndRef} />
                                            </div>

                                            {/* Call Controls Footer */}
                                            <div className="px-8 py-6 border-t border-[#E5E7EB] bg-white">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className='w-16 h-16 rounded-full bg-gradient-to-b from-[#8266D4] to-[#41288A] flex items-center justify-center'>
                                                        <Image
                                                            src="/svgs/bot.svg"
                                                            alt="Bot Illustration"
                                                            width={24}
                                                            height={24}
                                                        />
                                                    </div>
                                                    <div className="text-center">
                                                        <h2 className="text-base font-medium text-[#0A0A0A] mb-1 text-black">{agentDetails.name}</h2>
                                                        <p className="text-sm text-[#717182] text-black">{formatDuration(callDuration)}</p>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            disabled={true}
                                                            className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all ${
                                                                isRecording 
                                                                    ? 'bg-red-500 border-red-500 animate-pulse cursor-not-allowed' 
                                                                    : 'bg-white border-[#E5E7EB] cursor-not-allowed opacity-50'
                                                            }`}
                                                        >
                                                            <Image 
                                                                src={"/svgs/mic.svg"} 
                                                                alt="Microphone" 
                                                                width={22} 
                                                                height={22}
                                                                className={isRecording ? 'brightness-0 invert' : ''}
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={toggleMute}
                                                            className="w-14 h-14 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center hover:bg-gray-50 transition-all"
                                                        >
                                                            <Image 
                                                                src={isMuted ? "/svgs/speaker-mute.svg" : "/svgs/speaker.svg"} 
                                                                alt="Volume" 
                                                                width={22} 
                                                                height={22} 
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={handleEndCall}
                                                            className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-all"
                                                        >
                                                            <Image src="/svgs/abort-call.svg" alt="End Call" width={22} height={22} />
                                                        </button>
                                                    </div>
                                                    
                                                    <p className="text-xs text-[#717182] text-black">
                                                        {isRecording ? '🔴 Listening... (auto-send after silence)' : isProcessingAudio ? '⏳ Processing...' : '🎤 Speak to continue conversation'}
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>)
                        }

                    </div>


                </div>

                {/* Agent Details Panel */}
                <div className="w-[20%] max-w-[400px] overflow-auto bg-white p-6 border-l border-[#0000001A]">
                    <h2 className="text-lg font-medium mb-6 text-black">Agent Details</h2>

                    <div className="space-y-6">
                        {/* Status */}
                        <div>
                            <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Status</label>
                            <div className="w-full px-4 py-4 bg-[#EBEBEB] rounded-[10px] text-sm text-black">
                                {agentDetails.status}
                            </div>
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Type</label>
                            <div className="w-full px-4 py-4 bg-[#EBEBEB] rounded-[10px] text-sm text-black">
                                {agentDetails.type}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Description</label>
                            <div className="w-full px-4 py-4 bg-[#EBEBEB] rounded-[10px] text-sm break-words text-black">
                                {agentDetails.description}
                            </div>
                        </div>

                        {/* Last Updated */}
                        <div>
                            <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Last Updated</label>
                            <div className="w-full px-4 py-4 bg-[#EBEBEB] rounded-[10px] text-sm text-black">
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

export default function TestAgent() {
    return (
        <Suspense fallback={
            <div className="h-screen bg-[#F9FAFB] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#8266D4] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#717182] text-black">Loading agent...</p>
                </div>
            </div>
        }>
            <TestAgentContent />
        </Suspense>
    );
}