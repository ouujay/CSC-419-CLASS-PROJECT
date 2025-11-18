"use client";
import React, { useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { tryCatch } from "@/utils/try-catch";
import { useMutation } from "convex/react";
import { c_UpdatedFamilyMember } from "@/fullstack/PublicConvexFunctions";
import { toast } from "sonner";
import FormInput from "@/components/osisi-ui/inputs/input";
import { RoleBasedButton } from "@/components/osisi-ui/WithAccessButtons";

type NamesProps = {
  familyMember?: Doc<"family_members"> | null;
};

type ContactsType = NonNullable<Doc<"family_members">["contacts"]>;

type ContactDetailType = {
  label: string;
  value: keyof ContactsType;
  type: "number" | "text" | "email";
  placeholder: string;
};

const ContactsDetails: ContactDetailType[] = [
  {
    label: "Phone Number",
    value: "phone_number",
    type: "number",
    placeholder: "Enter Phone number",
  },
  {
    label: "Email",
    value: "email",
    type: "email",
    placeholder: "Enter Email address",
  },
  {
    label: "Facebook",
    value: "facebook",
    type: "text",
    placeholder: "Enter Facebook profile",
  },
  {
    label: "X or Twitter",
    value: "x",
    type: "text",
    placeholder: "Enter X profile",
  },
  {
    label: "Instagram",
    value: "instagram",
    type: "text",
    placeholder: "Enter Instagram profile",
  },
  {
    label: "LinkedIn",
    value: "linkedin",
    type: "text",
    placeholder: "Enter LinkedIn profile",
  },
];

export default function AboutMe({ familyMember }: NamesProps) {
  const [contacts, setContacts] = useState(familyMember?.contacts || {});
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanged] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const updateFamilyMember = useMutation(c_UpdatedFamilyMember);

  function handleChange(field: keyof ContactsType, value: string) {
    setContacts((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanged(true);
  }

  function handleReset() {
    setContacts(familyMember?.contacts || {});
    setHasChanged(false);
    setCanEdit(false);
  }

  async function handleSave() {
    setIsLoading(true);
    if (!contacts) {
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
          contacts,
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
      <div className="border rounded p-4 bg-accent/5 relative">
        {/* Header with title and edit button */}
        <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row mb-4 gap-2 sm:gap-0">
          <h6 className="mb-2 sm:mb-0">Personal Names</h6>
          <RoleBasedButton
            requiredRoles={["editor", "owner"]}
            variant="outline"
            className="w-full sm:w-auto"
            disabled={canEdit}
            onClick={() => setCanEdit(true)}
          >
            Edit
          </RoleBasedButton>
        </div>

        {/* Form grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-fluid-lg gap-4">
          {ContactsDetails.map((detail, index) => (
            <FormInput
              key={index}
              label={detail.label}
              name={detail.value}
              type={detail.type}
              required={false}
              value={contacts?.[detail.value] || ""}
              placeholder={detail.placeholder}
              className="w-full"
              onChange={(e) => handleChange(detail.value, e.target.value)}
              disabled={!canEdit}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-2 mt-6">
          <RoleBasedButton
            requiredRoles={["editor", "owner"]}
            variant="outline_destructive"
            className="w-full sm:w-auto"
            onClick={() => handleReset()}
          >
            Reset
          </RoleBasedButton>
          <RoleBasedButton
            requiredRoles={["editor", "owner"]}
            variant="default"
            className="w-full sm:w-auto"
            disabled={!hasChanges || isLoading}
            onClick={() => handleSave()}
          >
            {isLoading ? "Saving..." : "Save"}
          </RoleBasedButton>
        </div>
      </div>
    </>
  );
}
