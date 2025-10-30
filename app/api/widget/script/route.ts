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

      this.createWidget();
      this.bindEvents();
    },

    createWidget: function() {
      // Create trigger button
      this.createTriggerButton();
      
      // Create widget container (initially hidden)
      this.createWidgetContainer();
    },

    createTriggerButton: function() {
      triggerButton = document.createElement('button');
      triggerButton.id = 'vella-widget-trigger';
      triggerButton.innerHTML = '💬';
      triggerButton.style.cssText = this.getTriggerButtonStyles();
      
      document.body.appendChild(triggerButton);
    },

    createWidgetContainer: function() {
      widgetContainer = document.createElement('div');
      widgetContainer.id = 'vella-widget';
      widgetContainer.style.cssText = this.getWidgetContainerStyles();
      widgetContainer.style.display = 'none';
      
      widgetContainer.innerHTML = this.getWidgetHTML();
      document.body.appendChild(widgetContainer);
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
      return \`
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
              ">Send</button>
            </div>
          </div>
        </div>
      \`;
    },


// ...existing code...
bindEvents: function() {
  // Toggle widget
  triggerButton.addEventListener('click', this.toggleWidget.bind(this));

  // Close widget
  const closeBtn = widgetContainer.querySelector('#vella-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', this.closeWidget.bind(this));
  }

  // Send message
  const sendBtn = widgetContainer.querySelector('#vella-send');
  if (sendBtn) {
    sendBtn.addEventListener('click', this.sendMessage.bind(this));
  }

  // Enter key to send
  const input = widgetContainer.querySelector('#vella-input');
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
  }
},
    toggleWidget: function() {
      if (isOpen) {
        this.closeWidget();
      } else {
        this.openWidget();
      }
    },

    openWidget: function() {
      isOpen = true;
      widgetContainer.style.display = 'block';
      triggerButton.innerHTML = '×';
      
      // Start conversation if not already started
      if (!conversationId) {
        this.startConversation();
      }
    },

    closeWidget: function() {
      isOpen = false;
      widgetContainer.style.display = 'none';
      triggerButton.innerHTML = '💬';
    },

    startConversation: async function() {
      try {
        const response = await fetch(\`\${config.widgetBaseUrl}/api/widget/conversations/start/\${config.agentId}?channel=widget\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          conversationId = data.conversation_id;
          
          // If there's a greeting message, display it
          if (data.message) {
            this.addMessage(data.message, 'agent');
          }
        }
      } catch (error) {
        console.error('Failed to start conversation:', error);
        this.addMessage('Sorry, I\\'m having trouble connecting right now. Please try again later.', 'agent');
      }
    },

    sendMessage: async function() {
      const input = document.getElementById('vella-input');
      const message = input.value.trim();
      
      if (!message || !conversationId) return;

      // Add user message to chat
      this.addMessage(message, 'user');
      input.value = '';

      // Show typing indicator
      this.showTypingIndicator();

      try {
        const response = await fetch(\`\${config.widgetBaseUrl}/api/widget/conversations/\${conversationId}/message?message=\${encodeURIComponent(message)}\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        this.hideTypingIndicator();

        if (response.ok) {
          const data = await response.json();
          this.addMessage(data.message || 'I received your message.', 'agent');
        } else {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        this.hideTypingIndicator();
        console.error('Failed to send message:', error);
        this.addMessage('Sorry, I couldn\\'t process your message. Please try again.', 'agent');
      }
    },

    addMessage: function(text, sender) {
      const messagesContainer = document.getElementById('vella-messages');
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
    },

    showTypingIndicator: function() {
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
    },

    hideTypingIndicator: function() {
      const typingDiv = document.getElementById('vella-typing');
      if (typingDiv) {
        typingDiv.remove();
      }
    }
  };

  // Auto-initialize if config is already available
  if (window.vellaConfig) {
    window.VellaWidget.init(window.vellaConfig);
  }
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
