"use client";
import * as React from "react";
import Link from "next/link";
import { cn } from "@/utils/utils";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import {
  ChevronDown,
  FolderTree,
  GitCommitVertical,
  GitFork,
  Hourglass,
  Network,
  Sheet,
  TreeDeciduous,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";

export function LayoutsMenu({
  familyId,
  baseUrl,
}: {
  familyId: Id<"families">;
  baseUrl: string;
}) {
  const pathname = usePathname();
  const views = [
    {
      title: "Descendants",
      url: `${baseUrl}/${familyId}/layouts/descendants`,
      icon: Network,
    },
    {
      title: "Ancestors",
      url: `${baseUrl}/${familyId}/layouts/ancestors`,
      icon: GitFork,
      isNew: true,
      isDisabled: true,
    },
    {
      title: "Close Family",
      url: `${baseUrl}/${familyId}/layouts/close-family`,
      icon: Users,
      isNew: true,
      isDisabled: true,
    },
    {
      title: "Lineage",
      url: `${baseUrl}/${familyId}/layouts/lineage,`,
      icon: GitCommitVertical,
      isNew: true,
      isDisabled: true,
    },
    {
      title: "Hourglass",
      url: `${baseUrl}/${familyId}/layouts/hourglass`,
      icon: Hourglass,
      isNew: true,
      isDisabled: true,
    },
    {
      title: "Bowtie",
      url: `${baseUrl}/${familyId}/layouts/bowtie`,
      icon: Hourglass,
      isNew: true,
      isDisabled: true,
    },
    {
      title: "Folder",
      url: `${baseUrl}/${familyId}/layouts/folder`,
      icon: FolderTree,
    },
    {
      title: "Table",
      url: `${baseUrl}/${familyId}/layouts/table`,
      icon: Sheet,
    },
  ];

  const currentView = views.find((view) => {
    const viewPath = view.url.split("?")[0];
    const currentPath = pathname;
    return currentPath === viewPath;
  });

  const defaultView = {
    title: "Family Tree",
    icon: TreeDeciduous,
    isDisabled: true,
  };

  const activeView = currentView || defaultView;

  return (
    <div className="w-full sm:w-auto flex sm:justify-end">
      <div className="font-sora">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`cursor-pointer   py-1 flex gap-2 items-center w-full sm:w-auto justify-center capitalize ${activeView.isDisabled ? "text-foreground" : "border-b-2 border-primary text-primary"}`}
          >
            <activeView.icon className="size-4" />
            <span>{activeView.title}</span>
            <ChevronDown className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background w-[200px]">
            {views.map((view) => (
              <DropdownMenuItem
                className="p-0"
                key={view.url}
                disabled={view?.isDisabled}
              >
                <Link
                  href={view.url}
                  className="w-full p-2 flex gap-2 capitalize"
                >
                  <view.icon className="size-4" />
                  <span>{view.title}</span>
                  {view.isNew && <Badge className="text-xs ml-auto">New</Badge>}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
