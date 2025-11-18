import React from "react";
import BackButton from "./BackButton";

export default function EditFamilyFallback() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-2">
      <h3 className="text-lg font-semibold">Access Denied</h3>
      <p className="text-sm text-muted-foreground">
        You don&apos;t have permission to edit this family.
      </p>
      <BackButton />
    </div>
  );
}
export  function AddFamilyMemberFallback() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-2">
      <h3 className="text-lg font-semibold">Access Denied</h3>
      <p className="text-sm text-muted-foreground">
        You don&apos;t have permission to add a family member this family.
      </p>
      <BackButton />
    </div>
  );
}
