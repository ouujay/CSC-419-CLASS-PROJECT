"use client";
import React from "react";
import EssentialInfoContainer from "./EssentialInfo";
import Relationships from "./Relationships";
import { SubmitButton } from "./SubmitButton";


export default function AddFamilyMemberForm() {
  return (
    <div className="flex flex-col items-center gap-8 w-full p-4">
      <EssentialInfoContainer />
      <Relationships />
      <SubmitButton />
    </div>
  );
}