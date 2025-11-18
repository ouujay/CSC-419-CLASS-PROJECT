"use client";
import * as React from "react";
import { cn } from "@/utils/utils";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import FamilyName from "@/components/osisi-ui/FamilyName";
import FamilyMemberSearchBar from "@/features/layouts/components/FamilyMemberSearchBar";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import FamilyDetails from "../components/FamilyDetails";
import { useFamilyData } from "@/contexts/DashboardFamilyContext";

export default function SubNavBar() {
  const [open, setOpen] = useState(false);
  const { data } = useFamilyData();
  const familyName = data.details.name;
  const familyMembers = data.members || [];

  return (
    <nav className="w-full py-2 px-4 border-b-2 border-b-secondary/25 font-body">
      <div className="container flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
        {/* Family Name and Details Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <h6 className="capitalize text-center sm:text-left">
            <FamilyName name={familyName || ""} />
          </h6>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8 w-8"
                onClick={() => setOpen(true)}
              >
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90%] max-w-full sm:max-w-xl overflow-y-auto max-h-[90vh] p-4 sm:p-6">
              <DialogTitle>Family Details</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Detailed information about this family.
              </DialogDescription>
              <FamilyDetails />
            </DialogContent>
          </Dialog>
        </div>

        <FamilyMemberSearchBar familyMembers={familyMembers} />
      </div>
    </nav>
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
