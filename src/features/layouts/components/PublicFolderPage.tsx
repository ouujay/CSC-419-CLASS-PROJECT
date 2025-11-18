"use client";
import Folder, { FamilyNode } from "@/components/layouts/Folder";
import { usePublicFamilyData } from "@/contexts/PublicFamilyContext";
import { useSearchParams } from "next/navigation";

function PublicFolderPage() {
  const focusMember = useSearchParams().get("focus_member");
  const { data } = usePublicFamilyData();
  const { familyDetails, familyMembers, relationships } = data;
  const selectedMember = familyMembers?.find(
    (member) => member._id === (focusMember || familyDetails?.root_member)
  );

  const family: FamilyNode[] = [
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
        {family.map((folder, index) => (
          <Folder
            node={folder}
            fam={family[index]}
            key={index}
            familyMembers={familyMembers}
            relationships={relationships}
          />
        ))}
      </ul>
    </div>
  );
}

export default PublicFolderPage;
