"use client";
import SuggestedRelationships from "@/components/osisi-ui/suggestedRelationships";
import { useAddMemberStore } from "@/contexts/AddMemberContext";
import { Id } from "@/convex/_generated/dataModel";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Relationships() {
  const searchParams = useSearchParams();
  const referringMemberId = searchParams.get(
    "family_member"
  ) as Id<"family_members">;

  const setRelationships = useAddMemberStore((state) => state.setRelationships);
  const familyId = useAddMemberStore((state) => state.familyId);
  const relationship = useAddMemberStore((state) => state.relationship);

  if (!relationship || !referringMemberId) {
    return null;
  }
  return (
    <SuggestedRelationships
      relationship={relationship}
      setRelationships={setRelationships}
      familyMemberId={referringMemberId}
      familyId={familyId}
    />
  );
}
