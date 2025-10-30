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
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Card from '@/components/shared/Card';
import Image from 'next/image';

const components = [
  { id: 'start', icon: <Image src="/svgs/start.svg" alt="Start" width={24} height={24} />, title: 'Start', description: 'Workflow entry point' },
  { id: 'end', icon: <Image src="/svgs/end.svg" alt="End" width={24} height={24} />, title: 'End', description: 'Workflow endpoint' },
  { id: 'message', icon: <Image src="/svgs/message3.svg" alt="Message" width={24} height={24} />, title: 'Message', description: 'Send text message' },
  { id: 'voicecall', icon: <Image src="/svgs/call.svg" alt="Voice Call" width={24} height={24} />, title: 'Voice Call', description: 'Make phone call' },
  { id: 'email', icon: <Image src="/svgs/email.svg" alt="Send Email" width={24} height={24} />, title: 'Send Email', description: 'Send email message' },
  { id: 'webhook', icon: <Image src="/svgs/webhook.svg" alt="Webhook" width={24} height={24} />, title: 'Webhook', description: 'HTTP request' },
  { id: 'sheets', icon: <Image src="/svgs/sheets.svg" alt="Google Sheets" width={24} height={24} />, title: 'Google Sheets', description: 'Insert row' },
  { id: 'condition', icon: <Image src="/svgs/condition.svg" alt="Condition" width={24} height={24} />, title: 'Condition', description: 'Branch logic' },
  { id: 'transfer', icon: <Image src="/svgs/transfer.svg" alt="Transfer" width={24} height={24} />, title: 'Transfer', description: 'Transfer to agent' },
  { id: 'kb', icon: <Image src="/svgs/knowledge.svg" alt="Knowledge Base" width={24} height={24} />, title: 'Knowledge Base', description: 'Query KB' },
];

