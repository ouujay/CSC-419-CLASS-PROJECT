import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { getRelationshipPath } from "@/lib/RelationshipFinder";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { c_GetRelationshipsPathName } from "@/fullstack/PublicConvexFunctions";
import { GetRelationshipsPathName } from "@/fullstack/types";
import RelationshipPath from "@/components/layouts/RelationshipPath";
import { PathNode } from "@/components/Nodes/PathNode";

interface Props {
  relationships: Doc<"relationships">[];
  familyMembers: Doc<"family_members">[];
  sourceFamilyMember: Id<"family_members">;
  targetFamilyMember: Id<"family_members">;
}

export default function SeeRelationshipDialog({
  relationships,
  familyMembers,
  sourceFamilyMember,
  targetFamilyMember,
}: Props) {
  const [open, setOpen] = useState(false);
  const path = getRelationshipPath(relationships, sourceFamilyMember, targetFamilyMember);
  const { data } = useSafeQuery(c_GetRelationshipsPathName, path ? { path } : "skip");
  if (!data) {
    return <></>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 ">
          {getRelationshipName(data, familyMembers)}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[1000px] min-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 ">
            <AlertCircle className="size-4" />
            {`See How They're Linked`}
          </DialogTitle>
          <DialogDescription>{getRelationshipName(data, familyMembers)}.</DialogDescription>
        </DialogHeader>
        <PathPage path={data} familyMembers={familyMembers} />
        <DialogFooter className="gap-2 ">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getRelationshipName(
  relationshipName: GetRelationshipsPathName,
  familyMembers: Doc<"family_members">[]
) {
  const target = relationshipName[relationshipName.length - 1];
  const sourceId = relationshipName[0].familyMemberId;
  const targetId = target.familyMemberId;

  const sourceDetails = familyMembers.find((familyMember) => familyMember._id === sourceId);
  const targetDetails = familyMembers.find((familyMember) => familyMember._id === targetId);
  let sex: "default" | "female" | "male" = "default";

  if (targetDetails?.sex === "female") {
    sex = "female";
  }
  if (targetDetails?.sex === "male") {
    sex = "male";
  }

  if (sourceDetails && targetDetails) {
    return `${targetDetails?.full_name_s} is the ${target.relationship_name[sex]} of ${sourceDetails?.full_name_s}`;
  }

  return "";
}

export function PathPage({
  familyMembers,
  path,
}: {
  familyMembers: Doc<"family_members">[];
  path: GetRelationshipsPathName;
}) {
  const source = path[0].familyMemberId;

  const nodeTypes = {
    previewNode: PathNode,
  };

  return <RelationshipPath familyMembers={familyMembers} nodeTypes={nodeTypes} source={source} path={path} />;
}
