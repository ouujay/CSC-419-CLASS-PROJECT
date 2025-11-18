"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { SessionData } from "@auth0/nextjs-auth0/types";
import { c_GetProfile } from "@/fullstack/PublicConvexFunctions";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { Doc } from "@/convex/_generated/dataModel";


interface UserContextType {
  user?: Doc<"profiles"> ;
  isLoading: boolean;
  error?: Error ;
}

const initialContext: UserContextType = {
  isLoading: false
};

const UserContext = createContext<UserContextType>(initialContext);

export function UserProvider({
  children,
}: {
  children: ReactNode;
  session: SessionData | null;
}) {
  const {data: userData, error, isPending} = useSafeQuery(c_GetProfile);


  // Create more comprehensive context value
  const contextValue: UserContextType = {
    user: userData,
    isLoading: isPending,
    error: error,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

// Helper hook for components that need to wait for user data
export function useRequiredUser() {
  const { user, isLoading, error } = useUser();

  if (error) {
    throw error;
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
