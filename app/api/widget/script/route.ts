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
        <div style="height: 100%; display: flex; flex-direction: column; margin-bottom: 100px;">
          <!-- Header -->
          <div id="vella-header" style="
            padding: 16px;
            background: \${config.primaryColor};
            color: white;
            border-radius: 12px 12px 0 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex: 0 0 auto;
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
              background: none;
              border: none;
              color: white;
              cursor: pointer;
              padding: 4px;
              border-radius: 4px;
              font-size: 18px;
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
          ">
            <div style="display: flex; gap: 8px;">
              <input 
                id="vella-input" 
                type="text" 
                placeholder="Type your message..."
                style="
                  flex: 0 0 auto;
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
              " onclick="window.VellaWidget.sendMessage()">send massage</button>
            </div>
          </div>
        </div>
      \`;
      console.log('✅ Vella Widget: HTML generated, button text should be "send massage"');
      return html;
    },


// ...existing code...
bindEvents: function() {
  console.log('🔗 Vella Widget: bindEvents() called - looking for elements...');
  console.log('widgetContainer exists:', !!widgetContainer);
  if (widgetContainer) {
    console.log('widgetContainer children:', widgetContainer.children.length);
  }
  
  // Remove existing event listeners to prevent duplicates
  const existingSendBtn = widgetContainer.querySelector('#vella-send');
  const existingInput = widgetContainer.querySelector('#vella-input');
  
  if (existingSendBtn) {
    console.log('🧹 Vella Widget: Removing existing send button event listener');
    existingSendBtn.removeEventListener('click', this.sendMessage.bind(this));
  }
  if (existingInput) {
    console.log('🧹 Vella Widget: Removing existing input keypress event listener');
    existingInput.removeEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
  }

  // Toggle widget
  triggerButton.addEventListener('click', this.toggleWidget.bind(this));
  console.log('✅ Vella Widget: Trigger button event bound');

  // Close widget
  const closeBtn = widgetContainer.querySelector('#vella-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', this.closeWidget.bind(this));
    console.log('✅ Vella Widget: Close button event bound');
  } else {
    console.log('❌ Vella Widget: Close button not found');
  }

  // Send message
  const sendBtn = widgetContainer.querySelector('#vella-send');
  if (sendBtn) {
    console.log('✅ Vella Widget: Send button found, text content:', sendBtn.textContent);
    sendBtn.addEventListener('click', () => {
      console.log('🖱️ Vella Widget: Send button clicked (event listener)');
      this.sendMessage();
    });
    console.log('✅ Vella Widget: Send button event bound');
  } else {
    console.log('❌ Vella Widget: Send button NOT found in widget container');
  }

  // Enter key to send
  const input = widgetContainer.querySelector('#vella-input');
  if (input) {
    console.log('✅ Vella Widget: Input field found');
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        console.log('⌨️ Vella Widget: Enter key pressed (event listener)');
        this.sendMessage();
      }
    });
    console.log('✅ Vella Widget: Input keypress event bound');
  } else {
    console.log('❌ Vella Widget: Input field NOT found in widget container');
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
      triggerButton.innerHTML = '×';
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
      triggerButton.innerHTML = '💬';
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
