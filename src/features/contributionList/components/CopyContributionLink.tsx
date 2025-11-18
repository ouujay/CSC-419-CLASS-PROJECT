"use client";
import { CopyWrapper } from "@/components/osisi-ui/CopyWrapper";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { Copy } from "lucide-react";
import React from "react";

export default function CopyContributionLink({
  contributionId,
}: {
  contributionId: Id<"family_contributions">;
}) {
  const rootUrl = window.location.origin;
  const shareLink = `${rootUrl}/add-family-member/${contributionId}`;
  return (
    <CopyWrapper textToCopy={shareLink}>
      <Button
        className=" "
        title="Copy Link"
        size="sm"
        variant="outline"
      >
        <Copy className="size-4" />
      </Button>
    </CopyWrapper>
  );
}
