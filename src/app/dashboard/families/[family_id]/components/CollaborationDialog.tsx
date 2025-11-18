"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import {
  c_AddCollaborator,
  c_CheckCollaborationUsage,
  c_DeleteCollaborator,
  c_GetCollaborator,
  c_GetCollaborators,
  c_GetFamilyDetails,
  c_TransferOwnership,
  c_UpdateFamily,
} from "@/fullstack/PublicConvexFunctions";
import { Key, Loader, UserMinus, UserPlus } from "lucide-react";
import { ConvexError } from "convex/values";
import CollaboratorsTabs from "./CollaboratorsTabs";
import { FormSelect } from "@/components/osisi-ui/Selects/FormSelect";
import { collaboratorRolesOptions } from "@/utils/constants";
import FormInput from "@/components/osisi-ui/inputs/input";
import { Doc, Id } from "@/convex/_generated/dataModel";
import WithFamilyAccess from "../../../../../components/access/WithAccess";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { redirect, useParams } from "next/navigation";
import { formatCollaborators } from "@/lib/formatters";
import FormSwitch from "@/components/osisi-ui/inputs/FormSwitch";
import { UsageBar } from "@/features/contributionList/list";
import { addCollaboratorSchema } from "@/convex/collaborators/mutations";
import { tryCatch } from "@/utils/try-catch";

type RoleType = Doc<"family_collaborators">["role"];
export default function CollaborationDialog() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<RoleType>("viewer");
  const [isLoading, setIsLoading] = React.useState(false);
  const { family_id: familyId } = useParams<{ family_id: Id<"families"> }>();
  const addCollaborator = useMutation(c_AddCollaborator);
  const { data: usageData } = useSafeQuery(c_CheckCollaborationUsage, {
    familyId,
  });

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!familyId) {
      setIsLoading(false);
      toast.error("Failed to add collaborator: No Family Id");
      return;
    }
    const { data, error } = addCollaboratorSchema.safeParse({
      email,
      role,
      familyId: familyId,
      eventType: "create_collaborator",
      inviteUrl: `${window.location.origin}/invite`,
    });

    if (error) {
      if (error) {
        const errorMessage =
          error?.flatten()?.fieldErrors?.email?.[0] ?? "An error occurred";
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }
    }
    const { error: collaborationError } = await tryCatch(
      addCollaborator({ ...data, eventType: "create_collaborator" })
    );

    if (collaborationError) {
      const error = collaborationError as ConvexError<string>;
      toast.error(error.data || "Failed to add collaborator");
      setIsLoading(false);
      return;
    }

    toast.success("Collaborator added successfully");
    setEmail("");
    setIsLoading(false);
  };

  if (!familyId) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="size-4 mr-1" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] md:w-[70%] lg:w-[50%] max-w-[600px] px-2 sm:p-6">
        <DialogHeader>
          <DialogTitle>Collaborators</DialogTitle>
        </DialogHeader>

        <div className=" overflow-auto space-y-4">
          {/* Add Collaborator Form */}
          <WithFamilyAccess
            familyId={familyId}
            resource="family_collaborators"
            action="create"
            loadingFallback={<></>}
          >
            <form onSubmit={handleAddCollaborator} className="space-y-4 w-">
              <div className="space-y-2">
                <Label htmlFor="email">Add Collaborator by Email</Label>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 items-end">
                  <FormInput
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={false}
                    label=""
                    disabled={isLoading}
                    className="w-full"
                  />

                  <FormSelect
                    label=""
                    required={false}
                    value={role}
                    options={collaboratorRolesOptions}
                    onChange={(value) => setRole(value as RoleType)}
                    name="role"
                    className="w-full sm:w-fit"
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </form>
          </WithFamilyAccess>
          <section className="grid grid-cols-[auto_1fr] md:min-w-[400px] gap-2 place-content-center">
            <span>Collaborators</span>
            <UsageBar
              current={Math.min(usageData?.current || 1, usageData?.max || 1)}
              max={usageData?.max || 1}
            />
          </section>

          <CollaboratorsTabs />

          <PrivacyButton />

          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <LeaveFamily />
            <TransferOwnership />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LeaveFamily() {
  const { family_id: familyId } = useParams<{ family_id: Id<"families"> }>();
  const leaveFamily = useMutation(c_DeleteCollaborator);
  const [open, setOpen] = React.useState(false);
  const { data: collaborator } = useSafeQuery(
    c_GetCollaborator,
    familyId ? { familyId: familyId } : "skip"
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLeaveFamily = async () => {
    if (!familyId || !collaborator) return;

    setIsLoading(true);
    try {
      await leaveFamily({
        familyId: familyId,
        familyCollaboratorId: collaborator._id,
        eventType: "delete_collaborator",
      });
      toast.success("Left family successfully");
    } catch (err) {
      const error = err as ConvexError<string>;
      toast.error(error.data || "Failed to leave family");
    } finally {
      setIsLoading(false);
      redirect("/dashboard/families");
    }
  };

  return (
    <WithFamilyAccess
      familyId={familyId}
      action="delete"
      resource="family_collaborators"
      loadingFallback={<></>}
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <UserMinus className="w-4 h-4 mr-2" />
            Leave Family
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90%] md:w-[70%] lg:w-[50%] max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Leave Family</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this family?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-between py-4 flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isLoading}
              onClick={handleLeaveFamily}
            >
              Leave
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </WithFamilyAccess>
  );
}

