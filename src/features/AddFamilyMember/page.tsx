"use client";
import React from "react";
import { AddFamilyMemberForm } from "./components/AddFamilyMember";
import { Id } from "@/convex/_generated/dataModel";
import { AddMemberProvider } from "@/contexts/AddMemberContext";
import WithFamilyAccess from "@/components/access/WithAccess";
import { useParams } from "next/navigation";
import { AddFamilyMemberFallback } from "@/components/osisi-ui/PermissionFallbacks";

export default function AddFamilyMemberPage() {
  const { family_id: familyId } = useParams<{ family_id: Id<"families"> }>();

  return (
    <WithFamilyAccess
      familyId={familyId}
      action="create"
      resource="family_members"
      fallback={<AddFamilyMemberFallback />}
    >
      <AddMemberProvider familyId={familyId}>
        <AddFamilyMemberForm />
      </AddMemberProvider>
    </WithFamilyAccess>
  );
}
