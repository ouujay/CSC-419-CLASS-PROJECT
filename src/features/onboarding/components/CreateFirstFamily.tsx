"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { c_CreateFamily } from "@/fullstack/PublicConvexFunctions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { tryCatch } from "@/utils/try-catch";
import { isFieldRequired } from "@/utils/utils";
import { CreateFamilySchema } from "@/convex/families/mutations";
import FormInput from "@/components/osisi-ui/inputs/input";
import FormSwitch from "@/components/osisi-ui/inputs/FormSwitch";
import { Id } from "@/convex/_generated/dataModel";
import { ConvexError } from "convex/values";
import EssentialInfo, {
  familyMemberDetailsType,
  initialFamilyMember,
} from "@/components/osisi-ui/Form/EssentialInfo";

export interface CreateFirstFamilyProps {
  onComplete: (isComplete: boolean) => void;
}
type CreateFamilyResponse = {
  familyId: Id<"families">;
  individualId: Id<"family_members">;
};

export const CreateFirstFamily = ({ onComplete }: CreateFirstFamilyProps) => {
  const [familyName, setFamilyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [familyMemberDetails, setFamilyMemberDetails] =
    useState<familyMemberDetailsType>(initialFamilyMember);
  const [isDone, setIsDone] = useState(false);
  const createFamily = useMutation(c_CreateFamily);
  const router = useRouter();

  const handleFamilyMemberChange = <Key extends keyof familyMemberDetailsType>(
    key: Key,
    value: familyMemberDetailsType[Key]
  ) => {
    setFamilyMemberDetails({ ...familyMemberDetails, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      familyData: {
        name: formData.get("family_name") as string,
        is_public: formData.get("is_family_public") === "on",
        method: "scratch",
      },
      memberData: familyMemberDetails,
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
      CreateFamilyResponse,
      ConvexError<string>
    >(createFamily({ ...familyData, eventType: "create_family" }));

    if (createFamilyError) {
      toast("Failed to create family", {
        description: createFamilyError.data,
      });
      console.error(createFamilyError);
      setIsLoading(false);
      return;
    }

    toast("Family has been created");
    setIsLoading(false);
    setIsDone(true);
    onComplete(true);

    setTimeout(() => {
      router.push(`/dashboard/families/${ids.familyId}/layouts`);
    }, 1000);
  };

  useEffect(() => {
    onComplete(isDone);
  }, [isDone, onComplete]);

  return (
    <div className="space-y-6 mt-4">
      {!isDone ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Preview */}
          <h6 className="text-primary text-base sm:text-lg">
            Preview: The <span>{familyName || "New"} Family</span>
          </h6>

          {/* Family Name */}
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

          {/* Public Family Toggle */}
          <FormSwitch
            defaultChecked={false}
            required={isFieldRequired(
              CreateFamilySchema.shape.familyData,
              "is_public"
            )}
            name="is_family_public"
            id="is_family_public"
            label="Allow Public view"
          />

          {/* First Member Block */}
          <div className="grid gap-4">
            <label className="font-cardo text-lg border-b pb-1">
              Add First Member
            </label>

            <EssentialInfo
              familyMemberDetails={familyMemberDetails}
              onChange={handleFamilyMemberChange}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="rounded w-full sm:w-auto self-center"
            disabled={isLoading}
          >
            {isLoading ? "Creating Family..." : "Create Family"}
          </Button>
        </form>
      ) : (
        <div className="text-center text-green-600 text-sm sm:text-base py-4">
          ✓ Family created successfully! Redirecting...
        </div>
      )}
    </div>
  );
};
