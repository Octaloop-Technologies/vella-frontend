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
    
    const [isCallActive, setIsCallActive] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [resolvedAgentName, setResolvedAgentName] = useState(agentName);
    const [conversationId, setConversationId] = useState('');
    const conversationIdRef = useRef('');

    useEffect(() => {
        conversationIdRef.current = conversationId;
    }, [conversationId]);

    const [isStartingConversation, setIsStartingConversation] = useState(false);
    const [error, setError] = useState('');
    const [greetingMessage, setGreetingMessage] = useState<Message | null>(null);
    
    // Audio recording state
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessingAudio, setIsProcessingAudio] = useState(false);
    const [liveTranscript, setLiveTranscript] = useState('');
    const [callMessages, setCallMessages] = useState<Message[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const currentAudioRef = useRef<HTMLAudioElement | null>(null);
    const recognitionRef = useRef<any>(null);
    const callMessagesEndRef = useRef<HTMLDivElement | null>(null);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastTranscriptRef = useRef<string>('');
    const currentTranscriptRef = useRef<string>(''); // Store current transcript for immediate access
    
    // WebSocket and Audio Context refs
    const wsRef = useRef<WebSocket | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const audioQueueRef = useRef<string[]>([]);
    const isPlayingQueueRef = useRef(false);
    const nextStartTimeRef = useRef(0);
    const isAudioStreamCompleteRef = useRef(false);

    const agentDetails = {
        name: resolvedAgentName,
        status: agentStatus,
        type: agentType,
        description: agentDescription,
        lastUpdated: '2 minutes ago'
    };

    const generateMessageId = () => {
        if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
            return crypto.randomUUID();
        }
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    };

    // Audio playback queue processing
    const processAudioQueue = useCallback(() => {
        if (audioQueueRef.current.length === 0) {
            
            // If stream is complete and queue is empty, we're done speaking
            if (isAudioStreamCompleteRef.current) {
                // Calculate remaining time to play
                let waitTime = 0;
                if (audioContextRef.current) {
                    waitTime = (nextStartTimeRef.current - audioContextRef.current.currentTime) * 1000;
                }
                
                // Ensure we don't wait if it's already done or invalid
                if (waitTime < 0) waitTime = 0;
                
                console.log(`Queue empty, stream complete. Waiting ${waitTime}ms for audio to finish.`);
                
                setTimeout(() => {
                    isPlayingQueueRef.current = false; // Now we are truly done
                    setIsProcessingAudio(false);
                    if (isCallActiveRef.current) {
                        startRecording();
                    }
                }, waitTime + 500); // 500ms buffer
            } else {
                // Queue empty but stream not complete (buffering?)
                isPlayingQueueRef.current = false; 
            }
            return;
        }

        // Ensure we are not recording when we start playing
        // We check recognitionRef directly as isRecording state might be stale in this callback
        if (recognitionRef.current) {
            console.log('Stopping recording because audio playback is starting');
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = null;
            }
            try {
                recognitionRef.current.stop();
            } catch (e) {
                // Ignore errors
            }
            recognitionRef.current = null;
            setIsRecording(false);
            setLiveTranscript('');
            currentTranscriptRef.current = '';
        }

        isPlayingQueueRef.current = true;
        const base64Audio = audioQueueRef.current.shift();

        if (!base64Audio) {
            processAudioQueue();
            return;
        }

        // Initialize AudioContext if needed
        if (!audioContextRef.current) {
            try {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                nextStartTimeRef.current = audioContextRef.current.currentTime;
                
                // Create GainNode for volume control
                gainNodeRef.current = audioContextRef.current.createGain();
                gainNodeRef.current.connect(audioContextRef.current.destination);
                // Set initial mute state - we can't access isMuted state directly here reliably if it changes, 
                // but we can check the ref if we had one, or just default to 1 and let toggleMute handle it.
                // However, since we are inside the component, we can access isMuted.
                // But processAudioQueue is memoized with [isCallActive].
                // If isMuted changes, this callback isn't recreated, so it sees old isMuted?
                // No, isMuted is state.
                // To be safe, let's just set it to 1. The toggleMute will update it.
                // Or better, add isMuted to dependency array? No, that would recreate the function too often.
                gainNodeRef.current.gain.value = 1; 
                
            } catch (e) {
                console.error('Web Audio API not supported', e);
                return;
            }
        }

        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }

        try {
            const binaryString = atob(base64Audio);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            audioContextRef.current.decodeAudioData(bytes.buffer, (buffer) => {
                if (!audioContextRef.current) return;

                const source = audioContextRef.current.createBufferSource();
                source.buffer = buffer;
                
                // Connect to GainNode if available, otherwise destination
                if (gainNodeRef.current) {
                    source.connect(gainNodeRef.current);
                } else {
                    source.connect(audioContextRef.current.destination);
                }

                const currentTime = audioContextRef.current.currentTime;
                if (nextStartTimeRef.current < currentTime) {
                    nextStartTimeRef.current = currentTime;
                }

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;

                // Process next chunk immediately
                processAudioQueue();

            }, (error) => {
                console.error('Error decoding audio', error);
                processAudioQueue();
            });
        } catch (e) {
            console.error('Error processing audio chunk', e);
            processAudioQueue();
        }
    }, [isCallActive]); // Added dependency, though startRecording is used inside

    // WebSocket connection logic
    const connectWebSocket = useCallback((targetAgentId: string) => {
        if (wsRef.current) {
            wsRef.current.close();
        }

        const wsUrl = `wss://ai-voice-agent-backend.octaloop.dev/ws/conversation/${targetAgentId}`;
        console.log('Connecting to WebSocket:', wsUrl);
        
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('WebSocket connected');
            ws.send(JSON.stringify({
                type: 'start_conversation',
                agent_id: targetAgentId,
                channel: 'phone'
            }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('WebSocket message:', data.type);

                // Capture conversation_id from any message if present
                if (data.conversation_id) {
                    if (conversationIdRef.current !== data.conversation_id) {
                        console.log('Received conversation_id:', data.conversation_id);
                        setConversationId(data.conversation_id);
                        conversationIdRef.current = data.conversation_id;
                    }
                }

                switch (data.type) {
                    case 'conversation_started':
                        // conversation_id is handled above
                        if (data.greeting) {
                            const greeting: Message = {
                                id: generateMessageId(),
                                sender: 'agent',
                                content: data.greeting,
                                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                            };
                            setCallMessages(prev => [...prev, greeting]);
                        }
                        break;

                    case 'greeting':
                        // Handle greeting message - ensure we capture the text from various possible fields
                        const greetingText = data.text || data.content || data.message || data.greeting;
                        if (greetingText) {
                            const greeting: Message = {
                                id: generateMessageId(),
                                sender: 'agent',
                                content: greetingText,
                                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                            };
                            setCallMessages(prev => [...prev, greeting]);
                        }
                        // Set processing true so we don't auto-start recording while greeting plays
                        setIsProcessingAudio(true);
                        break;

                    case 'audio_start':
                        setIsProcessingAudio(true);
                        break;

                    case 'response_start':
                        setIsProcessingAudio(true);
                        audioQueueRef.current = [];
                        isAudioStreamCompleteRef.current = false;
                        nextStartTimeRef.current = 0;
                        
                        // Stop any existing audio playback
                        if (audioContextRef.current) {
                            try {
                                audioContextRef.current.close();
                                audioContextRef.current = null;
                            } catch (e) {
                                console.error('Error closing audio context:', e);
                            }
                        }
                        
                        // Add placeholder message for streaming response
                        const placeholderMsg: Message = {
                            id: 'streaming-response',
                            sender: 'agent',
                            content: '...',
                            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                        };
                        setCallMessages(prev => [...prev, placeholderMsg]);
                        break;

                    case 'response_chunk':
                        setCallMessages(prev => {
                            const newMessages = [...prev];
                            const lastMsgIndex = newMessages.length - 1;
                            if (lastMsgIndex >= 0 && newMessages[lastMsgIndex].id === 'streaming-response') {
                                const updatedMsg = { ...newMessages[lastMsgIndex] };
                                updatedMsg.content = (updatedMsg.content === '...' ? '' : updatedMsg.content) + data.content;
                                newMessages[lastMsgIndex] = updatedMsg;
                            }
                            return newMessages;
                        });
                        break;

                    case 'response_complete':
                        setCallMessages(prev => {
                            const newMessages = [...prev];
                            const lastMsg = newMessages[newMessages.length - 1];
                            if (lastMsg && lastMsg.id === 'streaming-response') {
                                lastMsg.id = generateMessageId(); // Finalize ID
                                lastMsg.content = data.full_response;
                            }
                            return newMessages;
                        });
                        break;

                    case 'audio_chunk':
                        if (data.audio) {
                            audioQueueRef.current.push(data.audio);
                            if (!isPlayingQueueRef.current) {
                                processAudioQueue();
                            }
                        }
                        break;

                    case 'audio_complete':
                        isAudioStreamCompleteRef.current = true;
                        // If queue was empty, trigger completion logic immediately
                        if (audioQueueRef.current.length === 0 && !isPlayingQueueRef.current) {
                             setIsProcessingAudio(false);
                             setTimeout(() => {
                                if (isCallActiveRef.current) {
                                    startRecording();
                                }
                            }, 500);
                        }
                        break;
                        
                    case 'error':
                        console.error('WebSocket error message:', data.message);
                        setError(data.message || 'An error occurred');
                        setIsProcessingAudio(false);
                        break;
                }
            } catch (err) {
                console.error('Error parsing WebSocket message:', err);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setError('Connection error');
        };

        ws.onclose = () => {
            console.log('WebSocket closed');
        };

    }, [isCallActive]); // Added dependency

    const startConversation = useCallback(async (targetAgentId: string) => {
        if (!targetAgentId) {
            setError('Agent information is missing. Navigate here from the Agents list.');
            return;
        }

        setIsStartingConversation(true);
        setError('');
        setConversationId('');
        setGreetingMessage(null);
        
        // We don't start WebSocket here anymore, we start it when call starts
        // But we can fetch initial details if needed via REST, or just rely on WS
        // For consistency with previous logic, let's just set ready state
        setIsStartingConversation(false);
        
    }, []);



    // Start recording audio with live transcription
    const startRecording = async () => {
        // Don't start recording if we are playing audio or processing
        if (isPlayingQueueRef.current || isProcessingAudio) {
            console.log('Cannot start recording: Audio is playing or processing');
            return;
        }

        try {
            // Stop any existing recognition first
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {
                    // Ignore error on stop
                }
                recognitionRef.current = null;
            }

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
                    // Ignore 'aborted' error as it happens when we stop manually or switch state
                    if (event.error === 'aborted') {
                        console.log('Speech recognition aborted (intentional)');
                        return;
                    }
                    
                    console.error('Speech recognition error:', event.error);
                    if (event.error !== 'no-speech') {
                        setError('Speech recognition error: ' + event.error);
                    }
                };

                recognition.onend = () => {
                    console.log('Speech recognition ended');
                    // If we are still recording (state says so) but recognition ended, 
                    // it might be due to silence or error. 
                    // If it was intentional stop, isRecording would be false.
                    // We don't auto-restart here to avoid loops, unless we implement robust logic.
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
                if (isCallActiveRef.current) {
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
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            setError('Connection lost. Reconnecting...');
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

            console.log('Sending message via WebSocket:', text);

            wsRef.current.send(JSON.stringify({
                type: 'message',
                message: text,
                conversation_id: conversationIdRef.current
            }));
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to send message');
            setIsProcessingAudio(false);
        }
    };

    const handleClearChat = () => {
        setCallMessages([]);
    };

    const handleStartCall = () => {
        setIsCallActive(true);
        setCallDuration(0);
        setCallMessages([]);
        setLiveTranscript('');
        
        connectWebSocket(agentId);
        
        // Fallback: if no audio received within 5 seconds, start recording
        // This handles cases where there's no greeting audio
        setTimeout(() => {
            // Check if we are playing audio or have audio in queue
            // Also check if we are already recording or processing
            if (!isPlayingQueueRef.current && audioQueueRef.current.length === 0 && !isRecording && !isProcessingAudio) {
                console.log('No greeting audio detected, starting recording...');
                startRecording();
            }
        }, 5000);
    };

    const handleEndCall = () => {
        setIsCallActive(false);
        setCallDuration(0);
        setIsMuted(false);
        setLiveTranscript('');
        
        // Close WebSocket
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        
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
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        
        setIsRecording(false);
        setIsProcessingAudio(false);
    };

    const toggleMute = () => {
        const newMuteState = !isMuted;
        setIsMuted(newMuteState);
        
        // Mute/unmute Web Audio API
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = newMuteState ? 0 : 1;
        }
        
        // Mute/unmute legacy audio (if any)
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

    // Auto-scroll to latest message in call
    useEffect(() => {
        if (isCallActive && callMessagesEndRef.current) {
            callMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [callMessages, isProcessingAudio, isRecording, liveTranscript, isCallActive]);

    const isCallActiveRef = useRef(false);

    useEffect(() => {
        isCallActiveRef.current = isCallActive;
    }, [isCallActive]);

    const renderMessageContent = (content: string) => {
        if (!content) return null;
        return content.split('\n').map((line, i) => {
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <div key={i} className={`${line.trim().startsWith('-') ? 'pl-4' : ''} min-h-[1.5em]`}>
                    {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j}>{part.slice(2, -2)}</strong>;
                        }
                        return <span key={j}>{part}</span>;
                    })}
                </div>
            );
        });
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
                <span className="font-medium text-black">Test {agentDetails.name}</span>
            </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                <div className='flex-1 flex flex-col'>
                    <div className='flex flex-1 h-[80vh] overflow-auto'>
                        <div className="flex flex-1 flex-col">
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
                                            <h2 className="text-lg mb-7 text-black">Testing: {agentDetails.name}</h2>
                                            <button
                                                onClick={handleStartCall}
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

                                                        <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                                            <div
                                                                className={`px-5 py-3 rounded-[10px] font-medium text-sm opacity-70 ${message.sender === 'user'
                                                                    ? 'bg-[#007BFF1A] border border-[#8266D4]'
                                                                    : 'bg-[#FAF8F8] text-black'
                                                                    }`}
                                                            >
                                                                <div className="mb-2 leading-relaxed text-black text-left">
                                                                    {renderMessageContent(message.content)}
                                                                </div>
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
                                                        <div className="flex flex-col items-end max-w-[75%]">
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
                                                    <div className="text-center text-sm mb-4 text-black">
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
                                                        <h2 className="text-base font-medium mb-1 text-black">{agentDetails.name}</h2>
                                                        <p className="text-sm text-black">{formatDuration(callDuration)}</p>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-4">
                                                        {/* <button
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
                                                        </button> */}
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
                                                    
                                                    <p className="text-xs text-black">
                                                        {isRecording ? '🔴 Listening... (auto-send after silence)' : isProcessingAudio ? '⏳ Processing...' : '🎤 Speak to continue conversation'}
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
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
                    <p className="text-black">Loading agent...</p>
                </div>
            </div>
        }>
            <TestAgentContent />
        </Suspense>
    );
}