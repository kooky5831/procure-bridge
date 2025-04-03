
import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Panel,
  ReactFlowProvider
} from 'reactflow';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import 'reactflow/dist/style.css';
import { ApprovalNode } from './nodes/ApprovalNode';

const nodeTypes = {
  approvalNode: ApprovalNode,
};

interface WorkflowCreatorProps {
  onNodesChange?: (nodes: Node[]) => void;
  initialRole?: string;
}

function WorkflowCreatorInner({ onNodesChange: onNodesChangeCallback, initialRole = 'PROCUREMENT' }: WorkflowCreatorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: 'start',
      type: 'approvalNode',
      position: { x: 250, y: 0 },
      data: { 
        label: 'Initial Approval',
        role: initialRole,
        approver: 'Not set',
        status: 'pending'
      }
    },
  ]);
  
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const prevNodesRef = useRef<Node[]>([]);
  const flowWrapper = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNewNode = useCallback(() => {
    const newNodeId = `approvalNode_${nodes.length}`;
    const lastNode = nodes[nodes.length - 1];
    const newY = lastNode ? lastNode.position.y + 100 : 0;

    const newNode: Node = {
      id: newNodeId,
      type: 'approvalNode',
      position: { x: 250, y: newY },
      data: {
        label: 'New Approval Step',
        role: 'EMPLOYEE',
        approver: 'Not set',
        status: 'pending'
      }
    };

    setNodes((nds) => [...nds, newNode]);

    if (lastNode) {
      const newEdge: Edge = {
        id: `e${lastNode.id}-${newNodeId}`,
        source: lastNode.id,
        target: newNodeId,
        type: 'smoothstep',
      };
      setEdges((eds) => [...eds, newEdge]);
    }
  }, [nodes, setNodes, setEdges]);

  useEffect(() => {
    if (onNodesChangeCallback && JSON.stringify(prevNodesRef.current) !== JSON.stringify(nodes)) {
      prevNodesRef.current = nodes;
      onNodesChangeCallback(nodes);
    }
  }, [nodes, onNodesChangeCallback]);

  // Add a small delay before fitting view to ensure proper rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      if (flowWrapper.current) {
        const reactFlowInstance = flowWrapper.current.querySelector('.react-flow');
        if (reactFlowInstance) {
          const event = new Event('resize');
          window.dispatchEvent(event);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={flowWrapper} className="h-[400px] border rounded-lg bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-muted/10"
      >
        <Background />
        <Controls />
        <Panel position="top-right">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={addNewNode}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Approval Step
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

// Wrap the component with ReactFlowProvider to handle context properly
export function WorkflowCreator(props: WorkflowCreatorProps) {
  return (
    <ReactFlowProvider>
      <WorkflowCreatorInner {...props} />
    </ReactFlowProvider>
  );
}
