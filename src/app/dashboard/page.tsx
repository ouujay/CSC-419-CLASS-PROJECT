import React from "react";
import Scratch from "./families/components/Scratch";
import ExtendFamily from "@/features/extendFamily/ExtendFamily";
import ViewFamilies from "@/features/dashboard/components/ViewFamilies";

export default async function page() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Scratch />
        <ViewFamilies />
        <ExtendFamily />
      </div>
    </div>
  );
}
