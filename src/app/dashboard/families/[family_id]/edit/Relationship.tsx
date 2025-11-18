import { FormSelect } from "@/components/osisi-ui/Selects/FormSelect";
import { Button } from "@/components/ui/button";
import {
  maritalStatusOptions,
  parentageTypeOptions,
  relationshipOptions,
} from "@/utils/constants";
import { Doc, Id } from "@/convex/_generated/dataModel";
import {
  c_DeleteRelationship,
  c_UpdateRelationship,
} from "@/fullstack/PublicConvexFunctions";
import { tryCatch } from "@/utils/try-catch";
import { useMutation } from "convex/react";
import { LoaderCircle, Save, X } from "lucide-react";
import React from "react";
import {
  genealogicalRelations,
  PartnershipTypeSchema,
  ParentageTypeSchema,
} from "@/convex/tables";
import { z } from "zod";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import FormInput from "@/components/osisi-ui/inputs/input";
import { useFamilyData } from "@/contexts/DashboardFamilyContext";

type RelationshipProps = {
  index: number;
  relationship: Doc<"relationships">;
};

type RelationshipCategoriesType = z.infer<typeof genealogicalRelations>;
type PartnershipType = z.infer<typeof PartnershipTypeSchema>;
type ParentageType = z.infer<typeof ParentageTypeSchema>;

export default function Relationship({
  index,
  relationship,
}: RelationshipProps) {
  const [rel, setRel] = React.useState(relationship);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [hasChanged, setHasChanged] = React.useState(false);

  const deleteRelationship = useMutation(c_DeleteRelationship);
  const updateRelationship = useMutation(c_UpdateRelationship);

  function handleChangePosition(value: string) {
    setRel((prev) => ({ ...prev, position: +value }));
    setHasChanged(true);
  }

  function handleChangeRelationship(value: RelationshipCategoriesType) {
    if (value !== rel.relationship) {
      setRel((prev) => ({
        ...prev,
        relationship: value,
        parentage_type: undefined,
        partnership_type: undefined,
      }));
    } else {
      setRel((prev) => ({ ...prev, relationship: value }));
    }
    setHasChanged(true);
  }

  function handleChangeRelationshipType(
    value: PartnershipType | ParentageType
  ) {
    if (rel.relationship === "parents") {
      setRel((prev) => ({
        ...prev,
        parentage_type: value as ParentageType,
        partnership_type: undefined,
      }));
    }
    if (rel.relationship === "partners") {
      setRel((prev) => ({
        ...prev,
        parentage_type: undefined,
        partnership_type: value as PartnershipType,
      }));
    }
    setHasChanged(true);
  }

  async function handleSave() {
    setHasChanged(false);
    setIsSaving(true);

    const { error } = await tryCatch<null, ConvexError<string>>(
      updateRelationship({
        relationship: rel,
        eventType: "update_relationship",
      })
    );

    if (error) {
      console.error("Error deleting relationship:", error);
      toast.error(error.data);
      setIsSaving(false);
      return;
    }
    // Save logic here
    setIsSaving(false);
  }

  async function handleDelete() {
    setIsDeleting(true);
    const { error } = await tryCatch(
      deleteRelationship({ id: rel._id, eventType: "delete_relationship" })
    );
    if (error) {
      console.error("Error deleting relationship:", error);
      setIsDeleting(false);
      return;
    }
    setIsDeleting(false);
  }

  return (
    <tr key={index} className="">
      <td className="">
        <FormatRelationships familyMemberId={relationship.from} />
      </td>
      <td className="">
        <FormSelect
          className="w-full"
          name="relationship"
          required={false}
          options={relationshipOptions}
          placeholder="Select Relationship Type"
          value={rel.relationship}
          onChange={(value) =>
            handleChangeRelationship(value as RelationshipCategoriesType)
          }
        />
      </td>
      <td className="">
        {rel.relationship === "parents" ? (
          <FormSelect
            className="w-full"
            name="parentage_type"
            required={false}
            options={parentageTypeOptions}
            placeholder="Select Parentage Type"
            value={rel?.parentage_type || ""}
            onChange={(value) =>
              handleChangeRelationshipType(value as ParentageType)
            }
          />
        ) : (
          <FormSelect
            className="w-full"
            name="partnership_type"
            required={false}
            options={maritalStatusOptions}
            placeholder="Select Partnership Type"
            value={rel?.partnership_type || ""}
            onChange={(value) =>
              handleChangeRelationshipType(value as PartnershipType)
            }
          />
        )}
      </td>

      <td className="">
        <FormInput
          className="w-full"
          name="position"
          required={false}
          placeholder="Position"
          label=""
          value={`${rel?.position || ""}`}
          onChange={(e) =>
            handleChangePosition(e.target.value as unknown as string)
          }
        />
      </td>
      <td className="">
        <FormatRelationships familyMemberId={relationship.to} />
      </td>
      <td>
        <div className="flex items-center justify-center">
          <Button
            type="button"
            variant="outline"
            size={"icon"}
            disabled={!hasChanged}
            onClick={() => handleSave()}
          >
            {isSaving ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
          </Button>
        </div>
      </td>
      <td className="">
        <div className="flex items-center justify-center">
          <Button
            type="button"
            size={"icon"}
            disabled={isDeleting}
            onClick={() => handleDelete()}
            variant={"outline_destructive"}
          >
            {isDeleting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <X className="size-4" />
            )}
          </Button>
        </div>
      </td>
    </tr>
  );
}

