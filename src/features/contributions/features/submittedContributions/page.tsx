"use client";
import React from "react";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { c_GetContributionDetails } from "@/fullstack/PublicConvexFunctions";
import Loader from "@/components/osisi-ui/skeleton/Loader";
import Link from "next/link";
import { ConvexError } from "convex/values";
import { FamilyMembersTable } from "./components/FamilyMembersTable";
import FormHeader from "../../components/FormHeader";
import { SignUp } from "@/features/account/components/Socials";
import { Button } from "@/components/ui/button";

export default function SubmittedPage() {
  const { contribution_id } = useParams();
  const {
    data: contributionDetails,
    isPending,
    isError,
    error,
  } = useSafeQuery(
    c_GetContributionDetails,
    contribution_id
      ? { contributionId: contribution_id as Id<"family_contributions"> }
      : "skip"
  );

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    const cError = error as ConvexError<string>;
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h4 className="mb-2">Error</h4>
          <p className="opacity-75">
            {cError?.data ||
              "An error occurred while loading the contribution details."}
          </p>
        </div>
      </div>
    );
  }

  if (!contributionDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h4 className="mb-2">Link Not Found</h4>
          <p className="opacity-75">
            This contribution link does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="flex items-center flex-col p-4">
        <div className="max-w-[800px] w-full ">
          <FormHeader data={contributionDetails} />
          <div className="flex flex-col sm:flex-row justify-between gap-2 ">
            <SignUp text="Join Osisi Today" />
            {contributionDetails.max_uses_reached ? (
              <></>
            ) : (
              <Button asChild>
                <Link
                  href={`/add-family-member/${contribution_id}`}
                >
                  Add other {contributionDetails.relationship_type}
                </Link>
              </Button>
            )}
          </div>
          <FamilyMembersTable />
        </div>
      </div>
    </main>
  );
}
