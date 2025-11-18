"use client";
import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { tryCatch } from "@/utils/try-catch";
import { redirect, useSearchParams } from "next/navigation";
import {
  c_CreateFamilyMemberContribution,
  c_UpdateFamilyMemberContribution,
} from "@/fullstack/PublicConvexFunctions";
import {
  CreateFamilyMemberSchema,
  UpdateFamilyMemberSchema,
} from "@/convex/familyContributions/mutations";
import { Id } from "@/convex/_generated/dataModel";
import { useAddMemberStore } from "@/contexts/AddMemberContext";
import { useContributionStore } from "../context/ContributionProvider";

export function SubmitButton() {
  const searchParams = useSearchParams();
  const member = searchParams.get("member") as Id<"family_members"> | null;
  const memberData = useAddMemberStore((state) => state.memberData);
  const familyId = useAddMemberStore((state) => state.familyId);
  const contributionId = useContributionStore((state)=> state.data._id)
  const reset = useAddMemberStore((state) => state.reset);
  const relationships = useAddMemberStore((state) => state.relationships);
  const [isLoading, setIsLoading] = useState(false);
  const updateFamilyMember = useMutation(c_UpdateFamilyMemberContribution);
  const createFamilyMember = useMutation(c_CreateFamilyMemberContribution);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    const input = {
      familyId,
      memberData,
      relationships,
      contributionId,
    };

    const { error, data } = CreateFamilyMemberSchema.safeParse(input);

    if (error) {
      const { fieldErrors } = error.flatten();
      Object.entries(fieldErrors).forEach(([field, errors]) => {
        if (errors) {
          errors.forEach((err) => toast.error(`${field}: ${err}`));
        }
      });
      console.log(error.message);
      setIsLoading(false);
      return;
    }

    const { error: createError } = await tryCatch(
      createFamilyMember({
        ...data,
      })
    );

    if (createError) {
      console.error(createError);
      toast.error(
        "An error occurred while Creating this member. Please try again later."
      );

      setIsLoading(false);
      return;
    }

    toast.success("Family member created and added to the family.");
    reset();
    redirect(`/add-family-member/${contributionId}/submitted`);
  }, [
    familyId,
    memberData,
    relationships,
    createFamilyMember,
    reset,
    contributionId,
  ]);

  const handleUpdate = useCallback(async () => {
    setIsLoading(true);
    const input = {
      familyId,
      memberData,
      relationships,
      contributionId,
      familyMemberId: member,
    };

    const { error, data } = UpdateFamilyMemberSchema.safeParse(input);

    if (error) {
      const { fieldErrors } = error.flatten();
      Object.entries(fieldErrors).forEach(([field, errors]) => {
        if (errors) {
          errors.forEach((err) => toast.error(`${field}: ${err}`));
        }
      });

      console.log(error.message);
      setIsLoading(false);
      return;
    }

    const { error: createError } = await tryCatch(
      updateFamilyMember({
        ...data,
      })
    );

    if (createError) {
      console.error(createError);
      toast.error(
        "An error occurred while creating this member. Please try again later."
      );

      setIsLoading(false);
      return;
    }

    toast.success(" Family member updated successfully.");
    reset();
    redirect(`/add-family-member/${contributionId}/submitted`);
  }, [
    familyId,
    memberData,
    relationships,
    updateFamilyMember,
    reset,
    contributionId,
    member,
  ]);

  if (!member) {
    return (
      <Button
        className="rounded cursor-pointer w-full"
        disabled={isLoading}
        onClick={handleSubmit}
      >
        Add Family Member
      </Button>
    );
  }

  return (
    <Button
      className="rounded cursor-pointer w-full"
      disabled={isLoading}
      onClick={handleUpdate}
    >
      Update Family Member
    </Button>
  );
}