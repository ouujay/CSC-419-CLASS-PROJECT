"use client";
import React from "react";
import { Calendar, Users, Eye, EyeClosed, Camera } from "lucide-react";
import FamilyName from "@/components/osisi-ui/FamilyName";
import ImageUploader from "@/components/osisi-ui/ImageUploader";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useMutation } from "convex/react";
import {
  c_RemoveFamilyProfilePicture,
  c_UpdateFamily,
} from "@/fullstack/PublicConvexFunctions";
import { tryCatch } from "@/utils/try-catch";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { toast } from "sonner";
import { useFamilyData } from "@/contexts/DashboardFamilyContext";

export default function FamilyDetails() {
  const { data } = useFamilyData();
  const family = data.details;

  return (
    <section className="bg-card rounded-lg">
      <div className="flex flex-col sm:flex-row items-start gap-4 p-2 sm:p-6">
        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0 relative isolate">
          <figure className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0   overflow-hidden relative isolate">
            <Image
              src={family?.profile_picture || "/placeholder-family-tree-1.png"}
              alt={family?.name || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </figure>
          <FamilyImage
            fallbackText={family?.name.charAt(0).toUpperCase() || "OS"}
            familyId={family?._id}
            imageUrl={family?.profile_picture}
          />
        </div>

        {/* Content */}
        <div className="flex-1 w-full">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
            {/* Family Info */}
            <div className="flex flex-col gap-2">
              <h6 className="capitalize text-lg sm:text-xl">
                <FamilyName name={family?.name || ""} />
              </h6>
              <p className="text-sm text-white/75 max-w-md">
                {family?.description || ""}
              </p>

              {/* Stats - Responsive Layout */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
                {/* Updated Date */}
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs">
                    {family?.updated_at
                      ? new Date(family.updated_at).toISOString().split("T")[0]
                      : ""}
                  </p>
                </div>

                {/* Member Count */}
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs">
                    {family?.family_members_count}{" "}
                    {family?.family_members_count === 1 ? "Member" : "Members"}
                  </p>
                </div>

                {/* Privacy Status */}
                <div className="flex items-center gap-1.5">
                  {family?.is_public ? (
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <EyeClosed className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <p className="text-xs">
                    {family?.is_public ? "Public" : "Private"} Family
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FamilyImage({
  fallbackText,
  familyId,
  imageUrl,
}: {
  fallbackText: string;
  imageUrl?: string;
  familyId?: Id<"families">;
}) {
  const [open, setOpen] = useState(false);
  const updateFamily = useMutation(c_UpdateFamily);
  const removeProfilePicture = useMutation(c_RemoveFamilyProfilePicture);

  async function uploadFamilyProfilePicture(val: string) {
    if (!familyId) {
      return;
    }
    const { error } = await tryCatch(
      updateFamily({
        id: familyId,
        data: {
          profile_picture: val,
        },
        eventType: "update_family",
      })
    );

    if (error) {
      toast("Failed to update family image");
    }
  }

  async function removeFamilyProfilePicture() {
    if (!familyId) {
      return;
    }
    const { error } = await tryCatch(
      removeProfilePicture({
        familyId,
        eventType: "update_family",
      })
    );

    if (error) {
      toast.error("Failed to update family image");
    }
    toast.success("Family image removed successfully");
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="rounded-full hover:border bg-accent/50    hover:bg-accent transition-colors absolute -bottom-2 -right-2 p-2 z-10"
          onClick={() => setOpen(true)}
        >
          <Camera className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="min-w-[300px] w-[25%]">
        <DialogTitle>Family Image</DialogTitle>
        <DialogDescription className="text-xs text-muted-foreground text-center">
          Upload a profile picture for this family.
        </DialogDescription>
        <ImageUploader
          onRemove={removeFamilyProfilePicture}
          imageUrl={imageUrl || "/placeholder-family-tree-1.png"}
          onUpload={uploadFamilyProfilePicture}
          alt="family"
          tableName="families"
          tableId={familyId || "unknown-family"}
          fieldName="profile-picture"
          fallbackText={fallbackText}
        />
      </DialogContent>
    </Dialog>
  );
}
