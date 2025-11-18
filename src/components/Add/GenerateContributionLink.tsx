"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { ExtendedRelationshipsType } from "@/types";
import { Copy, ExternalLink, Link as Llink } from "lucide-react";
import { FormSelect } from "@/components/osisi-ui/Selects/FormSelect";
import {
  expirationOptions,
  extendedRelationshipOptions,
  maxUsageOptions,
} from "@/utils/constants";
import { useMutation } from "convex/react";
import {
  c_CheckContributionUsage,
  c_CreateContribution,
  c_GetFamilyMemberName,
  c_GetProfile,
} from "@/fullstack/PublicConvexFunctions";
import { tryCatch } from "@/utils/try-catch";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { Id } from "@/convex/_generated/dataModel";
import { addDays } from "@/utils/utils";
import { ConvexError } from "convex/values";
import Link from "next/link";

interface GenerateContributionLinkProps {
  familyMemberId: Id<"family_members">;
  familyId: Id<"families">;
}
export default function GenerateContributionLink({
  familyMemberId,
  familyId,
}: GenerateContributionLinkProps) {
  const { data } = useSafeQuery(c_GetFamilyMemberName, {
    id: familyMemberId,
  });
  const { data: usageData } = useSafeQuery(c_CheckContributionUsage, {
    familyId,
  });
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [expirationDuration, setExpirationDuration] = useState("1");
  const [maxUsage, setMaxUsage] = useState("1");
  const [relationship, setRelationship] = useState<
    ExtendedRelationshipsType | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { data: user } = useSafeQuery(c_GetProfile);
  const createContribution = useMutation(c_CreateContribution);

  const handleCopyLink = useCallback(() => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      toast("Link copied to clipboard", {
        description: "Share this link with your family members",
      });
    }
  }, [shareLink]);

  async function generateShareLink() {
    if (!user || !relationship) {
      return;
    }
    if (!relationship) return;

    setIsLoading(true);
    const { error, data: contributionId } = await tryCatch<
      Id<"family_contributions">,
      ConvexError<string>
    >(
      createContribution({
        created_by: user.user_id,
        family_id: familyId,
        expires_at: addDays(+expirationDuration),
        expiration_days: +expirationDuration,
        max_usage: +maxUsage,
        max_uses_reached: false,
        created_family_members: [],
        link_origin_family_member_id: familyMemberId,
        relationship_type: relationship,
        eventType: "create_family_contribution",
      })
    );

    if (error) {
      toast.error(error.data);
      setIsLoading(false);
      return;
    }

    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/add-family-member/${contributionId}`;
    setShareLink(shareUrl);
    setIsLoading(false);
  }

  const handleExpirationChange = (value: string) => {
    setExpirationDuration(value);
    setShareLink(null);
  };
  const handleMaxUsageChange = (value: string) => {
    setMaxUsage(value);
    setShareLink(null);
  };
  const handleRelChange = (value: string) => {
    setRelationship(value as ExtendedRelationshipsType);
    setShareLink(null);
  };

  if (!usageData?.isAllowed) {
    return <></>;
  }

  return (
    <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          Generate Contribution Link
          <Llink className="text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-full sm:max-w-xl overflow-y-auto max-h-[90vh] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle> Contribution Link</DialogTitle>
          <DialogDescription>
            Generate a secure link that allows trusted family members to
            contribute information to your family tree.
          </DialogDescription>
        </DialogHeader>

        <Link
          href={`/dashboard/families/${familyId}/edit#contribution-links`}
          className="text-sm text-primary text-right hover:underline"
        >
          View Contribution Links
        </Link>
        <p className=" text-sm border-b py-1">For {data || "Current Member"}</p>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1  gap-4">
            <FormSelect
              label="Relationship"
              value={relationship || ""}
              options={extendedRelationshipOptions}
              onChange={handleRelChange}
              name="rel"
              placeholder="Select Relationship"
              className="w-full"
            />
            <FormSelect
              label="How long should this link stay active?"
              value={expirationDuration}
              options={expirationOptions}
              onChange={handleExpirationChange}
              name="exp"
              className="w-full"
            />
            <FormSelect
              label="How many times can this link be used?"
              value={maxUsage}
              options={maxUsageOptions}
              onChange={handleMaxUsageChange}
              name="max_usage"
              className="w-full"
            />

            <Button
              onClick={generateShareLink}
              className="w-full h-[38px] sm:mt-auto"
              disabled={isLoading || !!shareLink}
            >
              {isLoading ? "Creating" : "Create Contribution Link"}
            </Button>
          </div>

          {shareLink && (
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Link
                className="text-xs break-all bg-background p-2 rounded border flex gap-2 w-full sm:w-auto justify-between"
                href={shareLink}
                target="_blank"
              >
                <span>Preview Link</span>
                <ExternalLink className="size-4" />
              </Link>
              <Button
                onClick={handleCopyLink}
                className="w-full sm:w-fit"
                disabled={!shareLink}
              >
                <Copy className="mr-2" /> Copy
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
