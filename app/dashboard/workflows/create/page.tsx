"use client";

import { useState, useCallback, useRef, DragEvent as ReactDragEvent } from 'react';
import { useRouter } from 'next/navigation';
import ReactFlow, {
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  NodeTypes,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Card from '@/components/shared/Card';

const components = [
  { id: 'start', icon: '▶', title: 'Start', description: 'Workflow entry point' },
  { id: 'end', icon: '⊙', title: 'End', description: 'Workflow endpoint' },
  { id: 'message', icon: '💬', title: 'Message', description: 'Send text message' },
  { id: 'voicecall', icon: '📞', title: 'Voice Call', description: 'Make phone call' },
  { id: 'email', icon: '✉', title: 'Send Email', description: 'Send email message' },
  { id: 'webhook', icon: '🌐', title: 'Webhook', description: 'HTTP request' },
  { id: 'sheets', icon: '📊', title: 'Google Sheets', description: 'Insert row' },
  { id: 'condition', icon: '🔀', title: 'Condition', description: 'Branch logic' },
  { id: 'transfer', icon: '↔', title: 'Transfer', description: 'Transfer to agent' },
  { id: 'kb', icon: '📚', title: 'Knowledge Base', description: 'Query KB' },
];

// Custom Node Component
const CustomNode = ({ data }: any) => {
  return (
    <div className="bg-white rounded-lg border-2 border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow p-4 min-w-[200px]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-b from-[#8266D4] to-[#41288A] rounded-full flex items-center justify-center text-white text-lg flex-shrink-0">
          {data.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-[#1F2937]">{data.label}</div>
          <div className="text-xs text-[#6B7280]">{data.description}</div>
        </div>
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const getNodeDescription = (type: string) => {
  const descriptions: Record<string, string> = {
    email: 'Send email message',
    start: 'Workflow entry point',
    end: 'Workflow endpoint',
    message: 'Send text message',
    voicecall: 'Make phone call',
    webhook: 'HTTP request',
    sheets: 'Insert row',
    condition: 'Branch logic',
    transfer: 'Transfer to agent',
    kb: 'Query KB',
  };
  return descriptions[type] || '';
};

const getNodeProperties = (type: string) => {
  switch (type) {
    case 'email':
      return {
        from: 'noreply@company.com',
        to: 'recipient@example.com or {{variable}}',
        subject: 'Email subject line',
        body: 'Email content...',
        attachments: false,
      };
    case 'message':
      return {
        content: 'Message content...',
        recipient: '{{variable}}',
      };
    case 'voicecall':
      return {
        phoneNumber: '{{variable}}',
        message: 'Voice message...',
      };
    case 'webhook':
      return {
        url: 'https://api.example.com/endpoint',
        method: 'POST',
        headers: {},
        body: {},
      };
    case 'sheets':
      return {
        spreadsheetId: '',
        sheetName: 'Sheet1',
        row: {},
      };
    case 'condition':
      return {
        condition: '',
        operator: 'equals',
        value: '',
      };
    case 'transfer':
      return {
        agentId: '',
        message: '',
      };
    case 'kb':
      return {
        query: '{{variable}}',
        knowledgeBaseId: '',
      };
    default:
      return {};
  }
};

export default function WorkflowBuilder() {
  const router = useRouter();
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [savedTime, setSavedTime] = useState('1 min ago');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const nodeIdCounter = useRef(0);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true, style: { stroke: '#8266D4', strokeWidth: 2, strokeDasharray: '5,5' } }, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: ReactDragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: ReactDragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const component = components.find(c => c.id === type);
      if (!component) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode: Node = {
        id: `node-${nodeIdCounter.current++}`,
        type: 'custom',
        position,
        data: {
          label: component.title,
          icon: component.icon,
          description: getNodeDescription(component.id),
          nodeType: component.id,
          properties: getNodeProperties(component.id),
        },
      };

      setNodes((nds) => {
        const newNodes = nds.concat(newNode);
        // Auto-connect to previous node
        if (nds.length > 0) {
          const lastNode = nds[nds.length - 1];
          setEdges((eds) =>
            eds.concat({
              id: `edge-${lastNode.id}-${newNode.id}`,
              source: lastNode.id,
              target: newNode.id,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#8266D4', strokeWidth: 2, strokeDasharray: '5,5' },
            })
          );
        }
        return newNodes;
      });
    },
    [reactFlowInstance, setNodes, setEdges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNodeProperty = (nodeId: string, key: string, value: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, properties: { ...node.data.properties, [key]: value } } }
          : node
      )
    );
    if (selectedNode?.id === nodeId) {
      setSelectedNode((prev) => 
        prev ? { ...prev, data: { ...prev.data, properties: { ...prev.data.properties, [key]: value } } } : null
      );
    }
  };

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNode(null);
  };

  const onDragStart = (event: ReactDragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

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
                  draggable
                  onDragStart={(event) => onDragStart(event, component.id)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F9FAFB] cursor-grab active:cursor-grabbing transition-colors border border-transparent hover:border-[#E5E7EB]"
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

        {/* Canvas Area with React Flow */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
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
          )}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-[#FAFBFC]"
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#8266D4', strokeWidth: 2, strokeDasharray: '5,5' },
            }}
          >
            <Background color="#E5E7EB" variant={BackgroundVariant.Dots} gap={20} size={1} />
            <Controls 
              className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm"
              showInteractive={false}
            />
          </ReactFlow>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-[340px] bg-white border-l border-[#E5E7EB] overflow-y-auto">
          <div className="p-6">
            {!selectedNode ? (
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
            ) : (
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-b from-[#8266D4] to-[#41288A] rounded-full flex items-center justify-center text-white text-lg">
                      {selectedNode.data.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#1F2937]">{selectedNode.data.label}</h3>
                      <p className="text-xs text-[#6B7280]">{selectedNode.data.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 hover:bg-[#F3F4F6] rounded transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Properties Form */}
                <div className="space-y-6">
                  {selectedNode.data.nodeType === 'email' && (
                    <>
                      <div className="border-b border-[#E5E7EB] pb-4">
                        <h4 className="text-xs font-semibold text-[#1F2937] uppercase mb-3">EMAIL DETAILS</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-[#1F2937] mb-2">From</label>
                            <input
                              type="text"
                              value={selectedNode.data.properties.from || ''}
                              onChange={(e) => updateNodeProperty(selectedNode.id, 'from', e.target.value)}
                              className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8266D4] focus:border-transparent"
                              placeholder="noreply@company.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#1F2937] mb-2">To</label>
                            <input
                              type="text"
                              value={selectedNode.data.properties.to || ''}
                              onChange={(e) => updateNodeProperty(selectedNode.id, 'to', e.target.value)}
                              className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8266D4] focus:border-transparent"
                              placeholder="recipient@example.com or {{variable}}"
                            />
                            <p className="text-xs text-[#6B7280] mt-1">Use variables like {'{{email}}'} from previous steps</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#1F2937] mb-2">Subject</label>
                            <input
                              type="text"
                              value={selectedNode.data.properties.subject || ''}
                              onChange={(e) => updateNodeProperty(selectedNode.id, 'subject', e.target.value)}
                              className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8266D4] focus:border-transparent"
                              placeholder="Email subject line"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#1F2937] mb-2">Body</label>
                            <textarea
                              value={selectedNode.data.properties.body || ''}
                              onChange={(e) => updateNodeProperty(selectedNode.id, 'body', e.target.value)}
                              rows={6}
                              className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8266D4] focus:border-transparent resize-none"
                              placeholder="Email content..."
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-[#1F2937] uppercase mb-3">OPTIONS</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-[#1F2937]">Attachments</label>
                            <p className="text-xs text-[#6B7280]">Include file attachments</p>
                          </div>
                          <button
                            onClick={() => updateNodeProperty(selectedNode.id, 'attachments', !selectedNode.data.properties.attachments)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              selectedNode.data.properties.attachments ? 'bg-[#8266D4]' : 'bg-[#D1D5DB]'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                selectedNode.data.properties.attachments ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedNode.data.nodeType === 'message' && (
                    <div>
                      <h4 className="text-xs font-semibold text-[#1F2937] uppercase mb-3">MESSAGE DETAILS</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1F2937] mb-2">Recipient</label>
                          <input
                            type="text"
                            value={selectedNode.data.properties.recipient || ''}
                            onChange={(e) => updateNodeProperty(selectedNode.id, 'recipient', e.target.value)}
                            className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8266D4] focus:border-transparent"
                            placeholder="{{variable}}"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1F2937] mb-2">Content</label>
                          <textarea
                            value={selectedNode.data.properties.content || ''}
                            onChange={(e) => updateNodeProperty(selectedNode.id, 'content', e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8266D4] focus:border-transparent resize-none"
                            placeholder="Message content..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedNode.data.nodeType === 'voicecall' && (
                    <div>
                      <h4 className="text-xs font-semibold text-[#1F2937] uppercase mb-3">CALL DETAILS</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1F2937] mb-2">Phone Number</label>
                          <input
                            type="text"
                            value={selectedNode.data.properties.phoneNumber || ''}
                            onChange={(e) => updateNodeProperty(selectedNode.id, 'phoneNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8266D4] focus:border-transparent"
                            placeholder="{{variable}}"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1F2937] mb-2">Message</label>
                          <textarea
                            value={selectedNode.data.properties.message || ''}
                            onChange={(e) => updateNodeProperty(selectedNode.id, 'message', e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8266D4] focus:border-transparent resize-none"
                            placeholder="Voice message..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedNode.data.nodeType === 'webhook' && (
                    <div>
                      <h4 className="text-xs font-semibold text-[#1F2937] uppercase mb-3">WEBHOOK DETAILS</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1F2937] mb-2">URL</label>
                          <input
                            type="text"
                            value={selectedNode.data.properties.url || ''}
                            onChange={(e) => updateNodeProperty(selectedNode.id, 'url', e.target.value)}
                            className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8266D4] focus:border-transparent"
                            placeholder="https://api.example.com/endpoint"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1F2937] mb-2">Method</label>
                          <select
                            value={selectedNode.data.properties.method || 'POST'}
                            onChange={(e) => updateNodeProperty(selectedNode.id, 'method', e.target.value)}
                            className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8266D4] focus:border-transparent"
                          >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4 space-y-2">
                    <button className="w-full px-4 py-2 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium hover:opacity-90 transition-all">
                      Apply
                    </button>
                    <button 
                      onClick={() => setSelectedNode(null)}
                      className="w-full px-4 py-2 border border-[#D1D5DB] bg-white text-[#1F2937] rounded-lg font-medium hover:bg-[#F3F4F6] transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => deleteNode(selectedNode.id)}
                      className="w-full px-4 py-2 text-[#DC2626] font-medium hover:bg-[#FEE2E2] rounded-lg transition-all"
                    >
                      Delete Node
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}