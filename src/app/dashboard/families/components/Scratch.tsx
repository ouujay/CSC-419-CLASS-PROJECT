"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "convex/react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import FormInput from "@/components/osisi-ui/inputs/input";
import { Sprout } from "lucide-react";
import { z } from "zod";
import { isFieldRequired } from "@/utils/utils";
import { tryCatch } from "@/utils/try-catch";
import { CreateFamilySchema } from "@/convex/families/mutations";
import {
  c_CheckFamilyUsage,
  c_CreateFamily,
} from "@/fullstack/PublicConvexFunctions";
import { DashboardCard } from "@/features/dashboard/components/ViewFamilies";
import EssentialInfo, {
  familyMemberDetailsType,
  initialFamilyMember,
} from "@/components/osisi-ui/Form/EssentialInfo";
import { ConvexError } from "convex/values";
import { Id } from "@/convex/_generated/dataModel";
import { useSafeQuery } from "@/hooks/useSafeQuery";

type CreateFamilyType = z.infer<typeof CreateFamilySchema>;
export default function Scratch() {
  const [isLoading, setIsLoading] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [familyMember, setFamilyMember] =
    useState<familyMemberDetailsType>(initialFamilyMember);
  const createFamilyMutation = useMutation(c_CreateFamily);
  const { data } = useSafeQuery(c_CheckFamilyUsage);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    if (!familyMember) {
      toast("Failed to create family", {
        description: "No data entered",
      });
      setIsLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = {
      familyData: {
        name: formData.get("family_name") as string,
        is_public: false,
        method: "scratch",
      },
      memberData: familyMember,
    };

    const {
      data: familyData,
      success,
      error,
    } = CreateFamilySchema.safeParse(data);

    if (!success) {
      toast("Failed to create family", {
        description: "Invalid data",
      });
      console.error(error);
      setIsLoading(false);
      return;
    }

    const { error: createFamilyError, data: ids } = await tryCatch<
      {
        familyId: Id<"families">;
        individualId: Id<"family_members">;
      },
      ConvexError<string>
    >(createFamilyMutation({ ...familyData, eventType: "create_family" }));

    if (createFamilyError) {
      const cError: ConvexError<string> = createFamilyError;
      toast.error("Failed to create family", {
        description: (
          <div className="text-sm text-foreground-muted font-extralight">
            {cError.data}
          </div>
        ),
      });
      console.error(createFamilyError);
      setIsLoading(false);
      return;
    }

    toast("Family has been created");
    setIsLoading(false);
    redirect(`/dashboard/families/${ids.familyId}`);
  };

  const handleFamilyMemberChange = <Key extends keyof familyMemberDetailsType>(
    key: Key,
    value: familyMemberDetailsType[Key]
  ) => {
    const newFamilyMember = {
      ...familyMember,
      [key]: value,
    };

    if (!newFamilyMember) {
      return;
    }

    setFamilyMember(newFamilyMember as CreateFamilyType["memberData"]);
  };
  return (
    <Dialog>
      <DialogTrigger disabled={!data?.isAllowed}>
        <DashboardCard
          icon={<Sprout className="size-4" />}
          title="Create family from scratch"
          subtitle="Begin with a blank family tree and add relatives, events, and photos step by step."
          isDisabled={!data?.isAllowed}
          limitMessage={
            !data?.isAllowed
              ? `You've reached your limit of ${data?.max} families`
              : undefined
          }
        />
      </DialogTrigger>

      <DialogContent className="rounded-xl max-h-[85vh] overflow-y-auto w-[90%] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl sm:text-2xl">
            Create A New Family
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground">
            Start creating your family tree by providing the necessary details.
            You can always edit or add more information later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
          <h6 className="text-primary text-sm sm:text-base font-medium">
            Preview: <span className="italic">The {familyName} Family</span>
          </h6>

          <FormInput
            name="family_name"
            label="Family Name"
            required={isFieldRequired(
              CreateFamilySchema.shape.familyData,
              "name"
            )}
            type="text"
            onChange={(e) => setFamilyName(e.target.value)}
            placeholder="Family Name Here"
          />

          <div className="grid gap-4">
            <label className="font-cardo text-lg border-b pb-1">
              Add First Family Member
            </label>
            <EssentialInfo
              familyMemberDetails={familyMember || {}}
              onChange={handleFamilyMemberChange}
            />
          </div>

          <Button
            type="submit"
            className="mt-2 rounded w-full sm:w-auto"
            disabled={isLoading}
          >
            Create Family
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
