"use client";
import { Doc, Id } from "@/convex/_generated/dataModel";
import FamilyTree from "@/sketches/FamilyFlow";
import { NodeTypes, ReactFlowProvider } from "@xyflow/react";
import React from "react";
import { familyTreeBuilder, FamilyTreeBuilderParams } from "@/lib/familyTreeBuilder";
import { FAMILY_MEMBER_DIMENSIONS } from "@/utils/constants";
import { LoadingError } from "../osisi-ui/Errors";

type FamilyType = {
  familyMembers: Doc<"family_members">[] | null;
  familyDetails: Doc<"families"> | null;
  relationships: Doc<"relationships">[] | null;
};

export default function Descendants({
  family,
  nodeTypes,
  focusFamilyMember,
  findFamilyMember,
  nodeLabel,
  fit,
}: {
  family: FamilyType;
  nodeLabel: "familyNode" | "previewNode";
  nodeTypes: NodeTypes;
  focusFamilyMember: Id<"family_members">;
  findFamilyMember?: Id<"family_members">;
  fit?: boolean;
}) {
  const input: FamilyTreeBuilderParams = {
    focusFamilyMemberId: focusFamilyMember,
    allFamilyMembers: family.familyMembers || [],
    familyRelationships: family.relationships || [],
    width: FAMILY_MEMBER_DIMENSIONS.width,
    height: FAMILY_MEMBER_DIMENSIONS.height,
    gap: FAMILY_MEMBER_DIMENSIONS.gap,
  };

  const {
    computeGenerations,
    groupGenerations,
    findRootAncestors,
    buildFamilyTreeStructure,
    ExtractNodes,
    generateEdges,
  } = familyTreeBuilder(input);
  let familyTree: ReturnType<typeof buildFamilyTreeStructure>;

  const familyMembersWithGeneration = computeGenerations();
  familyTree = buildFamilyTreeStructure(
    familyMembersWithGeneration,
    null,
    focusFamilyMember,
    input.familyRelationships
  );

  if (!familyTree) {
    const groupedGenerations = groupGenerations(familyMembersWithGeneration);
    const rootAncestors = findRootAncestors(groupedGenerations);
    familyTree = buildFamilyTreeStructure(
      familyMembersWithGeneration,
      null,
      rootAncestors[0],
      input.familyRelationships
    );
  }

  if (!familyTree) {
    return <LoadingError message="No Family Members Found. Are you waiting for a family request?" />;
  }
  const initialNodes = ExtractNodes(familyTree, [], nodeLabel);
  const initialEdges = generateEdges(family.relationships || []);
  const focusNode = initialNodes?.find((member) => member.id === (findFamilyMember || focusFamilyMember));

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full">
        <ReactFlowProvider>
          <FamilyTree
            initialEdges={initialEdges}
            initialNodes={initialNodes}
            nodeTypes={nodeTypes}
            focusNode={fit ? undefined : focusNode}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
