import {
  Camera,
  // Clock,
  Eye,
  EyeClosed,
  Heart,
  HeartCrack,
  Mars,
  Venus,
  VenusAndMars,
} from "lucide-react";
import React, { useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import {
  c_RemoveFamilyMemberProfilePicture,
  c_UpdatedFamilyMember,
} from "@/fullstack/PublicConvexFunctions";
import { useMutation } from "convex/react";
import { tryCatch } from "@/utils/try-catch";
import { toast } from "sonner";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageUploader from "@/components/osisi-ui/ImageUploader";
import Image from "next/image";
import WithFamilyAccess from "@/components/access/WithAccess";

type FamilyMemberImage = { profile_picture?: string };
type FamilyMemberProps = {
  familyMember: (Doc<"family_members"> & FamilyMemberImage) | null;
};
export default function FamilyMemberDetails({
  familyMember,
}: FamilyMemberProps) {
  return (
    <section className="border-b-card border-b-2 pb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        {/* Avatar */}
        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0 relative isolate">
          <figure className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0   overflow-hidden relative isolate">
            <Image
              src={familyMember?.profile_picture || "/placeholder.jpg"}
              alt={familyMember?.full_name || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </figure>
          <WithFamilyAccess
            action="read"
            resource="family_members"
            familyId={familyMember?.family_id}
          >
            <FamilyMemberImage
              fallbackText={
                familyMember?.full_name.charAt(0).toUpperCase() || "FM"
              }
              familyMemberId={familyMember?._id}
              imageUrl={familyMember?.profile_picture}
            />
          </WithFamilyAccess>
        </div>

        {/* Info */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex flex-col gap-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h5 className="capitalize text-base sm:text-lg break-words">
                {familyMember?.full_name}
              </h5>
            </div>

            {/* Description */}
            <p className="text-xs text-white/75 break-words">
              {familyMember?.about_me?.short_description || ""}
            </p>

            {/* Last updated */}
            {/* {familyMember?.updated_at && (
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground items-center">
                <Clock className="size-3.5" />
                <span>
                  Last updated{" "}
                  {
                    new Date(familyMember.updated_at)
                      .toISOString()
                      .split("T")[0]
                  }
                </span>
              </div>
            )} */}

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mt-1 text-xs">
              {/* Visibility */}
              <div className="flex items-center gap-1">
                {familyMember?.is_public ? (
                  <Eye className="size-3.5 text-muted-foreground" />
                ) : (
                  <EyeClosed className="size-3.5 text-muted-foreground" />
                )}
                <span>{familyMember?.is_public ? "Public" : "Private"}</span>
              </div>

              {/* Life Status */}
              <div className="flex items-center gap-1">
                {familyMember?.is_deceased ? (
                  <HeartCrack className="size-3.5 text-muted-foreground" />
                ) : (
                  <Heart className="size-3.5 text-muted-foreground" />
                )}
                <span>{familyMember?.is_deceased ? "Deceased" : "Living"}</span>
              </div>

              {/* Gender */}
              <div className="flex items-center gap-1">
                {familyMember?.sex === "male" ? (
                  <Mars className="size-3.5 text-muted-foreground" />
                ) : familyMember?.sex === "female" ? (
                  <Venus className="size-3.5 text-muted-foreground" />
                ) : (
                  <VenusAndMars className="size-3.5 text-muted-foreground" />
                )}
                <span className="capitalize">{familyMember?.sex}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FamilyMemberImage({
  fallbackText,
  familyMemberId,
  imageUrl,
}: {
  fallbackText: string;
  imageUrl?: string;
  familyMemberId?: Id<"family_members">;
}) {
  const [open, setOpen] = useState(false);
  const updateFamilyMember = useMutation(c_UpdatedFamilyMember);
  const removeProfilePicture = useMutation(c_RemoveFamilyMemberProfilePicture);

  async function onRemove() {
    if (!familyMemberId) {
      return;
    }
    const { error } = await tryCatch(
      removeProfilePicture({
        familyMemberId,
        eventType: "update_family_member",
      })
    );

    if (error) {
      toast("Failed to update family image");
    }
  }

  async function onUpload(val: string) {
    if (!familyMemberId) {
      return;
    }
    const { error } = await tryCatch(
      updateFamilyMember({
        data: {
          profile_picture: val,
        },
        id: familyMemberId,
        eventType: "update_family_member",
      })
    );

    if (error) {
      toast("Failed to update family image");
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="rounded-full hover:border bg-accent/50 hover:bg-accent transition-colors absolute -bottom-2 -right-2 p-2 z-10"
          onClick={() => setOpen(true)}
        >
          <Camera className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="min-w-[300px] w-[25%]">
        <DialogTitle>Family Image</DialogTitle>
        <DialogDescription className="text-xs text-muted-foreground text-center">
          Upload a profile picture for this family member.
        </DialogDescription>
        <ImageUploader
          imageUrl={imageUrl || "/placeholder.jpg"}
          onRemove={onRemove}
          onUpload={onUpload}
          alt="family-member"
          fallbackText={fallbackText}
          tableName="family-members"
          tableId={familyMemberId || "unknown-user"}
        />
      </DialogContent>
    </Dialog>
  );
}