// Custom Node Component
const CustomNode = ({ data, selected }: any) => {
  return (
    <div
      className={`bg-white rounded-xl border border-[#41288A80] transition-all duration-200 p-4 min-w-[300px] relative`}
    >
      {/* Invisible handles - needed for connections but hidden */}
      <Handle
        type="target"
        position={Position.Top}
        className="!opacity-0 !w-1 !h-1"
        style={{ top: '50%', left: '50%' }}
      />

      <div className="flex items-center gap-3">
        <div
          className="rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
        >
          <div className="text-white scale-110">
            {data.icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-black">{data.label}</div>
          <div className="text-xs opacity-70 leading-tight text-black">{data.description}</div>
        </div>
      </div>
      {/* Connection handles indicator */}
      {selected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#8266D4] rounded-full animate-pulse" />
      )}

      {/* Invisible output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!opacity-0 !w-1 !h-1"
        style={{ bottom: '50%', left: '50%' }}
      />
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
      setEdges((eds) => addEdge({
        ...params,
        type: 'straight',
        animated: false,
        style: {
          stroke: '#8266D4',
          strokeWidth: 2,
          strokeDasharray: '5, 5'
        },
      }, eds));
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

      const newNodeId = `node-${nodeIdCounter.current++}`;
      const newNode: Node = {
        id: newNodeId,
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

      // Check current nodes to see if we need to create an edge
      const currentNodes = reactFlowInstance.getNodes();

      // Add the new node
      setNodes((nds) => nds.concat(newNode));

      // Auto-connect to previous node with dashed line
      if (currentNodes.length > 0) {
        const lastNode = currentNodes[currentNodes.length - 1];
        const newEdge: Edge = {
          id: `edge-${lastNode.id}-${newNodeId}`,
          source: lastNode.id,
          target: newNodeId,
          type: 'straight',
          animated: false,
          style: {
            stroke: '#8266D4',
            strokeWidth: 2,
            strokeDasharray: '5, 5'
          },
        };
        setEdges((eds) => [...eds, newEdge]);
      }
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
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push('/dashboard/workflows')}
            className="flex items-center gap-3 transition-colors"
          >
            <Image src="/svgs/back.svg" alt="Back" width={16} height={16} className='mb-1' />
            <span className="font-medium text-black">Back</span>
          </button>

          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-sm text-[#101828] bg-[#EBEBEB] rounded-lg border-none focus:outline-none focus:ring-0 px-4 py-2"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs">
            <Image src="/svgs/clock2.svg" alt="Saved" width={12} height={12} />
            <span className="text-black">Saved {savedTime}</span>
          </div>

          <button className="px-3 py-1.5 bg-white border border-[#D1D5DC] rounded-lg font-medium flex items-center gap-2">
            <Image src="/svgs/play.svg" alt="Run Test" width={12} height={12} />
            <span className="text-black">Run Test</span>
          </button>

          <button className="px-3 py-1.5 bg-white border border-[#D1D5DC] rounded-lg font-medium flex items-center gap-2">
            <Image src="/svgs/save.svg" alt="Save Draft" width={16} height={16} />
            <span className="text-black">Save Draft</span>
          </button>

          <button className="px-3 py-1.5 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium">
            Publish
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Components */}
        <div className="w-[280px] bg-white border-r border-[#E5E7EB] overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4 text-black">Components</h3>
            <div className="space-y-2">
              {components.map((component, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(event) => onDragStart(event, component.id)}
                  className="flex items-center gap-3 p-3 rounded-[10px] cursor-grab active:cursor-grabbing transition-colors border border-[#EBEBEB]"
                >
                  <div className="w-8 h-8 flex items-center justify-center text-lg">
                    {component.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-black">{component.title}</div>
                    <div className="text-xs opacity-70 text-black">{component.description}</div>
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
              <Card className="p-6 border border-[#EBEBEB]">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-b from-[#8266D4] to-[#41288A] rounded-full flex items-center justify-center mb-4">
                    <Image src="/svgs/lightning.svg" alt="Workflow" width={24} height={24} />
                  </div>
                  <h2 className="text-sm font-semibold mb-2 text-black">Build Your Workflow</h2>
                  <p className="text-xs opacity-70 max-w-md leading-loose text-black">
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
            defaultViewport={{ x: 100, y: 100, zoom: 0.95 }}
            className="bg-gradient-to-br from-[#F9FAFB] via-[#F3F4F6] to-[#F9FAFB]"
            defaultEdgeOptions={{
              type: 'straight',
              animated: false,
              style: {
                stroke: '#8266D4',
                strokeWidth: 2,
                strokeDasharray: '5, 5'
              },
            }}
          >
            {/* Custom styled background with dots pattern */}
            <Background
              color="#D1D5DB"
              variant={BackgroundVariant.Dots}
              gap={50}
              size={2}
              style={{
                backgroundColor: 'transparent'
              }}
            />
            <Controls
              className="bg-white border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden"
              showInteractive={false}
            />
          </ReactFlow>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-[340px] bg-white border-l border-[#E5E7EB] overflow-y-auto">
          <div className="p-4 h-full flex flex-col">
            <h3 className="text-lg font-medium mb-4 text-black">Properties</h3>
            {!selectedNode ? (
              <div className="flex items-center justify-center flex-1">
                <div className="text-center">
                  <div className="w-12 h-12 border border-[#8266D4] rounded-[10px] flex items-center justify-center mx-auto mb-4">
                    <Image src="/svgs/eye.svg" alt="Node" width={24} height={24} />
                  </div>
                  <h3 className="text-sm font-medium mb-2 text-black">No node selected</h3>
                  <p className="text-xs text-black">
                    Click on a node to view and edit its properties
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-6 border-t border-[#E5E7EB] pt-4">
                  <div className="flex items-center gap-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg">
                      {selectedNode.data.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-black">{selectedNode.data.label}</h3>
                      <p className="text-xs opacity-70 text-black">{selectedNode.data.description}</p>
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
                              className="w-full px-3 py-2 bg-[#EBEBEB] rounded-lg text-sm focus:outline-none text-black"
                              placeholder="noreply@company.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#1F2937] mb-2">To</label>
                            <input
                              type="text"
                              value={selectedNode.data.properties.to || ''}
                              onChange={(e) => updateNodeProperty(selectedNode.id, 'to', e.target.value)}
                              className="w-full px-3 py-2 border bg-[#EBEBEB] rounded-lg text-sm focus:outline-none text-black"
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
                              className="w-full px-3 py-2 bg-[#EBEBEB] rounded-lg text-sm focus:outline-none text-black"
                              placeholder="Email subject line"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#1F2937] mb-2">Body</label>
                            <textarea
                              value={selectedNode.data.properties.body || ''}
                              onChange={(e) => updateNodeProperty(selectedNode.id, 'body', e.target.value)}
                              rows={6}
                              className="w-full px-3 py-2 bg-[#EBEBEB] rounded-lg text-sm focus:outline-none text-black resize-none"
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
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${selectedNode.data.properties.attachments ? 'bg-[#8266D4]' : 'bg-[#D1D5DB]'
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${selectedNode.data.properties.attachments ? 'translate-x-6' : 'translate-x-1'
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
                            className="w-full px-3 py-2 bg-[#EBEBEB] rounded-lg text-sm focus:outline-none text-black"
                            placeholder="{{variable}}"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1F2937] mb-2">Content</label>
                          <textarea
                            value={selectedNode.data.properties.content || ''}
                            onChange={(e) => updateNodeProperty(selectedNode.id, 'content', e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 bg-[#EBEBEB] rounded-lg text-sm focus:outline-none text-black resize-none"
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
                            className="w-full px-3 py-2 bg-[#EBEBEB] rounded-lg text-sm focus:outline-none text-black"
                            placeholder="{{variable}}"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1F2937] mb-2">Message</label>
                          <textarea
                            value={selectedNode.data.properties.message || ''}
                            onChange={(e) => updateNodeProperty(selectedNode.id, 'message', e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 bg-[#EBEBEB] rounded-lg text-sm focus:outline-none text-black resize-none"
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
                            className="w-full px-3 py-2 bg-[#EBEBEB] rounded-lg text-sm focus:outline-none text-black"
                            placeholder="https://api.example.com/endpoint"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1F2937] mb-2">Method</label>
                          <select
                            value={selectedNode.data.properties.method || 'POST'}
                            onChange={(e) => updateNodeProperty(selectedNode.id, 'method', e.target.value)}
                            className="w-full px-3 py-2 bg-[#EBEBEB] rounded-lg text-sm focus:outline-none text-black"
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
                  <div className="pt-4 space-y-2 border-t border-[#E5E7EB]">
                    <div className='flex gap-2'>
                      <button className="w-full px-4 py-2 bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white rounded-lg font-medium">
                        Apply
                      </button>
                      <button
                        onClick={() => setSelectedNode(null)}
                        className="w-full px-4 py-2 border border-[#8266D4] bg-white text-[#1F2937] rounded-lg font-medium text-black"
                      >
                        Cancel
                      </button>
                    </div>
                    <button
                      onClick={() => deleteNode(selectedNode.id)}
                      className="w-full px-4 py-2 text-[#DC2626] border border-[#FFA2A2] font-medium rounded-lg"
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