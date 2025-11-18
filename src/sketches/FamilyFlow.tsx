"use client";
import React, { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Connection,
  Node,
  Edge,
  NodeTypes,
  useReactFlow,
  ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import DownloadButton from "@/components/osisi-ui/buttons/DownloadFlow";

const connectionLineStyle = { stroke: "#ffff" };
const snapGrid: [number, number] = [25, 25];

const defaultEdgeOptions = {
  animated: false,
  type: "",
};

const proOptions = { hideAttribution: true };
const defaultViewport = { x: 0, y: 0, zoom: 1.5 };
export default function FamilyTree({
  initialNodes,
  initialEdges,
  nodeTypes,
  focusNode,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
  nodeTypes: NodeTypes;
  focusNode?: Node;
}) {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const { setCenter } = useReactFlow();
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params }, eds)),
    [setEdges]
  );

  useEffect(() => {
    if (focusNode) {

      setCenter(focusNode.position.x + 100, focusNode.position.y + 100, {
        zoom: 0.90,
        duration: 1000,
      });
    }
  }, [focusNode, setCenter]);

  useEffect(() => {
    if (focusNode) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [focusNode, initialNodes, setNodes, setEdges, initialEdges]);

  return (
    <div style={{ width: "100%", height: "100%" }} className="">
      <ReactFlow
        fitView={focusNode ? undefined : true}
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        onConnect={onConnect}
        minZoom={0.05}
        connectionLineType={ConnectionLineType.Straight}
        // onNodesChange={onNodesChange}
        // onEdgesChange={onEdgesChange}
        connectionLineStyle={connectionLineStyle}
        snapGrid={snapGrid}
        defaultViewport={defaultViewport}
        defaultEdgeOptions={defaultEdgeOptions}
        snapToGrid={true}
        attributionPosition="bottom-left"
        className="download-image"
        proOptions={proOptions}
      >
        <Controls className="text-accent" />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} className="bg-accent"/>
        <DownloadButton />
      </ReactFlow>
    </div>
  );
}
