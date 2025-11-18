"use client";

import AddFamilyMembers from "@/components/Add/Add";
import { Doc } from "@/convex/_generated/dataModel";
import FamilyTree from "@/sketches/FamilyFlow";
import { Handle, Position, ReactFlowProvider } from "@xyflow/react";
import Image from "next/image";
import React from "react";
import {
  familyTreeBuilder,
  FamilyTreeBuilderParams,
} from "@/lib/familyTreeBuilder";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { P5jsContainer } from "@/components/p5js/P5jsContainer";
import { SampleSketch, SampleSketchProps } from "@/sketches/FamilySketch copy";
import ProfileDetails from "@/components/osisi-ui/profile/ProfileDetails";
import WithFamilyAccess from "@/components/access/WithAccess";

const familyMemberDimensions = {
  width: 250,
  height: 200,
};
type FamilyType = {
  familyMembers: Doc<"family_members">[] | null;
  familyDetails: Doc<"families"> | null;
  relationships: Doc<"relationships">[] | null;
};

export default function CloseFamily({ family }: { family: FamilyType }) {
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const focusMember = useSearchParams().get("focus_member");

  if (!family.familyDetails?.root_member) {
    return <></>;
  }
  const input: FamilyTreeBuilderParams = {
    focusFamilyMemberId: family.familyDetails?.root_member,
    allFamilyMembers: family.familyMembers || [],
    familyRelationships: family.relationships || [],
    width: familyMemberDimensions.width,
    height: familyMemberDimensions.height,
    gap: {
      x: 250,
      y: 250,
    },
  };
  const {
    computeGenerations,
    groupGenerations,
    findRootAncestors,
    buildFamilyTreeStructure,
    ExtractNodes,
    generateEdges,
  } = familyTreeBuilder(input);
  const familyMembersWithGeneration = computeGenerations();
  const groupedGenerations = groupGenerations(familyMembersWithGeneration);
  const rootAncestors = findRootAncestors(groupedGenerations);
  const familyTree = buildFamilyTreeStructure(
    familyMembersWithGeneration,
    null,
    rootAncestors[0],
    input.familyRelationships
  );

  // const sketchData: FamilySketchProps = {
  //   familyMembers: family.familyMembers || [],
  //   familyRelationships: family.relationships || [],
  // };

  if (!familyTree) {
    return <div></div>;
  }
  const initialNodes = ExtractNodes(familyTree);
  const initialEdges = generateEdges(family.relationships || []);
  const focusNode = initialNodes?.find(
    (member) => member.id === (focusMember || family.familyDetails?.root_member)
  );
  if (initialNodes.length === 0) {
    return <div>lol</div>;
  }
  const nodeTypes = {
    familyNode: FamilyNode,
    spouseNode: SpouseNode,
  };

  return (
    <div className="w-full h-full relative">
      <section className="absolute top-0 left-0 right-0 z-10 flex items-center justify-end gap-2 p-2">
        <Button
          variant={viewMode === "edit" ? "default" : "outline"}
          onClick={() => setViewMode("edit")}
          size={"sm"}
        >
          Edit
        </Button>
        <Button
          variant={viewMode === "preview" ? "default" : "ghost"}
          onClick={() => setViewMode("preview")}
          size={"sm"}
        >
          Preview
        </Button>
      </section>
      <div className="w-full h-full">
        {viewMode === "edit" ? (
          <ReactFlowProvider>
            <FamilyTree
              initialEdges={initialEdges}
              initialNodes={initialNodes}
              nodeTypes={nodeTypes}
              focusNode={focusNode}
            />
          </ReactFlowProvider>
        ) : (
          <div
            className={`h-full w-full flex overflow-x-auto sec-font text-base`}
          >
            <div className="w-full h-full grid place-content-center">
              COMING SOON
              <div className="text-muted-foreground mb-4">
                This feature is under development. Stay tuned for updates!
              </div>
            </div>
            <P5jsContainer<SampleSketchProps>
              sketch={SampleSketch}
              className="h-full w-full hidden"
              data={null}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const FamilyNode = ({
  data: familyMember,
}: {
  data: Doc<"family_members">;
}) => {
  return (
    <div
      className="bg-background border border-muted rounded-xl p-4 font-cardo flex flex-col items-center text-center shadow-sm transition hover:shadow-md gap-1"
      style={{
        width: familyMemberDimensions.width,
        height: familyMemberDimensions.height,
      }}
    >
      <Image
        src={familyMember?.profile_picture || "/placeholder.jpg"}
        alt="Profile photo"
        width={56}
        height={56}
        className="rounded-full border border-muted bg-muted p-1 mb-2"
      />

      <ProfileDetails details={familyMember}>
        <div className="text-xs text-primary underline">View Profile</div>
      </ProfileDetails>
      <h6 className="text-primary text-lg font-semibold">
        {familyMember?.full_name || "Unknown"}
      </h6>

      <p className="text-xs text-muted-foreground mb-2">
        b. {familyMember?.dates?.birth?.year || "Unknown"}
      </p>
      <WithFamilyAccess
        action="read-limited"
        familyId={familyMember.family_id}
        resource="family_members"
      >
        <AddFamilyMembers familyMemberId={familyMember._id} />
      </WithFamilyAccess>

      {/* React Flow Handles */}
      <>
        <Handle
          type="target"
          id="parents-to"
          position={Position.Top}
          style={{ background: "#004a58" }}
        />
        <Handle
          type="source"
          id="parents-from"
          position={Position.Bottom}
          style={{ background: "#004a58" }}
        />
        <Handle
          type="target"
          id="partners-to"
          position={Position.Right}
          style={{ background: "#004a58" }}
        />
        <Handle
          type="source"
          id="partners-from"
          position={Position.Left}
          style={{ background: "#004a58" }}
        />
      </>
    </div>
  );
};
const SpouseNode = () => {
  return (
    <div className="hidden">
      {/* React Flow Handles */}
      <>
        <Handle
          type="target"
          id="parents-to"
          position={Position.Top}
          style={{ background: "#004a58" }}
        />
        <Handle
          type="source"
          id="parents-from"
          position={Position.Bottom}
          style={{ background: "#004a58" }}
        />
        <Handle
          type="target"
          id="partners-to"
          position={Position.Right}
          style={{ background: "#004a58" }}
        />
        <Handle
          type="source"
          id="partners-from"
          position={Position.Left}
          style={{ background: "#004a58" }}
        />
      </>
    </div>
  );
};
