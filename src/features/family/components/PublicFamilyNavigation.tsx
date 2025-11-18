"use client";
import { LayoutsMenu } from "@/components/osisi-ui/navs/LayoutsMenuBar";
import SubNavigationBar from "@/components/osisi-ui/navs/SubNavigationBar";
import { Id } from "@/convex/_generated/dataModel";
import { Layout } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";

export default function PublicFamilyNavigation() {
  const { family_id: familyId } = useParams<{ family_id: Id<"families"> }>();
  const baseUrl = "/families";
  const links = useMemo(
    () => [
      {
        label: "Layouts",
        href: `/families/${familyId}/layouts`,
        icon: <Layout className=" w-4 h-4" />,
        subNav: <LayoutsMenu familyId={familyId} baseUrl={baseUrl} />,
      },
    ],
    [familyId]
  );
  return <SubNavigationBar links={links} />;
}
