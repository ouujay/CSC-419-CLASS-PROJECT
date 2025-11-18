import { useMutation } from "convex/react";
import { toast } from "sonner";
import { c_RemoveFamilyMembers } from "@/fullstack/PublicConvexFunctions";
import { Id } from "@/convex/_generated/dataModel";
import { tryCatch } from "@/utils/try-catch";
import { ConvexError } from "convex/values";
import { useState, useCallback } from "react";

export function useRemoveFamilyMembers() {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteMembers = useMutation(c_RemoveFamilyMembers);

  const removeFamilyMembers = useCallback(
    async (
      familyId: Id<"families">,
      memberIds: Id<"family_members">[],
      onSuccess?: () => void
    ) => {
      setIsDeleting(true);

      const { error } = await tryCatch<{ success: boolean }, ConvexError<string>>(
        deleteMembers({
          memberIds,
          familyId,
          eventType: "delete_family_member",
        })
      );

      if (error) {
        console.error(error);
        toast.error(error.data);
        setIsDeleting(false);
        return;
      }

      toast.success("Member deleted successfully");
      onSuccess?.();
      setIsDeleting(false);
    },
    [deleteMembers]
  );

  return {
    removeFamilyMembers,
    isDeleting,
  };
}
