"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Clock, Eye, EyeClosed, Users, UserSearch } from "lucide-react";
import { SearchFamilies } from "./components/SearchFamilies";
import FormInput from "@/components/osisi-ui/inputs/input";
import { useMutation } from "convex/react";
import { useState } from "react";
import {
  c_CheckFamilyUsage,
  c_ExtendFamily,
  c_GetFamilyAccessDetails,
  c_RequestExtendFamily,
} from "@/fullstack/PublicConvexFunctions";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { tryCatch } from "@/utils/try-catch";
import { ConvexError } from "convex/values";
import { redirect } from "next/navigation";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import FamilyName from "@/components/osisi-ui/FamilyName";
import { DashboardCard } from "../dashboard/components/ViewFamilies";

export default function ExtendFamily() {
  const [isLoading, setIsLoading] = useState(false);
  const [familyName, setFamilyName] = useState<string | undefined>(undefined);
  const [sourceFamilyId, setSourceFamilyId] = useState<
    Id<"families"> | undefined
  >(undefined);
  const { data } = useSafeQuery(
    c_GetFamilyAccessDetails,
    sourceFamilyId ? { familyId: sourceFamilyId } : "skip"
  );
  const extendFamily = useMutation(c_ExtendFamily);
  const requestExtendFamily = useMutation(c_RequestExtendFamily);
  const { data: usageData } = useSafeQuery(c_CheckFamilyUsage);

  const handleSelectFamily = (id: Id<"families">) => {
    setSourceFamilyId(id);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!sourceFamilyId) {
      toast.error("Select a family to start from");
      console.error("No Family Selected");
      setIsLoading(false);
      return;
    }

    if (!familyName) {
      toast.error("Family name required");
      console.error("Family name required");
      setIsLoading(false);
      return;
    }

    const { error, data } = await tryCatch<Id<"families">, ConvexError<string>>(
      extendFamily({
        familyName,
        familyId: sourceFamilyId,
        eventType: "create_family",
      })
    );

    if (error) {
      toast("Failed to create family", {
        description: error.data,
      });
      console.error(error);
      setIsLoading(false);
      return;
    }

    toast("Family has been created");
    setIsLoading(false);
    redirect(`/dashboard/families/${data}/layouts`);
  };
  const requestAccess = async () => {
    setIsLoading(true);

    if (!sourceFamilyId) {
      toast.error("Select a family to start from");
      console.error("No Family Selected");
      setIsLoading(false);
      return;
    }

    if (!familyName) {
      toast.error("Family name required");
      console.error("Family name required");
      setIsLoading(false);
      return;
    }

    const { error, data } = await tryCatch<Id<"families">, ConvexError<string>>(
      requestExtendFamily({
        familyName,
        familyId: sourceFamilyId,
        eventType: "create_family",
      })
    );

    if (error) {
      toast("Failed to request access to family", {
        description: error.data,
      });
      console.error(error);
      setIsLoading(false);
      return;
    }

    toast("Family has been created");
    setIsLoading(false);
    redirect(`/dashboard/families/${data}`);
  };
  return (
    <Dialog>
      <DialogTrigger>
        <DashboardCard
          icon={<UserSearch className="size-4" />}
          title={"Build on existing families"}
          subtitle={
            "Copy an existing family as a starting point. Your changes create a new, separate family."
          }
          isDisabled={!usageData?.isAllowed}
          limitMessage={
            !usageData?.isAllowed
              ? `You've reached your limit of ${usageData?.max} families`
              : undefined
          }
        />
      </DialogTrigger>
      <DialogContent className="md:w-[50%] max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className=" ">
          <DialogTitle>Build on an Existing Family</DialogTitle>

          <DialogDescription>
            Use an existing family as the foundation for a new one. The original
            members and relationships are included, but anything you add or
            change belongs only to your new family.
          </DialogDescription>
        </DialogHeader>
        <section className="flex flex-col gap-6 mt-4">
          <SearchFamilies onClick={handleSelectFamily} />
          <section>
            <h6 className="text-primary text-sm sm:text-base font-medium mb-2">
              Preview: <span className="italic">The {familyName} Family</span>
            </h6>
            <FormInput
              name="family_name"
              label="New Family Name"
              type="text"
              value={familyName || ""}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="New Family Name Here"
              maxLength={100}
              showCharacterCount={true}
            />
          </section>

          <div
            className={`flex flex-col ${data ? "border-primary border-2 rounded p-2" : ""}`}
          >
            <h6 className="capitalize text-lg sm:text-xl">
              <FamilyName name={data?.name || "Select a Family"} />
            </h6>
            {data?.description && (
              <p className="text-sm text-white/75 max-w-md">
                {data?.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-xs">
                  {data?.updated_at
                    ? new Date(data.updated_at).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0]}
                </p>
              </div>

              {/* Member Count */}
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-xs">
                  {data?.family_members_count}
                  {""}
                  {data?.family_members_count === 1 ? "Member" : "Members"}
                </p>
              </div>

              {/* Privacy Status */}
              <div className="flex items-center gap-1.5">
                {data?.is_public ? (
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <EyeClosed className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <p className="text-xs">
                  {data?.is_public ? "Public" : "Private"} Family
                </p>
              </div>
            </div>
            {data?.canAccess ? (
              <Button
                type="submit"
                className="mt-2 rounded w-full sm:w-auto"
                disabled={isLoading || !sourceFamilyId || !familyName}
                onClick={handleSubmit}
              >
                Build on This Family
              </Button>
            ) : (
              <Button
                type="submit"
                className="mt-2 rounded w-full sm:w-auto"
                disabled={isLoading || !sourceFamilyId || !familyName}
                onClick={requestAccess}
              >
                Request Access
              </Button>
            )}
          </div>

          <Button
            type="submit"
            variant={"destructive"}
            className="ml-auto rounded w-fit "
            onClick={() => {
              setSourceFamilyId(undefined);
              setFamilyName(undefined);
            }}
            size={"sm"}
          >
            Clear
          </Button>
        </section>
      </DialogContent>
    </Dialog>
  );
}
