/**
 * Vella AI Widget Script
 * Serves the JavaScript widget that gets embedded on external websites
 */

export async function GET() {
  const widgetScript = `
/**
 * Vella AI Widget - Client-side Script
 * This script gets loaded on external websites to render the chat widget
 */

(function() {
  'use strict';
  console.log('🚀 Vella Widget Script: Script loaded and executing...');

  // Widget configuration will be passed from the embed code
  let config = {};
  
  // Widget state
  let isOpen = false;
  let conversationId = null;
  let widgetContainer = null;
  let triggerButton = null;
  let isRecording = false;
  let recognition = null;
  let isVoiceMode = false; // New: tracks if user is in voice call mode
  let speechSynthesis = null;
  let isPlaying = false; // tracks if AI is speaking
  let currentAudio = null; // tracks current audio playback
  let silenceTimer = null; // tracks silence detection for auto-send
  let lastSpeechTime = null; // tracks when user last spoke
  let voiceState = 'idle'; // 'idle', 'listening', 'processing', 'responding'
  let isVoiceActive = false; // tracks if voice mode is actively listening
  
  // WebSocket state
  let ws = null;
  let wsReconnectAttempts = 0;
  let wsMaxReconnectAttempts = 5;
  let wsReconnectDelay = 1000;
  let currentResponseText = ''; // accumulate streaming text
  let audioChunks = []; // accumulate audio chunks
  
  // Audio queue for sequential playback
  let audioQueue = [];
  let isPlayingQueue = false;
  let isAudioStreamComplete = false; // Track if server finished sending audio chunks

  // Main widget initialization
  window.VellaWidget = {
    init: function(userConfig) {
      console.log('🎯 Vella Widget: init() called with config:', userConfig);
      config = {
        agentId: userConfig.agentId || '',
        widgetType: userConfig.widgetType || 'chat', // 'chat', 'voice', or 'inline-voice'
        theme: userConfig.theme || 'light',
        position: userConfig.position || 'bottom-right',
        size: userConfig.size || 'medium',
        primaryColor: userConfig.primaryColor || '#8266D4',
        title: userConfig.title || 'AI Assistant',
        containerId: userConfig.containerId || null, // For inline widgets
        apiBaseUrl: '${
          process.env.NEXT_PUBLIC_API_URL ||
          "https://ai-voice-agent-backend.octaloop.dev"
        }',
        widgetBaseUrl: '${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }'
      };
      console.log('📝 Vella Widget: Final config set:', config);

      // Check if inline voice widget
      if (config.widgetType === 'inline-voice') {
        this.createInlineVoiceWidget();
      } else {
        this.createWidget();
      }
      // bindEvents is now called in createWidgetContainer after DOM is ready
    },

    createWidget: function() {
      console.log('🏗️ Vella Widget: createWidget() called');
      // Create trigger button
      this.createTriggerButton();
      
      // Create widget container (initially hidden)
      this.createWidgetContainer();
    },

    createInlineVoiceWidget: function() {
      console.log('🎙️ Vella Widget: createInlineVoiceWidget() called');
      
      // Find container element
      const container = config.containerId 
        ? document.getElementById(config.containerId) 
        : document.body;
      
      if (!container) {
        console.error('❌ Container not found:', config.containerId);
        return;
      }

      // Create inline widget element
      const inlineWidget = document.createElement('div');
      inlineWidget.id = 'vella-inline-voice-widget';
      inlineWidget.style.cssText = \`
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        background: white;
        border-radius: 16px;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      \`;
      
      inlineWidget.innerHTML = this.getInlineVoiceHTML();
      container.appendChild(inlineWidget);
      
      console.log('✅ Vella Widget: Inline voice widget created');
      
      // Just bind events - don't auto-start
      setTimeout(() => {
        this.bindInlineVoiceEvents();
      }, 100);
    },

    createTriggerButton: function() {
      console.log('🔘 Vella Widget: createTriggerButton() called');
      triggerButton = document.createElement('button');
      triggerButton.id = 'vella-trigger-button';
      // Set icon based on widget type
      triggerButton.innerHTML = config.widgetType === 'voice' ? '📞' : '💬';
      triggerButton.style.cssText = this.getTriggerButtonStyles();
      
      // Check if we're in preview mode - append to preview container if available
      const previewContainer = document.getElementById('vella-preview-container');
      const targetContainer = previewContainer || document.body;
      targetContainer.appendChild(triggerButton);
      console.log('✅ Vella Widget: Trigger button created and added to', previewContainer ? 'preview container' : 'body');
    },

    createWidgetContainer: function() {
      console.log('📦 Vella Widget: createWidgetContainer() called');
      widgetContainer = document.createElement('div');
      widgetContainer.id = 'vella-widget';
      widgetContainer.style.cssText = this.getWidgetContainerStyles();
      widgetContainer.style.display = 'none';
      
      widgetContainer.innerHTML = this.getWidgetHTML();
      
      // Check if we're in preview mode - append to preview container if available
      const previewContainer = document.getElementById('vella-preview-container');
      const targetContainer = previewContainer || document.body;
      targetContainer.appendChild(widgetContainer);
      console.log('✅ Vella Widget: Widget container created and added to', previewContainer ? 'preview container' : 'body');

      // Bind events after DOM is created
      setTimeout(() => {
        console.log('⏰ Vella Widget: setTimeout triggered, calling bindEvents()');
        this.bindEvents();
      }, 100);
    },

    getTriggerButtonStyles: function() {
      const positions = this.getPositionStyles();
      return \`
        position: fixed;
        \${positions};
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: \${config.primaryColor};
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        transition: transform 0.2s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      \`;
    },

    getWidgetContainerStyles: function() {
      const positions = this.getPositionStyles();
      const sizes = this.getSizeStyles();
      
      return \`
        position: fixed;
        \${positions};
        \${sizes};
        z-index: 9999;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        background: white;
        border: 1px solid #e5e7eb;
        transition: all 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        overflow: hidden;
      \`;
    },

    getPositionStyles: function() {
      const margin = isOpen ? '80px' : '24px';
      
      switch(config.position) {
        case 'bottom-right':
          return \`bottom: 24px; right: 24px;\`;
        case 'bottom-left':
          return \`bottom: 24px; left: 24px;\`;
        case 'top-right':
          return \`top: 24px; right: 24px;\`;
        case 'top-left':
          return \`top: 24px; left: 24px;\`;
        default:
          return \`bottom: 24px; right: 24px;\`;
      }
    },

    getSizeStyles: function() {
      switch(config.size) {
        case 'small':
          return \`width: 320px; height: 400px;\`;
        case 'medium':
          return \`width: 380px; height: 500px;\`;
        case 'large':
          return \`width: 450px; height: 600px;\`;
        default:
          return \`width: 380px; height: 500px;\`;
      }
    },

    getWidgetHTML: function() {
      console.log('📄 Vella Widget: getWidgetHTML() called');
      console.log('Widget Type:', config.widgetType);
      
      // Return different HTML based on widget type
      if (config.widgetType === 'voice') {
        return this.getVoiceWidgetHTML();
      } else {
        return this.getChatWidgetHTML();
      }
    },

    getChatWidgetHTML: function() {
      console.log('💬 Vella Widget: getChatWidgetHTML() called');
      const html = \`
        <style>
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          #vella-messages::-webkit-scrollbar {
            width: 6px;
          }
          
          #vella-messages::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          
          #vella-messages::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
          }
          
          #vella-messages::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        </style>
        <div style="height: 100%; display: flex; flex-direction: column; ">
          <!-- Header -->
          <div id="vella-header" style="
            padding: 20px;
            background: linear-gradient(135deg, \${config.primaryColor} 0%, \${config.primaryColor}dd 100%);
            color: white;
            border-radius: 12px 12px 0 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          ">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="
                width: 40px;
                height: 40px;
                background: rgba(255,255,255,0.25);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              ">🤖</div>
              <div>
                <div style="font-weight: 600; font-size: 16px;">\${config.title}</div>
                <div style="font-size: 13px; opacity: 0.95; display: flex; align-items: center; gap: 6px;">
                  <span style="
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    background: #10b981;
                    border-radius: 50%;
                    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
                  "></span>
                  Online now
                </div>
              </div>
            </div>
            <button id="vella-close" style="
              background: rgba(255,255,255,0.2);
              border: none;
              color: white;
              cursor: pointer;
              padding: 8px;
              border-radius: 50%;
              font-size: 20px;
              font-weight: bold;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              transition: background 0.2s;
            " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
          </div>

          <!-- Messages -->
          <div id="vella-messages" style="
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #f9fafb;
            display: flex;
            flex-direction: column;
            gap: 12px;
          ">
            <!-- Initial greeting message will be added here -->
          </div>

          <!-- Voice Call Screen -->
          <div id="vella-voice-screen" style="
            flex: 1;
            padding: 32px 16px;
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            text-align: center;
            color: white;
          ">
            <div style="margin-bottom: 24px;">
              <div style="
                width: 80px;
                height: 80px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40px;
                margin: 0 auto 16px auto;
              ">🤖</div>
              <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">\${config.title}</h3>
              <p id="vella-call-status" style="margin: 0; font-size: 14px; opacity: 0.9;">Connected</p>
            </div>
            
            <div id="vella-voice-visualizer" style="
              width: 200px;
              height: 4px;
              background: rgba(255,255,255,0.3);
              border-radius: 2px;
              margin: 24px 0;
              position: relative;
              overflow: hidden;
            ">
              <div id="vella-voice-wave" style="
                width: 0%;
                height: 100%;
                background: rgba(255,255,255,0.8);
                border-radius: 2px;
                transition: width 0.3s ease;
              "></div>
            </div>
            
            <p id="vella-voice-instruction" style="
              margin: 0;
              font-size: 14px;
              opacity: 0.8;
              max-width: 250px;
              line-height: 1.4;
            ">Click the microphone to start voice conversation</p>
          </div>

          <!-- Input -->
          <div id="vella-input-area" style="
            padding: 16px;
            border-top: 1px solid #e5e7eb;
            background: white;
            border-radius: 0 0 12px 12px;
          ">
            <!-- Chat Mode Input -->
            <div id="vella-chat-input" style="display: flex; gap: 8px; align-items: center;">
              <input
                type="text"
                id="vella-input"
                placeholder="Type your message..."
                style="
                  flex: 1;
                  padding: 12px 16px;
                  border: 1.5px solid #e5e7eb;
                  border-radius: 24px;
                  font-size: 14px;
                  outline: none;
                  font-family: inherit;
                  transition: border-color 0.2s;
                  background: #f9fafb;
                "
                onfocus="this.style.borderColor='\${config.primaryColor}'; this.style.background='white';"
                onblur="this.style.borderColor='#e5e7eb'; this.style.background='#f9fafb';"
              />
              <button id="vella-send" style="
                padding: 12px 20px;
                background: \${config.primaryColor};
                color: white;
                border: none;
                border-radius: 24px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                white-space: nowrap;
                transition: all 0.2s;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)';">Send</button>
            </div>
          </div>
        </div>
      \`;
      console.log('✅ Vella Widget: HTML generated');
      return html;
    },

    getVoiceWidgetHTML: function() {
      console.log('📞 Vella Widget: getVoiceWidgetHTML() called');
      const html = \`
        <style>
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes ripple {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
          }
        </style>
        <div style="height: 100%; display: flex; flex-direction: column;">
          <!-- Header -->
          <div id="vella-header" style="
            padding: 16px;
            background: \${config.primaryColor};
            color: white;
            border-radius: 12px 12px 0 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
          ">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="
                width: 32px;
                height: 32px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
              ">📞</div>
              <div>
                <div style="font-weight: 600; font-size: 14px;">\${config.title}</div>
                <div style="font-size: 12px; opacity: 0.9;">Voice Assistant</div>
              </div>
            </div>
            <button id="vella-close" style="
              background: none;
              border: none;
              color: white;
              cursor: pointer;
              padding: 6px;
              border-radius: 50%;
              font-size: 20px;
              font-weight: bold;
              display: flex;
              align-items: center;
              justify-center: center;
            ">×</button>
          </div>

          <!-- Voice Call Screen -->
          <div style="
            flex: 1;
            padding: 32px 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: white;
            text-align: center;
          ">
            <!-- Voice Animation Circle -->
            <div style="position: relative; margin-bottom: 32px;">
              <div style="
                width: 128px;
                height: 128px;
                border-radius: 50%;
                background: \${config.primaryColor}20;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
              ">
                <div id="vella-voice-pulse" style="
                  width: 96px;
                  height: 96px;
                  border-radius: 50%;
                  background: \${config.primaryColor}40;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  animation: pulse 2s infinite;
                ">
                  <svg style="width: 48px; height: 48px; color: \${config.primaryColor};" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Status Text -->
            <div style="margin-bottom: 32px;">
              <h3 id="vella-voice-status" style="font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 8px;">
                Connecting...
              </h3>
              <p id="vella-voice-subtitle" style="font-size: 14px; color: #6B7280; margin-bottom: 24px; max-width: 280px;">
                Starting voice call...
              </p>
            </div>

            <!-- Call Controls -->
            <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 24px;">
              <!-- End Call Button (Always visible during call) -->
              <button id="vella-voice-end-btn" style="
                width: 64px;
                height: 64px;
                border-radius: 50%;
                background: #EF4444;
                color: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 8px 16px rgba(239,68,68,0.3);
                transition: all 0.3s;
              " title="End Call">
                <svg style="width: 28px; height: 28px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Info Text -->
            <div style="margin-top: 24px; font-size: 12px; color: #9CA3AF;">
              <p>🎙️ Speak clearly into your microphone</p>
              <p style="margin-top: 4px;">🔊 Make sure your speakers are on</p>
            </div>
          </div>
        </div>
      \`;
      console.log('✅ Vella Widget: Voice widget HTML generated');
      return html;
    },

    getInlineVoiceHTML: function() {
      console.log('🎙️ Vella Widget: getInlineVoiceHTML() called');
      const html = \`
        <style>
          @keyframes breathe {
            0%, 100% { 
              transform: scale(1); 
              box-shadow: 0 8px 32px rgba(16,185,129,0.3);
            }
            50% { 
              transform: scale(1.08); 
              box-shadow: 0 12px 48px rgba(16,185,129,0.5);
            }
          }
          
          @keyframes listening-pulse {
            0%, 100% { 
              transform: scale(1); 
              box-shadow: 0 8px 32px rgba(16,185,129,0.4), 0 0 0 0 rgba(16,185,129,0.7);
            }
            50% { 
              transform: scale(1.05); 
              box-shadow: 0 12px 48px rgba(16,185,129,0.6), 0 0 0 15px rgba(16,185,129,0);
            }
          }
          
          @keyframes speaking-pulse {
            0%, 100% { 
              transform: scale(1); 
              box-shadow: 0 8px 32px rgba(139,92,246,0.4), 0 0 0 0 rgba(139,92,246,0.7);
            }
            50% { 
              transform: scale(1.05); 
              box-shadow: 0 12px 48px rgba(139,92,246,0.6), 0 0 0 15px rgba(139,92,246,0);
            }
          }
          
          @keyframes processing-spin {
            0% { 
              transform: rotate(0deg) scale(1); 
            }
            50% { 
              transform: rotate(180deg) scale(1.05); 
            }
            100% { 
              transform: rotate(360deg) scale(1); 
            }
          }
          
          @keyframes rec-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          
          @keyframes pulse-ring {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
            }
            50% {
              transform: scale(1);
              box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
            }
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
            }
          }
          
          @keyframes pulse-ring-red {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
            }
            50% {
              transform: scale(1);
              box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
            }
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
            }
          }
          
          @keyframes pulse-ring-blue {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
            }
            50% {
              transform: scale(1);
              box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
            }
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
            }
          }
          
          @keyframes pulse-ring-purple {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
            }
            50% {
              transform: scale(1);
              box-shadow: 0 0 0 10px rgba(139, 92, 246, 0);
            }
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
            }
          }
          
          @keyframes wave-animation {
            0%, 100% { 
              transform: scaleY(0.5); 
            }
            50% { 
              transform: scaleY(1); 
            }
          }
          
          .vella-voice-card {
            background: white;
            border-radius: 16px;
            padding: 40px 24px 24px 24px;
            text-align: center;
            max-width: 400px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }
          
          .vella-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin: 0 auto 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: white;
            font-weight: bold;
          }
          
          .vella-name {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
          }
          
          .vella-rec-status {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 12px;
            height: 30px;
          }
          
          .vella-rec-dot {
            width: 8px;
            height: 8px;
            background: #ef4444;
            border-radius: 50%;
            animation: rec-blink 1.5s ease-in-out infinite;
          }
          
          .vella-rec-time {
            font-size: 18px;
            color: #1f2937;
            font-weight: 600;
          }
          
          .vella-status-indicator {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.4s ease;
            cursor: pointer;
            position: absolute;
            top: 0;
            left: 0;
          }
          
          .vella-status-indicator:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          }
          
          .vella-status-indicator.listening {
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            animation: pulse-ring 2s ease-in-out infinite;
          }
          
          .vella-status-indicator.processing {
            background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
            animation: pulse-ring-blue 1.5s ease-in-out infinite;
          }
          
          .vella-status-indicator.speaking {
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
            animation: pulse-ring-purple 1.5s ease-in-out infinite;
          }
          
          .vella-status-indicator svg {
            width: 40px;
            height: 40px;
            color: white;
          }
          
          .vella-call-status {
            font-size: 16px;
            color: #9ca3af;
            margin-bottom: 32px;
            display: none;
          }
          
          .vella-endcall-btn {
            width: auto;
            margin: 0 auto 24px;
            padding: 14px 32px;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 24px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.3s ease;
          }
          
          .vella-endcall-btn:hover {
            background: #dc2626;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(239,68,68,0.4);
          }
          
          .vella-footer {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            font-size: 13px;
            color: #9ca3af;
          }
          
          .vella-footer-logo {
            width: 18px;
            height: 18px;
          }
          
          .vella-start-call-btn {
            width: 80px;
            height: 80px;
            background: \${config.primaryColor};
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            position: absolute;
            top: 0;
            left: 0;
          }
          
          .vella-start-call-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
          }
          
          .vella-start-call-btn:active {
            transform: scale(0.95);
          }
          
          .vella-start-call-btn svg {
            width: 32px;
            height: 32px;
          }
          
          .vella-content-area {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 16px;
            position: relative;
            padding-top: 0;
          }
        </style>
        
        <!-- Voice Interface Card -->
        <div class="vella-voice-card">
          <div>
            <!-- Avatar -->
            <div class="vella-avatar" id="vella-voice-avatar">
              <svg viewBox="-36 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m351.21875 392.441406-71.398438-10.441406-119.390624.019531s-71.277344 10.398438-71.378907 10.410157c-49.632812 6.453124-79.050781 44.757812-79.050781 87.597656v21.972656h420v-21.992188c0-44.449218-30.308594-81.265624-78.78125-87.566406zm0 0" fill="#83c2b1"></path><path d="m390 210v46c0 11.050781-8.929688 20-19.96875 20h-40.019531c-.011719-.171875-.011719-.351562-.011719-.519531v-85.480469h40.03125c11.039062 0 19.96875 8.949219 19.96875 20zm0 0" fill="#83c2b1"></path><path d="m390.339844 335.578125c0 26.300781-16.890625 48.652344-40.398438 56.800781l-69.8125-9.058594-.308594-1.199218-9.492187-37.101563-.457031-.941406c35.6875-18.179687 60.128906-55.269531 60.128906-98.078125v30h.011719c.269531 32.949219 27.296875 59.578125 60.328125 59.578125zm0 0" fill="#424d63"></path><path d="m329.96875 190h-29.820312c-33.1875 0-60.097657-27.53125-60.097657-60.730469 0 33.199219-26.910156 60.730469-60.109375 60.730469h-69.941406v-8.835938c0-59.789062 47.257812-109.546874 107.023438-111.125 62.09375-1.640624 112.976562 48.210938 112.976562 109.960938v10zm0 0" fill="#424d63"></path><path d="m300.179688 190c-33.191407 0-60.101563-27.53125-60.101563-60.730469 0 33.199219-26.90625 60.730469-60.109375 60.730469h-69.96875v56c0 43.023438 24.6875 80.105469 60.339844 98.171875l-.417969.847656-9.492187 37.121094c3.082031 30.25 28.628906 53.859375 59.699218 53.859375 31.070313 0 56.621094-23.621094 59.691406-53.878906l-9.492187-37.101563-.457031-.941406c35.6875-18.179687 60.128906-55.269531 60.128906-98.078125v-56zm0 0" fill="#fed2a4"></path><path d="m160.257812 381.773438-.300781 1.175781-69.730469 9.050781h-.007812c-23.449219-8.121094-40.300781-30.40625-40.300781-56.625 32.914062 0 59.804687-26.539062 60.070312-59.375h.011719v-29.898438c0 30.277344 12.277344 57.683594 32.117188 77.515626 8.164062 8.160156 17.609374 15.046874 28.015624 20.320312l-.417968.84375zm0 0" fill="#424d63"></path><path d="m110 190v85.480469c0 .167969 0 .347656-.011719.519531h-39.957031c-11.050781 0-20.03125-8.949219-20.03125-20v-46c0-11.039062 8.960938-19.980469 20-20h.03125zm0 0" fill="#83c2b1"></path><path d="m270.28125 240c5.519531 0 10-4.480469 10-10s-4.480469-10-10-10c-5.53125 0-10 4.480469-10 10s4.46875 10 10 10zm0 0"></path><path d="m170.28125 240c5.519531 0 10-4.480469 10-10s-4.480469-10-10-10c-5.53125 0-10 4.480469-10 10s4.46875 10 10 10zm0 0"></path><path d="m0 480.050781v21.949219c0 5.523438 4.476562 10 10 10h420c5.523438 0 10-4.476562 10-10v-21.96875c0-39.769531-22.339844-76.523438-63.683594-91.613281 14.945313-13.054688 24.03125-32.183594 24.023438-52.863281 0-5.5-4.5-9.976563-10-9.976563-24.054688 0-44.328125-17.011719-49.210938-39.578125h28.902344c16.527344 0 29.96875-13.457031 29.96875-30v-46c0-13.042969-8.359375-24.164062-20-28.285156v-21.714844c0-88.222656-71.761719-160-159.96875-160-88.410156 0-160.03125 71.550781-160.03125 160v21.730469c-11.636719 4.136719-20 15.253906-20 28.269531v46c0 16.542969 13.472656 30 30.03125 30h28.839844c-4.875 22.566406-25.128906 39.578125-49.160156 39.578125-5.5 0-10 4.476563-10 9.976563-.007813 20.707031 9.101562 39.855468 24.085937 52.917968-41.183594 15.101563-63.796875 52.226563-63.796875 91.578125zm379.746094-135.308593c-3.113282 16.769531-14.652344 31.003906-30.777344 37.398437l-60.582031-7.867187-6.472657-25.296876c18.886719-11.292968 33.9375-27.25 44.023438-45.980468 9.410156 21.804687 29.621094 37.976562 53.808594 41.746094zm-79.316406-164.742188c-27.625 0-50.101563-22.757812-50.101563-50.730469 0-5.523437-4.476563-10-10-10-5.519531 0-10 4.476563-10 10 0 27.972657-22.476563 50.730469-50.109375 50.730469h-59.9375c0-55.140625 44.859375-100 100-100 55.246094 0 100 44.710938 100 100zm-180.429688 20h59.96875c25.484375 0 47.835938-13.785156 60.109375-34.355469 12.273437 20.570313 34.621094 34.355469 60.101563 34.355469h19.820312v46c0 37.824219-20.949219 71.992188-54.667969 89.167969-14.109375 7.1875-29.351562 10.832031-45.300781 10.832031-15.90625 0-31.101562-3.617188-45.171875-10.75-9.441406-4.785156-18.039063-11.019531-25.558594-18.542969-18.894531-18.882812-29.300781-43.996093-29.300781-70.707031zm57.167969 158.023438c13.691406 5.289062 28.144531 7.976562 43.113281 7.976562 15.027344 0 29.535156-2.710938 43.285156-8.054688l6.347656 24.824219c-3.332031 24.757813-24.335937 43.230469-49.535156 43.230469-25.195312 0-46.199218-18.464844-49.539062-43.214844zm202.832031-102.023438c0 5.515625-4.472656 10-9.96875 10h-30.03125v-66h30.03125c5.496094 0 9.96875 4.484375 9.96875 10zm-159.96875-236c77.179688 0 139.96875 62.804688 139.96875 140v20h-19.96875c0-66.300781-53.660156-120-120-120-66.167969 0-120 53.832031-120 120h-20.03125v-20c0-77.351562 62.636719-140 140.03125-140zm-160.03125 236v-46c0-5.503906 4.492188-9.988281 10.03125-10h29.96875v66h-29.96875c-5.53125 0-10.03125-4.484375-10.03125-10zm54.578125 46.96875c5.480469 10.125 12.457031 19.515625 20.832031 27.882812 7.046875 7.050782 14.902344 13.144532 23.402344 18.21875l-6.441406 25.207032-60.75 7.882812c-16.144532-6.398437-27.699219-20.640625-30.816406-37.417968 24.179687-3.773438 44.378906-19.960938 53.773437-41.773438zm-24.265625 99.492188 1.101562-.140626h.007813c.007813-.003906.015625-.003906.023437-.003906l61.121094-7.929687c8.097656 30.089843 35.386719 51.613281 67.5625 51.613281 32.175782 0 59.460938-21.523438 67.554688-51.617188 3.046875.398438-16.054688-2.082031 62.25 8.082032 43.839844 5.695312 70.066406 38.550781 70.066406 77.566406v11.96875h-400v-11.949219c0-38.285156 26.210938-71.863281 70.3125-77.589843zm0 0"></path><path d="m193.546875 308.734375c8.394531 3.957031 17.390625 5.964844 26.730469 5.964844 9.125 0 17.941406-1.925781 26.214844-5.722657 5.019531-2.300781 7.21875-8.238281 4.914062-13.257812-2.300781-5.019531-8.238281-7.222656-13.257812-4.917969-5.636719 2.585938-11.648438 3.898438-17.867188 3.898438-6.371094 0-12.5-1.363281-18.207031-4.054688-4.996094-2.355469-10.953125-.214843-13.308594 4.78125-2.355469 4.996094-.214844 10.957031 4.78125 13.308594zm0 0"></path><path d="m310.28125 466h40c5.523438 0 10-4.476562 10-10s-4.476562-10-10-10h-40c-5.523438 0-10 4.476562-10 10s4.476562 10 10 10zm0 0"></path><path d="m390 466c5.519531 0 10-4.480469 10-10s-4.480469-10-10-10-10 4.480469-10 10 4.480469 10 10 10zm0 0"></path></svg>
            </div>
            
            <!-- Name -->
            <div class="vella-name" id="vella-voice-name">\${config.title}</div>
          </div>
          
          <!-- Content Area with Fixed Height -->
          <div class="vella-content-area">
            <!-- Timer (Always visible at top) -->
            <div class="vella-rec-status">
              <span class="vella-rec-dot" id="vella-rec-dot" style="display: none;"></span>
              <span class="vella-rec-time" id="vella-rec-timer">00:00</span>
            </div>
            
            <!-- Button Container (Both buttons in same position) -->
            <div style="position: relative; width: 80px; height: 80px; margin: 0 auto;">
              <!-- Start Call Button (Visible initially) -->
              <button id="vella-inline-call-btn" class="vella-start-call-btn" data-state="ready" title="Start Call">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </button>
              
              <!-- Status Indicator (Hidden initially) -->
              <div class="vella-status-indicator" id="vella-status-indicator" style="display: none;">
                <svg class="vella-status-icon" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="vella-footer">
            <span>Powered by</span>
            <svg class="vella-footer-logo" viewBox="0 0 24 24" fill="#8B5CF6">
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <span style="color: #8B5CF6; font-weight: 600;">Vella AI</span>
          </div>
          
          <!-- Hidden elements for accessibility -->
          <div id="vella-inline-status" style="position: absolute; left: -9999px;">Ready to talk</div>
          <div id="vella-inline-subtitle" style="position: absolute; left: -9999px;">Click to start</div>
          <div id="vella-inline-pulse" style="display: none;"></div>
        </div>
      \`;
      return html;
    },

    bindInlineVoiceEvents: function() {
      console.log('🔗 Vella Widget: bindInlineVoiceEvents() called');
      const self = this;
      
      // Get UI elements
      const startCallBtn = document.getElementById('vella-inline-call-btn');
      const callStatus = document.getElementById('vella-call-status');
      const recTimer = document.getElementById('vella-rec-timer');
      const recDot = document.getElementById('vella-rec-dot');
      const statusIndicator = document.getElementById('vella-status-indicator');
      
      let callStartTime = null;
      let timerInterval = null;
      
      // Function to update timer
      const updateTimer = () => {
        if (callStartTime) {
          const elapsed = Math.floor((Date.now() - callStartTime) / 1000);
          const minutes = Math.floor(elapsed / 60);
          const seconds = elapsed % 60;
          if (recTimer) {
            recTimer.textContent = \`\${String(minutes).padStart(2, '0')}:\${String(seconds).padStart(2, '0')}\`;
          }
        }
      };
      
      // Start call button click
      if (startCallBtn) {
        startCallBtn.onclick = function() {
          console.log('📞 Vella Widget: Start call clicked');
          isVoiceMode = true;
          self.startConversation();
          
          setTimeout(() => {
            self.startVoiceListening();
          }, 500);
          
          // Hide start button, show status indicator
          startCallBtn.style.display = 'none';
          if (statusIndicator) {
            statusIndicator.style.display = 'flex';
            statusIndicator.classList.add('listening');
          }
          if (recDot) recDot.style.display = 'inline-block';
          
          // Initialize and start timer
          if (recTimer) recTimer.textContent = '00:00';
          callStartTime = Date.now();
          updateTimer(); // Update immediately to show 00:00
          timerInterval = setInterval(updateTimer, 1000);
          
          // Update status (hidden text for accessibility)
          if (callStatus) callStatus.textContent = 'Listening...';
        };
      }
      
      // Status indicator click to end call
      if (statusIndicator) {
        statusIndicator.onclick = function() {
          // Only end call if we're in an active call
          if (isVoiceMode && statusIndicator.style.display !== 'none') {
            console.log('🛑 Vella Widget: Status indicator clicked - ending call');
            isVoiceMode = false;
            self.endVoiceConversation();
            
            // Show start button, hide status indicator
            if (startCallBtn) startCallBtn.style.display = 'flex';
            if (statusIndicator) {
              statusIndicator.style.display = 'none';
              statusIndicator.classList.remove('listening', 'processing', 'speaking');
            }
            if (recDot) recDot.style.display = 'none';
            
            // Stop timer
            if (timerInterval) {
              clearInterval(timerInterval);
              timerInterval = null;
            }
            callStartTime = null;
            if (recTimer) recTimer.textContent = '00:00';
          }
        };
      }
      
      console.log('✅ Vella Widget: Inline voice events bound');
    },

    bindEvents: function() {
      console.log('🔗 Vella Widget: bindEvents() called - looking for elements...');
      console.log('widgetContainer exists:', !!widgetContainer);
      if (widgetContainer) {
        console.log('widgetContainer children:', widgetContainer.children.length);
      }
      
      // Bind interactive controls. Use assignment (onclick/ons) to overwrite previous handlers
      // and avoid duplicate listeners caused by multiple bindEvents() calls.
      const self = this;

  // Toggle widget (overwrite any previous handler)
  if (triggerButton) {
    triggerButton.onclick = self.toggleWidget.bind(self);
    console.log('? Vella Widget: Trigger button onclick bound');
  }

  // Close widget (overwrite)
  const closeBtn = widgetContainer.querySelector('#vella-close');
  if (closeBtn) {
    closeBtn.onclick = self.closeWidget.bind(self);
    console.log('✅ Vella Widget: Close button onclick bound');
  } else {
    console.log('❌ Vella Widget: Close button not found');
  }

  // Send message (overwrite)
  const sendBtn = widgetContainer.querySelector('#vella-send');
  if (sendBtn) {
    sendBtn.onclick = function (e) {
      e && e.preventDefault && e.preventDefault();
      console.log('🖱️ Vella Widget: Send button clicked (onclick)');
      self.sendMessage();
    };
    console.log('✅ Vella Widget: Send button onclick bound');
  } else {
    console.log('❌ Vella Widget: Send button NOT found in widget container');
  }

  // Enter key to send (overwrite)
  const input = widgetContainer.querySelector('#vella-input');
  if (input) {
    input.onkeypress = function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        console.log('⌨️ Vella Widget: Enter key pressed (onkeypress)');
        self.sendMessage();
      }
    };
    console.log('✅ Vella Widget: Input onkeypress bound');
  } else {
    console.log('❌ Vella Widget: Input field NOT found in widget container');
  }

  // Voice toggle button (overwrite)
  const voiceToggleBtn = widgetContainer.querySelector('#vella-voice-toggle');
  if (voiceToggleBtn) {
    voiceToggleBtn.onclick = function () {
      console.log('📞 Vella Widget: Voice toggle button clicked (onclick)');
      self.toggleVoiceMode();
    };
    console.log('✅ Vella Widget: Voice toggle button onclick bound');
  } else {
    console.log('❌ Vella Widget: Voice toggle button NOT found in widget container');
  }

  // Voice call controls
  const voiceToggleListeningBtn = widgetContainer.querySelector('#vella-voice-toggle-listening');
  if (voiceToggleListeningBtn) {
    voiceToggleListeningBtn.onclick = function () {
      console.log('🎤 Vella Widget: Voice toggle listening button clicked');
      if (isVoiceMode) {
        self.toggleVoiceListening();
      }
    };
    console.log('✅ Vella Widget: Voice toggle listening button onclick bound');
  }

  const voiceMuteBtn = widgetContainer.querySelector('#vella-voice-mute');
  if (voiceMuteBtn) {
    voiceMuteBtn.onclick = function () {
      console.log('🔊 Vella Widget: Voice mute button clicked');
      self.toggleMute();
    };
    console.log('✅ Vella Widget: Voice mute button onclick bound');
  }

  const voiceEndBtn = widgetContainer.querySelector('#vella-voice-end');
  if (voiceEndBtn) {
    voiceEndBtn.onclick = function () {
      console.log('📞 Vella Widget: Voice end button clicked');
      self.endVoiceCall();
    };
    console.log('✅ Vella Widget: Voice end button onclick bound');
  }

  // Main voice button for voice widget (single button flow)
  const voiceMainBtn = widgetContainer.querySelector('#vella-voice-main-btn');
  if (voiceMainBtn) {
    voiceMainBtn.onclick = function () {
      console.log('🎤 Vella Widget: Main voice button clicked, current state:', self.voiceState);
      self.handleVoiceButtonClick();
    };
    console.log('✅ Vella Widget: Main voice button onclick bound');
  }

  // End button for voice widget (stops conversation and returns to ready)
  const voiceEndButton = widgetContainer.querySelector('#vella-voice-end-btn');
  if (voiceEndButton) {
    voiceEndButton.onclick = function () {
      console.log('🛑 Vella Widget: End conversation button clicked');
      self.endVoiceConversation();
    };
    console.log('✅ Vella Widget: End conversation button onclick bound');
  }

  // Microphone button (overwrite)
  const micBtn = widgetContainer.querySelector('#vella-mic');
  if (micBtn) {
    micBtn.onclick = function () {
      console.log('🎤 Vella Widget: Microphone button clicked (onclick)');
      self.toggleVoiceRecording();
    };
    console.log('✅ Vella Widget: Microphone button onclick bound');
  } else {
    console.log('❌ Vella Widget: Microphone button NOT found in widget container');
  }
},
    toggleWidget: function() {
      console.log('🔄 Vella Widget: toggleWidget() called, current isOpen:', isOpen);
      if (isOpen) {
        this.closeWidget();
      } else {
        this.openWidget();
      }
    },

    openWidget: function() {
      console.log('📂 Vella Widget: openWidget() called');
      isOpen = true;
      widgetContainer.style.display = 'block';
      triggerButton.style.display = 'none'; // Hide trigger button when widget is open
      console.log('✅ Vella Widget: Widget opened, display set to block');
      
      // Add initial greeting message if messages container is empty
      const messagesContainer = document.getElementById('vella-messages');
      if (messagesContainer && messagesContainer.children.length === 0) {
        this.addMessage(\`Hello! I'm \${config.title}, your dedicated assistant for all things educational. How can I assist you today with your educational needs?\`, 'agent');
      }
      
      // Start conversation if not already started
      if (!conversationId) {
        console.log('💬 Vella Widget: No conversation ID, starting new conversation');
        this.startConversation();
      } else {
        console.log('💬 Vella Widget: Conversation already exists, ID:', conversationId);
      }

      // Don't auto-start for voice widgets - wait for user to click Start Call
      
      // Re-bind events in case DOM was re-rendered
      setTimeout(() => {
        console.log('⏰ Vella Widget: openWidget setTimeout triggered, re-binding events');
        this.bindEvents();
      }, 100);
    },

    closeWidget: function() {
      console.log('📁 Vella Widget: closeWidget() called');
      isOpen = false;
      widgetContainer.style.display = 'none';
      triggerButton.style.display = 'block'; // Show trigger button when widget is closed
      triggerButton.innerHTML = '💬';
      
      // Stop voice listening if active
      this.stopVoiceListening();
      
      // Stop any audio playback
      if (isPlaying) {
        this.stopSpeech();
        this.stopAudio();
      }
      
      console.log('✅ Vella Widget: Widget closed, display set to none');
    },

    startConversation: async function() {
      console.log('🚀 Vella Widget: startConversation() called for agentId:', config.agentId);
      console.log('🔍 Vella Widget: Current conversationId before start:', conversationId);
      console.log('🔍 Vella Widget: WebSocket state:', ws ? ws.readyState : 'null');
      
      // Prevent duplicate calls - check if WebSocket is already open or connecting
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        console.log('⚠️ Vella Widget: WebSocket already open or connecting, skipping startConversation');
        return;
      }
      
      // Connect WebSocket directly - it will handle conversation start
      this.connectWebSocket();
    },

    connectWebSocket: function() {
      console.log('🔌 connectWebSocket called - agentId:', config.agentId);
      
      // Close existing connection if any
      if (ws) {
        console.log('🔌 Closing existing WebSocket connection');
        ws.close();
        ws = null;
      }

      const wsUrl = config.apiBaseUrl.replace('https://', 'wss://').replace('http://', 'ws://');
      const wsEndpoint = \`\${wsUrl}/ws/conversation/\${config.agentId}\`;
      
      console.log('🔌 WebSocket URL constructed:', wsEndpoint);
      console.log('🔌 apiBaseUrl:', config.apiBaseUrl);
      
      const self = this; // Preserve context for event handlers
      
      try {
        console.log('🔌 Creating new WebSocket connection...');
        ws = new WebSocket(wsEndpoint);
        console.log('🔌 WebSocket object created, readyState:', ws.readyState);
        
        ws.onopen = () => {
          console.log('✅✅✅ WebSocket connected successfully! ✅✅✅');
          console.log('🔌 WebSocket readyState:', ws.readyState);
          wsReconnectAttempts = 0;
          
          // Send start conversation message
          console.log('📡 Sending start_conversation event via WebSocket');
          ws.send(JSON.stringify({
            type: 'start_conversation',
            agent_id: config.agentId,
            channel: 'phone'
          }));
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('📨 WebSocket message received:', data);
            
            self.handleWebSocketMessage(data);
          } catch (error) {
            console.error('❌ Error parsing WebSocket message:', error);
            console.log('Raw message:', event.data);
          }
        };
        
        ws.onerror = (error) => {
          console.error('❌❌❌ WebSocket error occurred:', error);
          console.error('🔌 WebSocket readyState after error:', ws?.readyState);
        };
        
        ws.onclose = (event) => {
          console.log('🔌🔌🔌 WebSocket closed - code:', event.code, 'reason:', event.reason);
          ws = null; // Clear the connection
          
          // Attempt to reconnect if not a normal closure
          if (event.code !== 1000 && wsReconnectAttempts < wsMaxReconnectAttempts) {
            wsReconnectAttempts++;
            const delay = wsReconnectDelay * wsReconnectAttempts;
            console.log(\`🔄 Attempting to reconnect WebSocket in \${delay}ms (attempt \${wsReconnectAttempts}/\${wsMaxReconnectAttempts})\`);
            
            setTimeout(() => {
              self.connectWebSocket();
            }, delay);
          }
        };
      } catch (error) {
        console.error('❌ Failed to create WebSocket:', error);
      }
    },

    handleWebSocketMessage: function(data) {
      const messageType = data.type;
      console.log('🔍 Handling message type:', messageType);
      
      switch (messageType) {
        case 'conversation_started':
          console.log('🎉 Conversation started via WebSocket');
          if (data.conversation_id) {
            conversationId = data.conversation_id;
            console.log('✅ Conversation ID set to:', conversationId);
          }
          if (data.greeting || data.message) {
            const greetingText = data.greeting || data.message;
            console.log('👋 Greeting received:', greetingText);
            // For voice widget, we don't add messages to chat
            // Just log it or handle it differently
            if (config.widgetType !== 'voice' && !isVoiceMode) {
              this.addMessage(greetingText, 'agent');
            }
          }
          break;
          
        case 'greeting':
          console.log('👋 Received greeting');
          if (data.message) {
            if (config.widgetType !== 'voice' && !isVoiceMode) {
              this.addMessage(data.message, 'agent');
            }
          }
          break;
          
        case 'response_start':
          console.log('🎬 Response started');
          currentResponseText = '';
          audioChunks = [];
          
          // Typing indicator already shown in sendMessage, no need to show again
          
          if (config.widgetType === 'voice' || isVoiceMode) {
            voiceState = 'processing';
            this.updateVoiceState('processing');
          }
          break;
          
        case 'response_chunk':
          console.log('📝 Response chunk:', data.content);
          currentResponseText += data.content;
          
          // Update message in real-time for chat mode
          if (!isVoiceMode && config.widgetType !== 'voice') {
            // Hide typing indicator on first chunk
            this.hideTypingIndicator();
            this.updateStreamingMessage(currentResponseText);
          }
          break;
          
        case 'response_complete':
          console.log('✅ Response complete:', data.full_response);
          
          if (!isVoiceMode && config.widgetType !== 'voice') {
            this.hideTypingIndicator();
            this.finalizeStreamingMessage(data.full_response || currentResponseText);
          }
          break;
          
        case 'audio_start':
          console.log('🎵 Audio stream started');
          audioChunks = [];
          isAudioStreamComplete = false; // Reset flag when new audio stream starts
          
          if (config.widgetType === 'voice' || isVoiceMode) {
            voiceState = 'responding';
            this.updateVoiceState('responding');
          }
          break;
          
        case 'audio_chunk':
          console.log('🎵 Audio chunk received, length:', data.audio?.length);
          
          // Ignore audio chunks if not in voice mode or call is not active
          if (!isVoiceMode && config.widgetType !== 'voice') {
            console.log('⚠️ Vella Widget: Ignoring audio chunk - not in voice mode');
            break;
          }
          
          if (data.audio) {
            // Add audio chunk to queue for sequential playback
            if (config.widgetType === 'voice' || isVoiceMode) {
              this.enqueueAudioChunk(data.audio);
            }
          }
          break;
          
        case 'audio_complete':
          console.log('🎵 Audio stream complete');
          
          // Mark that server finished sending audio chunks
          isAudioStreamComplete = true;
          audioChunks = [];
          console.log('✅ Server finished sending audio, queue will process remaining chunks');
          break;
          
        case 'message_received':
          console.log('📬 Message received by server');
          break;
          
        case 'error':
          console.error('❌ Server error:', data.message || data.error);
          if (!isVoiceMode && config.widgetType !== 'voice') {
            this.hideTypingIndicator();
            this.addMessage('Sorry, an error occurred. Please try again.', 'agent');
          } else {
            // Reset voice state on error
            voiceState = 'ready';
            this.updateVoiceState('ready');
          }
          break;
          
        default:
          console.log('❓ Unknown message type:', messageType);
          console.log('📦 Full data:', data);
      }
    },

    updateStreamingMessage: function(text) {
      const messagesContainer = document.getElementById('vella-messages');
      if (!messagesContainer) return;
      
      // Check if there's already a streaming message wrapper
      let streamingWrapper = document.getElementById('vella-streaming-wrapper');
      
      if (!streamingWrapper) {
        // Create new streaming message wrapper
        streamingWrapper = document.createElement('div');
        streamingWrapper.id = 'vella-streaming-wrapper';
        streamingWrapper.style.cssText = \`
          display: flex;
          justify-content: flex-start;
          margin-bottom: 4px;
        \`;
        
        const messageDiv = document.createElement('div');
        messageDiv.id = 'vella-streaming-message';
        messageDiv.className = 'vella-message vella-agent-message';
        messageDiv.style.cssText = \`
          max-width: 75%;
          padding: 10px 14px;
          border-radius: 4px 16px 16px 16px;
          font-size: 14px;
          line-height: 1.5;
          word-wrap: break-word;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          background: white;
          color: #1f2937;
          border: 1px solid #e5e7eb;
        \`;
        
        streamingWrapper.appendChild(messageDiv);
        messagesContainer.appendChild(streamingWrapper);
      }
      
      // Update the message content
      const messageDiv = document.getElementById('vella-streaming-message');
      if (messageDiv) {
        messageDiv.textContent = text;
      }
      
      // Auto-scroll with smooth behavior
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
      });
    },

    finalizeStreamingMessage: function(text) {
      const streamingWrapper = document.getElementById('vella-streaming-wrapper');
      const streamingMsg = document.getElementById('vella-streaming-message');
      
      if (streamingWrapper && streamingMsg) {
        // Remove IDs so they become regular messages
        streamingWrapper.removeAttribute('id');
        streamingMsg.removeAttribute('id');
      } else {
        // If no streaming message, add final message normally
        this.addMessage(text, 'agent');
      }
    },

    sendMessage: async function(voiceTranscript = null) {
      console.log('📤 Vella Widget: sendMessage() called - START, voiceTranscript:', voiceTranscript);
      const input = document.getElementById('vella-input');
      console.log('📝 Vella Widget: Input element found:', !!input);
      
      // Use voiceTranscript if provided, otherwise get from input field
      const message = voiceTranscript || (input ? input.value.trim() : '');
      console.log('💬 Vella Widget: Message to send:', message);
      
      if (!message) {
        console.log('⚠️ Vella Widget: No message to send');
        return;
      }

      console.log('✅ Vella Widget: Proceeding to send message...');
      
      // Add user message to chat (only in chat mode)
      if (!isVoiceMode && config.widgetType !== 'voice') {
        this.addMessage(message, 'user');
      }
      
      // Clear input after adding message (only if input exists)
      if (input && !voiceTranscript) {
        input.value = '';
      }

      // Update voice state to processing
      if (config.widgetType === 'voice' || isVoiceMode) {
        voiceState = 'processing';
        this.updateVoiceState('processing');
      }
      
      // Show typing indicator (only in chat mode)
      if (!isVoiceMode && config.widgetType !== 'voice') {
        this.showTypingIndicator();
      }

      // Send message ONLY via WebSocket
      console.log('🔍 WebSocket status - ws:', ws, 'readyState:', ws?.readyState);
      
      if (ws && ws.readyState === WebSocket.OPEN) {
        console.log('✅ WebSocket is OPEN, sending message via WebSocket');
        try {
          const payload = JSON.stringify({
            type: 'message',
            message: message
          });
          console.log('📡 Sending WebSocket payload:', payload);
          ws.send(payload);
          console.log('✅ Message sent via WebSocket successfully');
        } catch (error) {
          console.error('❌ Error sending via WebSocket:', error);
          // Reset states on error
          if (config.widgetType === 'voice' || isVoiceMode) {
            voiceState = 'ready';
            this.updateVoiceState('ready');
          }
          if (!isVoiceMode && config.widgetType !== 'voice') {
            this.hideTypingIndicator();
          }
        }
      } else {
        console.error('❌ WebSocket not connected! Cannot send message.');
        console.log('⚠️ ws:', ws, 'readyState:', ws?.readyState);
        // Reset states
        if (config.widgetType === 'voice' || isVoiceMode) {
          voiceState = 'ready';
          this.updateVoiceState('ready');
        }
        if (!isVoiceMode && config.widgetType !== 'voice') {
          this.hideTypingIndicator();
          this.addMessage('Connection lost. Please refresh the page.', 'agent');
        }
      }
    },



    addMessage: function(text, sender) {
      console.log('💬 Vella Widget: addMessage() called with text:', text, 'sender:', sender);
      const messagesContainer = document.getElementById('vella-messages');
      console.log('📦 Vella Widget: Messages container found:', !!messagesContainer);
      const messageDiv = document.createElement('div');
      
      const isAgent = sender === 'agent';
      messageDiv.className = \`vella-message vella-\${sender}-message\`;
      
      // Add voice mode indicator for agent messages
      let displayText = text;
      if (isAgent && isVoiceMode && !text.includes('🎤') && !text.includes('Voice call')) {
        displayText = '🎤 ' + text;
      }
      
      // Create message bubble wrapper
      const bubbleWrapper = document.createElement('div');
      bubbleWrapper.style.cssText = \`
        display: flex;
        justify-content: \${isAgent ? 'flex-start' : 'flex-end'};
        margin-bottom: 4px;
      \`;
      
      messageDiv.style.cssText = \`
        max-width: 75%;
        padding: 10px 14px;
        border-radius: \${isAgent ? '4px 16px 16px 16px' : '16px 4px 16px 16px'};
        font-size: 14px;
        line-height: 1.5;
        word-wrap: break-word;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        \${isAgent ? 
          'background: white; color: #1f2937; border: 1px solid #e5e7eb;' : 
          'background: ' + config.primaryColor + '; color: white;'
        }
      \`;
      
      messageDiv.textContent = displayText;
      bubbleWrapper.appendChild(messageDiv);
      messagesContainer.appendChild(bubbleWrapper);
      
      // Scroll to bottom with smooth behavior
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
      });
      console.log('✅ Vella Widget: Message added to chat');
    },

    showTypingIndicator: function() {
      console.log('⌨️ Vella Widget: showTypingIndicator() called');
      const messagesContainer = document.getElementById('vella-messages');
      
      // Check if typing indicator already exists
      if (document.getElementById('vella-typing-wrapper')) {
        console.log('⚠️ Vella Widget: Typing indicator already exists, skipping');
        return;
      }
      
      const bubbleWrapper = document.createElement('div');
      bubbleWrapper.id = 'vella-typing-wrapper';
      bubbleWrapper.style.cssText = \`
        display: flex;
        justify-content: flex-start;
        margin-bottom: 4px;
      \`;
      
      const typingDiv = document.createElement('div');
      typingDiv.id = 'vella-typing';
      typingDiv.style.cssText = \`
        max-width: 75%;
        background: white;
        padding: 10px 14px;
        border-radius: 4px 16px 16px 16px;
        font-size: 14px;
        border: 1px solid #e5e7eb;
        color: #6b7280;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        display: flex;
        align-items: center;
        gap: 4px;
      \`;
      
      // Create animated dots
      typingDiv.innerHTML = \`
        <span>Typing</span>
        <span style="display: inline-flex; gap: 2px;">
          <span style="animation: pulse 1.4s ease-in-out infinite; animation-delay: 0s;">.</span>
          <span style="animation: pulse 1.4s ease-in-out infinite; animation-delay: 0.2s;">.</span>
          <span style="animation: pulse 1.4s ease-in-out infinite; animation-delay: 0.4s;">.</span>
        </span>
      \`;
      
      bubbleWrapper.appendChild(typingDiv);
      messagesContainer.appendChild(bubbleWrapper);
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
      });
      console.log('✅ Vella Widget: Typing indicator shown');
    },

    hideTypingIndicator: function() {
      console.log('⌨️ Vella Widget: hideTypingIndicator() called');
      const typingWrapper = document.getElementById('vella-typing-wrapper');
      if (typingWrapper) {
        typingWrapper.remove();
        console.log('✅ Vella Widget: Typing indicator removed');
      } else {
        console.log('⚠️ Vella Widget: Typing indicator not found to remove');
      }
    },

    toggleVoiceRecording: function() {
      console.log('🎤 Vella Widget: toggleVoiceRecording() called, current isRecording:', isRecording);
      if (isRecording) {
        this.stopVoiceRecording();
      } else {
        this.startVoiceRecording();
      }
    },

    startVoiceRecording: function() {
      console.log('🎤 Vella Widget: startVoiceRecording() called');
      
      // Check if speech recognition is supported
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.log('❌ Vella Widget: Speech recognition not supported');
        this.addMessage('Voice input is not supported in this browser.', 'agent');
        return;
      }

      // Prevent starting if already recording
      if (isRecording) {
        console.log('⚠️ Vella Widget: Already recording, ignoring start request');
        return;
      }

      try {
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        let finalTranscript = '';
        let interimTranscript = '';
        let lastSpeechActivity = Date.now();

        // Set recording state immediately
        isRecording = true;
        voiceState = 'listening';
        this.updateMicButton(true);
        this.updateVoiceState('listening');

        // Clear any existing silence timer
        if (silenceTimer) {
          clearTimeout(silenceTimer);
          silenceTimer = null;
        }

        recognition.onstart = () => {
          console.log('🎤 Vella Widget: Speech recognition started');
          const input = document.getElementById('vella-input');
          if (input && !isVoiceMode) {
            input.placeholder = 'Listening... Speak now';
          }
          
          this.updateVoiceState('listening');
        };

        recognition.onresult = (event) => {
          console.log('🎤 Vella Widget: Speech recognition result received');
          
          interimTranscript = '';
          let hasNewFinalResult = false;
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
              hasNewFinalResult = true;
            } else {
              interimTranscript += transcript;
            }
          }

          // Update last speech activity time if we have any speech
          if (interimTranscript.trim() || hasNewFinalResult) {
            lastSpeechActivity = Date.now();
            lastSpeechTime = Date.now();
            
            // Clear existing silence timer
            if (silenceTimer) {
              clearTimeout(silenceTimer);
            }
            
            // Set new silence timer (1.5 seconds)
            silenceTimer = setTimeout(() => {
              console.log('🔇 Vella Widget: Silence detected after 1.5 seconds');
              this.handleSilenceDetected(finalTranscript.trim());
            }, 1500);
          }

          const input = document.getElementById('vella-input');
          if (input) {
            input.value = finalTranscript + interimTranscript;
            if (!isVoiceMode) {
              input.placeholder = 'Listening... Speak now';
            }
          }
          
          // Update voice visualizer to show activity
          this.updateVoiceActivity(true);
          
          console.log('🎤 Vella Widget: Final transcript:', finalTranscript);
          console.log('🎤 Vella Widget: Interim transcript:', interimTranscript);
        };

        recognition.onerror = (event) => {
          console.error('🎤 Vella Widget: Speech recognition error:', event.error);
          
          // Clear silence timer
          if (silenceTimer) {
            clearTimeout(silenceTimer);
            silenceTimer = null;
          }
          
          // Don't show error for aborted (user clicked stop) or no-speech
          if (event.error !== 'aborted' && event.error !== 'no-speech') {
            this.stopVoiceRecording();
            if (event.error === 'not-allowed') {
              this.addMessage('Microphone access denied. Please allow microphone access and try again.', 'agent');
            } else {
              this.addMessage('Voice input failed. Please try again or type your message.', 'agent');
            }
          } else {
            // For aborted or no-speech, just stop recording without error message
            this.stopVoiceRecording();
          }
        };

        recognition.onend = () => {
          console.log('🎤 Vella Widget: Speech recognition ended');
          
          // Clear silence timer
          if (silenceTimer) {
            clearTimeout(silenceTimer);
            silenceTimer = null;
          }
          
          // Only auto-restart if we're in voice mode and actively listening
          if (isVoiceMode && isVoiceActive && voiceState === 'listening') {
            console.log('🔄 Vella Widget: Auto-restarting speech recognition');
            setTimeout(() => {
              if (isVoiceMode && isVoiceActive && !isPlaying) {
                this.startVoiceRecording();
              }
            }, 500);
          }
        };

        recognition.start();
        console.log('✅ Vella Widget: Speech recognition started successfully');
        
      } catch (error) {
        console.error('❌ Vella Widget: Failed to start speech recognition:', error);
        this.stopVoiceRecording();
        this.addMessage('Voice input failed. Please try again or type your message.', 'agent');
      }
    },

    handleSilenceDetected: function(transcript) {
      console.log('🔇 Vella Widget: handleSilenceDetected() called with transcript:', transcript);
      
      if (transcript && transcript.length > 0) {
        // Stop recording and process the message
        this.stopVoiceRecording();
        
        const input = document.getElementById('vella-input');
        if (input) {
          input.value = transcript;
        }
        
        // Check if we're in voice widget or voice mode
        if (config.widgetType === 'voice' || isVoiceMode) {
          console.log('🎤 Vella Widget: Voice widget/mode - sending voice message after silence');
          this.sendMessage(transcript); // Pass transcript directly
        } else {
          // In chat mode, auto-send after short delay
          setTimeout(() => {
            this.sendMessage();
          }, 500);
        }
      } else {
        console.log('🔇 Vella Widget: No transcript to process after silence');
      }
    },

    stopVoiceRecording: function() {
      console.log('🎤 Vella Widget: stopVoiceRecording() called');
      
      if (!isRecording) {
        console.log('⚠️ Vella Widget: Not currently recording, ignoring stop request');
        return;
      }
      
      // Clear silence timer
      if (silenceTimer) {
        clearTimeout(silenceTimer);
        silenceTimer = null;
      }
      
      if (recognition) {
        try {
          recognition.stop();
        } catch (error) {
          console.log('⚠️ Vella Widget: Error stopping recognition:', error);
        }
        recognition = null;
      }
      
      isRecording = false;
      voiceState = 'idle';
      this.updateMicButton(false);
      this.updateVoiceActivity(false);
      
      const input = document.getElementById('vella-input');
      if (input && input.placeholder === 'Listening... Speak now') {
        input.placeholder = 'Type your message...';
      }
      console.log('✅ Vella Widget: Voice recording stopped');
    },

    toggleVoiceListening: function() {
      console.log('🎤 Vella Widget: toggleVoiceListening() called, isVoiceActive:', isVoiceActive);
      
      if (isVoiceActive) {
        // Stop voice listening
        this.stopVoiceListening();
      } else {
        // Start voice listening
        this.startVoiceListening();
      }
    },

    handleVoiceButtonClick: function() {
      console.log('🎤 Vella Widget: handleVoiceButtonClick() called, current voiceState:', voiceState);
      
      if (voiceState === 'idle' || voiceState === 'ready') {
        // Start listening
        this.startVoiceListening();
      } else if (voiceState === 'listening') {
        // User wants to stop speaking - this will trigger processing
        // The recording will auto-stop and process when silence is detected
        console.log('⏸️ User stopped speaking, waiting for silence detection...');
      } else if (voiceState === 'processing' || voiceState === 'responding') {
        // In these states, button is disabled or doesn't respond
        console.log('⚠️ Cannot interact while processing or responding');
      }
    },

    endVoiceConversation: function() {
      console.log('🛑 Vella Widget: endVoiceConversation() called');
      
      // Stop speech synthesis immediately
      if ('speechSynthesis' in window && window.speechSynthesis) {
        try {
          if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
            window.speechSynthesis.cancel();
            console.log('✅ Vella Widget: Speech synthesis cancelled');
          }
        } catch (error) {
          console.error('Error cancelling speech:', error);
        }
      }
      
      // Stop any audio playback immediately
      if (isPlaying) {
        this.stopAudio();
        this.stopSpeech();
      }
      
      // Stop global currentAudio if playing
      if (currentAudio) {
        try {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          currentAudio = null;
          console.log('✅ Vella Widget: Global audio stopped');
        } catch (error) {
          console.error('Error stopping global audio:', error);
        }
      }
      
      // Clear audio queue to prevent background playback
      audioQueue = [];
      isPlayingQueue = false;
      isAudioStreamComplete = false;
      console.log('🗑️ Vella Widget: Audio queue cleared');
      
      // Stop current audio if playing (instance variable)
      if (this.currentAudio) {
        try {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
          this.currentAudio = null;
        } catch (error) {
          console.error('Error stopping instance audio:', error);
        }
      }
      
      // Stop any recording
      if (isRecording) {
        this.stopVoiceRecording();
      }
      
      // Close WebSocket connection to stop receiving audio chunks
      if (ws) {
        try {
          console.log('🔌 Vella Widget: Closing WebSocket connection');
          ws.close();
          ws = null;
          conversationId = null;
          console.log('✅ Vella Widget: WebSocket closed');
        } catch (error) {
          console.error('Error closing WebSocket:', error);
        }
      }
      
      // Reset all flags
      isPlaying = false;
      isVoiceActive = false;
      isVoiceMode = false;
      voiceState = 'ready';
      
      // Update UI to ready state
      this.updateVoiceState('ready');
      this.updateSpeechUI(false);
      this.updateAudioUI(false);
      
      console.log('✅ Vella Widget: Conversation ended, all audio stopped, WebSocket closed, returned to ready state');
    },

    startVoiceListening: function() {
      console.log('🎤 Vella Widget: startVoiceListening() called');
      
      if (isPlaying) {
        console.log('⚠️ Vella Widget: AI is currently speaking, cannot start listening');
        return;
      }
      
      isVoiceActive = true;
      voiceState = 'listening';
      this.updateVoiceListeningUI(true);
      this.updateVoiceState('listening');
      
      // Start the first recording session
      this.startVoiceRecording();
    },

    stopVoiceListening: function() {
      console.log('🎤 Vella Widget: stopVoiceListening() called');
      
      isVoiceActive = false;
      voiceState = 'idle';
      
      // Stop current recording if active
      if (isRecording) {
        this.stopVoiceRecording();
      }
      
      // Clear any timers
      if (silenceTimer) {
        clearTimeout(silenceTimer);
        silenceTimer = null;
      }
      
      this.updateVoiceListeningUI(false);
      this.updateVoiceState('idle');
    },

    updateVoiceListeningUI: function(active) {
      const voiceToggleBtn = document.getElementById('vella-voice-toggle-listening');
      const callStatus = document.getElementById('vella-call-status');
      const voiceInstruction = document.getElementById('vella-voice-instruction');
      
      if (voiceToggleBtn) {
        if (active) {
          voiceToggleBtn.style.background = '#ef4444';
          voiceToggleBtn.style.transform = 'scale(1.1)';
          voiceToggleBtn.innerHTML = '🔴';
          voiceToggleBtn.title = 'Stop voice conversation';
        } else {
          voiceToggleBtn.style.background = '#22c55e';
          voiceToggleBtn.style.transform = 'scale(1)';
          voiceToggleBtn.innerHTML = '🎤';
          voiceToggleBtn.title = 'Start voice conversation';
        }
      }
      
      if (active) {
        if (callStatus) {
          callStatus.textContent = 'Voice conversation active';
        }
        if (voiceInstruction) {
          voiceInstruction.textContent = 'Speak naturally - I\\'m listening';
        }
      } else {
        if (callStatus) {
          callStatus.textContent = 'Connected';
        }
        if (voiceInstruction) {
          voiceInstruction.textContent = 'Click the microphone to start voice conversation';
        }
      }
    },

    updateVoiceState: function(state) {
      console.log('🔄 Vella Widget: updateVoiceState() called with state:', state);
      voiceState = state;
      
      // Update legacy chat widget voice UI
      const callStatus = document.getElementById('vella-call-status');
      const voiceInstruction = document.getElementById('vella-voice-instruction');
      const voiceWave = document.getElementById('vella-voice-wave');
      
      // Update new voice widget UI
      const voiceStatusTitle = document.getElementById('vella-voice-status');
      const voiceSubtitle = document.getElementById('vella-voice-subtitle');
      const voiceMainBtn = document.getElementById('vella-voice-main-btn');
      const voiceEndBtn = document.getElementById('vella-voice-end-btn');
      const voicePulse = document.getElementById('vella-voice-pulse');
      const voiceIcon = document.getElementById('vella-voice-icon');
      
      // Update inline voice widget UI
      const inlineStatus = document.getElementById('vella-inline-status');
      const inlineSubtitle = document.getElementById('vella-inline-subtitle');
      const inlinePulse = document.getElementById('vella-inline-pulse');
      const inlineIcon = document.getElementById('vella-inline-icon');
      const inlineText = document.getElementById('vella-inline-text');
      const inlineIconContainer = document.getElementById('vella-inline-icon-container');
      const inlineCallBtn = document.getElementById('vella-inline-call-btn');
      const inlineCallStatus = document.getElementById('vella-call-status');
      const statusIndicator = document.getElementById('vella-status-indicator');
      
      switch (state) {
        case 'listening':
          // Legacy UI
          if (callStatus) {
            callStatus.textContent = 'Listening...';
          }
          if (voiceInstruction) {
            voiceInstruction.textContent = 'Speak naturally - I\\'m listening';
          }
          if (voiceWave) {
            voiceWave.style.background = 'rgba(34, 197, 94, 0.8)';
          }
          
          // New voice widget UI
          if (voiceStatusTitle) {
            voiceStatusTitle.textContent = 'Listening...';
            voiceStatusTitle.style.color = '#10B981';
          }
          if (voiceSubtitle) {
            voiceSubtitle.textContent = 'I\\'m listening... speak now';
          }
          if (voiceMainBtn) {
            voiceMainBtn.style.background = '#10B981';
            voiceMainBtn.style.animation = 'pulse 1.5s infinite';
            voiceMainBtn.disabled = false;
            voiceMainBtn.style.cursor = 'pointer';
            voiceMainBtn.style.display = 'flex';
          }
          if (voiceEndBtn) {
            voiceEndBtn.style.display = 'none';
          }
          if (voicePulse) {
            voicePulse.style.animation = 'pulse 1s infinite';
          }
          if (voiceIcon && voiceIcon.innerHTML) {
            voiceIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />';
          }
          
          // Inline widget UI - Update status indicator to listening state
          if (statusIndicator) {
            statusIndicator.classList.remove('processing', 'speaking');
            statusIndicator.classList.add('listening');
            // Change icon to animated wave bars (same as speaking)
            const icon = statusIndicator.querySelector('.vella-status-icon');
            if (icon) {
              icon.innerHTML = \`
                <g>
                  <rect x="4" y="8" width="3" height="8" fill="currentColor" rx="1.5">
                    <animate attributeName="height" values="8;16;8" dur="0.8s" repeatCount="indefinite"/>
                    <animate attributeName="y" values="8;4;8" dur="0.8s" repeatCount="indefinite"/>
                  </rect>
                  <rect x="10" y="6" width="3" height="12" fill="currentColor" rx="1.5">
                    <animate attributeName="height" values="12;18;12" dur="0.8s" begin="0.1s" repeatCount="indefinite"/>
                    <animate attributeName="y" values="6;3;6" dur="0.8s" begin="0.1s" repeatCount="indefinite"/>
                  </rect>
                  <rect x="16" y="4" width="3" height="16" fill="currentColor" rx="1.5">
                    <animate attributeName="height" values="16;20;16" dur="0.8s" begin="0.2s" repeatCount="indefinite"/>
                    <animate attributeName="y" values="4;2;4" dur="0.8s" begin="0.2s" repeatCount="indefinite"/>
                  </rect>
                </g>
              \`;
            }
          }
          if (inlineCallStatus) {
            inlineCallStatus.textContent = 'Listening...';
          }
          break;
          
        case 'processing':
          // Legacy UI
          if (callStatus) {
            callStatus.textContent = 'Processing...';
          }
          if (voiceInstruction) {
            voiceInstruction.textContent = 'Getting your response...';
          }
          if (voiceWave) {
            voiceWave.style.background = 'rgba(59, 130, 246, 0.8)';
            voiceWave.style.width = '100%';
            voiceWave.style.animation = 'pulse 1s infinite';
          }
          
          // New voice widget UI
          if (voiceStatusTitle) {
            voiceStatusTitle.textContent = 'Processing...';
            voiceStatusTitle.style.color = '#3B82F6';
          }
          if (voiceSubtitle) {
            voiceSubtitle.textContent = 'Understanding your question...';
          }
          if (voiceMainBtn) {
            voiceMainBtn.style.background = '#3B82F6';
            voiceMainBtn.style.animation = 'pulse 1s infinite';
            voiceMainBtn.disabled = true;
            voiceMainBtn.style.cursor = 'not-allowed';
            voiceMainBtn.style.display = 'flex';
          }
          if (voiceEndBtn) {
            voiceEndBtn.style.display = 'none';
          }
          if (voiceIcon && voiceIcon.innerHTML) {
            // Change to processing icon (spinner or clock)
            voiceIcon.innerHTML = '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"></path>';
          }
          
          // Inline widget UI - Update status indicator to processing state
          if (statusIndicator) {
            statusIndicator.classList.remove('listening', 'speaking');
            statusIndicator.classList.add('processing');
            // Change icon to processing/loading
            const icon = statusIndicator.querySelector('.vella-status-icon');
            if (icon) {
              icon.innerHTML = \`
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.25"/>
                <path fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8V2z" opacity="0.75"/>
              \`;
            }
          }
          if (inlineCallStatus) {
            inlineCallStatus.textContent = 'Processing...';
          }
          break;
          
        case 'responding':
          // Legacy UI
          if (callStatus) {
            callStatus.textContent = 'AI is speaking...';
          }
          if (voiceInstruction) {
            voiceInstruction.textContent = 'Listening to response...';
          }
          if (voiceWave) {
            voiceWave.style.background = 'rgba(168, 85, 247, 0.8)';
            voiceWave.style.width = '100%';
            voiceWave.style.animation = 'pulse 1s infinite';
          }
          
          // New voice widget UI
          if (voiceStatusTitle) {
            voiceStatusTitle.textContent = 'Speaking...';
            voiceStatusTitle.style.color = '#A855F7';
          }
          if (voiceSubtitle) {
            voiceSubtitle.textContent = 'AI is responding to you...';
          }
          if (voiceMainBtn) {
            voiceMainBtn.style.background = '#A855F7';
            voiceMainBtn.style.animation = 'pulse 1.5s infinite';
            voiceMainBtn.style.display = 'none'; // Hide main button
          }
          if (voiceEndBtn) {
            voiceEndBtn.style.display = 'flex'; // Show red end button
          }
          if (voiceIcon && voiceIcon.innerHTML) {
            // Change to speaker icon
            voiceIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />';
          }
          
          // Inline widget UI - Update status indicator to speaking state
          if (statusIndicator) {
            statusIndicator.classList.remove('listening', 'processing');
            statusIndicator.classList.add('speaking');
            // Change icon to animated sound waves
            const icon = statusIndicator.querySelector('.vella-status-icon');
            if (icon) {
              icon.innerHTML = \`
                <g>
                  <rect x="4" y="8" width="3" height="8" fill="currentColor" rx="1.5">
                    <animate attributeName="height" values="8;16;8" dur="0.8s" repeatCount="indefinite"/>
                    <animate attributeName="y" values="8;4;8" dur="0.8s" repeatCount="indefinite"/>
                  </rect>
                  <rect x="10" y="6" width="3" height="12" fill="currentColor" rx="1.5">
                    <animate attributeName="height" values="12;18;12" dur="0.8s" begin="0.1s" repeatCount="indefinite"/>
                    <animate attributeName="y" values="6;3;6" dur="0.8s" begin="0.1s" repeatCount="indefinite"/>
                  </rect>
                  <rect x="16" y="4" width="3" height="16" fill="currentColor" rx="1.5">
                    <animate attributeName="height" values="16;20;16" dur="0.8s" begin="0.2s" repeatCount="indefinite"/>
                    <animate attributeName="y" values="4;2;4" dur="0.8s" begin="0.2s" repeatCount="indefinite"/>
                  </rect>
                </g>
              \`;
            }
          }
          if (inlineCallStatus) {
            inlineCallStatus.textContent = 'AI is speaking...';
          }
          break;
          
        case 'idle':
        case 'ready':
        default:
          // Legacy UI
          if (callStatus) {
            callStatus.textContent = 'Connected';
          }
          if (voiceInstruction) {
            voiceInstruction.textContent = 'Click the microphone to start voice conversation';
          }
          if (voiceWave) {
            voiceWave.style.background = 'rgba(255,255,255,0.8)';
            voiceWave.style.width = '0%';
            voiceWave.style.animation = 'none';
          }
          
          // New voice widget UI
          if (voiceStatusTitle) {
            voiceStatusTitle.textContent = 'Ready to Talk';
            voiceStatusTitle.style.color = '#111827';
          }
          if (voiceSubtitle) {
            voiceSubtitle.textContent = 'Click the microphone to start speaking';
          }
          if (voiceMainBtn) {
            voiceMainBtn.style.background = config.primaryColor;
            voiceMainBtn.style.animation = 'none';
            voiceMainBtn.disabled = false;
            voiceMainBtn.style.cursor = 'pointer';
            voiceMainBtn.style.display = 'flex';
          }
          if (voiceEndBtn) {
            voiceEndBtn.style.display = 'none'; // Hide end button
          }
          if (voicePulse) {
            voicePulse.style.animation = 'pulse 2s infinite';
          }
          if (voiceIcon && voiceIcon.innerHTML) {
            // Reset to microphone icon
            voiceIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />';
          }
          
          // Inline widget UI - Reset to Ready state
          if (inlineCallStatus) {
            inlineCallStatus.textContent = 'Ready to talk';
          }
          break;
      }
    },

    updateVoiceActivity: function(active) {
      const voiceWave = document.getElementById('vella-voice-wave');
      
      if (voiceWave && voiceState === 'listening') {
        if (active) {
          voiceWave.style.width = '100%';
          voiceWave.style.animation = 'pulse 0.5s infinite';
        } else {
          voiceWave.style.width = '20%';
          voiceWave.style.animation = 'pulse 2s infinite';
        }
      }
    },

    updateMicButton: function(recording) {
      const micBtn = document.getElementById('vella-mic');
      if (micBtn) {
        if (recording) {
          micBtn.innerHTML = '🔴';
          micBtn.style.background = '#fee2e2';
          micBtn.style.borderColor = '#fca5a5';
          micBtn.style.animation = 'pulse 1s infinite';
          micBtn.title = 'Click to stop recording';
        } else {
          micBtn.innerHTML = '🎤';
          micBtn.style.background = '#f3f4f6';
          micBtn.style.borderColor = '#d1d5db';
          micBtn.style.animation = 'none';
          micBtn.title = 'Voice input';
        }
      }
    },

    // Voice Mode Functions
    toggleVoiceMode: function() {
      console.log('📞 Vella Widget: toggleVoiceMode() called, current isVoiceMode:', isVoiceMode);
      isVoiceMode = !isVoiceMode;
      this.updateVoiceMode();
    },

    updateVoiceMode: function() {
      console.log('📞 Vella Widget: updateVoiceMode() called, isVoiceMode:', isVoiceMode);
      const chatInput = document.getElementById('vella-chat-input');
      const voiceControls = document.getElementById('vella-voice-controls');
      const voiceToggle = document.getElementById('vella-voice-toggle');
      const messagesDiv = document.getElementById('vella-messages');
      const voiceScreen = document.getElementById('vella-voice-screen');

      if (chatInput && voiceControls && voiceToggle && messagesDiv && voiceScreen) {
        if (isVoiceMode) {
          // Switch to voice call mode - hide chat UI, show voice call screen
          chatInput.style.display = 'none';
          voiceControls.style.display = 'flex';
          messagesDiv.style.display = 'none';
          voiceScreen.style.display = 'flex';
          voiceToggle.innerHTML = '💬 Chat';
          voiceToggle.title = 'Switch to chat mode';
          voiceToggle.style.background = 'rgba(255,255,255,0.3)';
          
          // Initialize voice state
          voiceState = 'idle';
          isVoiceActive = false;
          this.updateVoiceState('idle');
          this.updateVoiceListeningUI(false);
          
          console.log('✅ Vella Widget: Switched to voice call mode');
        } else {
          // Switch to chat mode - show chat UI, hide voice call screen
          chatInput.style.display = 'flex';
          voiceControls.style.display = 'none';
          messagesDiv.style.display = 'block';
          voiceScreen.style.display = 'none';
          voiceToggle.innerHTML = '📞 Voice';
          voiceToggle.title = 'Switch to voice call mode';
          voiceToggle.style.background = 'rgba(255,255,255,0.2)';
          
          // Stop any ongoing voice activities
          this.stopVoiceListening();
          if (isPlaying) {
            this.stopSpeech();
            this.stopAudio();
          }
          
          console.log('✅ Vella Widget: Switched to chat mode');
        }
      }
    },

    endVoiceCall: function() {
      console.log('📞 Vella Widget: endVoiceCall() called');
      
      // Stop voice listening first
      this.stopVoiceListening();
      
      isVoiceMode = false;
      this.updateVoiceMode();
      
      // Stop any ongoing activities
      if (isPlaying) {
        this.stopSpeech();
        this.stopAudio();
      }
    },

    toggleMute: function() {
      console.log('🔊 Vella Widget: toggleMute() called');
      const muteBtn = document.getElementById('vella-voice-mute');
      if (muteBtn) {
        if (isPlaying) {
          // Stop both speech and audio
          this.stopSpeech();
          this.stopAudio();
          muteBtn.innerHTML = '🔇';
          muteBtn.title = 'Unmute';
        } else {
          muteBtn.innerHTML = '🔊';
          muteBtn.title = 'Mute';
        }
      }
    },

    // Text-to-Speech Functions
    speakText: function(text) {
      console.log('🗣️ Vella Widget: speakText() called with text:', text);
      
      // Check if speech synthesis is supported
      if (!('speechSynthesis' in window) || !window.speechSynthesis) {
        console.log('❌ Vella Widget: Speech synthesis not supported');
        return;
      }

      // Stop any current speech
      this.stopSpeech();

      try {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure voice settings
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.lang = 'en-US';

        // Set voice if available - wait for voices to load
        const setVoiceAndSpeak = () => {
          const voices = window.speechSynthesis.getVoices();
          const preferredVoice = voices.find(voice => 
            voice.lang.includes('en') && voice.name.includes('Female')
          ) || voices.find(voice => voice.lang.includes('en'));
          
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }

          utterance.onstart = () => {
            console.log('🗣️ Vella Widget: Speech started');
            isPlaying = true;
            this.updateSpeechUI(true);
            
            // Update voice call UI
            if (isVoiceMode) {
              voiceState = 'responding';
              this.updateVoiceState('responding');
            }
          };

          utterance.onend = () => {
            console.log('🗣️ Vella Widget: Speech ended');
            isPlaying = false;
            this.updateSpeechUI(false);
            
            // Reset voice state
            if (isVoiceMode && isVoiceActive) {
              voiceState = 'listening';
              this.updateVoiceState('listening');
            }
          };

          utterance.onerror = (error) => {
            console.error('🗣️ Vella Widget: Speech error:', error);
            isPlaying = false;
            this.updateSpeechUI(false);
            
            // Reset voice state on error
            if (isVoiceMode && isVoiceActive) {
              voiceState = 'listening';
              this.updateVoiceState('listening');
            }
          };

          window.speechSynthesis.speak(utterance);
          console.log('✅ Vella Widget: Speech synthesis started');
        };

        // Check if voices are already loaded
        if (window.speechSynthesis.getVoices().length > 0) {
          setVoiceAndSpeak();
        } else {
          // Wait for voices to load
          window.speechSynthesis.onvoiceschanged = () => {
            setVoiceAndSpeak();
            window.speechSynthesis.onvoiceschanged = null; // Remove listener
          };
        }
        
      } catch (error) {
        console.error('❌ Vella Widget: Failed to start speech synthesis:', error);
        isPlaying = false;
        this.updateSpeechUI(false);
      }
    },

    speakTextAsync: function(text) {
      console.log('🗣️ Vella Widget: speakTextAsync() called with text:', text);
      
      return new Promise((resolve, reject) => {
        // Check if speech synthesis is supported
        if (!('speechSynthesis' in window) || !window.speechSynthesis) {
          console.log('❌ Vella Widget: Speech synthesis not supported');
          resolve();
          return;
        }

        // Stop any current speech
        this.stopSpeech();

        try {
          const utterance = new SpeechSynthesisUtterance(text);
          
          // Configure voice settings
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          utterance.lang = 'en-US';

          // Set voice if available
          const setVoiceAndSpeak = () => {
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice => 
              voice.lang.includes('en') && voice.name.includes('Female')
            ) || voices.find(voice => voice.lang.includes('en'));
            
            if (preferredVoice) {
              utterance.voice = preferredVoice;
            }

            utterance.onstart = () => {
              console.log('🗣️ Vella Widget: Async speech started');
              isPlaying = true;
              this.updateSpeechUI(true);
              
              if (isVoiceMode) {
                voiceState = 'responding';
                this.updateVoiceState('responding');
              }
            };

            utterance.onend = () => {
              console.log('🗣️ Vella Widget: Async speech ended');
              isPlaying = false;
              this.updateSpeechUI(false);
              
              if (isVoiceMode && isVoiceActive) {
                voiceState = 'listening';
                this.updateVoiceState('listening');
              }
              
              resolve();
            };

            utterance.onerror = (error) => {
              console.error('🗣️ Vella Widget: Async speech error:', error);
              isPlaying = false;
              this.updateSpeechUI(false);
              
              if (isVoiceMode && isVoiceActive) {
                voiceState = 'listening';
                this.updateVoiceState('listening');
              }
              
              reject(error);
            };

            window.speechSynthesis.speak(utterance);
            console.log('✅ Vella Widget: Async speech synthesis started');
          };

          // Check if voices are already loaded
          if (window.speechSynthesis.getVoices().length > 0) {
            setVoiceAndSpeak();
          } else {
            // Wait for voices to load
            window.speechSynthesis.onvoiceschanged = () => {
              setVoiceAndSpeak();
              window.speechSynthesis.onvoiceschanged = null;
            };
          }
          
        } catch (error) {
          console.error('❌ Vella Widget: Failed to start async speech synthesis:', error);
          isPlaying = false;
          this.updateSpeechUI(false);
          reject(error);
        }
      });
    },

    stopSpeech: function() {
      console.log('🗣️ Vella Widget: stopSpeech() called');
      if ('speechSynthesis' in window && window.speechSynthesis) {
        try {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            console.log('✅ Vella Widget: Speech cancelled');
          }
          isPlaying = false;
          this.updateSpeechUI(false);
          console.log('✅ Vella Widget: Speech stopped');
        } catch (error) {
          console.error('🗣️ Vella Widget: Error stopping speech:', error);
          isPlaying = false;
          this.updateSpeechUI(false);
        }
      }
    },

    updateSpeechUI: function(speaking) {
      const muteBtn = document.getElementById('vella-voice-mute');
      if (muteBtn && isVoiceMode) {
        if (speaking) {
          muteBtn.style.background = '#22c55e';
          muteBtn.innerHTML = '🔊';
          muteBtn.style.animation = 'pulse 1s infinite';
          muteBtn.title = 'AI is speaking - Click to stop';
        } else {
          muteBtn.style.background = '#6b7280';
          muteBtn.innerHTML = '🔊';
          muteBtn.style.animation = 'none';
          muteBtn.title = 'Mute/Unmute';
        }
      }
    },

    // Audio Playback Functions
    playBase64Audio: function(base64Audio) {
      console.log('🎵 Vella Widget: playBase64Audio() called');
      
      if (!base64Audio) {
        console.log('❌ Vella Widget: No base64 audio provided');
        return;
      }

      try {
        // Stop any current speech or audio
        this.stopSpeech();
        this.stopAudio();

        // Set playing state
        isPlaying = true;
        this.updateAudioUI(true);

        // Convert base64 to blob
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const audio = new Audio(audioUrl);
        
        audio.onloadstart = () => {
          console.log('🎵 Vella Widget: Audio loading started');
        };

        audio.oncanplaythrough = () => {
          console.log('🎵 Vella Widget: Audio can play through');
        };

        audio.onplay = () => {
          console.log('🎵 Vella Widget: Audio playback started');
          
          // Update voice state for voice widget or voice mode
          if (config.widgetType === 'voice' || isVoiceMode) {
            voiceState = 'responding';
            this.updateVoiceState('responding');
          }
        };

        audio.onended = () => {
          console.log('🎵 Vella Widget: Audio playback ended');
          isPlaying = false;
          this.updateAudioUI(false);
          
          // Clean up
          URL.revokeObjectURL(audioUrl);
          
          // Don't restart listening here - let processAudioQueue handle it
          // This prevents premature state changes while queue is still processing
        };

        audio.onerror = (error) => {
          console.error('🎵 Vella Widget: Audio playback error:', error);
          isPlaying = false;
          this.updateAudioUI(false);
          
          // Clean up
          URL.revokeObjectURL(audioUrl);
        };

        // Store reference for stopping if needed
        this.currentAudio = audio;
        
        // Start playback
        audio.play().catch(error => {
          console.error('🎵 Vella Widget: Failed to start audio playback:', error);
          isPlaying = false;
          this.updateAudioUI(false);
          URL.revokeObjectURL(audioUrl);
        });

        console.log('✅ Vella Widget: Audio playback initiated');
        
      } catch (error) {
        console.error('❌ Vella Widget: Failed to play base64 audio:', error);
        isPlaying = false;
        this.updateAudioUI(false);
      }
    },

    enqueueAudioChunk: function(base64Audio) {
      console.log('📥 Vella Widget: Enqueueing audio chunk, queue length:', audioQueue.length);
      audioQueue.push(base64Audio);
      
      // Start processing queue if not already playing
      if (!isPlayingQueue) {
        this.processAudioQueue();
      }
    },

    processAudioQueue: function() {
      if (audioQueue.length === 0) {
        console.log('✅ Vella Widget: Audio queue empty');
        isPlayingQueue = false;
        
        // Only restart listening if BOTH queue is empty AND server finished sending chunks
        if (!isAudioStreamComplete) {
          console.log('⏳ Vella Widget: Waiting for more audio chunks from server...');
          return; // Don't restart yet, more chunks coming
        }
        
        console.log('✅ Vella Widget: All audio chunks played, stream complete');
        
        // Only restart listening if call is still active
        if ((config.widgetType === 'voice' || isVoiceMode) && isVoiceMode) {
          console.log('📞 Vella Widget: Auto-restarting listening (call mode)');
          
          // Brief pause before listening again
          setTimeout(() => {
            // Double-check call is still active before starting
            if (isVoiceMode) {
              voiceState = 'listening';
              this.updateVoiceState('listening');
              this.startVoiceRecording();
            } else {
              console.log('⚠️ Vella Widget: Call ended during audio playback, not restarting');
            }
          }, 100);
        }
        return;
      }

      isPlayingQueue = true;
      const nextChunk = audioQueue.shift();
      
      console.log('▶️ Vella Widget: Playing next audio chunk, remaining:', audioQueue.length);
      
      this.playBase64AudioChunk(nextChunk)
        .then(() => {
          console.log('✅ Vella Widget: Chunk finished, playing next immediately...');
          // Play next chunk immediately without delay
          this.processAudioQueue();
        })
        .catch(error => {
          console.error('❌ Vella Widget: Error playing chunk, skipping:', error);
          // Continue with next chunk even if this one failed
          this.processAudioQueue();
        });
    },

    playBase64AudioChunk: function(base64Audio) {
      console.log('🎵 Vella Widget: playBase64AudioChunk() called');
      
      return new Promise((resolve, reject) => {
        if (!base64Audio) {
          console.log('❌ Vella Widget: No base64 audio chunk provided');
          resolve();
          return;
        }

        try {
          // Convert base64 to blob
          const binaryString = atob(base64Audio);
          const bytes = new Uint8Array(binaryString.length);
          
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          const audio = new Audio(audioUrl);
          currentAudio = audio;
          
          // Preload the audio to reduce gap
          audio.preload = 'auto';
          audio.load();

          audio.onended = () => {
            console.log('🎵 Vella Widget: Audio chunk playback ended');
            URL.revokeObjectURL(audioUrl);
            resolve();
          };

          audio.onerror = (error) => {
            console.error('🎵 Vella Widget: Audio chunk playback error:', error);
            URL.revokeObjectURL(audioUrl);
            reject(error);
          };
          
          // Set up canplaythrough event for smoother playback
          audio.oncanplaythrough = () => {
            console.log('🎵 Vella Widget: Audio chunk ready to play');
          };

          // Start playback immediately
          console.log('🎵 Vella Widget: Starting audio chunk playback');
          audio.play().catch(error => {
            console.error('🎵 Vella Widget: Failed to play audio chunk:', error);
            URL.revokeObjectURL(audioUrl);
            reject(error);
          });
        } catch (error) {
          console.error('❌ Vella Widget: Failed to process audio chunk:', error);
          reject(error);
        }
      });
    },

    playBase64AudioAsync: function(base64Audio) {
      console.log('🎵 Vella Widget: playBase64AudioAsync() called');
      
      return new Promise((resolve, reject) => {
        if (!base64Audio) {
          console.log('❌ Vella Widget: No base64 audio provided');
          resolve();
          return;
        }

        try {
          // Stop any current speech or audio
          this.stopSpeech();
          this.stopAudio();

          // Set playing state
          isPlaying = true;
          this.updateAudioUI(true);

          // Convert base64 to blob
          const binaryString = atob(base64Audio);
          const bytes = new Uint8Array(binaryString.length);
          
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          const audio = new Audio(audioUrl);
          
          audio.onloadstart = () => {
            console.log('🎵 Vella Widget: Async audio loading started');
          };

          audio.onplay = () => {
            console.log('🎵 Vella Widget: Async audio playback started');
            
            // Update to responding state for voice widget or voice mode
            if (config.widgetType === 'voice' || isVoiceMode) {
              voiceState = 'responding';
              this.updateVoiceState('responding');
            }
          };

          audio.onended = () => {
            console.log('🎵 Vella Widget: Async audio playback ended');
            isPlaying = false;
            this.updateAudioUI(false);
            
            // Clean up
            URL.revokeObjectURL(audioUrl);
            
            // Reset voice state based on widget type
            if (config.widgetType === 'voice') {
              // Voice widget: go back to listening state and start recording for next question
              voiceState = 'listening';
              this.updateVoiceState('listening');
              isVoiceActive = true;
              
              // Start voice recording again for continuous conversation
              this.startVoiceRecording();
            } else if (isVoiceMode && isVoiceActive) {
              // Chat widget voice mode: stay in listening mode
              voiceState = 'listening';
              this.updateVoiceState('listening');
            }
            
            resolve();
          };

          audio.onerror = (error) => {
            console.error('🎵 Vella Widget: Async audio playback error:', error);
            isPlaying = false;
            this.updateAudioUI(false);
            
            // Clean up
            URL.revokeObjectURL(audioUrl);
            
            // Reset voice state on error based on widget type
            if (config.widgetType === 'voice') {
              voiceState = 'ready';
              this.updateVoiceState('ready');
              isVoiceActive = false;
            } else if (isVoiceMode && isVoiceActive) {
              voiceState = 'listening';
              this.updateVoiceState('listening');
            }
            
            reject(error);
          };

          // Store reference for stopping if needed
          this.currentAudio = audio;
          
          // Start playback
          audio.play().catch(error => {
            console.error('🎵 Vella Widget: Failed to start async audio playback:', error);
            isPlaying = false;
            this.updateAudioUI(false);
            URL.revokeObjectURL(audioUrl);
            reject(error);
          });

          console.log('✅ Vella Widget: Async audio playback initiated');
          
        } catch (error) {
          console.error('❌ Vella Widget: Failed to play async base64 audio:', error);
          isPlaying = false;
          this.updateAudioUI(false);
          reject(error);
        }
      });
    },

    stopAudio: function() {
      console.log('🎵 Vella Widget: stopAudio() called');
      
      if (this.currentAudio) {
        try {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
          this.currentAudio = null;
          console.log('✅ Vella Widget: Audio stopped');
        } catch (error) {
          console.error('🎵 Vella Widget: Error stopping audio:', error);
        }
      }
      
      isPlaying = false;
      this.updateAudioUI(false);
    },

    updateAudioUI: function(playing) {
      // Update the same UI elements as speech
      this.updateSpeechUI(playing);
    }
  };

  // Auto-initialize if config is already available
  if (window.vellaConfig) {
    console.log('🔄 Vella Widget: Auto-initializing with existing config:', window.vellaConfig);
    window.VellaWidget.init(window.vellaConfig);
  } else {
    console.log('⏳ Vella Widget: No existing config found, waiting for manual initialization');
  }
  
  console.log('🎉 Vella Widget: Script execution completed, VellaWidget object created');
})();`;

  return new Response(widgetScript, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
