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
import { Id } from "@/convex/_generated/dataModel";
import { ReactNode, useState } from "react";
import { AlertCircle, Trash2 } from "lucide-react";
import { tryCatch } from "@/utils/try-catch";
import { ConvexError } from "convex/values";
import Link from "next/link";

interface RemoveFamilyMembersDialogProps {
  members: Id<"family_members">[];
  familyId: Id<"families">;
  children?: ReactNode;
  onSuccess?: () => void;
}

export default function RemoveFamilyMembersDialog({
  members,
  familyId,
  onSuccess,
  children,
}: RemoveFamilyMembersDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteMembers = useMutation(c_RemoveFamilyMembers);

  const handleDelete = async () => {
    setIsDeleting(true);

    const { error } = await tryCatch<{ success: boolean }, ConvexError<string>>(
      deleteMembers({
        memberIds: members,
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
        {children ? (
          children
        ) : (
          <Button
            variant="outline_destructive"
            size="sm"
            className="flex items-center gap-2 "
          >
            <Trash2 className="size-4" />
            Remove{" "}
            {members.length > 1 ? `Members (${members.length})` : "Member (1)"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[500px] min-w-[200px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 ">
            <AlertCircle className="size-4" />
            Remove Members
          </DialogTitle>
          <DialogDescription>
            These family members are can still be found in the
            <Button asChild variant={"link"}>
              <Link href={"/dashboard/family-members"}>Family Members Tab</Link>
            </Button>
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
            {isDeleting ? "Removing..." : "Remove Members"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
