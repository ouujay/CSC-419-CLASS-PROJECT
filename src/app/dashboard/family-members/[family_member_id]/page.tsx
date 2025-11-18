"use client";
import { Id } from "@/convex/_generated/dataModel";
import { c_GetIndividual } from "@/fullstack/PublicConvexFunctions";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import React from "react";
import { useParams } from "next/navigation";
import BackButton from "@/components/osisi-ui/BackButton";
import Loader from "@/components/osisi-ui/skeleton/Loader";
import DeleteFamilyMember from "./components/DeleteFamilyMember";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ResponsiveTabs from "./components/ResponsiveTabs";
import FamilyMemberDetails from "./components/FamilyMemberDetails";
import { LoadingError } from "@/components/osisi-ui/Errors";
import { ConvexError } from "convex/values";
import WithFamilyAccess from "@/components/access/WithAccess";

export default function View() {
  const { family_member_id } = useParams<{
    family_member_id: Id<"family_members">;
  }>();
  const familyMemberId = decodeURIComponent(
    family_member_id
  ) as Id<"family_members">;

  const {
    data: familyMember,
    isError,
    isPending,
    error,
  } = useSafeQuery(c_GetIndividual, {
    id: familyMemberId,
  });

  if (isError) {
    const cError = error as ConvexError<string>;
    return <LoadingError message={cError.data} />;
  }

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 sm:p-6 space-y-8 max-w-6xl mx-auto w-full">
        <BackButton />
        <FamilyMemberDetails familyMember={familyMember} />

        {familyMember && <ResponsiveTabs familyMember={familyMember} />}

        <WithFamilyAccess
          familyId={familyMember?.family_id}
          action="delete"
          resource="family_members"
        >
          <Card className="border-destructive/20 p-4">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Once you delete a family member, there is no going back.
                  Please be certain.
                </p>

                {familyMember && (
                  <DeleteFamilyMember familyMember={familyMember} />
                )}
              </div>
            </CardContent>
          </Card>
        </WithFamilyAccess>
      </div>
    </div>
  );
}
