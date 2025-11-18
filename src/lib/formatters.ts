import { OptionsType } from "@/components/osisi-ui/Selects/FormSelect";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { dateFormat } from "@/convex/tables";
import { z } from "zod";

export function formatFamilyMemberOptions(
  familyMembers: Doc<"family_members">[] | null
): OptionsType[] {
  if (!familyMembers) return [];
  return familyMembers.map((member) => ({
    id: member._id,
    label: member.full_name || "",
    value: member._id,
  }));
}

export function formatCollaborators(
  collaborators?: Doc<"family_collaborators">[]
) {
  if (!collaborators) return [];

  const options = collaborators.map((collaborator) => ({
    label: collaborator.email,
    value: collaborator.user_id || null,
    id: collaborator._id,
  }));

  const filtered = options.filter(
    (
      option
    ): option is {
      label: string;
      value: Id<"users">;
      id: Id<"family_collaborators">;
    } => option.value !== null
  );

  return filtered;
}

export function membersToOptions(
  members: Doc<"family_members">[] | null
): OptionsType[] {
  if (!members) return [];
  return members.map((member, index) => ({
    id: index + 1,
    label: `${member.full_name || ""}`,
    value: member._id,
  }));
}

export const formatDateLabel = (dateType: string) => {
  return dateType.charAt(0).toUpperCase() + dateType.slice(1).replace("_", " ");
};

type DateObject = z.infer<typeof dateFormat>;
export const formatDateObject = (dateObject: DateObject) => {
  if (!dateObject) return null;
  const day = dateObject.day ? String(dateObject.day).padStart(2, "0") : "??";
  const month = dateObject.month
    ? String(dateObject.month).padStart(2, "0")
    : "??";
  const year = dateObject.year || "????";
  const dateString = `${day}/${month}/${year}`;
  const timestamp = new Date(dateString).getTime();

  return formatDate(timestamp);
};

export const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};


 export const formatTimeRemaining = (expiresAt: number) => {
    const now = Date.now();
    const timeLeft = expiresAt - now;

    if (timeLeft <= 0) {
      return { text: "Expired", color: "text-red-600", expired: true };
    }

    const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));

    if (days > 0) {
      return {
        text: `${days}d`,
        color:
          days <= 1
            ? "text-destructive"
            : days <= 3
              ? "text-yellow-500"
              : "text-primary",
        expired: false,
      };
    } else {
      const hours = Math.floor(timeLeft / (60 * 60 * 1000));
      return {
        text: `${hours}h`,
        color: "text-red-600",
        expired: false,
      };
    }
  };