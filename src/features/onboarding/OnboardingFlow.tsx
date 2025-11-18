"use client";
import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Leaf, FolderTree, Users, HandHelping } from "lucide-react";
import { LucideIcon } from "lucide-react";
import Help from "./components/Help";
import { CreateFirstFamily, CreateFirstFamilyProps } from "./components/CreateFirstFamily";

interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
  component?: ({ onComplete }: CreateFirstFamilyProps) => React.ReactElement;
}

const steps: Step[] = [
  {
    title: "Welcome to Osisi",
    description: "Let's help you get started with managing your family tree",
    icon: Leaf,
  },
  {
    title: "Create Your First Family",
    description:
      "Start by creating a family group and adding your first family member",
    icon: FolderTree,
    component: CreateFirstFamily,
  },
  {
    title: "Add Family Members",
    description: "Add members to your family tree and establish relationships",
    icon: Users,
  },
  {
    title: "Still Need Help?",
    description:
      "Book a call with us, and we will onboard you onto the platform.",
    icon: HandHelping,
    component: Help,
  },
];

export function OnboardingFlow({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStates, setStepStates] = useState<boolean[]>(() =>
    steps.map(() => false)
  );

  // Memoize the step completion handler to prevent unnecessary re-renders
  const setStepComplete = useCallback(
    (stepIndex: number, isComplete: boolean) => {
      setStepStates((prev) => {
        // Only update if the value actually changed
        if (prev[stepIndex] === isComplete) {
          return prev;
        }
        const next = [...prev];
        next[stepIndex] = isComplete;
        return next;
      });
    },
    []
  );

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  }, [currentStep, onClose]);

  // Memoize derived values
  const canProgress = useMemo(
    () => stepStates[currentStep] || !steps[currentStep].component,
    [stepStates, currentStep]
  );

  const CurrentStep = steps[currentStep];
  const CurrentIcon = CurrentStep.icon;
  const ComponentWithCallback = CurrentStep.component;

  // Create a stable callback for the component
  const handleStepComplete = useCallback(
    (isComplete: boolean) => setStepComplete(currentStep, isComplete),
    [setStepComplete, currentStep]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90%] max-w-sm sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          {/* Icon Container */}
          <div className="mx-auto p-3 rounded-full bg-primary/10 mb-4">
            <CurrentIcon className="w-6 h-6 text-primary" />
          </div>

          {/* Step Title */}
          <DialogTitle className="text-center text-lg sm:text-xl font-semibold">
            {CurrentStep.title}
          </DialogTitle>

          {/* Step Description */}
          <DialogDescription className="text-center text-sm sm:text-base text-muted-foreground">
            {CurrentStep.description}
          </DialogDescription>
        </DialogHeader>

        {/* Step Content */}
        {ComponentWithCallback && (
          <ComponentWithCallback onComplete={handleStepComplete} />
        )}

        {/* Step Progress & Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          {/* Progress Dots */}
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep ? "bg-primary scale-110" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          {(!CurrentStep.component || canProgress) && (
            <Button
              onClick={handleNext}
              className="w-full sm:w-auto px-6 py-2 text-sm"
            >
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
