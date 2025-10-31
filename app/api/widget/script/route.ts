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

  // Main widget initialization
  window.VellaWidget = {
    init: function(userConfig) {
      console.log('🎯 Vella Widget: init() called with config:', userConfig);
      config = {
        agentId: userConfig.agentId || '',
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
      triggerButton.innerHTML = '💬';
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

          <!-- Input -->
          <div style="
            padding: 12px;
            border-top: 1px solid #e5e7eb;
            background: white;
            border-radius: 0 0 12px 12px;
            position: relative;
            z-index: 5;
          ">
            <div style="display: flex; gap: 8px; align-items: center;">
              <button id="vella-mic" style="
                padding: 8px;
                background: #f3f4f6;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 36px;
                transition: background-color 0.2s;
              " title="Voice input">🎤</button>
              <input 
                id="vella-input" 
                type="text" 
                placeholder="Type your message..."
                style="
                  flex: 1;
                  padding: 8px 12px;
                  border: 1px solid #d1d5db;
                  border-radius: 6px;
                  font-size: 14px;
                  outline: none;
                "
              />
              <button id="vella-send" style="
                padding: 8px 16px;
                background: \${config.primaryColor};
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
              " onclick="window.VellaWidget.sendMessage()">Send</button>
            </div>
          </div>
        </div>
      \`;
      console.log('✅ Vella Widget: HTML generated, includes voice input functionality');
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
      
      // Stop voice recording if active
      if (isRecording) {
        this.stopVoiceRecording();
      }
      
      console.log('✅ Vella Widget: Widget closed, display set to none');
    },

    startConversation: async function() {
      console.log('🚀 Vella Widget: startConversation() called for agentId:', config.agentId);
      console.log('🔍 Vella Widget: Current conversationId before start:', conversationId);
      try {
        const url = \`\${config.widgetBaseUrl}/api/widget/conversations/start/\${config.agentId}?channel=widget\`;
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

    sendMessage: async function() {
      console.log('📤 Vella Widget: sendMessage() called - START');
      const input = document.getElementById('vella-input');
      console.log('📝 Vella Widget: Input element found:', !!input);
      const message = input ? input.value.trim() : '';
      console.log('💬 Vella Widget: Message to send:', message, 'Conversation ID:', conversationId);
      
      if (!message || !conversationId) {
        console.log('⚠️ Vella Widget: Returning early - no message or conversationId');
        return;
      }

      console.log('✅ Vella Widget: Proceeding to send message...');
      // Add user message to chat
      this.addMessage(message, 'user');
      // Clear input after adding message
      input.value = '';

      // Show typing indicator
      this.showTypingIndicator();

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
        this.hideTypingIndicator();

        if (response.ok) {
          const data = await response.json();
          console.log('📄 Vella Widget: Message response data:', data);
          console.log('🔍 Vella Widget: data.response:', data.response);
          console.log('🔍 Vella Widget: data.response.agent_response:', data.response?.agent_response);
          console.log('🔍 Vella Widget: data.response.agent_response type:', typeof data.response?.agent_response);
          console.log('🔍 Vella Widget: data.response.agent_response length:', data.response?.agent_response ? data.response.agent_response.length : 'N/A');
          this.addMessage(data.response?.agent_response || 'I received your message.', 'agent');
        } else {
          console.log('❌ Vella Widget: Message send failed, response not ok');
          throw new Error('Failed to send message');
        }
      } catch (error) {
        console.log('❌ Vella Widget: Error in sendMessage:', error);
        this.hideTypingIndicator();
        console.error('Failed to send message:', error);
        this.addMessage('Sorry, I couldn\\'t process your message. Please try again.', 'agent');
      }
    },

    addMessage: function(text, sender) {
      console.log('💬 Vella Widget: addMessage() called with text:', text, 'sender:', sender);
      const messagesContainer = document.getElementById('vella-messages');
      console.log('📦 Vella Widget: Messages container found:', !!messagesContainer);
      const messageDiv = document.createElement('div');
      
      const isAgent = sender === 'agent';
      messageDiv.className = \`vella-message vella-\${sender}-message\`;
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
      
      messageDiv.textContent = text;
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

        // Set recording state immediately
        isRecording = true;
        this.updateMicButton(true);

        recognition.onstart = () => {
          console.log('🎤 Vella Widget: Speech recognition started');
          const input = document.getElementById('vella-input');
          if (input) {
            input.placeholder = 'Listening... Speak now';
          }
        };

        recognition.onresult = (event) => {
          console.log('🎤 Vella Widget: Speech recognition result received');
          
          interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          const input = document.getElementById('vella-input');
          if (input) {
            input.value = finalTranscript + interimTranscript;
            input.placeholder = 'Listening... Speak now';
          }
          
          console.log('🎤 Vella Widget: Final transcript:', finalTranscript);
          console.log('🎤 Vella Widget: Interim transcript:', interimTranscript);
        };

        recognition.onerror = (event) => {
          console.error('🎤 Vella Widget: Speech recognition error:', event.error);
          
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
          
          // If we have a final transcript, send the message
          const finalMessage = finalTranscript.trim();
          if (finalMessage) {
            const input = document.getElementById('vella-input');
            if (input) {
              input.value = finalMessage;
              input.placeholder = 'Type your message...';
              // Auto-send the message after a short delay
              setTimeout(() => {
                this.sendMessage();
              }, 500);
            }
          }
          
          this.stopVoiceRecording();
        };

        recognition.start();
        console.log('✅ Vella Widget: Speech recognition started successfully');
        
        // Auto-stop after 10 seconds if no speech
        setTimeout(() => {
          if (isRecording) {
            console.log('🎤 Vella Widget: Auto-stopping recording after timeout');
            this.stopVoiceRecording();
          }
        }, 10000);
        
      } catch (error) {
        console.error('❌ Vella Widget: Failed to start speech recognition:', error);
        this.stopVoiceRecording();
        this.addMessage('Voice input failed. Please try again or type your message.', 'agent');
      }
    },

    stopVoiceRecording: function() {
      console.log('🎤 Vella Widget: stopVoiceRecording() called');
      
      if (!isRecording) {
        console.log('⚠️ Vella Widget: Not currently recording, ignoring stop request');
        return;
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
      this.updateMicButton(false);
      
      const input = document.getElementById('vella-input');
      if (input && input.placeholder === 'Listening... Speak now') {
        input.placeholder = 'Type your message...';
      }
      console.log('✅ Vella Widget: Voice recording stopped');
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
