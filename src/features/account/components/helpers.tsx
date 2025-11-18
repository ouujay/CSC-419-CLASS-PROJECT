"use client"

import { useConvexAuth } from "convex/react";
import { ReactNode } from "react";

export function Authenticated({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  if (isLoading || !isAuthenticated) {
    return null;
  }
  return <>{children}</>;
}


export function Unauthenticated({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  if (isLoading || isAuthenticated) {
    return null;
  }
  return <>{children}</>;
}


export function AuthLoading({ children }: { children: ReactNode }) {
  const { isLoading } = useConvexAuth();
  if (!isLoading) {
    return null;
  }
  return <>{children}</>;
}
