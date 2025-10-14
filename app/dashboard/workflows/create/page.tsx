"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/shared/Card';

const components = [
  { icon: '▶', title: 'Start', description: 'Workflow entry point' },
  { icon: '⊙', title: 'End', description: 'Workflow endpoint' },
  { icon: '💬', title: 'Message', description: 'Send text message' },
  { icon: '📞', title: 'Voice Call', description: 'Make phone call' },
  { icon: '✉', title: 'Send Email', description: 'Send email message' },
  { icon: '🌐', title: 'Webhook', description: 'HTTP request' },
  { icon: '📊', title: 'Google Sheets', description: 'Insert row' },
  { icon: '🔀', title: 'Condition', description: 'Branch logic' },
  { icon: '↔', title: 'Transfer', description: 'Transfer to agent' },
  { icon: '📚', title: 'Knowledge Base', description: 'Query KB' },
];

export default function WorkflowBuilder() {
  const router = useRouter();
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [savedTime, setSavedTime] = useState('1 min ago');
  const [zoom, setZoom] = useState(100);

  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB]">
      {/* Top Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/workflows')}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#1F2937] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>

          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-base font-medium text-[#1F2937] bg-transparent border-none focus:outline-none focus:ring-0 px-2 py-1"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Saved {savedTime}</span>
          </div>

          <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-lg px-2 py-1">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-1 hover:bg-white rounded transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
            <span className="text-sm font-medium text-[#1F2937] min-w-[45px] text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 10))}
              className="p-1 hover:bg-white rounded transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
          </div>

          <button className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>

          <button className="px-4 py-2 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Run Test</span>
          </button>

          <button className="px-4 py-2 border border-[#D1D5DB] bg-white text-[#1F2937] rounded-lg font-medium hover:bg-[#F3F4F6] transition-all">
            Save Draft
          </button>

          <button className="px-4 py-2 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium hover:opacity-90 transition-all">
            Publish
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Components */}
        <div className="w-[280px] bg-white border-r border-[#E5E7EB] overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-[#1F2937] mb-4">Components</h3>
            <div className="space-y-2">
              {components.map((component, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F9FAFB] cursor-pointer transition-colors border border-transparent hover:border-[#E5E7EB]"
                >
                  <div className="w-8 h-8 flex items-center justify-center text-lg">
                    {component.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#1F2937]">{component.title}</div>
                    <div className="text-xs text-[#6B7280]">{component.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-[#FAFBFC] overflow-hidden" 
             style={{ backgroundImage: 'radial-gradient(circle, #E5E7EB 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="p-12 bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-b from-[#8266D4] to-[#41288A] rounded-full flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-[#1F2937] mb-2">Build Your Workflow</h2>
                <p className="text-sm text-[#6B7280] max-w-md">
                  Drag components from the left panel onto the canvas. Click on nodes to configure their properties.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-[340px] bg-white border-l border-[#E5E7EB] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-[#1F2937] mb-2">No node selected</h3>
                <p className="text-sm text-[#6B7280]">
                  Click on a node to view and edit its properties
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}