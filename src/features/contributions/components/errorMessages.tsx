import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";

export function MaximumUsageMessage({
  contribution_id,
}: {
  contribution_id: Id<"family_contributions">;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center grid gap-4">
        <h4 className=" mb-2"></h4>
        <p className="opacity-75">
          This contribution link has reached its maximum allowed uses.
        </p>
        <Link
          href={`/add-family-member/${contribution_id}/submitted`}
          className="text-primary underline "
        >
          View Other Contributions
        </Link>
      </div>
    </div>
  );
}

export function CreateFamilyPrompt() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center grid gap-4">
        <h4 className="mb-2">Join Osisi and Start Your Own Family Group</h4>
        <p className="opacity-75">
          It looks like you&apos;re not yet part of a family group on Osisi.
          Sign up to create your own family and start contributing together!
        </p>
        <Link href="/account/auth" className="text-primary underline">
          Get Started
        </Link>
      </div>
    </div>
  );
}
