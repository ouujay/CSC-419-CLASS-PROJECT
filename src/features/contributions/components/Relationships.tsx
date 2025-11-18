"use client";
import { useAddMemberStore } from "@/contexts/AddMemberContext";
import React from "react";
import { useContributionStore } from "../context/ContributionProvider";
import SuggestedRelationships from "@/components/osisi-ui/suggestedRelationships/new";

export default function Relationships() {
  const relationship = useContributionStore(
    (state) => state.data.relationship_type
  );
  const setRelationships = useAddMemberStore((state) => state.setRelationships);
  const referringMember = useContributionStore(
    (state) => state.data.link_origin_family_member_id
  );
  const familyId = useContributionStore((state) => state.data.family_id);
  const suggestions = useContributionStore((state) => state.data.suggestions);

  if (!relationship || !referringMember) {
    return null;
  }
  return (
    <SuggestedRelationships
      relationship={relationship}
      setRelationships={setRelationships}
      familyMemberId={referringMember}
      familyId={familyId}
      data={suggestions}
    />
  
  );
}
