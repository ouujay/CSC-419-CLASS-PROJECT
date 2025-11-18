"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { JSX, useState } from "react";
import { Ban, Menu, Settings2, TriangleAlert, X } from "lucide-react"; // or use Heroicons
import WithFamilyAccess from "@/components/access/WithAccess";
import CollaborationDialog from "@/app/dashboard/families/[family_id]/components/CollaborationDialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Id } from "@/convex/_generated/dataModel";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { c_CheckFamilyMembersUsage } from "@/fullstack/PublicConvexFunctions";

type NavigationLink = {
  label: string;
  href: string;
  icon: JSX.Element;
  subNav?: JSX.Element;
};
type Props = {
  links: NavigationLink[];
};
export default function SubNavigationBar({ links }: Props) {
  const { family_id: familyId } = useParams<{ family_id: Id<"families"> }>();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 py-2 sm:hidden">
        <span className="font-cardo text-lg">Family</span>
        <button
          className="p-2 rounded hover:bg-accent/20"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div
        className={`flex flex-col sm:flex-row justify-between sm:items-center  px-4 py-2 ${open ? "block" : "hidden sm:flex"}`}
      >
        <ul
          className={`flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 sm:pb-0 transition-all duration-300`}
        >
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.label}>
                {link.subNav ? (
                  link.subNav
                ) : (
                  <Link
                    href={link.href}
                    className={`flex items-center gap-2 py-2 border-b-2 transition-colors ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent hover:border-primary text-muted-foreground hover:text-foreground"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <WithFamilyAccess
          familyId={familyId}
          action={"update"}
          resource="families"
          fallback={<></>}
        >
          <div className="flex  items-center justify-between sm:justify-start gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0">
            <HideFamilyMember familyId={familyId} />
            <CollaborationDialog />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={`/dashboard/families/${familyId}/edit`}
                    className=""
                  >
                    <Settings2 className="mr-1 sm:mr-0" />
                    <p className="  inline sm:hidden">Manage Family</p>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Manage Family</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </WithFamilyAccess>
      </div>
    </nav>
  );
}

function HideFamilyMember({ familyId }: { familyId: Id<"families"> }) {
  const { data } = useSafeQuery(c_CheckFamilyMembersUsage, { familyId });
  if (!data) {
    return <></>;
  }
  function lol(current: number, max: number) {
    if (current >= max) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Ban className="text-destructive " />
          </TooltipTrigger>
          <TooltipContent>
            <p>{`You've reached your limit of ${max} family members`}</p>
          </TooltipContent>
        </Tooltip>
      );
    }
    const warningMax = max * 0.75;
    if (current >= warningMax) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <TriangleAlert className="text-warning " />
          </TooltipTrigger>
          <TooltipContent>
            <p>{`Warning: You about to reach your limit of ${max} family members`}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return <></>;
  }
  return <>{lol(data.current, data.max)}</>;
}
