"use client";
import Folder, { FamilyNode } from "@/components/layouts/Folder";
import { usePublicFamilyData } from "@/contexts/PublicFamilyContext";
import { useSearchParams } from "next/navigation";

function FolderPage() {
  const focusMember = useSearchParams().get("focus_member");
  const family = usePublicFamilyData()
  const familyData = family.data.familyDetails
  const familyMembers = family.data.familyMembers
  const relationships = family.data.relationships
  const selectedMember = familyMembers?.find(
    (member) => member._id === (focusMember || familyData?.root_member)
  );
  console.log("Selected Member:", selectedMember?.full_name);
  const familyFolder: FamilyNode[] = [
    {
      name: `${selectedMember?.full_name || ""}`,
      id: selectedMember?._id,
      type: "relationship",
      content: selectedMember || undefined,
      nodes: [
        {
          name: "Profile",
          content: selectedMember || undefined,
        },
      ],
    },
  ];

  return (
    <div className={`h-full w-full flex  overflow-x-auto sec-font text-base`}>
      <ul>
        {familyFolder.map((folder, index) => (
          <Folder
            node={folder}
            fam={familyFolder[index]}
            key={index}
            familyMembers={familyMembers || []}
            relationships={relationships || []}
          />
        ))}
      </ul>
    </div>
  );
}

export default FolderPage;
