"use client";

import RemoveFamilyMembersDialog from "@/components/osisi-ui/buttons/RemoveFamilyMemberButton";
import { Button } from "@/components/ui/button";
import { useFamilyMemberControls } from "@/contexts/FamilyMemberControl";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import SeeRelationshipDialog from "./SeeRelationship";
import { useFamilyData } from "@/contexts/DashboardFamilyContext";

export default function EditPreviewLinks({ familyId }: { familyId: Id<"families"> }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get full URL
  const previewPath = `/dashboard/families/${familyId}/layouts/descendants/preview`;
  const editPath = `/dashboard/families/${familyId}/layouts/descendants`;

  return (
    <>
      <div className="w-fit bg-background-muted rounded-br-xl border-b border-r border-primary/20 flex gap-2 absolute z-20 p-1">
        <Button variant={pathname === editPath ? "default" : "ghost"}>
          <Link href={`${editPath}?${searchParams.toString()}`}>Edit</Link>
        </Button>
        <Button variant={pathname === previewPath ? "default" : "ghost"}>
          <Link href={`${previewPath}?${searchParams.toString()}`}>Preview</Link>
        </Button>
      </div>
      <div className="w-fit bg-background-muted rounded-bl-xl border-b border-l border-primary/20 flex gap-2 absolute right-0 z-20 p-1">
        <Button variant={"outline_destructive"}>
          <Link href={pathname}>Reset Focus</Link>
        </Button>
      </div>
      <div className="w-fit bg-background-muted rounded-tl-xl border-t border-l border-primary/20 flex gap-2 absolute right-0 z-20 bottom-0 p-1">
        <RemoveFamilyMembers familyId={familyId} />
        <ResetSelectedFamilyMembers />
        <UnhideFamilyMembers />
      </div>
      <div className="w-fit bg-background-muted rounded-b-xl border-b border-x border-primary/20 flex gap-2 absolute left-1/2 -translate-x-1/2 z-20 top-0 p-1">
        <SeeRelationship />
      </div>
    </>
  );
}

export function RemoveFamilyMembers({ familyId }: { familyId: Id<"families"> }) {
  const selectedFamilyMembers = useFamilyMemberControls((state) => state.selectedFamilyMembers);
  const resetSelectedFamilyMembers = useFamilyMemberControls((state) => state.resetSelectedFamilyMembers);

  return selectedFamilyMembers.length > 0 ? (
    <RemoveFamilyMembersDialog
      familyId={familyId}
      members={selectedFamilyMembers}
      onSuccess={resetSelectedFamilyMembers}
    />
  ) : (
    <></>
  );
}
export function ResetSelectedFamilyMembers() {
  const selectedFamilyMembers = useFamilyMemberControls((state) => state.selectedFamilyMembers);
  const resetSelectedFamilyMembers = useFamilyMemberControls((state) => state.resetSelectedFamilyMembers);

  return selectedFamilyMembers.length > 0 ? (
    <Button variant={"ghost"} onClick={resetSelectedFamilyMembers}>
      Clear
    </Button>
  ) : (
    <></>
  );
}
export function UnhideFamilyMembers() {
  const hiddenFamilyMembers = useFamilyMemberControls((state) => state.hiddenFamilyMembers);
  const resetHiddenFamilyMembers = useFamilyMemberControls((state) => state.resetHiddenFamilyMembers);

  return hiddenFamilyMembers.length > 0 ? (
    <Button variant={"ghost"} onClick={resetHiddenFamilyMembers}>
      Unhide
    </Button>
  ) : (
    <></>
  );
}
export function SeeRelationship() {
  const selectedFamilyMembers = useFamilyMemberControls((state) => state.selectedFamilyMembers);
  const { data } = useFamilyData();
  const relationships = data.relationships;
  const familyMembers = data.members;

  return selectedFamilyMembers.length === 2 ? (
    <SeeRelationshipDialog
      relationships={relationships}
      familyMembers={familyMembers}
      sourceFamilyMember={selectedFamilyMembers[0]}
      targetFamilyMember={selectedFamilyMembers[1]}
    />
  ) : (
    <></>
  );
}
