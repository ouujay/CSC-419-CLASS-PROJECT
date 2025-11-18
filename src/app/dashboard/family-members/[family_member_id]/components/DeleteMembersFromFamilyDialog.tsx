import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { c_RemoveFamilyMembers } from "@/fullstack/PublicConvexFunctions";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { AlertCircle, Trash2 } from "lucide-react";
import { tryCatch } from "@/utils/try-catch";
import { ConvexError } from "convex/values";

interface DeleteMemberDialogProps {
  members: Doc<"family_members">[];
  familyId: Id<"families">;
  onSuccess?: () => void;
}

export default function DeleteMemberDialog({
  members,
  familyId,
  onSuccess,
}: DeleteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteMembers = useMutation(c_RemoveFamilyMembers);

  const handleDelete = async () => {
    setIsDeleting(true);

    const { error } = await tryCatch<{ success: boolean }, ConvexError<string>>(
      deleteMembers({
        memberIds: members.map((member) => member._id),
        familyId,
        eventType: "delete_family_member",
      })
    );

    if (error) {
      console.error(error);
      setIsDeleting(false);
      toast.error(error.data);
      return;
    }

    toast.success("Member deleted successfully");
    setOpen(false);
    onSuccess?.();
    setIsDeleting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="flex items-center gap-2 "
        >
          <Trash2 className="size-4" />
          Delete{" "}
          {members.length > 1 ? `Members (${members.length})` : "Member (1)"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 ">
            <AlertCircle className="size-4" />
            Delete Members
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{" '"}
            {members
              .map(
                (member) =>
                  `${member?.full_name || ""}`
              )
              .join(", ")}
            {"' "}
            from this family? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 ">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
