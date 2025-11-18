"use client";
import { useParams, usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { c_GetFamilyName, c_GetIndividual } from "@/fullstack/PublicConvexFunctions";
import { Id } from "@/convex/_generated/dataModel";
import { ThemeModeToggle } from "../theme-toggle";
// Parse the pathname to create breadcrumb items
interface BreadcrumbItem {
  title: string;
  path: string;
  isLast: boolean;
}
type ParamsType = {
  family_id: Id<"families">;
  family_member_id: Id<"family_members">;
};
export function DashboardHeader() {
  const pathname = usePathname();
  const { family_id, family_member_id } = useParams<ParamsType>();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const { data: family } = useSafeQuery(
    c_GetFamilyName,
    family_id
      ? {
          familyId: family_id as Id<"families">,
        }
      : "skip"
  );

  const { data: familyMember } = useSafeQuery(
    c_GetIndividual,
    family_member_id
      ? {
          id: family_member_id as Id<"family_members">,
        }
      : "skip"
  );

  useEffect(() => {
    function generateBreadcrumbs() {
      const params = [
        { id: family_id, name: family?.name },
        { id: family_member_id, name: familyMember?.full_name },
      ].filter((param) => param.id);

      const paths = pathname.split("/").filter((path) => path !== "");

      if (paths.length === 0) {
        setBreadcrumbs([{ title: "Dashboard", path: "/", isLast: true }]);
        return;
      }

      // Create breadcrumb items
      const newBreadcrumbs: BreadcrumbItem[] = [];
      let currentPath = "";

      paths.forEach((path, index) => {
        currentPath += `/${path}`;
        const data = params.find((param) => param.id === path);

        // Decode the URL-encoded path segment first
        const decodedPath = decodeURIComponent(data?.name || path);

        // Format the title (capitalize first letter and replace hyphens with spaces)
        const title = decodedPath
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        newBreadcrumbs.push({
          title,
          path: currentPath,
          isLast: index === paths.length - 1,
        });
      });

      setBreadcrumbs(newBreadcrumbs);
    }

    generateBreadcrumbs();
  }, [family, family_member_id, familyMember, family_id, pathname]);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 font-body border-b-2 border-b-secondary/25 sticky top-0 bg-background">
      <div className="flex items-center gap-2 px-4 ">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.path}>
                {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                <BreadcrumbItem className="hidden md:block font-sora">
                  {breadcrumb.isLast ? (
                    <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                  ) : (
                    <Link href={breadcrumb.path}>{breadcrumb.title}</Link>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto px-4">
        <ThemeModeToggle />
      </div>
    </header>
  );
}
