"use client";
import React, { useState } from "react";

import { Doc } from "@/convex/_generated/dataModel";
import { tryCatch } from "@/utils/try-catch";
import { useMutation } from "convex/react";
import { c_UpdatedFamilyMember } from "@/fullstack/PublicConvexFunctions";
import { toast } from "sonner";
import { FormSelect } from "@/components/osisi-ui/Selects/FormSelect";
import FormInput from "@/components/osisi-ui/inputs/input";
import { dayOptions, monthOptions } from "@/utils/constants";
import { X } from "lucide-react";
import { RoleBasedButton } from "@/components/osisi-ui/WithAccessButtons";

type NamesProps = {
  familyMember?: Doc<"family_members"> | null;
};

type DatesType = NonNullable<Doc<"family_members">["dates"]>;

type DateDetail = {
  label: string;
  value: keyof DatesType;
};

const datesDetails: DateDetail[] = [
  {
    label: "Date of Birth",
    value: "birth",
  },
  {
    label: "Date of Death",
    value: "death",
  },
  {
    label: "Date of Marriage",
    value: "marriage",
  },
  {
    label: "Date of Graduation",
    value: "graduation",
  },
  {
    label: "Date of Retirement",
    value: "retirement",
  },
];

export default function AboutMe({ familyMember }: NamesProps) {
  const [dates, setDates] = useState<DatesType | undefined>(
    familyMember?.dates
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanged] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const updateFamilyMember = useMutation(c_UpdatedFamilyMember);

  function handleClear(field: keyof DatesType) {
    setDates((prev) => ({
      ...prev,
      [field]: {},
    }));
    setHasChanged(true);
  }
  function handleChange(
    field: keyof DatesType,
    subField: "day" | "month" | "year",
    value: number
  ) {
    setDates((prev) => ({
      ...prev,
      [field]: {
        ...(prev?.[field] || {}),
        [subField]: value,
      },
    }));
    setHasChanged(true);
  }

  function handleReset() {
    setDates(familyMember?.dates || {});
    setHasChanged(false);
    setCanEdit(false);
  }
  async function handleSave() {
    setIsLoading(true);
    if (!dates) {
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
          dates: dates,
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
  {/* Header */}
  <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row mb-4 gap-2 sm:gap-0">
    <h6 className="text-base sm:text-lg">Dates</h6>
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

  {/* Date fields */}
  <div className="grid grid-cols-1 gap-6">
    {datesDetails.map((detail) => (
      <div
        className="border p-4 rounded space-y-2"
        key={detail.value}
      >
        <label className="text-base sm:text-lg font-light">{detail.label}</label>
        <div className="flex flex-wrap gap-4 items-center">
          <FormSelect
            name="day"
            label=""
            disabled={!canEdit}
            required={false}
            options={dayOptions}
            placeholder="Day"
            value={`${dates?.[detail.value]?.day || ""}`}
            onChange={(value) => handleChange(detail.value, "day", +value)}
            className="w-20"
          />
          <FormSelect
            name="month"
            label=""
            disabled={!canEdit}
            required={false}
            options={monthOptions}
            placeholder="Month"
            value={`${dates?.[detail.value]?.month || ""}`}
            onChange={(value) => handleChange(detail.value, "month", +value)}
            className="w-32"
          />
          <FormInput
            name="year"
            label=""
            type="text"
            disabled={!canEdit}
            required={false}
            placeholder="Year"
            value={`${dates?.[detail.value]?.year || ""}`}
            onChange={(e) => handleChange(detail.value, "year", +e.target.value)}
            className="w-24"
          />
          <RoleBasedButton
            requiredRoles={["editor", "owner"]}
            variant="ghost"
            className="h-8 w-8 rounded-full hover:text-destructive hover:bg-transparent"
            onClick={() => handleClear(detail.value)}
            disabled={!canEdit}
            title="Clear"
          >
            <X className="size-4" />
          </RoleBasedButton>
        </div>
      </div>
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
