"use client";

import React from "react";
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
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { c_DeleteFamily } from "@/fullstack/PublicConvexFunctions";
import { ConvexError } from "convex/values";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { tryCatch } from "@/utils/try-catch";
import { Id } from "@/convex/_generated/dataModel";

interface DeleteFamilyDialogProps {
  selectedFamilies?: Id<"families">[];
  onSuccess?: () => void;
}

export default function DeleteFamilyDialog({
  selectedFamilies,
  onSuccess,
}: DeleteFamilyDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [deleteMembers, setDeleteMembers] = React.useState(false);
  const router = useRouter();
  const deleteFamily = useMutation(c_DeleteFamily);

  const handleDelete = async () => {
    if (!selectedFamilies) {
      toast.error("No family was selected");
      setIsLoading(false);
      setOpen(false);
      return;
    }

    setIsLoading(true);

    const { error } = await tryCatch<{ success: boolean }, ConvexError<string>>(
      deleteFamily({
        familyIds: selectedFamilies,
        eventType: "delete_family",
      })
    );

    if (error) {
      console.error(error);
      toast.error(error.data || "Failed to delete family");
      setIsLoading(false);
      setOpen(false);
      return;
    }

    
    setIsLoading(false);
    setOpen(false);
    onSuccess?.();
    toast.success("Family(s) deleted successfully");
    router.push("/dashboard/families");
  };

  if (!selectedFamilies || selectedFamilies.length === 0) return null;
  return (
 <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button
      variant="destructive"
      size="sm"
      className="flex items-center gap-2"
    >
      <Trash2 className="size-4" />
      Delete {selectedFamilies.length > 1 ? `Families (${selectedFamilies.length})` : 'Family (1)'}
    </Button>
  </DialogTrigger>

  <DialogContent className="w-[90%] sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        Delete Family
      </DialogTitle>
      <DialogDescription>
        This action cannot be undone. Please choose how you want to delete
        this family.
      </DialogDescription>
    </DialogHeader>

    <div className="py-4">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="deleteFamilyOnly"
            checked={!deleteMembers}
            onChange={() => setDeleteMembers(false)}
            className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="deleteFamilyOnly" className="text-sm font-medium">
            Delete family only
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="deleteWithMembers"
            checked={deleteMembers}
            onChange={() => setDeleteMembers(true)}
            className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="deleteWithMembers" className="text-sm font-medium">
            Delete family and all members
          </label>
        </div>
      </div>
    </div>

    <Alert className="mt-4 text-sora">
      <AlertTriangle className="size-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        {deleteMembers
          ? "If any members are shared with other families, those families will also lose access to these members."
          : "Other families that share these members will retain access to them."}
      </AlertDescription>
    </Alert>

    <DialogFooter>
      <Button
        variant="outline"
        onClick={() => setOpen(false)}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        variant="destructive"
        onClick={handleDelete}
        disabled={isLoading}
      >
        {isLoading ? "Deleting..." : "Delete Family"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

  );
}
