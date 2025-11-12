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

  // Main widget initialization
  window.VellaWidget = {
    init: function(userConfig) {
      console.log('🎯 Vella Widget: init() called with config:', userConfig);
      config = {
        agentId: userConfig.agentId || '',
        widgetType: userConfig.widgetType || 'chat', // 'chat' or 'voice'
        theme: userConfig.theme || 'light',
        position: userConfig.position || 'bottom-right',
        size: userConfig.size || 'medium',
        primaryColor: userConfig.primaryColor || '#8266D4',
        title: userConfig.title || 'AI Assistant',
        apiBaseUrl: '${
          process.env.NEXT_PUBLIC_API_URL ||
          "https://ai-voice-agent-backend.octaloop.dev"
        }',
        widgetBaseUrl: '${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }'
      };
      console.log('📝 Vella Widget: Final config set:', config);

      this.createWidget();
      // bindEvents is now called in createWidgetContainer after DOM is ready
    },

    createWidget: function() {
      console.log('🏗️ Vella Widget: createWidget() called');
      // Create trigger button
      this.createTriggerButton();
      
      // Create widget container (initially hidden)
      this.createWidgetContainer();
    },

    createTriggerButton: function() {
      console.log('🔘 Vella Widget: createTriggerButton() called');
      triggerButton = document.createElement('button');
      triggerButton.id = 'vella-widget-trigger';
      // Set icon based on widget type
      triggerButton.innerHTML = config.widgetType === 'voice' ? '📞' : '💬';
      triggerButton.style.cssText = this.getTriggerButtonStyles();
      
      document.body.appendChild(triggerButton);
      console.log('✅ Vella Widget: Trigger button created and added to DOM');
    },

    createWidgetContainer: function() {
      console.log('📦 Vella Widget: createWidgetContainer() called');
      widgetContainer = document.createElement('div');
      widgetContainer.id = 'vella-widget';
      widgetContainer.style.cssText = this.getWidgetContainerStyles();
      widgetContainer.style.display = 'none';
      
      widgetContainer.innerHTML = this.getWidgetHTML();
      document.body.appendChild(widgetContainer);
      console.log('✅ Vella Widget: Widget container created and added to DOM');

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
        </style>
        <div style="height: 100%; display: flex; flex-direction: column; margin-bottom: 100px;">
          <!-- Header -->
          <div id="vella-header" style="
            padding: 16px;
            padding-right: 50px;
            background: \${config.primaryColor};
            color: white;
            border-radius: 12px 12px 0 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex: 0 0 auto;
            position: relative;
            overflow: hidden;
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
              ">🤖</div>
              <div>
                <div style="font-weight: 600; font-size: 14px;">\${config.title}</div>
                <div style="font-size: 12px; opacity: 0.9;">Online now</div>
              </div>
            </div>
            <button id="vella-close" style="
              position: absolute;
              top: 8px;
              right: 12px;
              background: none;
              border: none;
              color: white;
              cursor: pointer;
              padding: 6px;
              border-radius: 50%;
              font-size: 16px;
              z-index: 10;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 24px;
              height: 24px;
            ">×</button>
          </div>

          <!-- Messages -->
          <div id="vella-messages" style="
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background: white;
          ">
            <div class="vella-message vella-agent-message" style="
              background: #f3f4f6;
              padding: 12px;
              border-radius: 8px;
              flex: 1 1 auto;
              font-size: 14px;
            ">
              👋 Hi! I'm \${config.title}. How can I help you today?
            </div>
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
            padding: 12px;
            border-top: 1px solid #e5e7eb;
            background: white;
            border-radius: 0 0 12px 12px;
            position: relative;
            z-index: 5;
          ">
            <!-- Chat Mode Input -->
            <div id="vella-chat-input" style="display: flex; gap: 8px; align-items: center;">
              <input
                type="text"
                id="vella-input"
                placeholder="Type your message..."
                style="
                  flex: 1;
                  padding: 10px 12px;
                  border: 1px solid #d1d5db;
                  border-radius: 6px;
                  font-size: 14px;
                  outline: none;
                  font-family: inherit;
                "
              />
              <button id="vella-send" style="
                padding: 10px 16px;
                background: \${config.primaryColor};
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                white-space: nowrap;
                transition: opacity 0.2s;
              ">Send</button>
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
                Ready to Talk
              </h3>
              <p id="vella-voice-subtitle" style="font-size: 14px; color: #6B7280; margin-bottom: 24px; max-width: 280px;">
                Click the microphone to start speaking
              </p>
            </div>

            <!-- Single Voice Button -->
            <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 24px;">
              <!-- Main Voice Button (Microphone) -->
              <button id="vella-voice-main-btn" style="
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: \${config.primaryColor};
                color: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 8px 16px rgba(0,0,0,0.15);
                transition: all 0.3s;
                position: relative;
              " title="Start Voice Conversation">
                <svg id="vella-voice-icon" style="width: 40px; height: 40px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>

              <!-- End Call Button (Hidden by default, shown during speaking) -->
              <button id="vella-voice-end-btn" style="
                width: 64px;
                height: 64px;
                border-radius: 50%;
                background: #EF4444;
                color: white;
                border: none;
                cursor: pointer;
                display: none;
                align-items: center;
                justify-content: center;
                box-shadow: 0 8px 16px rgba(239,68,68,0.3);
                transition: all 0.3s;
              " title="End Conversation">
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


// ...existing code...
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
    console.log('✅ Vella Widget: Trigger button onclick bound');
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
      
      // Start conversation if not already started
      if (!conversationId) {
        console.log('💬 Vella Widget: No conversation ID, starting new conversation');
        this.startConversation();
      } else {
        console.log('💬 Vella Widget: Conversation already exists, ID:', conversationId);
      }

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
      try {
        const url = \`\${config.widgetBaseUrl}/api/widget/conversations/start/\${config.agentId}?channel=phone\`;
        console.log('🌐 Vella Widget: Fetching conversation start URL:', url);
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log('📡 Vella Widget: Conversation start response:', response.ok, response.status);
        console.log('📡 Vella Widget: Response headers:', [...response.headers.entries()]);

        if (response.ok) {
          const data = await response.json();
          console.log('📄 Vella Widget: Conversation start data:', data);
          console.log('🔍 Vella Widget: data.conversation:', data.conversation);
          console.log('🔍 Vella Widget: data.conversation.conversation_id:', data.conversation?.conversation_id);
          
          if (data.conversation?.conversation_id) {
            conversationId = data.conversation.conversation_id;
            console.log('✅ Vella Widget: Conversation started, ID set to:', conversationId);
          } else {
            console.log('❌ Vella Widget: No conversation.conversation_id in response data');
          }
          
          // If there's a greeting message, display it
          if (data.conversation?.greeting) {
            console.log('💬 Vella Widget: Adding greeting message:', data.conversation.greeting);
            this.addMessage(data.conversation.greeting, 'agent');
          } else {
            console.log('⚠️ Vella Widget: No greeting message in response');
          }
        } else {
          console.log('❌ Vella Widget: Failed to start conversation, response not ok');
          const errorText = await response.text();
          console.log('❌ Vella Widget: Error response text:', errorText);
        }
      } catch (error) {
        console.error('❌ Vella Widget: Failed to start conversation:', error);
        this.addMessage('Sorry, I\\'m having trouble connecting right now. Please try again later.', 'agent');
      }
      console.log('🔍 Vella Widget: Final conversationId after startConversation:', conversationId);
    },

    sendMessage: async function(voiceTranscript = null) {
      console.log('📤 Vella Widget: sendMessage() called - START, voiceTranscript:', voiceTranscript);
      const input = document.getElementById('vella-input');
      console.log('📝 Vella Widget: Input element found:', !!input);
      
      // Use voiceTranscript if provided, otherwise get from input field
      const message = voiceTranscript || (input ? input.value.trim() : '');
      console.log('💬 Vella Widget: Message to send:', message, 'Conversation ID:', conversationId);
      
      if (!message || !conversationId) {
        console.log('⚠️ Vella Widget: Returning early - no message or conversationId');
        return;
      }

      console.log('✅ Vella Widget: Proceeding to send message...');
      
      // Update voice state to processing
      if (config.widgetType === 'voice' || isVoiceMode) {
        voiceState = 'processing';
        this.updateVoiceState('processing');
      }
      
      // Add user message to chat (only in chat mode)
      if (!isVoiceMode && config.widgetType !== 'voice') {
        this.addMessage(message, 'user');
      }
      
      // Clear input after adding message (only if input exists)
      if (input && !voiceTranscript) {
        input.value = '';
      }

      // Show typing indicator (only in chat mode)
      if (!isVoiceMode && config.widgetType !== 'voice') {
        this.showTypingIndicator();
      }

      try {
        const url = \`\${config.widgetBaseUrl}/api/widget/conversations/\${conversationId}/message?message=\${encodeURIComponent(message)}\`;
        console.log('🌐 Vella Widget: Sending message to URL:', url);
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log('📡 Vella Widget: Message send response:', response.ok, response.status);
        
        if (!isVoiceMode && config.widgetType !== 'voice') {
          this.hideTypingIndicator();
        }

        if (response.ok) {
          const data = await response.json();
          console.log('📄 Vella Widget: Message response data:', data);
          console.log('🔍 Vella Widget: data.response:', data.response);
          console.log('🔍 Vella Widget: data.response.agent_response:', data.response?.agent_response);
          console.log('🔍 Vella Widget: data.response.agent_response type:', typeof data.response?.agent_response);
          console.log('🔍 Vella Widget: data.response.agent_response length:', data.response?.agent_response ? data.response.agent_response.length : 'N/A');
          
          const agentResponse = data.response?.agent_response || 'I received your message.';
          const responseAudio = data.response?.response_audio;
          
          // In chat mode, add message to chat
          if (!isVoiceMode && config.widgetType !== 'voice') {
            this.addMessage(agentResponse, 'agent');
          }
          
          // In voice mode or voice widget, play audio if available, otherwise speak
          if (isVoiceMode || config.widgetType === 'voice') {
            if (responseAudio) {
              console.log('🎵 Vella Widget: Playing response audio from API in voice mode/widget');
              try {
                await this.playBase64AudioAsync(responseAudio);
              } catch (audioError) {
                console.error('🎵 Vella Widget: Error playing response audio:', audioError);
                // Fallback to TTS if audio fails
                this.speakText(agentResponse);
              }
            } else {
              console.log('🗣️ Vella Widget: No response audio, using TTS in voice mode/widget');
              this.speakText(agentResponse);
            }
          }
        } else {
          console.log('❌ Vella Widget: Message send failed, response not ok');
          throw new Error('Failed to send message');
        }
      } catch (error) {
        console.log('❌ Vella Widget: Error in sendMessage:', error);
        if (!isVoiceMode && config.widgetType !== 'voice') {
          this.hideTypingIndicator();
        }
        console.error('Failed to send message:', error);
        
        if (!isVoiceMode && config.widgetType !== 'voice') {
          this.addMessage('Sorry, I couldn\\'t process your message. Please try again.', 'agent');
        } else {
          this.speakText('Sorry, I couldn\\'t process your message. Please try again.');
        }
        
        // Reset voice state on error
        if (config.widgetType === 'voice' || isVoiceMode) {
          voiceState = 'ready';
          this.updateVoiceState('ready');
          isVoiceActive = false;
        }
      }
    },

    sendVoiceMessage: async function(message) {
      console.log('📤 Vella Widget: sendVoiceMessage() called with message:', message);
      
      if (!message || !conversationId) {
        console.log('⚠️ Vella Widget: Returning early - no message or conversationId');
        return;
      }

      // Update voice state to processing
      voiceState = 'processing';
      this.updateVoiceState('processing');

      try {
        const url = \`\${config.widgetBaseUrl}/api/widget/conversations/\${conversationId}/message?message=\${encodeURIComponent(message)}\`;
        console.log('🌐 Vella Widget: Sending voice message to URL:', url);
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log('📡 Vella Widget: Voice message send response:', response.ok, response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('📄 Vella Widget: Voice message response data:', data);
          
          const agentResponse = data.response?.agent_response || 'I received your message.';
          const responseAudio = data.response?.response_audio;
          
          console.log('🎵 Vella Widget: Response audio available:', !!responseAudio);
          
          // Update voice state to responding
          voiceState = 'responding';
          this.updateVoiceState('responding');
          
          // In voice mode, prefer playing response audio if available, otherwise use TTS
          if (isVoiceMode) {
            if (responseAudio) {
              console.log('🎵 Vella Widget: Playing response audio from API');
              try {
                await this.playBase64AudioAsync(responseAudio);
              } catch (audioError) {
                console.error('🎵 Vella Widget: Error playing response audio:', audioError);
                // Fallback to TTS if audio fails
                await this.speakTextAsync(agentResponse);
              }
            } else {
              console.log('🗣️ Vella Widget: No response audio, using TTS');
              await this.speakTextAsync(agentResponse);
            }
            
            // After response is complete, restart listening if voice is still active
            if (isVoiceActive && isVoiceMode) {
              console.log('🔄 Vella Widget: Restarting voice listening after response');
              setTimeout(() => {
                if (isVoiceActive && isVoiceMode && !isPlaying) {
                  this.startVoiceRecording();
                }
              }, 1000);
            }
          } else {
            // In chat mode, speak the response
            console.log('🗣️ Vella Widget: Speaking voice response in chat mode');
            try {
              this.speakText(agentResponse);
            } catch (speechError) {
              console.error('🗣️ Vella Widget: Error in speech synthesis:', speechError);
              // Continue without speech if there's an error
            }
          }
          
        } else {
          console.log('❌ Vella Widget: Voice message send failed, response not ok');
          throw new Error('Failed to send voice message');
        }
      } catch (error) {
        console.log('❌ Vella Widget: Error in sendVoiceMessage:', error);
        console.error('Failed to send voice message:', error);
        
        try {
          await this.speakTextAsync('Sorry, I couldn\\'t process your message. Please try again.');
        } catch (speechError) {
          console.error('🗣️ Vella Widget: Error in fallback speech:', speechError);
        }
        
        // Reset voice state and restart listening if still active
        if (isVoiceActive && isVoiceMode) {
          setTimeout(() => {
            if (isVoiceActive && isVoiceMode && !isPlaying) {
              this.startVoiceRecording();
            }
          }, 2000);
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
      
      messageDiv.style.cssText = \`
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
        font-size: 14px;
        \${isAgent ? 
          'background: #f3f4f6; margin-right: 20px;' : 
          'background: ' + config.primaryColor + '; color: white; margin-left: 40px;'
        }
      \`;
      
      messageDiv.textContent = displayText;
      messagesContainer.appendChild(messageDiv);
      
      // Scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      console.log('✅ Vella Widget: Message added to chat');
    },

    showTypingIndicator: function() {
      console.log('⌨️ Vella Widget: showTypingIndicator() called');
      const messagesContainer = document.getElementById('vella-messages');
      const typingDiv = document.createElement('div');
      typingDiv.id = 'vella-typing';
      typingDiv.style.cssText = \`
        background: #f3f4f6;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
        font-size: 14px;
        margin-right: 20px;
        font-style: italic;
        color: #6b7280;
      \`;
      typingDiv.textContent = 'Typing...';
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      console.log('✅ Vella Widget: Typing indicator shown');
    },

    hideTypingIndicator: function() {
      console.log('⌨️ Vella Widget: hideTypingIndicator() called');
      const typingDiv = document.getElementById('vella-typing');
      if (typingDiv) {
        typingDiv.remove();
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
            
            // Set new silence timer (3 seconds)
            silenceTimer = setTimeout(() => {
              console.log('🔇 Vella Widget: Silence detected after 3 seconds');
              this.handleSilenceDetected(finalTranscript.trim());
            }, 3000);
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
      
      // Stop any audio playback
      if (isPlaying) {
        this.stopAudio();
        this.stopSpeech();
      }
      
      // Stop any recording
      if (isRecording) {
        this.stopVoiceRecording();
      }
      
      // Reset to ready state
      isVoiceActive = false;
      voiceState = 'ready';
      this.updateVoiceState('ready');
      
      console.log('✅ Vella Widget: Conversation ended, returned to ready state');
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
        };

        audio.onerror = (error) => {
          console.error('🎵 Vella Widget: Audio playback error:', error);
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
