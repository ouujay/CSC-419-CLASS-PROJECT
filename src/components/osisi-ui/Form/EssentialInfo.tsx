import FormInput from "@/components/osisi-ui/inputs/input";
import { FormSelect } from "@/components/osisi-ui/Selects/FormSelect";
import {
  dayOptions,
  isDeceasedOptions,
  monthOptions,
  prefixOptions,
  sexOptions,
  suffixOptions,
} from "@/utils/constants";
import React from "react";
import { isFieldRequired } from "@/utils/utils";
import { Doc } from "@/convex/_generated/dataModel";
import { CreateFamilyMemberSchema } from "@/convex/familyContributions/mutations";
import { MultiSelect } from "@/components/ui/multi-select";

export type familyMemberDetailsType = Partial<Doc<"family_members">>;
type SexType = Exclude<Doc<"family_members">["sex"], undefined>;
type Props = {
  familyMemberDetails: familyMemberDetailsType;
  onChange: <Key extends keyof familyMemberDetailsType>(
    key: Key,
    value: familyMemberDetailsType[Key]
  ) => void;
};

export const initialFamilyMember = {
  sex: "unknown" as SexType,
  is_deceased: false,
  is_public: false,
};
const FamilyMemberSchema = CreateFamilyMemberSchema.shape.memberData;
export default function EssentialInfo({
  familyMemberDetails,
  onChange,
}: Props) {
  const name = familyMemberDetails.name;
  const dates = familyMemberDetails.dates;
  const isDeceased = familyMemberDetails.is_deceased;
  const sex = familyMemberDetails.sex;
  const suffixes = familyMemberDetails.suffixes;
  const prefixes = familyMemberDetails.prefixes;

  return (
    <div className="@container w-full space-y-6">
      <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-4">
        <FormInput
          name="first_name"
          label="First Name"
          type="text"
          placeholder="Enter first name"
          value={name?.given || ""}
          onChange={(e) =>
            onChange("name", {
              ...name,
              given: e.target.value === "" ? undefined : e.target.value,
            })
          }
        />

        <FormInput
          name="middle_name"
          label="Middle Name"
          required={isFieldRequired(FamilyMemberSchema.shape.name, "middle")}
          type="text"
          placeholder="Enter middle name"
          value={name?.middle || ""}
          onChange={(e) =>
            onChange("name", {
              ...name,
              middle: e.target.value === "" ? undefined : e.target.value,
            })
          }
        />

        <FormInput
          name="married_name"
          label="Last Name"
          required={isFieldRequired(FamilyMemberSchema.shape.name, "married")}
          type="text"
          placeholder="Enter last name"
          value={name?.married || ""}
          onChange={(e) =>
            onChange("name", {
              ...name,
              married: e.target.value === "" ? undefined : e.target.value,
            })
          }
        />

        <FormInput
          name="maiden_name"
          label="Maiden Name"
          required={isFieldRequired(FamilyMemberSchema.shape.name, "family")}
          type="text"
          placeholder="Enter maiden name"
          value={name?.family || ""}
          onChange={(e) =>
            onChange("name", {
              ...name,
              family: e.target.value === "" ? undefined : e.target.value,
            })
          }
        />

        <FormSelect
          name="day"
          label="Day of Birth"
          required={false}
          options={dayOptions}
          placeholder="Select a Day"
          value={`${dates?.birth?.day || ""}`}
          onChange={(value) =>
            onChange("dates", {
              ...dates,
              birth: {
                ...dates?.birth,
                day: +value,
              },
            })
          }
        />

        <FormSelect
          name="month"
          label="Month of Birth"
          required={false}
          options={monthOptions}
          placeholder="Select a Month"
          value={`${dates?.birth?.month || ""}`}
          onChange={(value) =>
            onChange("dates", {
              ...dates,
              birth: {
                ...dates?.birth,
                month: +value,
              },
            })
          }
        />

        <FormInput
          name="year"
          label="Year of Birth"
          type="text"
          required={false}
          placeholder="1900"
          value={`${dates?.birth?.year || ""}`}
          onChange={(e) =>
            onChange("dates", {
              ...dates,
              birth: {
                ...dates?.birth,
                year: +e.target.value,
              },
            })
          }
        />

        <FormSelect
          name="is_deceased"
          label="Living Status"
          placeholder="Select a Living Status"
          options={isDeceasedOptions}
          value={isDeceased === undefined ? "" : `${isDeceased}`}
          onChange={(value) => onChange("is_deceased", value === "true")}
        />

        <FormSelect
          name="sex"
          label="Sex"
          options={sexOptions}
          placeholder="Select a Sex"
          value={sex}
          onChange={(value) => onChange("sex", value as SexType)}
        />
      </div>

      <div>
        <label
          htmlFor="prefixes"
          className="flex gap-1 font-light text-xs capitalize mb-1"
        >
          Prefixes
        </label>
        <MultiSelect
          options={prefixOptions}
          defaultValue={prefixes}
          onValueChange={(v) => onChange("prefixes", v)}
          placeholder="Select Prefixes"
          variant="inverted"
          animation={2}
          maxCount={3}
        />
      </div>

      <div>
        <label
          htmlFor="suffixes"
          className="flex gap-1 font-light text-xs capitalize mb-1"
        >
          Suffixes
        </label>
        <MultiSelect
          options={suffixOptions}
          defaultValue={suffixes}
          onValueChange={(v) => onChange("suffixes", v)}
          placeholder="Select Suffixes"
          variant="inverted"
          animation={2}
          maxCount={3}
        />
      </div>
    </div>
  );
}
