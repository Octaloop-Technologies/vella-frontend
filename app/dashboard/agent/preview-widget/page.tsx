"use client";

import React, { Suspense, useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/shared/Card';
import { useToast } from '@/contexts/ToastContext';

function WidgetPreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToast } = useToast();
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [selectedPosition, setSelectedPosition] = useState('bottom-right');
  const [selectedSize, setSelectedSize] = useState('medium');
  const [customColor, setCustomColor] = useState('#8266D4');
  const [showCode, setShowCode] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: `👋 Hi! I'm ${searchParams.get('name') || 'AI Assistant'}. How can I help you today?`, sender: 'agent' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get agent details from URL params
  const agentId = searchParams.get('id') || '';
  const agentName = searchParams.get('name') || 'AI Assistant';
  const agentType = searchParams.get('type') || '';
  const agentStatus = searchParams.get('status') || '';
  const agentDescription = searchParams.get('description') || '';

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user' as const
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentResponse = {
        id: Date.now() + 1,
        text: `I received your message: "${inputValue}". This is a preview of how your widget will work on external websites!`,
        sender: 'agent' as const
      };
      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Widget configurations
  const themes = [
    { id: 'light', name: 'Light', preview: '#FFFFFF' },
    { id: 'dark', name: 'Dark', preview: '#1F2937' },
    { id: 'custom', name: 'Custom', preview: customColor }
  ];

  const positions = [
    { id: 'bottom-right', name: 'Bottom Right', class: 'bottom-6 right-6' },
    { id: 'bottom-left', name: 'Bottom Left', class: 'bottom-6 left-6' },
    { id: 'top-right', name: 'Top Right', class: 'top-6 right-6' },
    { id: 'top-left', name: 'Top Left', class: 'top-6 left-6' }
  ];

  const sizes = [
    { id: 'small', name: 'Small', width: '320px', height: '400px' },
    { id: 'medium', name: 'Medium', width: '380px', height: '500px' },
    { id: 'large', name: 'Large', width: '450px', height: '600px' }
  ];

  const currentPosition = positions.find(p => p.id === selectedPosition);
  const currentSize = sizes.find(s => s.id === selectedSize);

  // Generate embed code
  const embedCode = `<!-- Vella AI Widget -->
<script>
  (function() {
    const vellaConfig = {
      agentId: '${agentId}',
      theme: '${selectedTheme}',
      position: '${selectedPosition}',
      size: '${selectedSize}',
      primaryColor: '${customColor}',
      title: '${agentName}'
    };
    
    // Widget loader script - now served from your Next.js app
    const script = document.createElement('script');
    script.src = '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/widget/script';
    script.onload = function() {
      window.VellaWidget.init(vellaConfig);
    };
    document.head.appendChild(script);
  })();
</script>

<!-- Alternative: Self-hosted with dynamic config -->
<script>
  (function() {
    // Fetch agent configuration first
    fetch('${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/widget/config/${agentId}')
      .then(response => response.json())
      .then(agentConfig => {
        const vellaConfig = {
          agentId: '${agentId}',
          title: agentConfig.name || '${agentName}',
          theme: '${selectedTheme}',
          position: '${selectedPosition}',
          size: '${selectedSize}',
          primaryColor: '${customColor}'
        };
        
        const script = document.createElement('script');
        script.src = '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/widget/script';
        script.onload = () => window.VellaWidget.init(vellaConfig);
        document.head.appendChild(script);
      })
      .catch(error => {
        console.error('Failed to load widget config:', error);
      });
  })();
</script>`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast({ message: 'Code copied to clipboard!', type: 'success' });
    } catch (err) {
      addToast({ message: 'Failed to copy code', type: 'error' });
    }
  };

  const testWidget = () => {
    // Create a test HTML page with the widget
    const testHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Widget Test - ${agentName}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 10px;
            margin-bottom: 2rem;
        }
        .content {
            background: #f9f9f9;
            padding: 2rem;
            border-radius: 10px;
            margin-bottom: 2rem;
        }
        .footer {
            text-align: center;
            color: #666;
            padding: 1rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Widget Test for ${agentName}</h1>
        <p>This is a live test of your AI widget. Click the chat button in the bottom-right corner!</p>
    </div>

    <div class="content">
        <h2>Widget Status</h2>
        <p id="status">Loading widget...</p>
        
        <h3>Test Instructions:</h3>
        <ul>
            <li>✅ Look for the chat button in the bottom-${selectedPosition.includes('right') ? 'right' : 'left'} corner</li>
            <li>✅ Click the button to open the chat widget</li>
            <li>✅ Try sending a message</li>
            <li>✅ Test the close button</li>
        </ul>

        <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
            <strong>Agent Details:</strong><br>
            ID: ${agentId}<br>
            Name: ${agentName}<br>
            Type: ${agentType}<br>
            Status: ${agentStatus}
        </div>
    </div>

    <div class="footer">
        <p>Powered by Vella AI Widget System</p>
    </div>

    <!-- Vella AI Widget -->
    <script>
        (function() {
            console.log('🚀 Starting widget initialization...');
            
            const vellaConfig = {
                agentId: '${agentId}',
                theme: '${selectedTheme}',
                position: '${selectedPosition}',
                size: '${selectedSize}',
                primaryColor: '${customColor}',
                title: '${agentName}'
            };
            
            console.log('📝 Widget config:', vellaConfig);
            
            // Update status
            document.getElementById('status').textContent = 'Loading widget script...';
            
            // Widget loader script
            const script = document.createElement('script');
            script.src = '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/widget/script';
            
            script.onload = function() {
                console.log('✅ Widget script loaded successfully');
                document.getElementById('status').textContent = 'Widget script loaded, initializing...';
                
                if (window.VellaWidget) {
                    console.log('🎯 Initializing widget...');
                    window.VellaWidget.init(vellaConfig);
                    document.getElementById('status').innerHTML = '✅ <strong style="color: green;">Widget loaded successfully!</strong> Look for the chat button.';
                    console.log('🎉 Widget initialized!');
                } else {
                    console.error('❌ VellaWidget not found on window');
                    document.getElementById('status').innerHTML = '❌ <strong style="color: red;">Widget failed to initialize</strong>';
                }
            };
            
            script.onerror = function(error) {
                console.error('❌ Failed to load widget script:', error);
                document.getElementById('status').innerHTML = '❌ <strong style="color: red;">Failed to load widget script</strong><br>Make sure your Next.js app is running on localhost:3000';
            };
            
            console.log('📤 Loading widget script from:', script.src);
            document.head.appendChild(script);
        })();
    </script>
</body>
</html>`;

    // Open test page in a new window
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(testHtml);
      newWindow.document.close();
      addToast({ message: 'Widget test page opened in new window', type: 'success' });
    } else {
      addToast({ message: 'Please allow popups to test the widget', type: 'error' });
    }
  };

  const downloadCode = () => {
    const blob = new Blob([embedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vella-widget-${agentName.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast({ message: 'Widget code downloaded!', type: 'success' });
  };

  if (!agentId) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">No Agent Selected</h2>
            <p className="text-gray-600 mb-6">Please select an agent from the agent list to preview its widget.</p>
            <button
              onClick={() => router.push('/dashboard/agent')}
              className="px-6 py-3 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Go to Agent List
            </button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Widget Preview</h1>
              <p className="text-gray-600 mt-2">Preview and customize your widget for {agentName}</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/agent')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Agents
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Agent Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Agent Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <p className="text-gray-600">{agentName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <p className="text-gray-600 capitalize">{agentType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    agentStatus === 'active' ? 'bg-green-100 text-green-800' :
                    agentStatus === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {agentStatus} 
                  </span>
                </div>
              </div>
            </Card>

            {/* Theme Selection */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Theme</h3>
              <div className="space-y-3">
                {themes.map(theme => (
                  <label key={theme.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value={theme.id}
                      checked={selectedTheme === theme.id}
                      onChange={(e) => setSelectedTheme(e.target.value)}
                      className="text-brand-primary"
                    />
                    <div 
                      className="w-6 h-6 rounded border-2"
                      style={{ backgroundColor: theme.preview }}
                    />
                    <span>{theme.name}</span>
                  </label>
                ))}
                {selectedTheme === 'custom' && (
                  <div className="ml-9">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-16 h-8 rounded border"
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Position Selection */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Position</h3>
              <div className="grid grid-cols-2 gap-3">
                {positions.map(position => (
                  <label key={position.id} className="flex items-center space-x-2 cursor-pointer p-2 border rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name="position"
                      value={position.id}
                      checked={selectedPosition === position.id}
                      onChange={(e) => setSelectedPosition(e.target.value)}
                      className="text-brand-primary"
                    />
                    <span className="text-sm">{position.name}</span>
                  </label>
                ))}
              </div>
            </Card>

            {/* Size Selection */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Size</h3>
              <div className="space-y-3">
                {sizes.map(size => (
                  <label key={size.id} className="flex items-center justify-between cursor-pointer p-2 border rounded hover:bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="size"
                        value={size.id}
                        checked={selectedSize === size.id}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="text-brand-primary"
                      />
                      <span className="text-sm font-medium">{size.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{size.width} × {size.height}</span>
                  </label>
                ))}
              </div>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <Card className="p-6 h-[800px] relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Live Preview</h3>
                <div className="flex gap-2">
                  <button
                    onClick={testWidget}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    🚀 Test Widget
                  </button>
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {showCode ? 'Hide Code' : 'Show Code'}
                  </button>
                  <button
                    onClick={() => setIsWidgetOpen(!isWidgetOpen)}
                    className="px-4 py-2 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg hover:opacity-90"
                  >
                    {isWidgetOpen ? 'Close Widget' : 'Open Widget'}
                  </button>
                </div>
              </div>

              {showCode ? (
                <div className="h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Embed Code</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(embedCode)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Copy
                      </button>
                      <button
                        onClick={downloadCode}
                        className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto h-[calc(100%-60px)] font-mono">
                    {embedCode}
                  </pre>
                </div>
              ) : (
                <div className="relative h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden">
                  {/* Simulated website background */}
                  <div className="p-8">
                    <div className="max-w-4xl mx-auto">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Website</h2>
                      <p className="text-gray-600 mb-6">This is how the widget will appear on your website. Visitors can click the chat button to start a conversation with your AI agent.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                          <h3 className="font-semibold mb-2">Feature 1</h3>
                          <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                          <h3 className="font-semibold mb-2">Feature 2</h3>
                          <p className="text-gray-600 text-sm">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Widget Trigger Button */}
                  <button
                    onClick={() => setIsWidgetOpen(!isWidgetOpen)}
                    className={`fixed ${currentPosition?.class} w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:scale-105 transition-transform z-20`}
                    style={{ backgroundColor: customColor }}
                  >
                    {isWidgetOpen ? '✕' : '💬'}
                  </button>

                  {/* Widget Panel */}
                  {isWidgetOpen && (
                    <div
                      ref={widgetRef}
                      className={`fixed ${currentPosition?.class} bg-white rounded-lg shadow-2xl border border-gray-200 z-10 transition-all duration-300`}
                      style={{ 
                        width: currentSize?.width, 
                        height: currentSize?.height,
                        marginRight: selectedPosition.includes('right') ? '80px' : 'auto',
                        marginLeft: selectedPosition.includes('left') ? '80px' : 'auto',
                        marginBottom: selectedPosition.includes('bottom') ? '80px' : 'auto',
                        marginTop: selectedPosition.includes('top') ? '80px' : 'auto'
                      }}
                    >
                      {/* Widget Header */}
                      <div 
                        className="p-4 border-b flex items-center justify-between text-white rounded-t-lg"
                        style={{ backgroundColor: customColor }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <span className="text-sm">🤖</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{agentName}</h4>
                            <p className="text-xs opacity-90">Online now</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsWidgetOpen(false)}
                          className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Widget Body */}
                      <div className="p-4 h-full overflow-y-auto" style={{ height: 'calc(100% - 140px)' }}>
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`p-3 rounded-lg ${
                                message.sender === 'agent'
                                  ? 'bg-gray-100 mr-8'
                                  : 'bg-blue-500 text-white ml-8'
                              }`}
                              style={message.sender === 'user' ? { backgroundColor: customColor } : {}}
                            >
                              <p className="text-sm">{message.text}</p>
                            </div>
                          ))}
                          {isTyping && (
                            <div className="bg-gray-100 p-3 rounded-lg mr-8">
                              <p className="text-sm italic text-gray-600">Typing...</p>
                            </div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      </div>

                      {/* Widget Footer */}
                      <div className="p-3 border-t">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Type your message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                            style={{ '--focus-ring-color': customColor } as React.CSSProperties}
                          />
                          <button 
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                            className="px-4 py-2 text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
                            style={{ backgroundColor: customColor }}
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function WidgetPreviewPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
            <p>Loading widget preview...</p>
          </div>
        </div>
      </DashboardLayout>
    }>
      <WidgetPreviewContent />
    </Suspense>
  );
}