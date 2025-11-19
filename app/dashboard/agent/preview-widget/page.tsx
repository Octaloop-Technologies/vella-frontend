"use client";

import React, { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Card from "@/components/shared/Card";
import { useToast } from "@/contexts/ToastContext";

function WidgetPreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToast } = useToast();
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("bottom-right");
  const [selectedSize, setSelectedSize] = useState("medium");
  const [customColor, setCustomColor] = useState("#8266D4");
  const [showCode, setShowCode] = useState(false);
  const [embedType, setEmbedType] = useState<"iframe" | "script">("iframe");
  const [selectedWidgetType, setSelectedWidgetType] = useState<
    "chat" | "voice"
  >("chat");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `👋 Hi! I'm ${
        searchParams.get("name") || "AI Assistant"
      }. How can I help you today?`,
      sender: "agent",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get agent details from URL params
  const agentId = searchParams.get("id") || "";
  const agentName = searchParams.get("name") || "AI Assistant";
  const agentType = searchParams.get("type") || "";
  const agentStatus = searchParams.get("status") || "";
  const agentDescription = searchParams.get("description") || "";
  const channelType = searchParams.get("channelType") || "";

  // Check if it's omnichannel
  const isOmnichannel = channelType === "omnichannel";

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user" as const,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentResponse = {
        id: Date.now() + 1,
        text: `I received your message: "${inputValue}". This is a preview of how your widget will work on external websites!`,
        sender: "agent" as const,
      };
      setMessages((prev) => [...prev, agentResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Widget configurations
  const positions = [
    { id: "bottom-right", name: "Bottom Right", class: "bottom-6 right-6" },
    { id: "bottom-left", name: "Bottom Left", class: "bottom-6 left-6" },
    { id: "top-right", name: "Top Right", class: "top-6 right-6" },
    { id: "top-left", name: "Top Left", class: "top-6 left-6" },
  ];

  const sizes = [
    { id: "small", name: "Small", width: "320px", height: "400px" },
    { id: "medium", name: "Medium", width: "380px", height: "500px" },
    { id: "large", name: "Large", width: "450px", height: "600px" },
  ];

  const currentPosition = positions.find((p) => p.id === selectedPosition);
  const currentSize = sizes.find((s) => s.id === selectedSize);

  // Determine widget type for embed
  const embedWidgetType =
    channelType === "phone"
      ? "voice"
      : isOmnichannel
      ? selectedWidgetType
      : "chat";

  // Voice widget uses iframe, chat uses script
  const isVoiceWidget = embedWidgetType === "voice";

  // Generate iframe embed code (for voice widget)
  const iframeEmbedCode = `<!-- Vella AI Widget - iframe Embed -->
<iframe
  src="${
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }/widget/voice/${agentId}?size=${selectedSize}&color=${encodeURIComponent(
    customColor
  )}"
  style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: ${
    currentSize?.width
  }; height: ${
    currentSize?.height
  }; border: none; border-radius: 12px; z-index: 9999;"
  title="${agentName} - Vella AI Widget"
  allow="microphone"
></iframe>`;

  // Generate script embed code (for chat widget)
  const scriptEmbedCode = `<!-- Vella AI Widget - Script Embed -->
<script>
  (function() {
    // Fetch agent configuration first
    fetch('${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/widget/config/${agentId}')
      .then(response => response.json())
      .then(agentConfig => {
        const vellaConfig = {
          agentId: '${agentId}',
          title: agentConfig.name || '${agentName}',
          widgetType: 'chat',
          position: '${selectedPosition}',
          size: '${selectedSize}',
          primaryColor: '${customColor}'
        };
        
        const script = document.createElement('script');
        script.src = '${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/api/widget/script';
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
      addToast({ message: "Code copied to clipboard!", type: "success" });
    } catch (err) {
      addToast({ message: "Failed to copy code", type: "error" });
    }
  };

  const testWidget = () => {
    if (isVoiceWidget) {
      // Voice Widget - iframe only, centered on screen
      const iframeUrl = `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/widget/voice/${agentId}?size=${selectedSize}&color=${encodeURIComponent(
        customColor
      )}`;

      const testHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Voice Widget Test - ${agentName}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>
</head>
<body>
    <!-- Vella AI Voice Widget - iframe Embed (Centered) -->
    <iframe
        src="${iframeUrl}"
        style="width: ${currentSize?.width}; height: ${
        currentSize?.height
      }; border: none; border-radius: 12px;"
        title="${agentName} - Vella AI Voice Widget"
        allow="microphone"
    ></iframe>
</body>
</html>`;

      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(testHtml);
        newWindow.document.close();
        addToast({
          message: "Voice widget test page opened",
          type: "success",
        });
      } else {
        addToast({
          message: "Please allow popups to test the widget",
          type: "error",
        });
      }
    } else {
      // Chat Widget - script embed
      const testHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat Widget Test - ${agentName}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .header {
            background: rgba(255,255,255,0.95);
            color: #333;
            padding: 2rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .content {
            background: rgba(255,255,255,0.95);
            padding: 2rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .success {
            background: #d4edda;
            color: #155724;
            padding: 12px;
            border-radius: 8px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Vella AI Chat Widget Test</h1>
        <p>Testing widget for: <strong>${agentName}</strong></p>
    </div>

    <div class="content">
        <h2>Widget Status</h2>
        <div class="success">
            ✅ <strong>Widget loaded successfully!</strong>
        </div>
        
        <h3>Test Instructions:</h3>
        <ul>
            <li>✅ Look for the chat button in the bottom-${
              selectedPosition.includes("right") ? "right" : "left"
            } corner</li>
            <li>✅ Click the button to open the chat widget</li>
            <li>✅ Try sending a message to test the conversation</li>
            <li>✅ The widget integrates directly with the page using script</li>
        </ul>
    </div>

    <!-- Vella AI Chat Widget - Script Embed -->
    <script>
        (function() {
            console.log('🚀 Starting widget initialization...');
            
            const vellaConfig = {
                agentId: '${agentId}',
                widgetType: 'chat',
                position: '${selectedPosition}',
                size: '${selectedSize}',
                primaryColor: '${customColor}',
                title: '${agentName}'
            };
            
            console.log('📝 Widget config:', JSON.stringify(vellaConfig));
            
            // Widget loader script
            const script = document.createElement('script');
            script.src = '${
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            }/api/widget/script?t=' + Date.now();
            
            script.onload = function() {
                console.log('✅ Widget script loaded successfully');
                
                if (window.VellaWidget) {
                    console.log('🎯 Initializing widget...');
                    try {
                        window.VellaWidget.init(vellaConfig);
                        console.log('🎉 Widget initialized!');
                    } catch (error) {
                        console.error('❌ Widget initialization failed:', error);
                    }
                } else {
                    console.error('❌ VellaWidget not found on window');
                }
            };
            
            script.onerror = function(error) {
                console.error('❌ Failed to load widget script:', error);
            };
            
            console.log('📤 Loading widget script from:', script.src);
            document.head.appendChild(script);
        })();
    </script>
</body>
</html>`;

      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(testHtml);
        newWindow.document.close();
        addToast({
          message: "Chat widget test page opened",
          type: "success",
        });
      } else {
        addToast({
          message: "Please allow popups to test the widget",
          type: "error",
        });
      }
    }
  };

  const downloadCode = () => {
    if (isVoiceWidget) {
      // Voice Widget - iframe embed
      const iframeUrl = `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/widget/voice/${agentId}?size=${selectedSize}&color=${encodeURIComponent(
        customColor
      )}`;

      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${agentName} - Voice Widget</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>
</head>
<body>
    <!-- Vella AI Voice Widget - iframe Embed (Centered) -->
    <iframe
        src="${iframeUrl}"
        style="width: ${currentSize?.width}; height: ${
        currentSize?.height
      }; border: none; border-radius: 12px;"
        title="${agentName} - Vella AI Voice Widget"
        allow="microphone"
    ></iframe>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vella-voice-widget-${agentId}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast({
        message: "Voice widget code downloaded (iframe embed)",
        type: "success",
      });
    } else {
      // Chat Widget - script embed
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${agentName} - Chat Widget</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        h1 {
            color: #333;
        }
        .info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>Welcome to ${agentName}</h1>
    <div class="info">
        <p>This page includes the Vella AI Chat Widget. Look for the chat button in the bottom-${
          selectedPosition.includes("right") ? "right" : "left"
        } corner!</p>
    </div>

    <!-- Vella AI Chat Widget - Script Embed -->
    <script>
        (function() {
            const vellaConfig = {
                agentId: '${agentId}',
                widgetType: 'chat',
                position: '${selectedPosition}',
                size: '${selectedSize}',
                primaryColor: '${customColor}',
                title: '${agentName}'
            };
            
            const script = document.createElement('script');
            script.src = '${
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            }/api/widget/script?t=' + Date.now();
            
            script.onload = function() {
                if (window.VellaWidget) {
                    window.VellaWidget.init(vellaConfig);
                }
            };
            
            document.head.appendChild(script);
        })();
    </script>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vella-chat-widget-${agentId}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast({
        message: "Chat widget code downloaded (script embed)",
        type: "success",
      });
    }
  };

  if (!agentId) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              No Agent Selected
            </h2>
            <p className="text-gray-600 mb-6">
              Please select an agent from the agent list to preview its widget.
            </p>
            <button
              onClick={() => router.push("/dashboard/agent")}
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
              <h1 className="text-2xl font-bold text-gray-900">
                Widget Preview
              </h1>
              <p className="text-gray-600 mt-2">
                Preview and customize your widget for {agentName}
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/agent")}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
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
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      agentStatus === "active"
                        ? "bg-green-100 text-green-800"
                        : agentStatus === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {agentStatus}
                  </span>
                </div>
              </div>
            </Card>

            {/* Widget Type Selection (for Omnichannel only) */}
            {isOmnichannel && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Widget Type</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name="widgetType"
                      value="chat"
                      checked={selectedWidgetType === "chat"}
                      onChange={(e) =>
                        setSelectedWidgetType(
                          e.target.value as "chat" | "voice"
                        )
                      }
                      className="text-brand-primary"
                    />
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <div>
                        <div className="font-medium">Chat Widget</div>
                        <div className="text-xs text-gray-500">
                          Text-based messaging
                        </div>
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name="widgetType"
                      value="voice"
                      checked={selectedWidgetType === "voice"}
                      onChange={(e) =>
                        setSelectedWidgetType(
                          e.target.value as "chat" | "voice"
                        )
                      }
                      className="text-brand-primary"
                    />
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      </svg>
                      <div>
                        <div className="font-medium">Voice Widget</div>
                        <div className="text-xs text-gray-500">
                          Voice call interaction
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </Card>
            )}

            {/* Primary Color Selection */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Primary Color</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-16 h-16 rounded border-2 cursor-pointer"
                  />
                  <div>
                    <p className="font-medium text-gray-700">Custom Color</p>
                    <p className="text-sm text-gray-500">{customColor}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Position Selection - Hide for voice widget */}
            {!isVoiceWidget && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Position</h3>
                <div className="grid grid-cols-2 gap-3">
                  {positions.map((position) => (
                    <label
                      key={position.id}
                      className="flex items-center space-x-2 cursor-pointer p-2 border rounded hover:bg-gray-50"
                    >
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
            )}

            {/* Size Selection */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Size</h3>
              <div className="space-y-3">
                {sizes.map((size) => (
                  <label
                    key={size.id}
                    className="flex items-center justify-between cursor-pointer p-2 border rounded hover:bg-gray-50"
                  >
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
                    <span className="text-xs text-gray-500">
                      {size.width} × {size.height}
                    </span>
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
                    {showCode ? "Hide Code" : "Show Code"}
                  </button>
                  {selectedWidgetType === "chat" && channelType !== "phone" && (
                    <button
                      onClick={() => setIsWidgetOpen(!isWidgetOpen)}
                      className="px-4 py-2 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg hover:opacity-90"
                    >
                      {isWidgetOpen ? "Close Widget" : "Open Widget"}
                    </button>
                  )}
                </div>
              </div>

              {showCode ? (
                <div className="h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <h4 className="font-medium">
                        {isVoiceWidget
                          ? "iframe Embed Code"
                          : "Script Embed Code"}
                      </h4>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          copyToClipboard(
                            isVoiceWidget ? iframeEmbedCode : scriptEmbedCode
                          )
                        }
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
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      {isVoiceWidget ? (
                        <>
                          <strong>iframe embed:</strong> Voice widget embedded
                          in an isolated iframe, centered on the screen. Perfect
                          for dedicated voice interaction pages.
                        </>
                      ) : (
                        <>
                          <strong>Script embed:</strong> Chat widget dynamically
                          loaded with your page. Appears in the corner and
                          integrates seamlessly.
                        </>
                      )}
                    </p>
                  </div>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto h-[calc(100%-140px)] font-mono">
                    {isVoiceWidget ? iframeEmbedCode : scriptEmbedCode}
                  </pre>
                </div>
              ) : (
                <div className="relative h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-auto">
                  {/* Simulated website background */}
                  <div className="p-8">
                    <div className="max-w-4xl mx-auto">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Your Website
                      </h2>
                      <p className="text-gray-600 mb-6">
                        This is how the widget will appear on your website.
                        Visitors can click the chat button to start a
                        conversation with your AI agent.
                      </p>

                      {/* Voice Widget Preview (Inline) */}
                      {(selectedWidgetType === "voice" ||
                        channelType === "phone") && (
                        <div className="flex justify-center my-8">
                          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                            {/* Voice Widget Header */}
                            <div className="text-center mb-6">
                              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg
                                  className="w-12 h-12 text-gray-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                              </div>
                              <h3 className="text-xl font-semibold text-gray-900">
                                {agentName}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Voice Assistant
                              </p>
                            </div>

                            {/* Voice Controls */}
                            <div className="space-y-6">
                              {/* Start Call Button */}
                              <div className="flex justify-center">
                                <button
                                  className="px-8 py-3 rounded-full text-white font-semibold shadow-lg hover:opacity-90 transition-all"
                                  style={{ backgroundColor: customColor }}
                                >
                                  Start Call
                                </button>
                              </div>

                              {/* Info */}
                              {/* <div className="text-center text-xs text-gray-500 space-y-1">
                                <p>🎙️ Click to start voice conversation</p>
                                <p>🔊 Make sure your microphone is enabled</p>
                              </div> */}
                            </div>

                            {/* Footer */}
                            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                              <p className="text-xs text-gray-400">
                                Powered by Vella AI
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                          <h3 className="font-semibold mb-2">Feature 1</h3>
                          <p className="text-gray-600 text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit.
                          </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                          <h3 className="font-semibold mb-2">Feature 2</h3>
                          <p className="text-gray-600 text-sm">
                            Sed do eiusmod tempor incididunt ut labore et dolore
                            magna aliqua.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Widget Trigger Button - Only show for chat widget */}
                  {selectedWidgetType === "chat" && channelType !== "phone" && (
                    <button
                      onClick={() => setIsWidgetOpen(!isWidgetOpen)}
                      className={`fixed ${currentPosition?.class} w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:scale-105 transition-transform z-20`}
                      style={{ backgroundColor: customColor }}
                    >
                      {isWidgetOpen ? "✕" : "💬"}
                    </button>
                  )}

                  {/* Widget Panel - Chat or Voice based on selection */}
                  {isWidgetOpen &&
                    selectedWidgetType === "chat" &&
                    channelType !== "phone" && (
                      <div
                        ref={widgetRef}
                        className={`fixed ${currentPosition?.class} bg-white rounded-lg shadow-2xl border border-gray-200 z-10 transition-all duration-300`}
                        style={{
                          width: currentSize?.width,
                          height: currentSize?.height,
                          marginRight: selectedPosition.includes("right")
                            ? "80px"
                            : "auto",
                          marginLeft: selectedPosition.includes("left")
                            ? "80px"
                            : "auto",
                          marginBottom: selectedPosition.includes("bottom")
                            ? "80px"
                            : "auto",
                          marginTop: selectedPosition.includes("top")
                            ? "80px"
                            : "auto",
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
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Widget Body */}
                        <div
                          className="p-4 h-full overflow-y-auto"
                          style={{ height: "calc(100% - 140px)" }}
                        >
                          <div className="space-y-4">
                            {messages.map((message) => (
                              <div
                                key={message.id}
                                className={`p-3 rounded-lg ${
                                  message.sender === "agent"
                                    ? "bg-gray-100 mr-8"
                                    : "bg-blue-500 text-white ml-8"
                                }`}
                                style={
                                  message.sender === "user"
                                    ? { backgroundColor: customColor }
                                    : {}
                                }
                              >
                                <p className="text-sm">{message.text}</p>
                              </div>
                            ))}
                            {isTyping && (
                              <div className="bg-gray-100 p-3 rounded-lg mr-8">
                                <p className="text-sm italic text-gray-600">
                                  Typing...
                                </p>
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
                              style={
                                {
                                  "--focus-ring-color": customColor,
                                } as React.CSSProperties
                              }
                            />
                            <button
                              onClick={handleSendMessage}
                              disabled={!inputValue.trim()}
                              className="px-4 py-2 text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
                              style={{ backgroundColor: customColor }}
                            >
                              send massage
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Voice Widget Panel */}
                  {isWidgetOpen &&
                    (selectedWidgetType === "voice" ||
                      channelType === "phone") && (
                      <div
                        ref={widgetRef}
                        className={`fixed ${currentPosition?.class} bg-white rounded-lg shadow-2xl border border-gray-200 z-10 transition-all duration-300`}
                        style={{
                          width: currentSize?.width,
                          height: currentSize?.height,
                          marginRight: selectedPosition.includes("right")
                            ? "80px"
                            : "auto",
                          marginLeft: selectedPosition.includes("left")
                            ? "80px"
                            : "auto",
                          marginBottom: selectedPosition.includes("bottom")
                            ? "80px"
                            : "auto",
                          marginTop: selectedPosition.includes("top")
                            ? "80px"
                            : "auto",
                        }}
                      >
                        {/* Voice Widget Header */}
                        <div
                          className="p-4 border-b flex items-center justify-between text-white rounded-t-lg"
                          style={{ backgroundColor: customColor }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                              <span className="text-sm">📞</span>
                            </div>
                            <div>
                              <h4 className="font-medium">{agentName}</h4>
                              <p className="text-xs opacity-90">
                                Voice Assistant
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setIsWidgetOpen(false)}
                            className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Voice Widget Body */}
                        <div
                          className="p-6 h-full flex flex-col items-center justify-center"
                          style={{ height: "calc(100% - 72px)" }}
                        >
                          <div className="text-center space-y-6">
                            {/* Voice Animation Circle */}
                            <div className="relative w-full  flex items-center justify-center">
                              <div
                                className="w-32 h-32 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${customColor}20` }}
                              >
                                <div
                                  className="w-24 h-24 rounded-full flex items-center justify-center animate-pulse"
                                  style={{
                                    backgroundColor: `${customColor}40`,
                                  }}
                                >
                                  <svg
                                    className="w-12 h-12"
                                    style={{ color: customColor }}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>

                            {/* Status Text */}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Ready to Talk
                              </h3>
                              <p className="text-sm text-gray-600 mb-6">
                                Click the microphone to start speaking
                              </p>
                            </div>

                            {/* Single Voice Button */}
                            <div className="flex items-center justify-center">
                              <button
                                className="w-20 h-20 rounded-full text-white flex items-center justify-center hover:opacity-90 transition-all shadow-lg transform hover:scale-105"
                                style={{ backgroundColor: customColor }}
                                title="Start Voice Conversation"
                              >
                                <svg
                                  className="w-10 h-10"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                  />
                                </svg>
                              </button>
                            </div>

                            {/* Info Text */}
                            <div className="mt-6 text-xs text-gray-500">
                              <p>🎙️ Speak clearly into your microphone</p>
                              <p className="mt-1">
                                🔊 Make sure your speakers are on
                              </p>
                            </div>
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
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
              <p>Loading widget preview...</p>
            </div>
          </div>
        </DashboardLayout>
      }
    >
      <WidgetPreviewContent />
    </Suspense>
  );
}
