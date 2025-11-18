"use client";
import { useFamilyData } from "@/contexts/DashboardFamilyContext";
import Folder, {
  FamilyNode,
} from "../../../../../../components/layouts/Folder";
import { useSearchParams } from "next/navigation";

function FolderPage() {
  const { data } = useFamilyData();
  const focusMember = useSearchParams().get("focus_member");
  const familyData = data.details;
  const familyMembers = data.members;
  const relationships = data.relationships;

  const selectedMember = familyMembers?.find(
    (member) => member._id === (focusMember || familyData?.root_member)
  );
  console.log("Selected Member:", selectedMember?.full_name);
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
            familyMembers={familyMembers || []}
            relationships={relationships || []}
          />
        ))}
      </ul>
    </div>
  );
}

export default FolderPage;
