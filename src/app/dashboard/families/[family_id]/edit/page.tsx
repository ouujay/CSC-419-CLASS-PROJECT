"use client";

import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/osisi-ui/inputs/input";
import FormSwitch from "@/components/osisi-ui/inputs/FormSwitch";
import {
  c_CheckFamilyMembersUsage,
  c_UpdateFamily,
} from "@/fullstack/PublicConvexFunctions";
import { tryCatch } from "@/utils/try-catch";
import { ConvexError } from "convex/values";
import EditRelationships from "./EditRelationships";
import DeleteFamilyDialog from "../components/DeleteFamilyDialog";
import WithFamilyAccess from "../../../../../components/access/WithAccess";
import EditFamilyFallback from "@/components/osisi-ui/PermissionFallbacks";
import { FormSelect } from "@/components/osisi-ui/Selects/FormSelect";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { formatFamilyMemberOptions } from "@/lib/formatters";
import ContributionList, { UsageBar } from "@/features/contributionList/list";
import { useFamilyData } from "@/contexts/DashboardFamilyContext";
import { useSafeQuery } from "@/hooks/useSafeQuery";

export default function EditFamilyPage() {
  const router = useRouter();
  const { data } = useFamilyData();
  const family = data.details;
  const familyMembers = data.members || [];
  const { data: usageData } = useSafeQuery(c_CheckFamilyMembersUsage, {
    familyId: family._id,
  });
  const updateFamily = useMutation(c_UpdateFamily);
  const [isLoading, setIsLoading] = React.useState(false);
  const familyMemberOptions = formatFamilyMemberOptions(familyMembers);
  const [formData, setFormData] = React.useState<Partial<Doc<"families">>>({
    name: "",
    description: "",
    is_public: false,
    root_member: "" as Id<"family_members">,
  });

  React.useEffect(() => {
    if (family) {
      setFormData({
        name: family.name,
        description: family.description || "",
        is_public: family.is_public,
        root_member: family.root_member,
      });
    }
  }, [family]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!family) {
      toast.error("Family not found");
      setIsLoading(false);
      return;
    }

    const { error } = await tryCatch<{ success: boolean }, ConvexError<string>>(
      updateFamily({
        data: formData,
        eventType: "update_family",
        id: family._id,
      })
    );

    if (error) {
      console.error(error);
      toast.error(error.data);
      setIsLoading(false);
      return;
    }

    toast.success("Family information updated successfully");
    setIsLoading(false);
    router.push(`/dashboard/families/${family._id}`);
  };

  if (!family) {
    return <div>Family not found</div>;
  }

  return (
    <WithFamilyAccess
      familyId={family._id}
      resource="families"
      action="update"
      fallback={<EditFamilyFallback />}
    >
      <div className="p-4 space-y-8 max-w-6xl mx-auto">
        {/* Header + Collaboration Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h5 className="">Family Information</h5>
          <section className="grid grid-cols-[auto_1fr] md:min-w-[400px] gap-2 place-content-center">
            <span>family members</span>
            <UsageBar
              current={Math.min(usageData?.current || 1, usageData?.max || 1)}
              max={usageData?.max || 1}
            />
          </section>
        </div>

        {/* Family Details Form */}
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                name="family_name"
                label="Family Name"
                required={false}
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter family name"
              />
              <FormInput
                name="description"
                label="Description"
                required={false}
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter family description"
              />
              <FormSelect
                name="root_family_member"
                label="Root Family Member"
                required={false}
                options={familyMemberOptions}
                value={formData.root_member || ""}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    root_member: value as Id<"family_members">,
                  }))
                }
                placeholder="Select Root Family Member"
              />

              <FormSwitch
                required={false}
                onCheckedChange={(value) =>
                  setFormData((prev) => ({ ...prev, is_public: value }))
                }
                checked={formData.is_public || false}
                name="is_family_public"
                id="is_family_public"
                label="Allow Public View"
              />

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <div id="contribution-links">
          <ContributionList />
        </div>
        <EditRelationships />

        {/* Danger Zone */}
        <WithFamilyAccess
          familyId={family?._id}
          resource="families"
          action="delete"
          fallback={<></>}
        >
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive text-base sm:text-lg">
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Once you delete a family, there is no going back. Please be
                  certain.
                </p>
                <div className="w-full sm:w-auto">
                  <DeleteFamilyDialog
                    selectedFamilies={family ? [family._id] : undefined}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </WithFamilyAccess>
      </div>
    </WithFamilyAccess>
  );
}
