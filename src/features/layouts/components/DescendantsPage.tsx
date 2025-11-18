"use client";
import { Id } from "@/convex/_generated/dataModel";
import React from "react";
import { useSearchParams } from "next/navigation";
import { FamilyNode } from "@/components/Nodes/FamilyNode";
import { SpouseNode } from "@/components/Nodes/SpouseNode";
import { LoadingError } from "@/components/osisi-ui/Errors";
import Descendants from "@/components/layouts/Descendants";
import { PreviewNode } from "@/components/Nodes/PreviewNode";
import { usePublicFamilyData } from "@/contexts/PublicFamilyContext";
import { useFamilyData } from "@/contexts/DashboardFamilyContext";
import { useFamilyMemberControls } from "@/contexts/FamilyMemberControl";
import { useDemoFamilyData } from "@/contexts/DemoFamilyContext";

export default function EditDescendantsPage() {
  const { data } = useFamilyData();
  const family = data.details;
  const familyMembers = data.members || [];
  const familyRelationships = data.relationships || [];

  const focusMember = (useSearchParams().get("focus_member") as Id<"family_members">) || family?.root_member;
  const findMember = useSearchParams().get("find_member") as Id<"family_members">;

  if (!focusMember) {
    return (
      <LoadingError message="No Root Family Member Found.Go to Manage Family to Update Root family Member" />
    );
  }

  const nodeTypes = {
    familyNode: FamilyNode,
    spouseNode: SpouseNode,
  };

  return (
    <Descendants
      family={{
        familyMembers: familyMembers,
        familyDetails: family,
        relationships: familyRelationships,
      }}
      nodeTypes={nodeTypes}
      nodeLabel={"familyNode"}
      focusFamilyMember={focusMember}
      findFamilyMember={findMember || focusMember}
    />
  );
}

export function PreviewDescendantsPage() {
  const { data } = useFamilyData();
  const family = data.details;
  const familyMembers = data.members || [];
  const familyRelationships = data.relationships || [];

  const hiddenFamilyMembers = useFamilyMemberControls((state) => state.hiddenFamilyMembers);

  const filteredFamilyMembers = familyMembers.filter((member) => !hiddenFamilyMembers.includes(member._id));
  const focusMember = (useSearchParams().get("focus_member") as Id<"family_members">) || family?.root_member;
  const findMember = useSearchParams().get("find_member") as Id<"family_members">;

  if (!focusMember) {
    return (
      <LoadingError message="No Root Family Member Found.Go to Manage Family to Update Root family Member" />
    );
  }

  const nodeTypes = {
    previewNode: PreviewNode,
    spouseNode: SpouseNode,
  };

  return (
    <Descendants
      family={{
        familyMembers: filteredFamilyMembers,
        familyDetails: family,
        relationships: familyRelationships,
      }}
      nodeTypes={nodeTypes}
      nodeLabel={"previewNode"}
      focusFamilyMember={focusMember}
      findFamilyMember={findMember || focusMember}
    />
  );
}

export function PublicDescendantsPage() {
  const { data: family } = usePublicFamilyData();
  const familyMembers = family.familyMembers;
  const familyRelationships = family.relationships;
  const focusMember =
    (useSearchParams().get("focus_member") as Id<"family_members">) || family?.familyDetails.root_member;
  const findMember = useSearchParams().get("find_member") as Id<"family_members">;

  if (!focusMember) {
    return (
      <LoadingError message="No Root Family Member Found.Go to Manage Family to Update Root family Member" />
    );
  }

  const nodeTypes = {
    previewNode: PreviewNode,
    spouseNode: SpouseNode,
  };

  return (
    <Descendants
      family={{
        familyMembers: familyMembers,
        familyDetails: family.familyDetails,
        relationships: familyRelationships,
      }}
      nodeTypes={nodeTypes}
      nodeLabel={"previewNode"}
      focusFamilyMember={focusMember}
      findFamilyMember={findMember || focusMember}
    />
  );
}
export function DemoDescendantsPage() {
  const { data: family } = useDemoFamilyData();
  const familyMembers = family.members;
  const familyRelationships = family.relationships;
  const focusMember =
    (useSearchParams().get("focus_member") as Id<"family_members">) || family?.details.root_member;
  const findMember = useSearchParams().get("find_member") as Id<"family_members">;

  if (!focusMember) {
    return (
      <LoadingError message="No Root Family Member Found.Go to Manage Family to Update Root family Member" />
    );
  }

  const nodeTypes = {
    previewNode: PreviewNode,
    spouseNode: SpouseNode,
  };

  return (
    <Descendants
      family={{
        familyMembers: familyMembers,
        familyDetails: family.details,
        relationships: familyRelationships,
      }}
      nodeTypes={nodeTypes}
      nodeLabel={"previewNode"}
      focusFamilyMember={focusMember}
      findFamilyMember={findMember || focusMember}
      fit={true}
    />
  );
}
