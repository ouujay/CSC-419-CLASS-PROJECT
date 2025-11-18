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
import { c_DeleteFamilyMember } from "@/fullstack/PublicConvexFunctions";
import { Doc } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { AlertCircle, Trash2 } from "lucide-react";
import { tryCatch } from "@/utils/try-catch";
import { ConvexError } from "convex/values";

interface DeleteMemberDialogProps {
  familyMember: Doc<"family_members">;
}

export default function DeleteFamilyMember({
  familyMember,
}: DeleteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteMember = useMutation(c_DeleteFamilyMember);

  const handleDelete = async () => {
    setIsDeleting(true);

    const { error } = await tryCatch<{ success: boolean }, ConvexError<string>>(
      deleteMember({
        familyMemberId: familyMember._id,
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
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
    setOpen(false);
    setIsDeleting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="flex items-center gap-2"
        >
          <Trash2 className="size-4" />
          <span>Delete Family Member</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[90vw] sm:max-w-lg w-full p-4 sm:p-6"
        style={{ width: "100%", maxWidth: "90vw" }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <AlertCircle className="size-4" />
            Are you sure you want to delete this family member?{" "}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            This action cannot be undone and will affect all families that
            include this member.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
