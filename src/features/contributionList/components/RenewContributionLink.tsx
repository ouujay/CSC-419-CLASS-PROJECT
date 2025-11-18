import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, ExternalLink, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { c_RenewContribution } from "@/fullstack/PublicConvexFunctions";
import { tryCatch } from "@/utils/try-catch";
import { toast } from "sonner";
import { CopyWrapper } from "@/components/osisi-ui/CopyWrapper";
import Link from "next/link";

export default function RenewContribution({
  contributionId,
}: {
  contributionId: Id<"family_contributions">;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [shareLink, setShareLink] = React.useState<string | null>(null);
  const renewContribution = useMutation(c_RenewContribution);

  const handleRenew = async () => {
    setLoading(true);
    // Logic to renew the contribution link
    // This could involve calling a mutation to update the contribution link in the database
    // For now, we will just log the action
    const { data, error } = await tryCatch(
      renewContribution({
        contributionId,
        eventType: "create_family_contribution",
      })
    );

    if (error) {
      toast.error("Failed to renew contribution link");
      console.error("Error renewing contribution link:", error);
      return;
    }
    if (data) {
      setShareLink(data);
      toast.success("Contribution link renewed successfully");
    } else {
      toast.error("No data returned from renewal");
    }
    setLoading(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <RefreshCcw className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] md:w-[70%] lg:w-[50%] max-w-[600px] px-2 sm:p-6">
        <DialogHeader>
          <DialogTitle>Renew Link</DialogTitle>
          <DialogDescription>
            Renewing the contribution link will create a new link for this
            contribution. The old link will no longer be valid.
          </DialogDescription>
        </DialogHeader>

        <Button onClick={handleRenew} disabled={loading}>
          <RefreshCcw className="size-4" />
          Renew Contribution Link
        </Button>
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
            <CopyWrapper textToCopy={shareLink}>
              <Button className="w-full sm:w-fit">
                <Copy className="mr-2" /> Copy
              </Button>
            </CopyWrapper>
          </div>
        )}
        <DialogClose>Close</DialogClose>
      </DialogContent>
    </Dialog>
  );
}
