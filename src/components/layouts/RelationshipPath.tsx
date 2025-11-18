"use client";
import { Doc, Id } from "@/convex/_generated/dataModel";
import FamilyTree from "@/sketches/FamilyFlow";
import { Edge, NodeTypes, ReactFlowProvider } from "@xyflow/react";
import React from "react";
import { GetRelationshipsPathName } from "@/fullstack/types";

type Path = GetRelationshipsPathName;

export default function RelationshipPath({
  familyMembers,
  path,
  nodeTypes,
  source,
}: {
  familyMembers: Doc<"family_members">[];
  path: Path;
  source: Id<"family_members">;
  nodeTypes: NodeTypes;
}) {
  const initialNodes = generateNode(path, familyMembers);
  const initialEdges = generateEdges(path);
  const focusNode = initialNodes?.find((member) => member.id === source);

  return (
    <div className="w-[600px] h-[500px] relative">
      <div className="w-full h-full">
        <ReactFlowProvider>
          <FamilyTree
            initialEdges={initialEdges}
            initialNodes={initialNodes}
            nodeTypes={nodeTypes}
            focusNode={focusNode}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}

function generateNode(path: Path, familyMembers: Doc<"family_members">[]) {
  const nodePath = path.map((p, index) => {
    const familyMember = familyMembers.find((familyMember) => familyMember._id === p.familyMemberId);
    if (!familyMember) return null;

    return {
      position: { x: index * 500, y: 100 },
      id: familyMember?._id || `${index}`,
      type: "previewNode",
      data: {familyMember, path:p},
    };
  });

  return nodePath.filter((n) => n !== null);
}

// In generateEdges function
function generateEdges(path: Path) {
  const edges: Edge[] = [];

  for (let i = 1; i < path.length; i++) {
    edges.push({
      id: `${path[i - 1].familyMemberId}-${path[i].familyMemberId}`,
      source: path[i - 1].familyMemberId,
      target: path[i].familyMemberId,
      type: "smoothstep",
      data: {
        startLabel: "start edge label",
        endLabel: "end edge label",
      },
      style: {
        stroke: "#00a388",
        strokeWidth: 5,
      },
      sourceHandle: `p-from`,
      targetHandle: `p-to`,
    });
  }

  return edges;
}
