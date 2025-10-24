export interface Message {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: string;
  audioBase64?: string;
  audioMimeType?: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  role: string;
  lastMessage: string;
  isActive?: boolean;
}

export interface ActiveChat {
  name: string;
  role: string;
  avatar: string;
  platform: string;
  status: 'Active' | 'Away' | 'Offline';
}