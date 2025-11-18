import FamilyName from "@/components/osisi-ui/FamilyName";
import React from "react";
import { Clock, Users } from "lucide-react";
import { getDaysLeft } from "@/utils/utils";
import Link from "next/link";
import { ContributionDetailsType } from "@/fullstack/types";

export default function FormHeader({
  data,
}: {
  data: ContributionDetailsType;
}) {
  const daysLeft = getDaysLeft(data?.expires_at || 0);

  return (
    <div className="flex justify-between items-center border-b py-2 px-4 mb-4 w-full">
      <div>
        <h5 className=" capitalize">
          <FamilyName name={data.family.name} />
        </h5>
        <div className="mt-2 text-xs sm:text-sm space-y-1">
          <p>
            <span>Invited by:</span>{" "}
            <span className="capitalize text-secondary font-normal">
              {data.user.username}
            </span>
          </p>
          <p>
            Relationship:{" "}
            <span className=" capitalize text-secondary font-normal">
              {data.relationship_type} of {data.originFamilyMember.full_name}
            </span>
          </p>
          {data.family.is_public ? (
            <Link
              href={`/families/${data.family._id}`}
              className="text-primary py-8 underline "
            >
              View Public Family Tree
            </Link>
          ) : (
            <></>
          )}
          <div className="flex  gap-2 mt-4">
            <p className="flex gap-1 items-center">
              <Clock className="size-3 text-primary" />
              <span>{daysLeft} days Left</span>
            </p>
            <p className="flex gap-1 items-center">
              <Users className="size-3 text-primary" />
              <span>
                {data.created_family_members.length} out of {data.max_usage}{" "}
                members added
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
