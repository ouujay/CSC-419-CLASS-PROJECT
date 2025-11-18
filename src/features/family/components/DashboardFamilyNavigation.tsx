"use client";
import { LayoutsMenu } from "@/components/osisi-ui/navs/LayoutsMenuBar";
import SubNavigationBar from "@/components/osisi-ui/navs/SubNavigationBar";
import { Id } from "@/convex/_generated/dataModel";
import {  Layout, Handshake, Inbox  } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";

export default function DashboardFamilyNavigation() {
  const { family_id: familyId } = useParams<{ family_id: Id<"families"> }>();
  const baseUrl = "/dashboard/families";
  const links = useMemo(
    () => [
      // {
      //   label: "Overview",
      //   href: `${baseUrl}/${familyId}`,
      //   icon: <Layout className=" w-4 h-4" />,
      // },
      {
        label: "Layouts",
        href: `${baseUrl}/${familyId}/layouts`,
        icon: <Layout className=" w-4 h-4" />,
        subNav: <LayoutsMenu familyId={familyId} baseUrl={baseUrl} />,
      },
      {
        label: "Requests",
        href: `${baseUrl}/${familyId}/family-requests`,
        icon: <Inbox className=" w-4 h-4" />,
      },
      {
        label: "Matches",
        href: `${baseUrl}/${familyId}/matches`,
        icon: <Handshake  className=" w-4 h-4" />,
      },
    ],
    [familyId]
  );
  return <SubNavigationBar links={links} />;
}
