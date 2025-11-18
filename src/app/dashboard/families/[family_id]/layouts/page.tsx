import { Id } from "@/convex/_generated/dataModel";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ family_id: Id<"families"> }>;
}>) {
  const { family_id } = await params;
  redirect(`/dashboard/families/${family_id}/layouts/descendants`);
}