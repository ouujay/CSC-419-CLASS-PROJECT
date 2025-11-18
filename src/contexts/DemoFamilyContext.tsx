"use client";
import { LoadingError } from "@/components/osisi-ui/Errors";
import Loader from "@/components/osisi-ui/skeleton/Loader";
import { c_GetDemoFamily } from "@/fullstack/PublicConvexFunctions";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { DataProviderContextValue } from "@/types";
import { ConvexError } from "convex/values";
import { createContext, ReactNode, useContext } from "react";

type familyType = typeof c_GetDemoFamily._returnType;
// Specific provider for family members
export function DemoFamilyProvider({ children }: { children: ReactNode }) {
  const { data, isPending, isError, isSuccess, error } = useSafeQuery(c_GetDemoFamily);
  const CError = error as ConvexError<string> | null;
  if (isError) return <LoadingError message={CError?.data || ""} />;
  if (isPending) return <Loader />;

  const contextValue: DataProviderContextValue<familyType> = {
    data,
    isPending,
    isError,
    isSuccess,
  };
  return <FamilyMemberContext.Provider value={contextValue}>{children}</FamilyMemberContext.Provider>;
}

// Create the context outside the component
const FamilyMemberContext = createContext<DataProviderContextValue<familyType> | null>(null);

export function useDemoFamilyData() {
  const context = useContext(FamilyMemberContext);
  if (!context) {
    throw new Error("useFamilyMemberData must be used within FamilyMemberProvider");
  }
  return context;
}
