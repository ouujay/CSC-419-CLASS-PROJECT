"use client";
import React from "react";
import FamilyMembersTable from "@/components/layouts/FamilyMembersTable";
import { usePublicFamilyData } from "@/contexts/PublicFamilyContext";

export default function PublicFamilyMembersTable() {
  const { data } = usePublicFamilyData();
  const { familyDetails, familyMembers } = data;
  if (!familyDetails) {
    return <></>;
  }
  return (
    <FamilyMembersTable
      familyData={familyDetails}
      familyMembers={familyMembers || []}
    />
  );
}
