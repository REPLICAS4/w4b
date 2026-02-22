import { useCallback, useRef, useState, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import Navbar from "@/components/Navbar";
import BuilderSidebar from "@/components/builder/BuilderSidebar";
import BuilderToolbar from "@/components/builder/BuilderToolbar";
import AgentNode from "@/components/builder/AgentNode";
import type { NodeTemplate } from "@/components/builder/BuilderSidebar";

const initialNodes: Node[] = [
  {
    id: "llm-1",
    type: "agentNode",
    position: { x: 300, y: 80 },
    data: {
      label: "LLM Brain",
      category: "llm",
      description: "AI reasoning engine — Grok, OpenAI, or Claude",
      config: { provider: "grok", model: "grok-2" },
    },
  },
  {
    id: "wallet-1",
    type: "agentNode",
    position: { x: 300, y: 320 },
    data: {
      label: "BEP-20 Wallet",
      category: "wallet",
      description: "On-chain identity, signs & broadcasts transactions",
      config: { chain: "BNB (56)", type: "BEP-20" },
    },
  },
  {
    id: "strategy-1",
    type: "agentNode",
    position: { x: 620, y: 180 },
    data: {
      label: "Strategy Engine",
      category: "strategy",
      description: "Trading logic — arbitrage, farming, prediction markets",
      config: { mode: "adaptive", risk: "medium" },
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e-llm-strategy",
    source: "llm-1",
    target: "strategy-1",
    animated: true,
    style: { stroke: "hsl(45, 96%, 48%)", strokeWidth: 2 },
  },
  {
    id: "e-wallet-strategy",
    source: "wallet-1",
    target: "strategy-1",
    animated: true,
    style: { stroke: "hsl(45, 96%, 48%)", strokeWidth: 2 },
  },
];

let nodeId = 100;
const getId = () => `node-${nodeId++}`;

function BuilderCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition, zoomIn, zoomOut, fitView } = useReactFlow();

  const nodeTypes = useMemo(() => ({ agentNode: AgentNode }), []);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "hsl(45, 96%, 48%)", strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const templateData = event.dataTransfer.getData("application/reactflow");
      if (!templateData) return;

      const template: NodeTemplate = JSON.parse(templateData);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type: "agentNode",
        position,
        data: {
          label: template.label,
          category: template.category,
          description: template.description,
          config: template.config || {},
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  const onDragStartHandler = useCallback(
    (event: React.DragEvent, template: NodeTemplate) => {
      event.dataTransfer.setData(
        "application/reactflow",
        JSON.stringify(template)
      );
      event.dataTransfer.effectAllowed = "move";
    },
    []
  );

  const onClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full">
      <BuilderSidebar onDragStart={onDragStartHandler} />

      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
          className="bg-background"
          defaultEdgeOptions={{
            animated: true,
            style: { stroke: "hsl(45, 96%, 48%)", strokeWidth: 2 },
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="hsl(220, 10%, 85%)"
          />
        </ReactFlow>

        {/* Top banner */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-card/90 border border-border rounded-lg backdrop-blur-md">
          <p className="font-mono text-xs text-center">
            <span className="text-primary font-semibold">CREATE YOUR REPLICA</span>
            <span className="text-muted-foreground ml-2">— Drag components → Connect → Deploy</span>
          </p>
        </div>

        <BuilderToolbar
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onFitView={() => fitView({ padding: 0.2 })}
          onClear={onClear}
          nodeCount={nodes.length}
          edgeCount={edges.length}
        />
      </div>
    </div>
  );
}

const CreateReplicas = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-14">
        <ReactFlowProvider>
          <BuilderCanvas />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default CreateReplicas;
