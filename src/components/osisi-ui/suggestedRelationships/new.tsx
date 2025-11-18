"use client";
import { FormSelect } from "@/components/osisi-ui/Selects/FormSelect";
import { maritalStatusOptions, parentageTypeOptions } from "@/utils/constants";
import { Id } from "@/convex/_generated/dataModel";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import {
  ExtendedRelationshipsType,
  ParentageType,
  PartnershipType,
} from "@/types";
import { CreateMemberType } from "@/convex/familyMembers/mutations";
import { suggestionsType } from "@/fullstack/types";

type SuggestedRelationships = {
  is_suggested: boolean;
  relationship: ExtendedRelationshipsType;
  familyMembers: Id<"family_members">[];
};
type FamilyMemberNameType = {
  id: Id<"family_members">;
  full_name: string;
};
type FormattedDataType = ReturnType<typeof formatData>;

export type setRelationshipsType = (
  data: CreateMemberType["relationships"]
) => void;

const obj = {
  parents: "children",
  children: "parents",
  partners: "partners",
} as const;
export default function SuggestedRelationships({
  familyMemberId,
  relationship,
  setRelationships,
  data,
}: {
  familyId: Id<"families">;
  familyMemberId: Id<"family_members">;
  relationship: ExtendedRelationshipsType;
  setRelationships: setRelationshipsType;
  data: suggestionsType;
}) {
  const [formattedData, setFormattedData] = useState<FormattedDataType>([]);

  useEffect(() => {
    const suggestions = data?.suggestions[relationship] || [];
    const combined = [
      {
        familyMembers: [familyMemberId],
        relationship: obj[relationship],
        is_suggested: false,
      },
      ...suggestions,
    ];
    const formattedRelationships = formatData(combined);
    setFormattedData(formattedRelationships);
  }, [relationship, familyMemberId, data]);

  return (
    <Rel
      data={formattedData}
      familyMemberNames={data?.familyMembers || []}
      setRelationships={setRelationships}
    />
  );
}
function Rel({
  data,
  familyMemberNames,
  setRelationships,
}: {
  data: FormattedDataType;
  familyMemberNames: FamilyMemberNameType[];
  setRelationships: setRelationshipsType;
}) {
  const [localRelationships, setLocalRelationships] = useState(data);

  function handleChange(
    index: number,
    subIndex: number,
    field: keyof FormattedDataType[number]["familyMembers"][number],
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

  useEffect(() => {
    setLocalRelationships(data); // <-- THIS ensures updates are synced
  }, [data]);

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
    (familyMember) => familyMember.id === familyMemberId
  );

  return <p>{familyMember?.full_name}</p>;
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
