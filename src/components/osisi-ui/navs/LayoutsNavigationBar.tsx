"use client";
import * as React from "react";
import FamilyName from "@/components/osisi-ui/FamilyName";
import { Doc } from "@/convex/_generated/dataModel";
import FamilyMemberSearchBar from "../../../features/layouts/components/FamilyMemberSearchBar";

export default function LayoutsNavigationBar({
  familyDetails,
  familyMembers,
}: {
  familyDetails: Doc<"families">;
  familyMembers: Doc<"family_members">[];
}) {
  return (
    <nav className=" container w-full py-2 px-4 border-b-2  font-body">
      <div className=" w-full  flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
        {/* Family Name */}
        <h6 className="capitalize text-center sm:text-left w-full sm:w-auto">
          <FamilyName name={familyDetails.name || ""} />
        </h6>
        <FamilyMemberSearchBar familyMembers={familyMembers} />
      </div>
    </nav>
  );
}
