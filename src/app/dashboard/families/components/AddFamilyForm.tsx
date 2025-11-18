"use client";
import ExtendFamily from "@/features/extendFamily/ExtendFamily";
import Scratch from "./Scratch";
// import FamilyTemplate from "./Template";
// import UploadGEDCOM from "./UploadGEDCOM";

export function AddFamilyForm() {
  return (
    <div className="grid grid-cols-fluid-lg gap-2 py-4">
      <Scratch />
      <ExtendFamily />
      {/* <FamilyTemplate /> */}
      {/*  <UploadGEDCOM /> */}
    </div>
  );
}
