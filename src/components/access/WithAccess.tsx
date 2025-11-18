"use client";
import { ReactNode } from "react";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { c_CheckFamilyAccess } from "@/fullstack/PublicConvexFunctions";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { ResourceType } from "@/convex/tables";

interface WithAccessProps {
  children: ReactNode;
  action: Doc<"roles">["actions"][number];
  resource: ResourceType;
  familyId?: Id<"families">;
  errorFallback?: ReactNode;
  loadingFallback?: ReactNode;
  fallback?: ReactNode;
}

const WithFamilyAccess = ({
  children,
  action,
  resource,
  familyId,
  errorFallback,
  loadingFallback,
  fallback,
}: WithAccessProps) => {
  const { data, isPending, isError } = useSafeQuery(
    c_CheckFamilyAccess,
    familyId ? { familyId, action, resource } : "skip"
  );

  if (isPending) {
    return <>{loadingFallback}</>;
  }

  if (isError) {
    return <>{errorFallback}</>;
  }

  if (!data) {
    return <>{fallback}</>;
  }

  if (!data.canAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default WithFamilyAccess;
