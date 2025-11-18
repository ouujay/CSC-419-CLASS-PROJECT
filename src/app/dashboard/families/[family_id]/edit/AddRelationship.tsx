import { FormSelect } from "@/components/osisi-ui/Selects/FormSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  maritalStatusOptions,
  parentageTypeOptions,
  relationshipOptions,
} from "@/utils/constants";
import { Doc, Id } from "@/convex/_generated/dataModel";
import {
  ParentageTypeSchema,
  PartnershipTypeSchema,
  genealogicalRelations,
} from "@/convex/tables";
import { c_createRelationship } from "@/fullstack/PublicConvexFunctions";
import { tryCatch } from "@/utils/try-catch";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import React, { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { membersToOptions } from "@/lib/formatters";
import { useFamilyData } from "@/contexts/DashboardFamilyContext";

// Define a more specific type
type RelationshipFormData = {
  from?: Id<"family_members">;
  to?: Id<"family_members">;
  relationship?: z.infer<typeof genealogicalRelations>;
  parentage_type?: z.infer<typeof ParentageTypeSchema>;
  partnership_type?: z.infer<typeof PartnershipTypeSchema>;
};

export default function AddRelationship() {
  const { data } = useFamilyData();
  const family = data.details;
  const membersOptions = membersToOptions(data.members);

  // Initialize with empty object instead of null
  const [rel, setRel] = useState<RelationshipFormData>({});
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const createRelationship = useMutation(c_createRelationship);

  function handleChangeName(value: Id<"family_members">, field: "from" | "to") {
    setRel((prev) => ({ ...prev, [field]: value }));
  }

  const isFormValid = () => {
    return rel.from && rel.to && rel.relationship && family?._id;
  };

  function handleChangeRelationship(
    value: RelationshipFormData["relationship"]
  ) {
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
  }

  function handleChangeRelationshipType(
    value:
      | RelationshipFormData["partnership_type"]
      | RelationshipFormData["parentage_type"]
  ) {
    if (rel.relationship === "parents") {
      setRel((prev) => ({
        ...prev,
        parentage_type: value as RelationshipFormData["parentage_type"],
        partnership_type: undefined,
      }));
    }
    if (rel.relationship === "partners") {
      setRel((prev) => ({
        ...prev,
        parentage_type: undefined,
        partnership_type: value as RelationshipFormData["partnership_type"],
      }));
    }
  }

  async function handleSave() {
    setIsSaving(true);

    if (!isFormValid()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!family) {
      toast.error("Family details not found");
      return;
    }

    // Create the relationship object without Convex internal fields
    const relationshipData: Omit<
      Doc<"relationships">,
      "_creationTime" | "_id"
    > = {
      from: rel.from!,
      to: rel.to!,
      relationship: rel.relationship!,
      parentage_type: rel.parentage_type,
      partnership_type: rel.partnership_type,
      family_id: family._id,
    };

    const { error } = await tryCatch<null, ConvexError<string>>(
      createRelationship({
        ...relationshipData,
        familyId: family._id,
        eventType: "create_relationship",
      })
    );

    if (error) {
      console.error("Error creating relationship:", error);
      toast.error(error.data);
    } else {
      toast.success("Relationship created successfully!");
      setRel({});
      setOpen(false);
    }

    setIsSaving(false);
  }

  function handleCancel() {
    setRel({});
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">Add Relationship</Button>
      </DialogTrigger>

      <DialogContent className="w-[90%] sm:w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Relationship</DialogTitle>
          <DialogDescription>
            Create a new relationship between family members here.
          </DialogDescription>
        </DialogHeader>

        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <FormSelect
              label="From"
              name="from"
              options={membersOptions}
              value={rel?.from || ""}
              onChange={(value) =>
                handleChangeName(value as Id<"family_members">, "from")
              }
              placeholder="Select Name"
            />
            <FormSelect
              label="To"
              name="to"
              options={membersOptions}
              value={rel?.to || ""}
              onChange={(value) =>
                handleChangeName(value as Id<"family_members">, "to")
              }
              placeholder="Select Name"
            />
            <FormSelect
              label="Relationship"
              name="relationship"
              options={relationshipOptions}
              value={rel?.relationship || ""}
              placeholder="Select Relationship"
              onChange={(value) =>
                handleChangeRelationship(
                  value as RelationshipFormData["relationship"]
                )
              }
            />

            {rel?.relationship === "parents" ? (
              <FormSelect
                className="w-full"
                label="Parentage Type"
                name="parentage_type"
                required={false}
                options={parentageTypeOptions}
                placeholder="Select Parentage Type"
                value={rel?.parentage_type || ""}
                onChange={(value) =>
                  handleChangeRelationshipType(
                    value as RelationshipFormData["parentage_type"]
                  )
                }
              />
            ) : (
              <FormSelect
                className="w-full"
                name="partnership_type"
                label="Partnership Type"
                options={maritalStatusOptions}
                placeholder="Select Partnership Type"
                value={rel?.partnership_type || ""}
                onChange={(value) =>
                  handleChangeRelationshipType(
                    value as RelationshipFormData["partnership_type"]
                  )
                }
              />
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={() => handleCancel()}
              variant="outline_destructive"
            >
              Cancel
            </Button>
            <Button disabled={isSaving} onClick={handleSave}>
              Add
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
