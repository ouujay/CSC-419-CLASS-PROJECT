import Loader from "@/components/osisi-ui/skeleton/Loader";
import { Id } from "@/convex/_generated/dataModel";
import { c_GetContributionFamilyMembers } from "@/fullstack/PublicConvexFunctions";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { ConvexError } from "convex/values";
import Link from "next/link";
import { useParams } from "next/navigation";

export function FamilyMembersTable() {
  const { contribution_id } = useParams();
  const {
    data: members,
    isPending,
    isError,
    error,
  } = useSafeQuery(
    c_GetContributionFamilyMembers,
    contribution_id
      ? { contributionId: contribution_id as Id<"family_contributions"> }
      : "skip"
  );

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    const cError = error as ConvexError<string>;
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h4 className="mb-2">Error</h4>
          <p className="opacity-75">
            {cError?.data ||
              "An error occurred while loading the contribution details."}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-4">
      <h6 >Added Family Members</h6>
      <table className="font-sora w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2"></th>
          </tr>
        </thead>
        <tbody>
          {members?.map((member) => (
            <tr key={member.id} className="border-b hover:bg-muted/50">
              <td className="capitalize p-1 h-fit">{member.fullname}</td>
              <td className="capitalize p-1 h-fit w-0">
                <Link
                  href={`/add-family-member/${contribution_id}?member=${member.id}`}
                  className="hover:text-primary transition-colors p-2 w-full"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
          {members?.length === 0 && (
            <tr>
              <td className="p-4 text-center" colSpan={1}>
                No members have been added through this contribution yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
