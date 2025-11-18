"use client";
import React, { useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { tryCatch } from "@/utils/try-catch";
import { useMutation } from "convex/react";
import { c_UpdatedFamilyMember } from "@/fullstack/PublicConvexFunctions";
import { toast } from "sonner";
import FormTextArea from "@/components/osisi-ui/inputs/Textarea";
import { RoleBasedButton } from "@/components/osisi-ui/WithAccessButtons";

type NamesProps = {
  familyMember?: Doc<"family_members"> | null;
};

export default function AboutMe({ familyMember }: NamesProps) {
  const [aboutMe, setAboutMe] = useState(familyMember?.about_me);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanged] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const updateFamilyMember = useMutation(c_UpdatedFamilyMember);

  function handleNameChange(
    event: React.ChangeEvent<HTMLTextAreaElement>,
    field: string
  ) {
    setAboutMe((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    setHasChanged(true);
  }

  function handleReset() {
    setAboutMe(familyMember?.about_me || {});
    setHasChanged(false);
    setCanEdit(false);
  }
  async function handleSave() {
    setIsLoading(true);
    if (!aboutMe) {
      console.error("No about me to save");
      toast.error("No about me to save");
      setIsLoading(false);
      return;
    }

    if (!familyMember?._id) {
      console.error("No family member ID found");
      toast.error("No family member ID found");
      setIsLoading(false);
      return;
    }

    const { error } = await tryCatch(
      updateFamilyMember({
        data: {
          about_me: aboutMe,
        },
        id: familyMember?._id,
        eventType: "update_family_member",
      })
    );

    if (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data");
      setIsLoading(false);
      return;
    }
    // Here you would typically call an API to save the names
    setIsLoading(false);
    setHasChanged(false);
    setCanEdit(false);
  }
  return (
    <>
      <div className="border rounded p-4 bg-accent/5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <h6 className="text-lg font-semibold">About Me</h6>
          <RoleBasedButton
            requiredRoles={["editor", "owner"]}
            variant="outline"
            className="mt-2 sm:mt-0"
            disabled={canEdit}
            onClick={() => setCanEdit(true)}
          >
            Edit
          </RoleBasedButton>
        </div>

        {/* Textareas */}
        <div className="grid grid-cols-1 gap-6">
          <FormTextArea
            label="Short Description"
            name="shortDescription"
            value={aboutMe?.short_description || ""}
            placeholder="Enter short description"
            className="w-full"
            onChange={(e) => handleNameChange(e, "short_description")}
            disabled={!canEdit}
            maxLength={256}
          />

          <FormTextArea
            label="Long Description"
            name="longDescription"
            required={false}
            value={aboutMe?.long_description || ""}
            placeholder="Enter long description"
            className="w-full min-h-[300px]"
            onChange={(e) => handleNameChange(e, "long_description")}
            disabled={!canEdit}
            rows={10}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-2 mt-6">
          <RoleBasedButton
            requiredRoles={["editor", "owner"]}
            variant="outline_destructive"
            onClick={handleReset}
          >
            Reset
          </RoleBasedButton>

          <RoleBasedButton
            requiredRoles={["editor", "owner"]}
            variant="default"
            disabled={!hasChanges || isLoading}
            onClick={handleSave}
          >
            {isLoading ? "Saving..." : "Save"}
          </RoleBasedButton>
        </div>
      </div>
    </>
  );
}
