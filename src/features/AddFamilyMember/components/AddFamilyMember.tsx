"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { c_GetIndividual } from "@/fullstack/PublicConvexFunctions";
import { Id } from "@/convex/_generated/dataModel";
import { ConvexError } from "convex/values";
import Loader from "@/components/osisi-ui/skeleton/Loader";
import { LoadingError } from "@/components/osisi-ui/Errors";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import EssentialInfoContainer from "./EssentialInfo";
import { SubmitButton } from "./SubmitButton";
import SelectRelationshipType from "./SelectRelationshipType";
import GenerateContributionLink from "@/components/Add/GenerateContributionLink";
import { useAddMemberStore } from "@/contexts/AddMemberContext";
import Relationships from "./Relationships";
import { ExtendedRelationshipsType } from "@/types";

export function AddFamilyMemberForm() {
  return (
    <div className="flex flex-col items-center gap-2 w-full pb-4">
      <Headers />

      <div className="w-full max-w-[750px] p-4 sm:px-8 flex flex-col gap-8">
        <SelectRelationshipType />
        <EssentialInfoContainer />
        <Relationships />
        <SubmitButton />
      </div>
    </div>
  );
}
function Headers() {
  const searchParams = useSearchParams();
  const familyId = useAddMemberStore((state) => state.familyId);
  const relationship = useAddMemberStore((state) => state.relationship);
  const referringMemberId = searchParams.get(
    "family_member"
  ) as Id<"family_members">;
  const {
    data: referringMember,
    isPending,
    isError,
    error,
  } = useSafeQuery(
    c_GetIndividual,
    referringMemberId ? { id: referringMemberId } : "skip"
  );

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    const cError = error as ConvexError<string>;
    return <LoadingError message={cError.data} />;
  }
  return (
    <nav className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b py-4 sm:px-8 px-4 mb-8 gap-2 w-full">
      <div>
        <h6 className="font-normal capitalize">
          {FormatTitle(relationship, referringMember?.full_name)}
        </h6>
        <p className="text-sm">
          Fill in the details below to add a new family member to the family
          tree.
        </p>
      </div>

      <GenerateContributionLink
        familyMemberId={referringMemberId}
        familyId={familyId}
      />
    </nav>
  );
}

function FormatTitle(
  relationship: ExtendedRelationshipsType | null,
  name?: string
) {
  if (!relationship) {
    return "Add Member";
  }
  const obj = {
    parents: "parent",
    children: "child",
    partners: "partner",
  };
  return obj[relationship] && name
    ? `the ${obj[relationship]} of ${name || ""}`
    : "Add Member";
}
