"use client";
import { ChevronRight, File, FolderClosed, FolderOpen } from "lucide-react";
import { useState } from "react";
import ProfileDetails from "../osisi-ui/profile/ProfileDetails";
import { Doc } from "@/convex/_generated/dataModel";
import { ExtendedRelationshipsType } from "@/types";
import { Button } from "../ui/button";
export type FamilyNode = {
  name: string;
  nodes?: FamilyNode[];
  id?: string;
  content?: Doc<"family_members">;
  type?: string;
};

export default function Folder({
  node,
  fam,
  familyMembers,
  relationships,
}: {
  node: FamilyNode;
  fam?: FamilyNode;
  familyMembers: Doc<"family_members">[]
  relationships: Doc<"relationships">[]
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [newNode, setNewNode] = useState<FamilyNode | undefined>(undefined);

  async function onOpenFolder() {
    if (!isOpen) {
      let family: FamilyNode;

      if (node.type === "relationship") {
        family = {
          name: node?.content?.full_name || "",
          id: node?.content?._id,
          nodes: [
            {
              name: "Profile",
              content: node.content,
            },
            {
              name: "Parents",
              id: node?.content?._id,
              type: "person",
              nodes: node?.content
                ? getProfile(
                    "parents",
                    node.content,
                    familyMembers || [],
                    relationships || []
                  )
                : [],
            },
            {
              name: "Children",
              id: node?.content?._id,
              type: "person",
              nodes: node?.content
                ? getProfile(
                    "children",
                    node.content,
                    familyMembers || [],
                    relationships || []
                  )
                : [],
            },
            {
              name: "Spouses",
              id: node?.content?._id,
              type: "person",
              nodes: node?.content
                ? getProfile(
                    "partners",
                    node.content,
                    familyMembers || [],
                    relationships || []
                  )
                : [],
            },
          ],
        };
        setNewNode(family);
      } else if (node.type === "person") {
        setNewNode(node);
      }
    }
    setIsOpen(!isOpen);
  }

  return (
    <li className="my-1.5" key={node.name}>
      <span className="flex items-center gap-1.5">
        {node?.nodes ? (
          <Button
            size="sm"
            variant={"ghost"}
            onClick={onOpenFolder}
          >
            <ChevronRight
              className={`size-4 ${
                isOpen ? "rotate-90" : "rotate-0"
              } duration-300`}
            />
            {isOpen ? (
              <FolderOpen className="size-4" />
            ) : (
              <FolderClosed className="size-4" />
            )}
            <span className="whitespace-nowrap">{node?.name}</span>
          </Button>
        ) : (
          <ProfileDetails details={node.content!}>
            <Button size="sm" variant={"ghost"}>
              <File className="size-4" />
              <span>Profile</span>
            </Button>
          </ProfileDetails>
        )}
      </span>

      {isOpen && (
        <ul className="pl-6">
          {newNode?.nodes?.map((folder, index) => (
            <Folder
              node={folder}
              key={index}
              fam={fam?.nodes?.[index]}
              familyMembers={familyMembers}
              relationships={relationships}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

type FamilyMembersType = Doc<"family_members">
function getProfile(
  relationshipName: ExtendedRelationshipsType,
  individual: FamilyMembersType,
  familyMembers: FamilyMembersType[],
  relationships: Doc<"relationships">[]
): FamilyNode[] {
  if (!relationships) return [];
  const members: FamilyMembersType["_id"][] = [];
  const referRelationship =
    relationships?.filter(
      (relationship) =>
        relationship.to === individual._id ||
        relationship.from === individual._id
    ) || [];
  for (const rel of referRelationship) {
    if ("parents" === relationshipName && rel.relationship === "parents") {
      members.push(rel.from);
    }

    if ("children" === relationshipName && rel.relationship === "parents") {
      members.push(rel.to);
    }

    if ("partners" === relationshipName && rel.relationship === "partners") {
      members.push(rel.to);
      members.push(rel.from);
    }
  }

  const filteredMembers = members.filter((member) => member !== individual._id);
  const membersData = filteredMembers.map((filteredMember) => {
    const profile = familyMembers.find(
      (member) => member._id === filteredMember
    );

    return {
      name: `${profile?.full_name || ""}`,
      id: profile?._id,
      type: "relationship",
      content: profile || undefined,
      nodes: [
        {
          name: "Profiles",
          content: profile || undefined,
        },
      ],
    };
  });

  return membersData;
}
