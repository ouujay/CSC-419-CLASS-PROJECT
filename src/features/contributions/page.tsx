"use client";
import React from "react";
import { AddMemberProvider } from "@/contexts/AddMemberContext";
import FormHeader from "./components/FormHeader";
import { useParams, useSearchParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { c_GetContributionDetails } from "@/fullstack/PublicConvexFunctions";
import Loader from "@/components/osisi-ui/skeleton/Loader";
import { ConvexError } from "convex/values";
import { MaximumUsageMessage } from "./components/errorMessages";
import { LoadingError } from "@/components/osisi-ui/Errors";
import AddFamilyMemberForm from "./components/Form";
import { familyMemberDetailsType } from "@/components/osisi-ui/Form/EssentialInfo";
import { ContributionProvider } from "./context/ContributionProvider";

export default function ContributionPage() {
  const { contribution_id } = useParams<{
    contribution_id: Id<"family_contributions">;
  }>();
  const searchParams = useSearchParams();
  const familyMemberId = searchParams.get("member") as Id<"family_members">;
  const { data, isPending, isError, error } = useSafeQuery(
    c_GetContributionDetails,
    contribution_id
      ? {
          contributionId: contribution_id as Id<"family_contributions">,
          familyMemberId: familyMemberId ? familyMemberId : undefined,
        }
      : "skip"
  );

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    const cError = error as ConvexError<string>;
    return <LoadingError message={cError.data} />;
  }

  if (data.max_uses_reached && !familyMemberId) {
    return <MaximumUsageMessage contribution_id={data._id} />;
  }

  return (
    <ContributionProvider contributionDetails={data}>
      <div className="flex flex-col py-4 w-full sm:items-center">
        <div className="max-w-[800px] flex items-center flex-col ">
          <FormHeader data={data} />

          <AddMemberProvider
            familyId={data.family._id}
            familyMemberDetails={
              (data.currentFamilyMember.details as familyMemberDetailsType) ||
              null
            }
            relationships={[]}
          >
            <AddFamilyMemberForm />
          </AddMemberProvider>
        </div>
      </div>
    </ContributionProvider>
  );
}
