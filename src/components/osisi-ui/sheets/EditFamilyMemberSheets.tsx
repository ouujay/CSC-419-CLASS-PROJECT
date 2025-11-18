import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Pencil, Share2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import FamilyMemberDetails from "@/app/dashboard/family-members/[family_member_id]/components/FamilyMemberDetails";
import ReorderableListDnd from "../ReorderableListDnd.tsx";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useFamilyData } from "@/contexts/DashboardFamilyContext";
import EssentialInfo, { familyMemberDetailsType } from "../Form/EssentialInfo";
import { useState } from "react";
import { tryCatch } from "@/utils/try-catch";
import { c_UpdatedFamilyMember } from "@/fullstack/PublicConvexFunctions";
import { useMutation } from "convex/react";
import { familyMemberType } from "@/fullstack/types.js";

export function Profile({ details }: { details: familyMemberType }) {
  return (
    <Sheet>
      <SheetTrigger className="" asChild>
        <Button variant="link">
          <Pencil /> Quick Edit
        </Button>
      </SheetTrigger>
      <SheetContent className=" overflow-auto w-[100%]">
        <SheetHeader className="">
          <SheetTitle className="text-xl">Quick Edit</SheetTitle>
        </SheetHeader>
        <div className="px-4">
          <FamilyMemberDetails familyMember={details} />
          <div className="w-full flex justify-between py-1">
            <Button asChild variant={"link"} size={"sm"}>
              <Link
                href={`/dashboard/family-members/${details._id}`}
                className=""
              >
                Edit More
              </Link>
            </Button>
            <ShareLink familyMemberId={details._id} />
          </div>
          <h6>Relationships</h6>
          <hr />
          <div className="grid gap-1 mt-2">
            <ReorderableListDnd
              relationship="partners"
              familyId={details.family_id}
              familyMemberId={details._id}
            />
            <ReorderableListDnd
              relationship="children"
              familyId={details.family_id}
              familyMemberId={details._id}
            />
            <ReorderableListDnd
              relationship="parents"
              familyId={details.family_id}
              familyMemberId={details._id}
            />
          </div>
          <EssentialInfoContainer initialFamilyMember={details} />
        </div>

        <SheetFooter>
          {/* <Button type="submit">Save changes</Button> */}
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function ShareLink({
  familyMemberId,
}: {
  familyMemberId: Id<"family_members">;
}) {
  const { data } = useFamilyData();
  const { _id: familyId } = data.details;
  const handleCopyLink = () => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/families/${familyId}/layouts/descendants?find_member=${familyMemberId}`;
    navigator.clipboard.writeText(shareUrl);
    toast("Link copied to clipboard", {
      description: "Share this link with your family members",
    });
  };
  if (!data.details.is_public) {
    return <></>;
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" onClick={handleCopyLink}>
          <Share2 className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Copy link to member</p>
      </TooltipContent>
    </Tooltip>
  );
}

function EssentialInfoContainer({
  initialFamilyMember,
}: {
  initialFamilyMember: familyMemberType;
}) {
  const [familyMember, setFamilyMember] = useState(initialFamilyMember);
  const [isLoading, setIsLoading] = useState(false);
  const updateFamilyMember = useMutation(c_UpdatedFamilyMember);

  const handleFamilyMemberChange = <Key extends keyof familyMemberDetailsType>(
    key: Key,
    value: familyMemberDetailsType[Key]
  ) => {
    const newFamilyMember = {
      ...familyMember,
      [key]: value,
    };

    setFamilyMember(newFamilyMember);
  };

  async function handleSave() {
    setIsLoading(true);
    const { _creationTime, _id, canAccess, profile_picture, ...data } =
      familyMember;

    const { error } = await tryCatch(
      updateFamilyMember({
        id: familyMember._id,
        eventType: "update_family_member",
        data,
      })
    );

    if (error) {
      toast.error("Error saving data");
      setIsLoading(false);
      console.log(_creationTime, _id, profile_picture, canAccess);
      return;
    }

    setIsLoading(false);
  }

  return (
    <section className="relative z-20">
      <div className="sticky top-0 bg-background/90  py-4">
        <div className="flex justify-between p-1 items-end">
          <h6>Personal Info</h6>{" "}
          <Button className="" onClick={handleSave}>
            {" "}
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
        <hr />
      </div>

      <EssentialInfo
        familyMemberDetails={familyMember}
        onChange={handleFamilyMemberChange}
      />
    </section>
  );
}
