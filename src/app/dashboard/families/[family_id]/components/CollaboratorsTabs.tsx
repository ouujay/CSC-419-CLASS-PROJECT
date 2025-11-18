import React from "react";
import { XCircle, Hourglass, LoaderCircle, Save, X, Check } from "lucide-react";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import {
  c_DeleteCollaborator,
  c_GetCollaborators,
  c_UpdateCollaborator,
} from "@/fullstack/PublicConvexFunctions";
import { Doc } from "@/convex/_generated/dataModel";
import { FormSelect } from "@/components/osisi-ui/Selects/FormSelect";
import { collaboratorRolesOptions } from "@/utils/constants";
import { useMutation } from "convex/react";
import { tryCatch } from "@/utils/try-catch";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import WithFamilyAccess from "../../../../../components/access/WithAccess";
import { ConfirmButton } from "@/components/osisi-ui/buttons/ConfirmButton";
import { useFamilyData } from "@/contexts/DashboardFamilyContext";

type RoleType = Doc<"family_collaborators">["role"];

export default function CollaboratorsTabs() {
  const { data } = useFamilyData();
  const family = data.details;
  const familyId = family._id;
  
  const { data: collaborators } = useSafeQuery(
    c_GetCollaborators,
    familyId ? { familyId } : "skip"
  );

  return (
    <div className="overflow-x-auto w-full ">
      <table className="min-w-full text-sm text-left">
        <thead className="font-sora">
          <tr>
            <th scope="col" className=""></th>
            <th scope="col" className="">
              Collaborators
            </th>
            <th scope="col" className="">
              Role
            </th>
          </tr>
        </thead>
        <tbody>
          {collaborators?.map((collaborator, index) => (
            <Collaborator
              key={index}
              index={index}
              collaborator={collaborator}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

const statusIcon = {
  accepted: {
    value: "Member",
    icon: Check,
  },
  pending: {
    value: "Pending",
    icon: Hourglass,
  },
  rejected: {
    value: "Rejected",
    icon: XCircle,
  },
};

type CollaboratorsProps = {
  collaborator?: Doc<"family_collaborators">;
  index: number;
};

function Collaborator({ collaborator }: CollaboratorsProps) {
  const [colab, setColab] = React.useState(collaborator);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [hasChanged, setHasChanged] = React.useState(false);

  const { data } = useFamilyData();
  const family = data.details;
  const ownerId = family.owner_id;
  const familyId = family._id;

  const deleteCollaborator = useMutation(c_DeleteCollaborator);
  const updateCollaborator = useMutation(c_UpdateCollaborator);

  function handleChangeRole(value: RoleType) {
    if (!colab) return;
    setColab({
      ...colab,
      role: value,
    });

    setHasChanged(true);
  }

  async function handleSave() {
    setHasChanged(false);
    setIsSaving(true);

    if (!ownerId) {
      console.error("Owner Id not found");
      toast.error("Owner Id not found");
      setIsSaving(false);
      return;
    }

    if (!colab?._id) {
      console.error("Collaboration Id not found");
      toast.error("Collaboration Id not found");
      setIsSaving(false);
      return;
    }

    const { error } = await tryCatch<{ success: boolean }, ConvexError<string>>(
      updateCollaborator({
        id: colab._id,
        data: {
          role: colab?.role,
        },
        ownerId: ownerId,
        eventType: "update_collaborator",
      })
    );

    if (error) {
      console.error("Error Saving relationship:", error);
      toast.error(error.data);
      setIsSaving(false);
      return;
    }
    // Save logic here
    setIsSaving(false);
  }

  async function handleDelete() {
    setIsDeleting(true);

    if (!familyId) {
      console.error("Family Id not found");
      toast.error("Family Id not found");
      setIsSaving(false);
      return;
    }

    if (!colab?._id) {
      console.error("Collaboration Id not found");
      toast.error("Collaboration Id not found");
      setIsSaving(false);
      return;
    }
    const { error } = await tryCatch(
      deleteCollaborator({
        familyCollaboratorId: colab._id,
        familyId: familyId,
        eventType: "delete_collaborator",
      })
    );
    if (error) {
      console.error("Error deleting relationship:", error);
      setIsDeleting(false);
      return;
    }
    setIsDeleting(false);
  }
  return (
    <tr className="align-middle">
      {/* Status Icon */}
      <td className="w-0 px-1">
        <div className="flex justify-center items-center">
          {React.createElement(statusIcon[colab?.status ?? "pending"].icon, {
            className: "size-4",
          })}
        </div>
      </td>

      {/* Email */}
      <td className="font-sora break-words max-w-[200px]">{colab?.email}</td>

      {/* Role Selector or Static Role */}
      <WithFamilyAccess
        familyId={familyId}
        resource="family_collaborators"
        action="update"
        fallback={<td>{colab?.role}</td>}
      >
        <td>
          {ownerId === colab?.user_id ? (
            <>Owner</>
          ) : (
            <FormSelect
              label=""
              required={false}
              value={colab?.role}
              options={collaboratorRolesOptions}
              onChange={(value) => handleChangeRole(value as RoleType)}
              name="collaborator"
              className="w-full sm:w-fit"
            />
          )}
        </td>
      </WithFamilyAccess>

      {/* Save Button */}
      <WithFamilyAccess
        familyId={familyId}
        resource="family_collaborators"
        action="update"
        fallback={<></>}
      >
        <td className="w-0 px-1">
          <div className="flex items-center justify-center">
            <Button
              type="button"
              variant="outline"
              size={"icon"}
              disabled={!hasChanged}
              onClick={handleSave}
            >
              {isSaving ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
            </Button>
          </div>
        </td>
      </WithFamilyAccess>

      {/* Delete Button */}
      <WithFamilyAccess
        familyId={familyId}
        resource="family_collaborators"
        action="update"
        fallback={<></>}
      >
        <td className="w-0 px-1">
          <div className="flex items-center justify-center">
            <ConfirmButton
              type="button"
              variant="outline_destructive"
              disabled={isDeleting || collaborator?.role === "owner"}
              onConfirm={handleDelete}
              size={"icon"}
              confirmActionText={"Remove"}
              confirmTitle="Remove this collaborator?"
              confirmDescription="This will remove the collaborator from this family. You can always invited this user again."
            >
              {isDeleting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <X className="size-4" />
              )}
            </ConfirmButton>
          </div>
        </td>
      </WithFamilyAccess>
    </tr>
  );
}
