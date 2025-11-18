"use client";
import { LoadingError } from "@/components/osisi-ui/Errors";
import Loader from "@/components/osisi-ui/skeleton/Loader";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { OptionalRestArgsOrSkip } from "convex/react";
import { FunctionReference, FunctionReturnType } from "convex/server";
import { ConvexError } from "convex/values";
import React, { createContext, useContext, ReactNode } from "react";

interface DataProviderContextValue<T> {
  data: T;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  error?: ConvexError<string> | null;
}

type endpointType = FunctionReference<"query">;

interface DataProviderProps {
  children: ReactNode;
  endpoint: endpointType;
  fetchOptions?: OptionalRestArgsOrSkip<endpointType>;
}

// Create a generic context creator function
function createDataContext<T>() {
  return createContext<DataProviderContextValue<T> | null>(null);
}

// Generic Data Provider Component
export function DataProvider({
  children,
  endpoint,
  fetchOptions = [undefined],
}: DataProviderProps) {
  const { data, isPending, isError, isSuccess, error } = useSafeQuery(
    endpoint,
    fetchOptions
  );
  // Create context dynamically
  const DataContext = createDataContext();

  const contextValue: DataProviderContextValue<
    FunctionReturnType<endpointType>
  > = {
    data,
    isPending,
    isError,
    isSuccess,
    error: error as ConvexError<string> | null,
  };

  if (isError) {
    <LoadingError message="" />;
  }

  if (isPending) {
    <Loader />;
  }

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
}

// Generic hook creator
export function createUseData<T>() {
  const DataContext = createDataContext<T>();

  return function useData(): DataProviderContextValue<T> {
    const context = useContext(DataContext);
    if (!context) {
      throw new Error("useData must be used within a DataProvider");
    }
    return context;
  };
}

// Example usage with specific types
interface User {
  id: number;
  name: string;
  email: string;
}

interface FamilyMember {
  id: string;
  full_name: string;
  family_id: string;
  sex: "male" | "female" | "unknown" | "prefer not to say";
  is_deceased: boolean;
}

// Create typed hooks
export const useUserData = createUseData<User[]>();
export const useFamilyMemberData = createUseData<FamilyMember[]>();