export function FormatRelationships({
  familyMemberId,
}: {
  familyMemberId: Id<"family_members">;
}) {
  const { data } = useFamilyData();
  const members = data.members;
  const member = members?.find((member) => member._id === familyMemberId);
  return <p className="max-w-[200px] truncate">{member?.full_name || "N/A"}</p>;
}

export function MobileRelationshipCard({
  index,
  relationship,
}: RelationshipProps) {
  const [rel, setRel] = React.useState(relationship);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [hasChanged, setHasChanged] = React.useState(false);

  const deleteRelationship = useMutation(c_DeleteRelationship);
  const updateRelationship = useMutation(c_UpdateRelationship);

  function handleChangeRelationship(value: RelationshipCategoriesType) {
    if (value !== rel.relationship) {
      setRel((prev) => ({
        ...prev,
        relationship: value,
        parentage_type: undefined,
        partnership_type: undefined,
      }));
    } else {
      setRel((prev) => ({ ...prev, relationship: value }));
    }
    setHasChanged(true);
  }

  function handleChangeRelationshipType(
    value: PartnershipType | ParentageType
  ) {
    if (rel.relationship === "parents") {
      setRel((prev) => ({
        ...prev,
        parentage_type: value as ParentageType,
        partnership_type: undefined,
      }));
    }
    if (rel.relationship === "partners") {
      setRel((prev) => ({
        ...prev,
        parentage_type: undefined,
        partnership_type: value as PartnershipType,
      }));
    }
    setHasChanged(true);
  }

  async function handleSave() {
    setHasChanged(false);
    setIsSaving(true);

    const { error } = await tryCatch<null, ConvexError<string>>(
      updateRelationship({
        relationship: rel,
        eventType: "update_relationship",
      })
    );

    if (error) {
      console.error("Error deleting relationship:", error);
      toast.error(error.data);
      setIsSaving(false);
      return;
    }
    // Save logic here
    setIsSaving(false);
  }

  async function handleDelete() {
    setIsDeleting(true);
    const { error } = await tryCatch(
      deleteRelationship({ id: rel._id, eventType: "delete_relationship" })
    );
    if (error) {
      console.error("Error deleting relationship:", error);
      setIsDeleting(false);
      return;
    }
    setIsDeleting(false);
  }

  return (
    <div className="border rounded-lg p-4  shadow-sm" key={index}>
      <div className="space-y-4">
        {/* From and To */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              From
            </label>
            <div className="mt-1">
              <FormatRelationships familyMemberId={relationship.from} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              To
            </label>
            <div className="mt-1">
              <FormatRelationships familyMemberId={relationship.to} />
            </div>
          </div>
        </div>

        {/* Relationship Type */}
        <div>
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Relationship
          </label>
          <div className="mt-1">
            <FormSelect
              className="w-full"
              name="relationship"
              required={false}
              options={relationshipOptions}
              placeholder="Select Relationship Type"
              value={relationship.relationship}
              onChange={(value) => {
                handleChangeRelationship(value as RelationshipCategoriesType);
              }}
            />
          </div>
        </div>

        {/* Relationship Subtype */}
        <div>
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Type
          </label>
          <div className="mt-1">
            {relationship.relationship === "parents" ? (
              <FormSelect
                className="w-full"
                name="parentage_type"
                required={false}
                options={parentageTypeOptions}
                placeholder="Select Parentage Type"
                value={relationship?.parentage_type || ""}
                onChange={(value) => {
                  handleChangeRelationshipType(value as ParentageType);
                }}
              />
            ) : (
              <FormSelect
                className="w-full"
                name="partnership_type"
                required={false}
                options={maritalStatusOptions}
                placeholder="Select Partnership Type"
                value={relationship?.partnership_type || ""}
                onChange={(value) => {
                  handleChangeRelationshipType(value as PartnershipType);
                }}
              />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            disabled={!hasChanged}
            onClick={() => handleSave()}
            className=" w-8 h-8 text-primary border-2 border-primary hover:bg-primary"
          >
            {isSaving ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
          </Button>
          <Button
            type="button"
            disabled={isDeleting}
            onClick={() => handleDelete()}
            className="bg-transparent hover:text-destructive hover:bg-transparent w-0"
          >
            {isDeleting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <X className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
