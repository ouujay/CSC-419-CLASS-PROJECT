"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Doc } from "@/convex/_generated/dataModel";
import FamilyMemberDetails from "@/app/dashboard/family-members/[family_member_id]/components/FamilyMemberDetails";
import Link from "next/link";
import DateRange from "@/components/osisi-ui/Dates";
import AddFamilyMembers from "@/components/Add/Add";
import WithFamilyAccess from "@/components/access/WithAccess";

export default function ProfileDetails({
  details,
  children,
}: {
  details: Doc<"family_members">;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="w-[90%] max-w-md mx-auto p-4 sm:p-6">
          <DialogTitle className="mb-4 text-lg font-medium">
            Profile Details
          </DialogTitle>
          <FamilyMemberDetails familyMember={details} />
          <DateRange
            birthDate={details.dates?.birth}
            deathDate={details.dates?.death}
            showIcon={true}
            isDeceased={details.is_deceased}
          />
          <WithFamilyAccess familyId={details.family_id} action={"read-limited"} resource="family_members">
            <div className="flex flex-col gap-4">
              <AddFamilyMembers familyMemberId={details._id} />
              <Link
                href={`/dashboard/family-members/${details._id}`}
                className=" underline hover:underline text-secondary transition-colors duration-200  w-full text-center"
              >
                View More...
              </Link>
            </div>
          </WithFamilyAccess>
        </DialogContent>
      </Dialog>
    </div>
  );
}
