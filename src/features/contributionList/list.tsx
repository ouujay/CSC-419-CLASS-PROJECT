"use client";
import React from "react";
import { Link } from "lucide-react";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import {
  c_CheckContributionUsage,
  c_GetContributionList,
} from "@/fullstack/PublicConvexFunctions";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { formatTimeRemaining } from "@/lib/formatters";
import { ConvexError } from "convex/values";
import CopyContributionLink from "./components/CopyContributionLink";
import DeleteContribution from "./components/DeleteContribution";
import RenewContribution from "./components/RenewContributionLink";
import { NewBadge } from "@/components/osisi-ui/badges/NewBadge";
import { Badge } from "@/components/ui/badge";

const ContributionList = () => {
  const { family_id: familyId } = useParams<{ family_id: Id<"families"> }>();
  const {
    data: contributions,
    isPending,
    isError,
    error,
  } = useSafeQuery(c_GetContributionList, familyId ? { familyId } : "skip");
  const { data: usageData } = useSafeQuery(c_CheckContributionUsage, {
    familyId,
  });

  const getStatusBadge = (contribution: Doc<"family_contributions">) => {
    const timeStatus = formatTimeRemaining(contribution.expires_at);

    if (timeStatus.expired) {
      return (
        <Badge className="rounded-full" variant={"destructive"}>
          Expired
        </Badge>
      );
    }

    if (contribution.max_uses_reached) {
      return <Badge className="rounded-full">Complete</Badge>;
    }

    return (
      <Badge className="rounded-full" variant={"outline"}>
        Active
      </Badge>
    );
  };

  const ActionButtons = ({
    contribution,
  }: {
    contribution: Doc<"family_contributions">;
  }) => (
    <div className="flex items-center gap-1 sm:gap-2">
      <CopyContributionLink contributionId={contribution._id} />
      <RenewContribution contributionId={contribution._id} />
      <DeleteContribution contributionId={contribution._id} />
    </div>
  );

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h4 className="mb-2">Loading...</h4>
          <p className="opacity-75">
            Please wait while we fetch contributions.
          </p>
        </div>
      </div>
    );
  }
  if (isError) {
    const cError = error as ConvexError<string>;
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h4 className="mb-2">Error</h4>
          <p className="opacity-75">
            {cError?.data || "An error occurred while loading contributions."}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full  mx-auto ">
      <div className="mb-6">
        <h4 className=" mb-2">Contribution Links</h4>
        <p className="">Manage your family contribution links.</p>
        <section className="grid grid-cols-[1fr_1fr] md:min-w-[400px] gap-2 place-content-center">
          <UsageBar
            current={Math.min(usageData?.current || 0, usageData?.max || 0)}
            max={usageData?.max || 0}
          />
        </section>
      </div>

      {contributions.length === 0 ? (
        <div className="text-center py-12 rounded border">
          <Link className="w-16 h-16 mx-auto  mb-4" />
          <h3 className="text-xl font-medium  mb-2">
            No contribution links found
          </h3>
          <p className="">
            Create your first contribution link to share your family tree.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="grid grid-cols-fluid-sm gap-4">
            {contributions.map((contribution) => {
              const timeStatus = formatTimeRemaining(contribution.expires_at);

              return (
                <div
                  key={contribution._id}
                  className="bg-background rounded-lg border shadow-sm  relative"
                >
                  {/* Card Header */}
                  <section className="p-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      {getStatusBadge(contribution)}
                      <NewBadge timestamp={contribution._creationTime} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h6 className="truncate">
                        {contribution.originFamilyMember?.full_name ||
                          "Unknown"}{" "}
                        | {contribution.relationship_type}
                      </h6>

                      <p className="text-sm  truncate opacity-75">
                        create by{" "}
                        {contribution.user?.first_name || "Unknown User"}
                      </p>
                    </div>

                    {/* Usage Bar */}
                    <div className="mt-2 mb-2">
                      <UsageBar
                        current={contribution.created_family_members.length}
                        max={contribution.max_usage}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${timeStatus.color}`}>
                        {timeStatus.text} left
                      </span>
                      <ActionButtons contribution={contribution} />
                    </div>
                  </section>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ContributionList;

export const UsageBar = ({
  current,
  max,
}: {
  current: number;
  max: number;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-sm font-medium  min-w-fit">
      {current}/{max}
    </span>
    <div className="flex-1 bg-white rounded-full h-2">
      <div
        className="bg-primary h-2 rounded-full transition-all duration-300"
        style={{ width: `${(current / max) * 100}%` }}
      ></div>
    </div>
  </div>
);
