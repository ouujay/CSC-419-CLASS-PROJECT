"use client";
import React from "react";
import { FamilyTable } from "./FamilyTable";
import { AddFamilyForm } from "./AddFamilyForm";

export default function FamilyPage() {
  return (
    <div className="p-4 h-full">
      <h5 className="">Family Trees</h5>
      <AddFamilyForm />
      <div className="mt-8">
        <FamilyTable />
      </div>
    </div>
  );
}
