"use client";
import { FormSelect } from "@/components/osisi-ui/Selects/FormSelect";
import { maritalStatusOptions, parentageTypeOptions } from "@/utils/constants";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { c_GetSuggestedRelationships } from "@/fullstack/PublicConvexFunctions";
import { Id } from "@/convex/_generated/dataModel";
import { LoadingError } from "@/components/osisi-ui/Errors";
import { ConvexError } from "convex/values";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import {
  ExtendedRelationshipsType,
  ParentageType,
  PartnershipType,
} from "@/types";
import { CreateMemberType } from "@/convex/familyMembers/mutations";

type SuggestedRelationships = {
  is_suggested: boolean;
  relationship: ExtendedRelationshipsType;
  familyMembers: Id<"family_members">[];
};
type FamilyMemberNameType = {
  _id: Id<"family_members">;
  fullname: string;
};

type setRelationshipsType = (data: CreateMemberType["relationships"]) => void;
export default function SuggestedRelationships({
  familyId,
  familyMemberId,
  relationship,
  setRelationships,
}: {
  familyId: Id<"families">;
  familyMemberId: Id<"family_members">;
  relationship: ExtendedRelationshipsType;
  setRelationships: setRelationshipsType;
}) {
  const obj = {
    parents: "children",
    children: "parents",
    partners: "partners",
  } as const;
  const { data, isPending, isError, error } = useSafeQuery(
    c_GetSuggestedRelationships,
    {
      familyId,
      familyMemberId,
      relationship: relationship,
    }
  );

  if (isPending) {
    return <div className="font-sora">Loading suggested relationships...</div>;
  }

  if (isError) {
    const cError = error as ConvexError<string>;
    return <LoadingError message={cError.data} />;
  }

  if (!familyMemberId) {
    return <LoadingError message={"No family member found"} />;
  }

  return (
    <Rel
      data={[
        {
          is_suggested: false,
          relationship: obj[relationship],
          familyMembers: [familyMemberId],
        },
        ...data.suggestions,
      ]}
      familyMemberNames={data.familyMemberNames}
      setRelationships={setRelationships}
    />
  );
}
function Rel({
  data,
  familyMemberNames,
  setRelationships,
}: {
  data: SuggestedRelationships[];
  familyMemberNames: FamilyMemberNameType[];
  setRelationships: setRelationshipsType;
}) {
  const formattedRelationships = formatData(data);
  const [localRelationships, setLocalRelationships] = useState<
    typeof formattedRelationships
  >(formattedRelationships);

  function handleChange(
    index: number,
    subIndex: number,
    field: keyof (typeof formattedRelationships)[0]["familyMembers"][0],
    value: unknown
  ): void {
    const familyMembers = localRelationships[index].familyMembers;
    const updatedMember = { ...familyMembers[subIndex], [field]: value };
    const updatedFamilyMembers = familyMembers.map((member, i) =>
      i === subIndex ? updatedMember : member
    );
    const updatedRelationships = localRelationships.map((rel, i) =>
      i === index ? { ...rel, familyMembers: updatedFamilyMembers } : rel
    );
    setLocalRelationships(updatedRelationships);
  }

  useEffect(() => {
    const familyMembers = localRelationships.map(
      (relationship) => relationship.familyMembers
    );
    const flattenedFamilyMembers = familyMembers.flat();
    const filteredFamilyMembers = flattenedFamilyMembers.filter(
      (familyMember) => familyMember.isSelected
    );
    const newRelationships = filteredFamilyMembers.map((familyMember) => ({
      ...familyMember,
      isSelected: undefined,
    }));
    setRelationships(newRelationships);
  }, [localRelationships, setRelationships]);

  return (
    <div className="grid gap-4 sm:gap-6 w-full ">
      {localRelationships.map((relationshipType, index) =>
        relationshipType.familyMembers.length !== 0 ? (
          <div
            key={`${relationshipType.relationship}-${relationshipType.is_suggested}`}
            className="grid gap-3 sm:gap-4"
          >
            <h6 className="text-sm sm:text-base font-medium border-b pb-2 capitalize ">
              {relationshipType.is_suggested ? "Suggested" : ""}{" "}
              {relationshipType.relationship}
            </h6>

            <div className="grid gap-6">
              {relationshipType.familyMembers.map((familyMember, subIndex) => (
                <div
                  className=" grid sm:grid-cols-2  sm:items-center"
                  key={familyMember.id}
                >
                  {/* Family Member Selection */}
                  <div className="flex gap-2 items-start sm:items-center">
                    <Checkbox
                      name="select_family_member"
                      id={`select_family_member_${familyMember.id}`}
                      defaultChecked={true}
                      className="mt-0.5 sm:mt-0 flex-shrink-0"
                      onCheckedChange={(checked) => {
                        handleChange(index, subIndex, "isSelected", checked);
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <FamilyMemberName
                        familyMemberId={familyMember.id}
                        familyMembers={familyMemberNames}
                      />
                    </div>
                  </div>

                  {/* Form Select */}
                  <div className="w-full">
                    <FormSelect
                      name={`parentage_${familyMember.id}`}
                      label=""
                      required={false}
                      options={
                        relationshipType.relationship === "partners"
                          ? maritalStatusOptions
                          : parentageTypeOptions
                      }
                      value={
                        familyMember.parentage_type ||
                        familyMember.partnership_type ||
                        ""
                      }
                      placeholder={`Select ${relationshipType.relationship === "partners" ? "Status" : "Type"}`}
                      onChange={(value) =>
                        handleChange(
                          index,
                          subIndex,
                          relationshipType.relationship === "partners"
                            ? "partnership_type"
                            : "parentage_type",
                          value
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}

function FamilyMemberName({
  familyMemberId,
  familyMembers,
}: {
  familyMemberId?: Id<"family_members">;
  familyMembers: FamilyMemberNameType[];
}) {
  const familyMember = familyMembers?.find(
    (familyMember) => familyMember._id === familyMemberId
  );

  return <p>{familyMember?.fullname}</p>;
}

function formatData(data: SuggestedRelationships[]) {
  return data.map((d) => ({
    ...d,
    familyMembers: d.familyMembers.map((id) => ({
      parentage_type:
        d.relationship === "partners"
          ? undefined
          : ("biological" as ParentageType),
      partnership_type:
        d.relationship === "partners"
          ? ("Married" as PartnershipType)
          : undefined,
      id: id,
      relationship: d.relationship,
      isSelected: true,
    })),
  }));
}
