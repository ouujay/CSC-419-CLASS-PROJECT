"use client";
import React from "react";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { c_GetPublicFamilies } from "@/fullstack/PublicConvexFunctions";
import { PublicFamilyList } from "./components/PublicFamiliesList";
import Loader from "@/components/osisi-ui/skeleton/Loader";

export default function PublicFamiliesPage() {
  const { data, isPending, isError } = useSafeQuery(c_GetPublicFamilies);

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    return <div className="p-4">Error loading families.</div>;
  }

  return (
    <div className="p-2 md:p-8">
      <div className="mt-8">
        <h6 className="pb-2">Families</h6>
        <PublicFamilyList families={data || []} />
      </div>
    </div>
  );
}
