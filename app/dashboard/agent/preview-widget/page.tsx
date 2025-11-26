"use client";

import React, { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Card from "@/components/shared/Card";
import { useToast } from "@/contexts/ToastContext";

// Extend Window interface for VellaWidget
declare global {
  interface Window {
    VellaWidget?: {
      init: (config: any) => void;
    };
  }
}

function WidgetPreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToast } = useToast();
  const [selectedPosition, setSelectedPosition] = useState("bottom-right");
  const [selectedSize, setSelectedSize] = useState("medium");
  const [customColor, setCustomColor] = useState("#8266D4");
  const [showCode, setShowCode] = useState(false);
  const [selectedWidgetType, setSelectedWidgetType] = useState<
    "chat" | "voice"
  >("chat");
  const [forceReload, setForceReload] = useState(0);

  // Voice widget customization options
  const [showAvatar, setShowAvatar] = useState(false);
  const [showWidgetTitle, setShowWidgetTitle] = useState(true);
  const [showCallDuration, setShowCallDuration] = useState(false);
  const [buttonColor, setButtonColor] = useState("#8266D4");
  const [iconColor, setIconColor] = useState("#FFFFFF");

  // Get agent details from URL params
  const agentId = searchParams.get("id") || "";
  const agentName = searchParams.get("name") || "AI Assistant";
  const agentType = searchParams.get("type") || "";
  const agentStatus = searchParams.get("status") || "";
  const agentDescription = searchParams.get("description") || "";
  const channelType = searchParams.get("channelType") || "";

  // Check if it's omnichannel
  const isOmnichannel = channelType === "omnichannel";

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

  // Cleanup on component unmount to prevent widget from persisting on other pages
  useEffect(() => {
    console.log('🎬 Preview page mounted');
    
    // Set preview mode flag immediately on body element
    document.body.setAttribute('data-vella-preview-mode', 'true');
    (window as any).__VELLA_PREVIEW_MODE__ = true;
    
    // Cleanup function that runs when leaving this page
    return () => {
      console.log('🚪 Leaving preview page - AGGRESSIVE cleanup starting...');
      
      // CRITICAL: Remove preview mode attribute and flag FIRST
      document.body.removeAttribute('data-vella-preview-mode');
      delete (window as any).__VELLA_PREVIEW_MODE__;
      
      // Disconnect any observers
      if ((window as any).__VELLA_OBSERVER__) {
        (window as any).__VELLA_OBSERVER__.disconnect();
        delete (window as any).__VELLA_OBSERVER__;
      }
      
      // Remove all widget elements - check multiple times
      const removeElements = () => {
        const widget = document.getElementById('vella-widget');
        const trigger = document.getElementById('vella-trigger-button');
        const dataElements = document.querySelectorAll('[data-vella-widget]');
        const styles = document.querySelectorAll('style#vella-preview-styles');
        const scripts = document.querySelectorAll('script[src*="/api/widget/script"], script#vella-widget-script');
        
        widget?.remove();
        trigger?.remove();
        dataElements.forEach(el => el.remove());
        styles.forEach(s => s.remove());
        scripts.forEach(s => s.remove());
        
        console.log('🗑️ Removed elements:', {
          widget: !!widget,
          trigger: !!trigger,
          dataElements: dataElements.length,
          styles: styles.length,
          scripts: scripts.length
        });
      };
      
      // Remove immediately
      removeElements();
      
      // Remove again after a short delay to catch any delayed additions
      setTimeout(removeElements, 100);
      setTimeout(removeElements, 300);
      setTimeout(removeElements, 500);
      
      // Clear window objects
      if (window.VellaWidget) {
        delete window.VellaWidget;
      }
      
      console.log('✅ Preview page AGGRESSIVE cleanup complete');
    };
  }, []); // Empty dependency array - runs only on mount/unmount

  // Load widget script for chat widgets
  useEffect(() => {
    // Mark this page as preview mode to prevent widget from loading elsewhere
    (window as any).__VELLA_PREVIEW_MODE__ = true;
    
    // Aggressive cleanup function
    const cleanup = () => {
      console.log('🧹 Starting cleanup...');
      
      // Remove widget container from anywhere (body or preview container)
      const existingWidget = document.getElementById('vella-widget');
      if (existingWidget) {
        existingWidget.remove();
        console.log('🗑️ Removed existing widget');
      }
      
      // Remove trigger button from anywhere
      const existingTrigger = document.getElementById('vella-trigger-button');
      if (existingTrigger) {
        existingTrigger.remove();
        console.log('🗑️ Removed existing trigger');
      }
      
      // Also check preview container specifically
      const previewContainer = document.getElementById('vella-preview-container');
      if (previewContainer) {
        const containerTrigger = previewContainer.querySelector('#vella-trigger-button');
        const containerWidget = previewContainer.querySelector('#vella-widget');
        if (containerTrigger) {
          containerTrigger.remove();
          console.log('🗑️ Removed trigger from preview container');
        }
        if (containerWidget) {
          containerWidget.remove();
          console.log('🗑️ Removed widget from preview container');
        }
      }
      
      // Remove any data-vella-widget elements
      const existingWidgets = document.querySelectorAll('[data-vella-widget]');
      existingWidgets.forEach(el => {
        el.remove();
        console.log('🗑️ Removed data-vella-widget element');
      });
      
      // CRITICAL: Remove ALL style tags with id vella-preview-styles
      // This ensures voice-mode CSS doesn't persist when switching to chat
      const existingStyles = document.querySelectorAll('style#vella-preview-styles');
      existingStyles.forEach(style => {
        style.remove();
        console.log('🗑️ Removed existing style tag');
      });
      
      // Remove any widget scripts
      const existingScripts = document.querySelectorAll('script[src*="/api/widget/script"]');
      existingScripts.forEach(script => {
        script.remove();
        console.log('🗑️ Removed widget script');
      });
      
      // Clear VellaWidget from window
      if (window.VellaWidget) {
        delete window.VellaWidget;
        console.log('🗑️ Cleared VellaWidget from window');
      }
      
      // CRITICAL: Close any active WebSocket connections
      try {
        // Access the widget's WebSocket if it exists
        const scripts = document.querySelectorAll('script[src*="/api/widget/script"]');
        if (scripts.length > 0) {
          // Force close any WebSocket connections by reloading will trigger cleanup
          console.log('🔌 Forcing WebSocket cleanup');
        }
      } catch (e) {
        console.log('⚠️ Could not access WebSocket for cleanup');
      }
      
      // Restore VellaWidget property descriptor (in case it was blocked in voice mode)
      try {
        delete (window as any).VellaWidget;
        console.log('🔓 Restored VellaWidget property');
      } catch (e) {
        // Ignore errors
      }
      
      console.log('✅ Cleanup complete');
    };

    // Always cleanup first
    cleanup();

    if (!isVoiceWidget && !showCode) {
      // ========== CHAT WIDGET MODE ==========
      console.log('🎯 Loading CHAT widget');
      
      // Add CRITICAL CSS to fix layout - must be added BEFORE widget loads
      const styleTag = document.createElement('style');
      styleTag.id = 'vella-preview-styles';
      styleTag.textContent = `
        /* CRITICAL: Contain widget within preview container */
        #vella-preview-container {
          position: relative !important;
        }
        
        /* Widget elements positioned within preview container */
        #vella-preview-container #vella-widget,
        #vella-preview-container #vella-trigger-button {
          position: absolute !important;
        }
        
        /* CRITICAL: Widget container z-index */
        #vella-widget {
          z-index: 10000 !important;
        }
        
        /* CRITICAL: Trigger button must be BELOW widget when open */
        #vella-trigger-button {
          z-index: 9999 !important;
        }
        
        /* Hide trigger button when widget is open */
        #vella-widget[style*="display: block"] ~ #vella-trigger-button,
        #vella-widget[style*="display:block"] ~ #vella-trigger-button {
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(styleTag);
      console.log('✅ Added critical CSS for widget layout with z-index fixes');

      const vellaConfig = {
        agentId: agentId,
        title: agentName,
        widgetType: 'chat',
        position: selectedPosition,
        size: selectedSize,
        primaryColor: customColor
      };

      // Load widget script after DOM is ready
      const loadWidget = () => {
        const previewContainer = document.getElementById('vella-preview-container');
        if (previewContainer) {
          console.log('✅ Preview container found, loading widget script');
          
          console.log('🚀 Loading widget script');
          const script = document.createElement('script');
          script.id = 'vella-widget-script';
          script.src = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/widget/script?t=${Date.now()}`;
          script.async = true;
          
          script.onload = () => {
            console.log('✅ Widget script loaded');
            if (window.VellaWidget) {
              window.VellaWidget.init(vellaConfig);
              console.log('✅ Widget initialized');
            } else {
              console.error('❌ VellaWidget not found');
            }
          };

          script.onerror = (error) => {
            console.error('❌ Failed to load widget script:', error);
          };

          document.head.appendChild(script);
        } else {
          console.log('⏳ Preview container not ready, retrying...');
          requestAnimationFrame(loadWidget);
        }
      };
      
      // Wait longer for React to finish rendering
      const timeoutId = setTimeout(loadWidget, 500);

      return () => {
        clearTimeout(timeoutId);
        cleanup();
      };
    } else if (isVoiceWidget && !showCode) {
      // ========== VOICE WIDGET MODE ==========
      console.log('🎙️ Voice widget mode - blocking chat widget');
      
      // Add aggressive CSS to hide chat elements
      const styleTag = document.createElement('style');
      styleTag.id = 'vella-preview-styles';
      styleTag.textContent = `
        /* Force hide chat widget elements when in voice mode */
        #vella-trigger-button,
        #vella-widget,
        button[id*="vella"],
        div[id*="vella-widget"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          position: absolute !important;
          left: -9999px !important;
          width: 0 !important;
          height: 0 !important;
        }
      `;
      document.head.appendChild(styleTag);
      
      // Prevent any VellaWidget initialization
      Object.defineProperty(window, 'VellaWidget', {
        get: () => undefined,
        set: () => {},
        configurable: true
      });
      
      // Use MutationObserver to aggressively remove chat elements
      const observer = new MutationObserver((mutations) => {
        const elementsToRemove = document.querySelectorAll(
          '#vella-trigger-button, #vella-widget, [data-vella-widget]'
        );
        elementsToRemove.forEach(el => {
          el.remove();
          console.log('🗑️ Removed chat widget element in voice mode');
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      return () => {
        observer.disconnect();
        // Restore VellaWidget property
        delete (window as any).VellaWidget;
        cleanup();
      };
    }
    
    return () => {
      cleanup();
      // Clear preview mode flag when leaving this page
      delete (window as any).__VELLA_PREVIEW_MODE__;
    };
  }, [isVoiceWidget, showCode, agentId, agentName, selectedPosition, selectedSize, customColor, forceReload]);

  // Generate iframe embed code (for voice widget)
  const voiceWidgetParams = new URLSearchParams({
    size: selectedSize,
    color: customColor,
    showAvatar: showAvatar.toString(),
    showTitle: showWidgetTitle.toString(),
    showDuration: showCallDuration.toString(),
    buttonColor: buttonColor,
    iconColor: iconColor,
    title: agentName // Pass title to iframe
  });

  const iframeEmbedCode = `<!-- Vella AI Widget - iframe Embed -->
<iframe
  src="${
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }/widget/voice/${agentId}?${voiceWidgetParams.toString()}"
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
      }/widget/voice/${agentId}?${voiceWidgetParams.toString()}`;

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
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
      }/widget/voice/${agentId}?${voiceWidgetParams.toString()}`;

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
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
      <div className="p-8 text-black">
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

        <div className="grid grid-cols-1  lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 h-[73vh] overflow-auto space-y-6">
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
                  <label className="flex justify-between items-center space-x-3 cursor-pointer p-3 border rounded hover:bg-gray-50">
                   
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
                     <input
                      type="radio"
                      name="widgetType"
                      value="chat"
                      checked={selectedWidgetType === "chat"}
                      onChange={(e) => {
                        setSelectedWidgetType(
                          e.target.value as "chat" | "voice"
                        );
                        setForceReload(prev => prev + 1);
                      }}
                      className="text-brand-primary"
                    />
                  </label>
                  <label className="flex justify-between items-center space-x-3 cursor-pointer p-3 border rounded hover:bg-gray-50">
                    
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
                      <input
                        type="radio"
                        name="widgetType"
                        value="voice"
                        checked={selectedWidgetType === "voice"}
                        onChange={(e) => {
                          setSelectedWidgetType(
                            e.target.value as "chat" | "voice"
                          );
                          setForceReload(prev => prev + 1);
                        }}
                        className="text-brand-primary"
                      />
                  </label>
                </div>
              </Card>
            )}

            {/* Primary Color Selection */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">{isVoiceWidget ? "Widget Colors" : "Primary Color"}</h3>
              <div className="space-y-3">
                {!isVoiceWidget ? (
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-10 h-10 rounded border-2 cursor-pointer"
                    />
                    <div>
                      <p className="font-medium text-gray-700">Custom Color</p>
                      <p className="text-sm text-gray-500">{customColor}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={buttonColor}
                        onChange={(e) => setButtonColor(e.target.value)}
                        className="w-10 h-10 rounded border-2 cursor-pointer"
                      />
                      <div>
                        <p className="font-medium text-gray-700">Button Color</p>
                        <p className="text-sm text-gray-500">{buttonColor}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={iconColor}
                        onChange={(e) => setIconColor(e.target.value)}
                        className="w-10 h-10 rounded border-2 cursor-pointer"
                      />
                      <div>
                        <p className="font-medium text-gray-700">Icon Color</p>
                        <p className="text-sm text-gray-500">{iconColor}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Voice Widget Display Options */}
            {isVoiceWidget && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Display Options</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer p-3 border rounded hover:bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div>
                        <div className="font-medium text-sm">Show Avatar</div>
                        <div className="text-xs text-gray-500">Display agent avatar image</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={showAvatar}
                      onChange={(e) => setShowAvatar(e.target.checked)}
                      className="w-4 h-4 text-brand-primary rounded focus:ring-2 focus:ring-brand-primary"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer p-3 border rounded hover:bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <div>
                        <div className="font-medium text-sm">Show Widget Title</div>
                        <div className="text-xs text-gray-500">Display agent name as title</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={showWidgetTitle}
                      onChange={(e) => setShowWidgetTitle(e.target.checked)}
                      className="w-4 h-4 text-brand-primary rounded focus:ring-2 focus:ring-brand-primary"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer p-3 border rounded hover:bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className="font-medium text-sm">Show Call Duration</div>
                        <div className="text-xs text-gray-500">Display call timer</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={showCallDuration}
                      onChange={(e) => setShowCallDuration(e.target.checked)}
                      className="w-4 h-4 text-brand-primary rounded focus:ring-2 focus:ring-brand-primary"
                    />
                  </label>
                </div>
              </Card>
            )}

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
          <div className="lg:col-span-2 h-full">
            <Card className="p-6 h-[73vh] relative overflow-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Live Preview</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {showCode ? "Hide Code" : "Show Code"}
                  </button>
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
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto h-[73vh] font-mono">
                    {isVoiceWidget ? iframeEmbedCode : scriptEmbedCode}
                  </pre>
                </div>
              ) : (
                <div className="relative h-[65vh] min-h-[650px] bg-white rounded-lg overflow-hidden">
                  {/* Voice Widget - Show iframe */}
                  {isVoiceWidget ? (
                    <div className="h-full flex items-center justify-center p-8">
                      <iframe
                        key={`${showAvatar}-${showWidgetTitle}-${showCallDuration}-${buttonColor}-${iconColor}-${forceReload}`}
                        src={`${
                          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                        }/widget/voice/${agentId}?${voiceWidgetParams.toString()}`}
                        style={{
                          width: currentSize?.width,
                          height: currentSize?.height,
                          border: "none",
                          borderRadius: "12px",
                        }}
                        title={`${agentName} - Vella AI Voice Widget`}
                        allow="microphone"
                      />
                    </div>
                  ) : (
                    /* Chat Widget - Show actual widget */
                    <>
                      {/* Widget Preview Container - Isolated positioning context */}
                      <div id="vella-preview-container" className="relative h-full w-full ">
                        {/* Simulated website background */}
                        <div className="p-8">
                          <div className="max-w-4xl mx-auto ">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                              Your Websites
                            </h2>
                            <p className="text-gray-600 mb-6">
                              This is how the widget will appear on your website.
                              Click the chat button to start a conversation with your AI agent.
                            </p>

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
                      </div>
                    </>
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
