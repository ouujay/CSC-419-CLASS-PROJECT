"use client";
import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants, Button } from "../ui/button";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { c_CheckFamilyMemberAccess } from "@/fullstack/PublicConvexFunctions";

// Props for the RoleBasedButton component
interface RoleBasedButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  requiredRoles: Doc<"family_collaborators">["role"][];
  fallback?: React.ReactNode;
}

function RoleBasedButton({
  requiredRoles,
  fallback = null,
  children,
  ...buttonProps
}: RoleBasedButtonProps) {
  const { family_member_id } = useParams();
  const { data: hasAccess } = useSafeQuery(
    c_CheckFamilyMemberAccess,
    family_member_id
      ? {
          id: family_member_id as Id<"family_members">,
          roles: requiredRoles,
        }
      : "skip"
  );

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <Button {...buttonProps}>{children}</Button>;
}

export { RoleBasedButton, type RoleBasedButtonProps };
