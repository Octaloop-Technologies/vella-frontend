'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AgentCreationData {
  // Step 1
  agentName: string;
  agentTypeDropdown: string;
  description: string;
  language: string;
  personaTune: string;
  
  // Step 2
  selectedDocuments: string[];
  
  // Step 3
  selectedChannels: string[];
  selectedIntegrations: string[];
  
  // Step 4
  phoneNumber: string;
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
  personaTune: '',
  selectedDocuments: [],
  selectedChannels: [],
  selectedIntegrations: [],
  phoneNumber: '',
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
