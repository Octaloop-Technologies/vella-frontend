'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AgentCreationData {
  // Step 1
  agentName: string;
  agentTypeDropdown: string;
  description: string;
  language: string;
  gender: string;
  persona: string;
  tune: string;
  // Step 2
  selectedDocuments: string[];
  
  // Step 3 (inbound/outbound)
  selectedChannels: string[];
  selectedIntegrations: string[];
  
  // Step 4 (inbound/outbound)
  phoneNumber: string;

  // Widget-specific
  buttonText: string;
  voiceButtonText: string;
  widgetPosition: string;
}

interface AgentCreationContextType {
  agentData: AgentCreationData;
  updateAgentData: (data: Partial<AgentCreationData>) => void;
  resetAgentData: () => void;
}

const defaultAgentData: AgentCreationData = {
  agentName: '',
  agentTypeDropdown: 'Agent Type',
  description: '',
  language: 'Select',
  gender: 'Select',
  persona: 'Select',
  tune: 'Select',
  selectedDocuments: [],
  selectedChannels: [],
  selectedIntegrations: [],
  phoneNumber: '',
  buttonText: '',
  voiceButtonText: '',
  widgetPosition: 'Bottom Right',
};

const AgentCreationContext = createContext<AgentCreationContextType | undefined>(undefined);

export const useAgentCreation = () => {
  const context = useContext(AgentCreationContext);
  if (!context) {
    throw new Error('useAgentCreation must be used within AgentCreationProvider');
  }
  return context;
};

interface AgentCreationProviderProps {
  children: ReactNode;
}

export const AgentCreationProvider: React.FC<AgentCreationProviderProps> = ({ children }) => {
  const [agentData, setAgentData] = useState<AgentCreationData>(defaultAgentData);

  const updateAgentData = (data: Partial<AgentCreationData>) => {
    setAgentData((prev) => ({ ...prev, ...data }));
  };

  const resetAgentData = () => {
    setAgentData(defaultAgentData);
  };

  return (
    <AgentCreationContext.Provider value={{ agentData, updateAgentData, resetAgentData }}>
      {children}
    </AgentCreationContext.Provider>
  );
};