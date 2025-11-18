"use client"
import LayoutsNavigationBar from "@/components/osisi-ui/navs/LayoutsNavigationBar";
import { usePublicFamilyData } from "@/contexts/PublicFamilyContext";
import React from "react";

export default function PublicLayoutsNavigationBar() {
  const { data } = usePublicFamilyData();
  const { familyDetails, familyMembers } = data;
  return (
    <LayoutsNavigationBar
      familyDetails={familyDetails}
      familyMembers={familyMembers}
    />
  );
}
