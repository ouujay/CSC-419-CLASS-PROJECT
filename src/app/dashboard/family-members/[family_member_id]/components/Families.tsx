"use client";
import FamilyName from "@/components/osisi-ui/FamilyName";
import Loader from "@/components/osisi-ui/skeleton/Loader";
import { Doc } from "@/convex/_generated/dataModel";
import { c_GetFamiliesByFamilyMemberId } from "@/fullstack/PublicConvexFunctions";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { ConvexError } from "convex/values";
import Link from "next/link";
import React from "react";

type FamiliesProps = {
  familyMember?: Doc<"family_members"> | null;
};
export default function Families({ familyMember }: FamiliesProps) {
  const {
    data: families,
    isPending,
    isError,
    error,
  } = useSafeQuery(
    c_GetFamiliesByFamilyMemberId,
    familyMember?._id ? { id: familyMember?._id } : "skip"
  );
  const CError = error as ConvexError<string>;

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Error loading family relationships: {CError.data || ""}
      </div>
    );
  }

  if (isPending) {
    return <Loader />;
  }

  return (
    <>
<div className="overflow-x-auto">
  <table className="font-sora w-full min-w-[500px]">
    <thead>
      <tr>
        <th className="text-left p-2">Family Name</th>
        <th className="text-center p-2">Members</th>
        <th className="text-center p-2">Updated At</th>
      </tr>
    </thead>
    <tbody>
      {families.map((fam) => (
        <tr
          key={fam.id}
          className="relative hover:bg-accent/10 transition-colors"
        >
          <td className="capitalize relative underline text-left p-2 whitespace-nowrap">
            <Link
              href={`/dashboard/families/${fam.name}`}
              className="absolute inset-0 z-10"
            />
            <FamilyName name={fam?.name || ""} />
          </td>
          <td className="text-center p-2 whitespace-nowrap">
            {fam.members || 0}
          </td>
          <td className="text-center p-2 whitespace-nowrap">
            {fam.updatedAt
              ? new Date(fam.updatedAt).toLocaleString()
              : "N/A"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </>
  );
}