function TransferOwnership() {
  const { family_id: familyId } = useParams<{ family_id: Id<"families"> }>();
  const transferOwnership = useMutation(c_TransferOwnership);
  const [open, setOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = useState<Id<"users"> | null>();
  const { data: collaborators } = useSafeQuery(
    c_GetCollaborators,
    familyId ? { familyId: familyId } : "skip"
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const selectOptions = formatCollaborators(collaborators);
  const handleTransfer = async () => {
    if (!familyId || !selectedUser) return;

    setIsLoading(true);
    try {
      await transferOwnership({
        newOwnerId: selectedUser,
        familyId: familyId,
        eventType: "update_collaborator",
      });
      toast.success("Ownership transferred successfully");
    } catch (err) {
      const error = err as ConvexError<string>;
      toast.error(error.data || "Failed to transfer ownership");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <WithFamilyAccess
      familyId={familyId}
      resource="family_collaborators"
      action="update"
      loadingFallback={<></>}
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="">
            <Key className="w-4 h-4 mr-2" />
            Transfer Ownership
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90%] md:w-[70%] lg:w-[50%] max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Transfer Ownership</DialogTitle>
            <DialogDescription>
              <span className="font-medium text-primary">
                Transfer ownership
              </span>{" "}
              of this family to another collaborator. This action will make them
              the <span className="font-medium text-primary">new owner</span>,
              and you will become an{" "}
              <span className="font-medium text-primary">editor</span>. This
              action{" "}
              <span className="font-medium text-primary">cannot be undone</span>
              .
            </DialogDescription>
          </DialogHeader>

          <div>
            <FormSelect
              label="New Owner"
              name="new_owner"
              onChange={(value) => setSelectedUser(value as Id<"users">)}
              value={selectedUser || ""}
              options={selectOptions}
            />
          </div>

          <div className="flex flex-wrap justify-between py-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              disabled={isLoading}
              onClick={handleTransfer}
            >
              Transfer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </WithFamilyAccess>
  );
}

function PrivacyButton() {
  const { family_id: familyId } = useParams<{ family_id: Id<"families"> }>();
  const { data: family } = useSafeQuery(
    c_GetFamilyDetails,
    familyId ? { familyId: familyId } : "skip"
  );
  const transferOwnership = useMutation(c_UpdateFamily);
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePrivacyChange = async () => {
    if (!familyId) return;

    setIsLoading(true);
    try {
      await transferOwnership({
        id: familyId,
        data: {
          is_public: !family?.is_public,
        },
        eventType: "update_family",
      });
      toast.success("Privacy Updated Successfully.");
    } catch (err) {
      const error = err as ConvexError<string>;
      toast.error(error.data || "Failed to transfer ownership");
    } finally {
      setIsLoading(false);
    }
  };
  const handleCopyLink = () => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/families/${familyId}`;
    navigator.clipboard.writeText(shareUrl);
    toast("Link copied to clipboard", {
      description: "Share this link with your family members",
    });
  };

  return (
    <WithFamilyAccess
      familyId={familyId}
      resource="family_collaborators"
      action="read"
      loadingFallback={<></>}
    >
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <FormSwitch
            required={false}
            onCheckedChange={handlePrivacyChange}
            checked={family?.is_public || false}
            name="is_family_public"
            id="is_family_public"
            label="Allow Public View"
          />
          <Loader
            className={`${isLoading ? "" : "hidden"} animate-spin text-primary`}
          />
        </div>

        {family?.is_public ? (
          <Button variant={"outline"} onClick={handleCopyLink}>
            Copy Link
          </Button>
        ) : (
          <></>
        )}
      </div>
    </WithFamilyAccess>
  );
}
