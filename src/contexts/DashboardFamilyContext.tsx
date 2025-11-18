"use client";
import { LoadingError } from "@/components/osisi-ui/Errors";
import Loader from "@/components/osisi-ui/skeleton/Loader";
import { Id } from "@/convex/_generated/dataModel";
import { c_GetFamily } from "@/fullstack/PublicConvexFunctions";
import { GetFamilyType } from "@/fullstack/types";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { DataProviderContextValue } from "@/types";
import { ConvexError } from "convex/values";
import { createContext, ReactNode, useContext } from "react";

// Specific provider for family members
export function DashboardFamilyProvider({
  children,
  familyId,
}: {
  children: ReactNode;
  familyId: Id<"families">;
}) {
  const { data, isError, isSuccess, isPending, error } = useSafeQuery(
    c_GetFamily,
    familyId ? { familyId } : "skip"
  );

  const CError = error as ConvexError<string> | null;
  if (isError) return <LoadingError message={CError?.data || ""} />;
  if (isPending) return <Loader />;

  const contextValue: DataProviderContextValue<GetFamilyType> = {
    data,
    isPending,
    isError,
    isSuccess,
  };
  return (
    <FamilyMemberContext.Provider value={contextValue}>
      {children}
    </FamilyMemberContext.Provider>
  );
}

// Create the context outside the component
const FamilyMemberContext =
  createContext<DataProviderContextValue<GetFamilyType> | null>(null);

export function useFamilyData() {
  const context = useContext(FamilyMemberContext);
  if (!context) {
    throw new Error(
      "useFamilyMemberData must be used within FamilyMemberProvider"
    );
  }
  return context;
}
