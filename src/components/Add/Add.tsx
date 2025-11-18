"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Users } from "lucide-react";
import React, { useState } from "react";
import GenerateContributionLink from "@/components/Add/GenerateContributionLink";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { SearchFamilyMember } from "./SearchFamilyMember";
import { c_CheckFamilyMembersUsage } from "@/fullstack/PublicConvexFunctions";
import { useSafeQuery } from "@/hooks/useSafeQuery";

type FamilyMember = Id<"family_members">;

interface AddFamilyMembersProps {
  familyMemberId: FamilyMember;
  children?: React.ReactNode;
}

export default function AddFamilyMembers({
  familyMemberId,
  children,
}: AddFamilyMembersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { family_id } = useParams<{ family_id: Id<"families"> }>();
  const pathname = usePathname();
  const { data: usageData } = useSafeQuery(c_CheckFamilyMembersUsage, {
    familyId: family_id,
  });



  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <DialogTitle className="text-xl sm:text-2xl font-bold mb-2">
          Add Family Members
        </DialogTitle>
        <DialogDescription className="text-sm sm:text-base">
          Choose how you&apos;d like to add new family members to your tree
        </DialogDescription>
      </div>

      <div className="grid gap-2">
        <SearchFamilyMember
          familyMemberId={familyMemberId}
          familyId={family_id}
        />
        <GenerateContributionLink
          familyMemberId={familyMemberId}
          familyId={family_id}
        />
        <Button asChild variant={"outline"}>
          <Link
            href={`/dashboard/families/${family_id}/new-family-member?family_member=${familyMemberId}&redirect=${pathname}`}
          >
            Add Family Members
            <Users className="text-primary size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
  if(!usageData?.isAllowed){
    return <></>
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button className="" variant={"outline"} size={"icon"}>
            <Plus className="size-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-[90%] max-w-full sm:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto px-4 sm:px-6">
        <DialogHeader className="sr-only">
          <DialogTitle>Add Family Members</DialogTitle>
          <DialogDescription>
            Choose how to add family members
          </DialogDescription>
        </DialogHeader>

        {renderMethodSelection()}
      </DialogContent>
    </Dialog>
  );
}
