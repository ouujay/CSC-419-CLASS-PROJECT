import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { c_DeleteContribution } from "@/fullstack/PublicConvexFunctions";
import { tryCatch } from "@/utils/try-catch";
import { useMutation } from "convex/react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { toast } from "sonner";

export default function DeleteContribution({
  contributionId,
}: {
  contributionId: Id<"family_contributions">;
}) {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const deleteContribution = useMutation(c_DeleteContribution);
  const handleDelete = async () => {
    setLoading(true);

    await tryCatch(
      deleteContribution({
        contributionId,
        eventType: "delete_family_contribution",
      })
    );

    const { error } = await tryCatch(
      deleteContribution({
        contributionId,
        eventType: "delete_family_contribution",
      })
    );

    if (error) {
      toast.error("Failed to delete contribution link");
      console.error("Error deleting contribution link:", error);
      return;
    }

    toast.error("Deleted contribution link Successfully");
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={"sm"}
          variant="outline_destructive"
          className=""
          title="Delete Link"
        >
          <Trash2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] md:w-[70%] lg:w-[50%] max-w-[600px] px-2 sm:p-6">
        <DialogHeader>
          <DialogTitle>Delete Contribution Link</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this contribution link? It will no
            longer be accessible to anyone who has it.
          </DialogDescription>
        </DialogHeader>

        <Button
          onClick={handleDelete}
          disabled={loading}
          variant={"destructive"}
        >
          <Trash2 className="size-4" />
          Delete Contribution Link
        </Button>

        <DialogClose>Close</DialogClose>
      </DialogContent>
    </Dialog>
  );
}
