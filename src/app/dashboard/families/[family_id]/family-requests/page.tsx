import { Id } from "@/convex/_generated/dataModel";
import FamilyRequestsList from "@/features/familyRequests/FamilyRequestPage";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ family_id: Id<"families"> }>;
}) {
  const { family_id: familyId } = await params;
  return <FamilyRequestsList familyId={familyId} />;
}
