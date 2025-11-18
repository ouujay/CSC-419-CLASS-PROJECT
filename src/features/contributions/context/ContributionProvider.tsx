"use client";

import { createStore, StoreApi, useStore } from "zustand";
import { createContext, useContext, ReactNode, useState } from "react";
import { ContributionDetailsType } from "@/fullstack/types";

type ContributionState = {
  data: ContributionDetailsType;
};

const ContributionContext = createContext<
  StoreApi<ContributionState> | undefined
>(undefined);

type ContributionProviderProps = {
  children: ReactNode;
  contributionDetails: ContributionDetailsType;
};

export function ContributionProvider({
  children,
  contributionDetails,
}: ContributionProviderProps) {
  const [store] = useState(() =>
    createStore<ContributionState>(() => ({
      data: contributionDetails,
    }))
  );

  return (
    <ContributionContext.Provider value={store}>
      {children}
    </ContributionContext.Provider>
  );
}

export function useContributionStore<T>(
  selector: (state: ContributionState) => T
) {
  const context = useContext(ContributionContext);

  if (!context) {
    throw new Error(
      "useContribution must be used within an ContributionProvider"
    );
  }

  return useStore(context, selector);
}
