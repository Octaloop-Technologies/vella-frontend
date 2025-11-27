import React, { useState, useEffect } from 'react';
import BaseModal from '@/components/shared/BaseModal';
import Input from '@/components/shared/Input';
import { AgentsTable } from '@/types/table';

interface EditAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent?: AgentsTable;
  onUpdate?: () => void;
}

const EditAgentModal: React.FC<EditAgentModalProps> = ({ 
  isOpen, 
  onClose, 
  agent,
  onUpdate
}) => {
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name || '',
        description: agent.description || '',
        agent_type: agent.type ? agent.type.toLowerCase() : '',
        channel_type: agent.typeVariant === 'chat' ? 'chat_only' : 
                      agent.typeVariant === 'phone' ? 'phone_only' : 
                      agent.typeVariant || '',
        language: agent.language || '',
        gender: agent.gender || '',
        persona: agent.persona || '',
        tune: agent.tune || '',
        voice_id: agent.voice_id || '',
        voice_settings: agent.voice_settings || '',
        status: agent.status || '',
        model_id: agent.model_id || '',
        phone_number: agent.phoneNumber || '',
        knowledge_base_document_ids: agent.knowledgeBaseDocuments 
          ? agent.knowledgeBaseDocuments.map((doc: any) => doc.id).join(', ') 
          : '',
      });
    }
  }, [agent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const payload = { ...formData };
      
      // Parse voice_settings if it's a string
      if (typeof payload.voice_settings === 'string') {
        try {
          payload.voice_settings = JSON.parse(payload.voice_settings);
        } catch (e) {
          // Keep as string if parsing fails
        }
      }

      // Convert knowledge_base_document_ids to array
      if (typeof payload.knowledge_base_document_ids === 'string') {
        payload.knowledge_base_document_ids = payload.knowledge_base_document_ids
          .split(',')
          .map((id: string) => id.trim())
          .filter((id: string) => id.length > 0);
      }

      const response = await fetch(`/api/agents/${agent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update agent');
      }

      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!agent) return null;

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-3xl" 
      title="Edit Agent"
      subtitle={`Edit configuration for ${agent.name}`}
    >
      <form onSubmit={handleSubmit} className="p-8 max-h-[75vh] overflow-y-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Agent Name"
            required
          />

          <div className="relative">
            <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Agent Type</label>
            <select
              name="agent_type"
              value={formData.agent_type}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-black appearance-none"
            >
              <option value="">Select Type</option>
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
              <option value="widget">Widget</option>
            </select>
          </div>

          <div className="relative">
            <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Channel Type</label>
            <select
              name="channel_type"
              value={formData.channel_type}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-black appearance-none"
            >
              <option value="">Select Channel</option>
              <option value="chat_only">Chat</option>
              <option value="phone_only">Phone</option>
              <option value="omnichannel">Omnichannel</option>
            </select>
          </div>

          <div className="relative">
            <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-black appearance-none"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <Input
            label="Language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            placeholder="e.g. en-US"
          />

          <div className="relative">
            <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-black appearance-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <Input
            label="Persona"
            name="persona"
            value={formData.persona}
            onChange={handleChange}
            placeholder="Agent Persona"
          />

          <Input
            label="Tune"
            name="tune"
            value={formData.tune}
            onChange={handleChange}
            placeholder="Voice Tune"
          />

          <Input
            label="Voice ID"
            name="voice_id"
            value={formData.voice_id}
            onChange={handleChange}
            placeholder="Voice ID"
          />

          <Input
            label="Model ID"
            name="model_id"
            value={formData.model_id}
            onChange={handleChange}
            placeholder="Model ID"
          />

          <Input
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="+1234567890"
          />

          <Input
            label="Knowledge Base Document IDs"
            name="knowledge_base_document_ids"
            value={formData.knowledge_base_document_ids}
            onChange={handleChange}
            placeholder="Comma separated IDs"
          />
        </div>

        <div className="mt-6">
          <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Agent Description"
            rows={4}
            className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-black resize-none"
          />
        </div>

        <div className="mt-6">
          <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Voice Settings</label>
          <textarea
            name="voice_settings"
            value={formData.voice_settings}
            onChange={handleChange}
            placeholder="Voice Settings (JSON or String)"
            rows={3}
            className="w-full px-4 py-3 bg-[#EBEBEB] rounded-[10px] outline-none text-sm text-black resize-none"
          />
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-gray-600 font-medium hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditAgentModal;
