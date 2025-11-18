"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useMutation } from "convex/react";
import {
  c_GetProfile,
  c_CompleteOnboarding,
} from "@/fullstack/PublicConvexFunctions";
import { OnboardingFlow } from "../OnboardingFlow";
import { tryCatch } from "@/utils/try-catch";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import Loader from "../../../components/osisi-ui/skeleton/Loader";
import { UserError } from "../../../components/osisi-ui/Errors";

type OnboardingContextType = {
  showOnboarding: boolean;
  completeOnboarding: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const {
    data: profile,
    isPending,
    isError,
    error,
  } = useSafeQuery(c_GetProfile);

  useEffect(() => {
    // Check if this is a first-time user
    if (profile && !profile.has_onboarded) {
      setShowOnboarding(true);
    }
  }, [profile]);
  const completeOnboardingMutation = useMutation(c_CompleteOnboarding);

  const completeOnboarding = async () => {
    const { error } = await tryCatch<boolean, ConvexError<string>>(
      completeOnboardingMutation()
    );

    if (error) {
      toast.error("Failed to complete onboarding");
      return;
    }

    setShowOnboarding(false);
  };

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    const cError = error as ConvexError<string>;
    return <UserError message={cError.data} />;
  }

  return (
    <OnboardingContext.Provider value={{ showOnboarding, completeOnboarding }}>
      {children}

      <OnboardingFlow isOpen={showOnboarding} onClose={completeOnboarding} />
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
