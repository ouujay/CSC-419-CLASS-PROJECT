import { Button } from "@/components/ui/button";
import { useAddMemberStore } from "@/contexts/AddMemberContext";
import { Id } from "@/convex/_generated/dataModel";
import { CreateMemberSchema } from "@/convex/familyMembers/mutations";
import { c_CreateMember } from "@/fullstack/PublicConvexFunctions";
import { tryCatch } from "@/utils/try-catch";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { redirect, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function SubmitButton() {
  const memberData = useAddMemberStore((state) => state.memberData);
  const familyId = useAddMemberStore((state) => state.familyId);
  const relationships = useAddMemberStore((state) => state.relationships);
  const reset = useAddMemberStore((state) => state.reset);
  const [isLoading, setIsLoading] = useState(false);
  const createMember = useMutation(c_CreateMember);
  const searchParams = useSearchParams();

  const handleSubmit = useCallback(
    async (addAnother: boolean) => {
      setIsLoading(true);
      const input = {
        familyId,
        memberData,
        relationships,
      };

      const { error, data } = CreateMemberSchema.safeParse(input);

      if (error) {
        const { fieldErrors } = error.flatten();
        Object.entries(fieldErrors).forEach(([field, errors]) => {
          if (errors) {
            errors.forEach((err) => toast.error(`${field}: ${err}`));
          }
        });

        console.log(error.message);
        setIsLoading(false);
        return;
      }

      const { error: createError, data: id } = await tryCatch<
        Id<"family_members">,
        ConvexError<string>
      >(
        createMember({
          ...data,
          eventType: "create_family_member",
        })
      );

      if (createError) {
        console.error(createError);
        toast.error(createError.data);
        setIsLoading(false);
        return;
      }

      toast.success("Family member created and added to the family.");
      reset();
      if (addAnother) {
        setTimeout(() => {
          const container = document.getElementById("add-member-container");
          container?.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      } else {
        const redirectUrl = searchParams.get("redirect");
        redirect(
          `${redirectUrl}?find_member=${id}` ||
            `/dashboard/families/${familyId}`
        );
      }
      setIsLoading(false);
    },
    [familyId, memberData, relationships, createMember, reset, searchParams]
  );

  const relationship = useAddMemberStore((state) => state.relationship);

  if (!relationship) {
    return null;
  }

  return (
    <div className="grid sm:grid-cols-[2fr_1fr] gap-2 w-full">
      <Button
        className="w-full"
        disabled={isLoading}
        onClick={() => handleSubmit(true)}
      >
        Save & Add
      </Button>
      <Button
        className="w-full"
        disabled={isLoading}
        onClick={() => handleSubmit(false)}
        variant={"outline"}
      >
        Done
      </Button>
    </div>
  );
}
