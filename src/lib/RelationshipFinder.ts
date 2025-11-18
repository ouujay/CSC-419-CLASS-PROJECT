import { Doc, Id } from "@/convex/_generated/dataModel";
import { ExtendedRelationshipsType } from "@/types";
type Points = {
  relationship: ExtendedRelationshipsType;
  familyMemberId: Id<"family_members">;
};
type Path = Record<
  Id<"family_members">,
  {
    id: Id<"family_members">;
    path: Points[];
  }
>;

export function getRelationshipPath(
  relationships: Doc<"relationships">[],
  sourceFamilyMember: Id<"family_members">,
  targetFamilyMember: Id<"family_members">
) {
  const MAX_DEPTH = 100;
  const sourceFinder = new RelativeFinder(relationships, [sourceFamilyMember]);
  const targetFinder = new RelativeFinder(relationships, [targetFamilyMember]);

  const sourcePath: Path = {};
  const targetPath: Path = {};

  sourcePath[sourceFamilyMember] = {
    id: sourceFamilyMember,
    path: [],
  };

  targetPath[targetFamilyMember] = {
    id: targetFamilyMember,
    path: [],
  };

  const sourceQueue = [sourceFamilyMember];
  const targetQueue = [targetFamilyMember];

  let currentDepth = 0;
  while (true) {
    if (currentDepth >= MAX_DEPTH) break;

    const sourceParents = findPath(sourceFinder, "parents", sourceQueue[0], sourcePath);
    const sourceChildren = findPath(sourceFinder, "children", sourceQueue[0], sourcePath);
    const sourcePartners = findPath(sourceFinder, "partners", sourceQueue[0], sourcePath);

    const sourceFamilyMembers = [...sourceParents, ...sourceChildren, ...sourcePartners];
    sourceQueue.shift();
    sourceQueue.push(...sourceFamilyMembers);
    const sourceCommonRelative = sourceFamilyMembers.find((rel) => targetPath[rel]);

    if (sourceCommonRelative) {
      const combinedPath = combinePath(
        sourceFamilyMember,
        targetFamilyMember,
        sourcePath[sourceCommonRelative]["path"],
        targetPath[sourceCommonRelative]["path"]
      );
      return combinedPath;
    }

    const targetParents = findPath(targetFinder, "parents", targetQueue[0], targetPath);
    const targetChildren = findPath(targetFinder, "children", targetQueue[0], targetPath);
    const targetPartners = findPath(targetFinder, "partners", targetQueue[0], targetPath);

    const targetFamilyMembers = [...targetParents, ...targetChildren, ...targetPartners];

    targetQueue.shift();
    targetQueue.push(...targetFamilyMembers);

    const targetCommonRelative = targetFamilyMembers.find((rel) => sourcePath[rel]);

    if (targetCommonRelative) {
      const combinedPath = combinePath(
        sourceFamilyMember,
        targetFamilyMember,
        sourcePath[targetCommonRelative]["path"],
        targetPath[targetCommonRelative]["path"]
      );

      return combinedPath;
    }

    currentDepth++;
  }
}

class RelativeFinder {
  relationships: Doc<"relationships">[];
  selectedFamilyMemberIds: Id<"family_members">[];
  seenFamilyMemberIds: Id<"family_members">[];
  relationshipTypesMap = {
    parents: ["parents", "to", null],
    children: ["parents", "from", null],
    partners: ["partners", "from", "to"],
  } as const;
  constructor(relationships: Doc<"relationships">[], familyMemberIds: Id<"family_members">[]) {
    this.relationships = relationships;
    this.selectedFamilyMemberIds = familyMemberIds;
    this.seenFamilyMemberIds = [...familyMemberIds];
  }

  find(relationshipType: ExtendedRelationshipsType, overWriteSelectedFamilyMemberIds?: Id<"family_members">[]) {
    let selectedFamilyMemberIds = overWriteSelectedFamilyMemberIds || this.selectedFamilyMemberIds;

    const [baseRelationshipType, direction1, direction2] = this.relationshipTypesMap[relationshipType];
    const selectedRelationships = this.relationships.filter(
      (relationship) =>
        (selectedFamilyMemberIds.includes(relationship[direction1]) ||
          (direction2 ? selectedFamilyMemberIds.includes(relationship[direction2]) : false)) &&
        relationship.relationship === baseRelationshipType
    );
    const froms = selectedRelationships.map((r) => r.from);
    const tos = selectedRelationships.map((r) => r.to);
    const fromsAndTos = [...froms, ...tos];
    selectedFamilyMemberIds = fromsAndTos.filter((id) => !this.seenFamilyMemberIds.includes(id));
    this.selectedFamilyMemberIds = selectedFamilyMemberIds;
    this.seenFamilyMemberIds.push(...selectedFamilyMemberIds);
    return selectedFamilyMemberIds;
  }
}

function findPath(
  finder: RelativeFinder,
  relationship: ExtendedRelationshipsType,
  currentFamilyMember: Id<"family_members">,
  paths: Path
) {
  const familyMembers = finder.find(relationship, [currentFamilyMember]);
  for (const familyMember of familyMembers) {
    const current = paths[currentFamilyMember];

    paths[familyMember] = {
      id: familyMember,
      path: [...current.path, { relationship, familyMemberId: familyMember }],
    };
  }

  return familyMembers;
}

function combinePath(
  source: Id<"family_members">,
  target: Id<"family_members">,
  sourcePath: Points[],
  targetPath: Points[]
) {
  const invertedTargetPath = invertTarget(targetPath, target);
  return [
    {
      relationship: null,
      familyMemberId: source,
    },
    ...sourcePath,
    ...invertedTargetPath,
  ];
}

function invertTarget(path: Points[], target: Id<"family_members">) {
  if(path.length === 0)return []
  
  const invertObj: Record<ExtendedRelationshipsType, ExtendedRelationshipsType> = {
    parents: "children",
    children: "parents",
    partners: "partners",
  };
  path.reverse();
  const invertedPath = path.map((p) => ({
    relationship: invertObj[p.relationship],
    familyMemberId: p.familyMemberId,
  }));
  const len = invertedPath.length;
  
  for (let i = 0; i < len - 1; i++) {
    invertedPath[i]["familyMemberId"] = invertedPath[i + 1].familyMemberId;
  }
  invertedPath[len - 1]["familyMemberId"] = target;
  return invertedPath;
}
