"use client";
import React, { useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import FormInput from "@/components/osisi-ui/inputs/input";
import { tryCatch } from "@/utils/try-catch";
import { useMutation } from "convex/react";
import { c_UpdatedFamilyMember } from "@/fullstack/PublicConvexFunctions";
import { toast } from "sonner";
import {
  isDeceasedOptions,
  isPublicOptions,
  prefixOptions,
  sexOptions,
  suffixOptions,
} from "@/utils/constants";
import { FormSelect } from "@/components/osisi-ui/Selects/FormSelect";
import { RoleBasedButton } from "@/components/osisi-ui/WithAccessButtons";
import { MultiSelect } from "@/components/ui/multi-select";

type NamesProps = {
  familyMember?: Doc<"family_members"> | null;
};

export default function Names({ familyMember }: NamesProps) {
  return (
    <div className="space-y-6">
      <PersonalInfo familyMember={familyMember} />
      <PersonalNames familyMember={familyMember} />
      <Formalities familyMember={familyMember} />
    </div>
  );
}

function PersonalNames({ familyMember }: NamesProps) {
  const [names, setNames] = useState(familyMember?.name);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanged] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const updateFamilyMember = useMutation(c_UpdatedFamilyMember);

  function handleNameChange(
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) {
    setNames((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    setHasChanged(true);
  }

  function handleReset() {
    setNames(familyMember?.name || {});
    setHasChanged(false);
    setCanEdit(false);
  }

  async function handleSave() {
    setIsLoading(true);
    if (!names?.given || !familyMember?._id) {
      toast.error("Missing required fields");
      setIsLoading(false);
      return;
    }

    const { error } = await tryCatch(
      updateFamilyMember({
        data: { name: names },
        id: familyMember._id,
        eventType: "update_family_member",
      })
    );

    if (error) {
      toast.error("Error saving names");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setHasChanged(false);
    setCanEdit(false);
  }

  return (
    <div className="border rounded p-4 bg-accent/5">
      <div className="flex justify-between items-center mb-4">
        <h6 className="mb-4">Personal Names</h6>
        <RoleBasedButton
          variant="outline"
          className="mt-4"
          disabled={canEdit}
          onClick={() => setCanEdit(true)}
          requiredRoles={["editor", "owner"]}
        >
          Edit
        </RoleBasedButton>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[var(--grid-template-columns-fluid-sm)] md:grid-cols-[var(--grid-template-columns-fluid-lg)] gap-4">
        <FormInput
          label="First Name"
          name="givenName"
          value={names?.given || ""}
          placeholder="Enter given name"
          onChange={(e) => handleNameChange(e, "given")}
          disabled={!canEdit}
        />

        <FormInput
          label="Last Name"
          name="marriedName"
          value={names?.married || ""}
          placeholder="Enter married name"
          onChange={(e) => handleNameChange(e, "married")}
          disabled={!canEdit}
        />
        <FormInput
          label="Maiden Name"
          name="familyName"
          value={names?.family || ""}
          placeholder="Enter family name"
          onChange={(e) => handleNameChange(e, "family")}
          disabled={!canEdit}
        />
        <FormInput
          label="Middle Name"
          name="middleName"
          value={names?.middle || ""}
          placeholder="Enter middle name"
          onChange={(e) => handleNameChange(e, "middle")}
          disabled={!canEdit}
        />
        <FormInput
          label="Nickname"
          name="nickname"
          value={names?.nickname || ""}
          placeholder="Enter nickname"
          onChange={(e) => handleNameChange(e, "nickname")}
          disabled={!canEdit}
        />
        <FormInput
          label="Other Name"
          name="otherName"
          value={names?.other || ""}
          placeholder="Enter other name"
          onChange={(e) => handleNameChange(e, "other")}
          disabled={!canEdit}
        />
      </div>

      <div className="flex justify-between gap-2 mt-4">
        <RoleBasedButton
          variant="outline_destructive"
          onClick={handleReset}
          requiredRoles={["editor", "owner"]}
        >
          Reset
        </RoleBasedButton>
        <RoleBasedButton
          variant="default"
          disabled={!hasChanges || isLoading}
          onClick={handleSave}
          requiredRoles={["editor", "owner"]}
        >
          {isLoading ? "Saving..." : "Save"}
        </RoleBasedButton>
      </div>
    </div>
  );
}

function Formalities({ familyMember }: NamesProps) {
  const [prefixes, setPrefixes] = useState(familyMember?.prefixes || []);
  const [suffixes, setSuffixes] = useState(familyMember?.suffixes || []);
  const [canEdit, setCanEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanged] = useState(false);
  const updateFamilyMember = useMutation(c_UpdatedFamilyMember);

  function handleSave() {
    if (!familyMember?._id) return;

    setIsLoading(true);
    tryCatch(
      updateFamilyMember({
        data: { prefixes, suffixes },
        id: familyMember._id,
        eventType: "update_family_member",
      })
    ).then(({ error }) => {
      if (error) toast.error("Error saving names");
      else {
        setHasChanged(false);
        setCanEdit(false);
      }
      setIsLoading(false);
    });
  }

  return (
    <div className="border rounded p-4 bg-accent/5">
      <div className="flex justify-between items-center mb-4">
        <h6 className="mb-4">Formalities</h6>
        <RoleBasedButton
          variant="outline"
          onClick={() => setCanEdit(true)}
          requiredRoles={["editor", "owner"]}
        >
          Edit
        </RoleBasedButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <span className="flex flex-col gap-2">
          <label className="text-xs font-light">Prefix</label>
          <MultiSelect
            options={prefixOptions}
            onValueChange={(v) => {
              setPrefixes(v);
              setHasChanged(true);
            }}
            defaultValue={prefixes}
            placeholder="Select Prefixes"
            variant="inverted"
            animation={2}
            maxCount={3}
            disabled={!canEdit}
          />
        </span>
        <span className="flex flex-col gap-2">
          <label className="text-xs font-light">Suffix</label>
          <MultiSelect
            options={suffixOptions}
            defaultValue={suffixes}
            onValueChange={(v) => {
              setSuffixes(v);
              setHasChanged(true);
            }}
            disabled={!canEdit}
            placeholder="Select Suffixes"
            variant="inverted"
            animation={2}
            maxCount={3}
          />
        </span>
      </div>

      <div className="flex justify-between gap-2 mt-4">
        <RoleBasedButton
          variant="outline_destructive"
          onClick={() => {
            setPrefixes(familyMember?.prefixes || []);
            setSuffixes(familyMember?.suffixes || []);
            setHasChanged(false);
            setCanEdit(false);
          }}
          requiredRoles={["editor", "owner"]}
        >
          Reset
        </RoleBasedButton>
        <RoleBasedButton
          variant="default"
          onClick={handleSave}
          disabled={!hasChanges || isLoading}
          requiredRoles={["editor", "owner"]}
        >
          {isLoading ? "Saving..." : "Save"}
        </RoleBasedButton>
      </div>
    </div>
  );
}

function PersonalInfo({ familyMember }: NamesProps) {
  const initialInfo = {
    sex: familyMember?.sex,
    is_deceased: familyMember?.is_deceased,
    is_public: familyMember?.is_public,
  };
  const [info, setInfo] = useState(initialInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanged] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const updateFamilyMember = useMutation(c_UpdatedFamilyMember);

  function handleFieldChange(value: string | boolean, field: string) {
    setInfo((prev) => ({ ...prev, [field]: value }));
    setHasChanged(true);
  }

  function handleSave() {
    if (!familyMember?._id) return;
    setIsLoading(true);
    tryCatch(
      updateFamilyMember({
        data: {
          sex: info.sex,
          is_deceased: info.is_deceased,
          is_public: info.is_public,
        },
        id: familyMember._id,
        eventType: "update_family_member",
      })
    ).then(({ error }) => {
      if (error) toast.error("Error saving");
      else {
        setHasChanged(false);
        setCanEdit(false);
      }
      setIsLoading(false);
    });
  }

  return (
    <div className="border rounded p-4 bg-accent/5">
      <div className="flex justify-between items-center mb-4">
        <h6 className="mb-4">Personal Info</h6>
        <RoleBasedButton
          variant="outline"
          disabled={canEdit}
          onClick={() => setCanEdit(true)}
          requiredRoles={["editor", "owner"]}
        >
          Edit
        </RoleBasedButton>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[var(--grid-template-columns-fluid-sm)] md:grid-cols-[var(--grid-template-columns-fluid-lg)] gap-4">
        <FormSelect
          label="Living Status"
          value={`${info?.is_deceased}`}
          options={isDeceasedOptions}
          onChange={(e) => handleFieldChange(e === "true", "is_deceased")}
          disabled={!canEdit}
        />
        <FormSelect
          label="Sex"
          value={info?.sex || ""}
          options={sexOptions}
          onChange={(e) => handleFieldChange(e, "sex")}
          disabled={!canEdit}
        />
        <FormSelect
          label="Member's Privacy"
          value={`${info?.is_public}`}
          options={isPublicOptions}
          onChange={(e) => handleFieldChange(e === "true", "is_public")}
          disabled={!canEdit}
        />
      </div>
      <div className="flex justify-between gap-2 mt-4">
        <RoleBasedButton
          variant="outline_destructive"
          onClick={() => {
            setInfo(initialInfo);
            setHasChanged(false);
            setCanEdit(false);
          }}
          requiredRoles={["editor", "owner"]}
        >
          Reset
        </RoleBasedButton>
        <RoleBasedButton
          variant="default"
          onClick={handleSave}
          disabled={!hasChanges || isLoading}
          requiredRoles={["editor", "owner"]}
        >
          {isLoading ? "Saving..." : "Save"}
        </RoleBasedButton>
      </div>
    </div>
  );
}
