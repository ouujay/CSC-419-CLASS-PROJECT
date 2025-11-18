import { Doc, Id } from "@/convex/_generated/dataModel";
import { Edge } from "@xyflow/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isFieldRequired<TSchema extends z.ZodObject<z.ZodRawShape>>(
  schema: TSchema,
  fieldName: keyof z.infer<TSchema>
): boolean {
  try {
    schema.parse({ [fieldName]: undefined });
    return false;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.errors.find(
        (e) => e.path.length === 1 && e.path[0] === fieldName
      );
      if (
        fieldError &&
        fieldError.code === "invalid_type" &&
        fieldError.received === "undefined"
      ) {
        return true;
      }
    }
    return false;
  }
}

export function getDaysLeft(expiryTimestamp: number): number {
  const now = Date.now();
  const msInDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.ceil((expiryTimestamp - now) / msInDay);
  return daysLeft < 0 ? 0 : daysLeft;
}



type FamilyMember = Doc<"family_members">;

type Relationship = Doc<"relationships">;

type Input = {
  rootMember: FamilyMember["_id"] | undefined;
  members: FamilyMember[];
  relationships: Relationship[];
};

export type MemberWithGeneration = FamilyMember & {
  generation: number;
};

type GenerationDetailMap = {
  [id: string]: MemberWithGeneration;
};

export function computeGenerations(input: Input) {
  const { rootMember, members, relationships } = input;
  if (!rootMember) return [];
  const memberMap = Object.fromEntries(members.map((m) => [m._id, m]));
  const childToParents: Record<string, string[]> = {};
  const parentToChildren: Record<string, string[]> = {};
  const partnerLinks: Record<string, string[]> = {};

  for (const rel of relationships) {
    const { from, to, relationship } = rel;

    if (relationship === "parents") {
      if (!parentToChildren[from]) parentToChildren[from] = [];
      parentToChildren[from].push(to);

      if (!childToParents[to]) childToParents[to] = [];
      childToParents[to].push(from);
    }

    if (relationship === "partners") {
      if (!partnerLinks[from]) partnerLinks[from] = [];
      if (!partnerLinks[to]) partnerLinks[to] = [];
      partnerLinks[from].push(to);
      partnerLinks[to].push(from);
    }
  }

  const generations: GenerationDetailMap = {};
  const visited = new Set<string>();
  const queue: Array<{ id: string; generation: number }> = [
    { id: rootMember, generation: 0 },
  ];

  while (queue.length > 0) {
    const { id, generation } = queue.shift()!;
    if (visited.has(id)) continue;

    visited.add(id);
    const member = memberMap[id];
    if (member) {
      generations[id] = { ...member, generation };
    }

    const parents = childToParents[id] || [];
    for (const parentId of parents) {
      if (!visited.has(parentId)) {
        queue.push({ id: parentId, generation: generation - 1 });
      }
    }

    const children = parentToChildren[id] || [];
    for (const childId of children) {
      if (!visited.has(childId)) {
        queue.push({ id: childId, generation: generation + 1 });
      }
    }

    const partners = partnerLinks[id] || [];
    for (const partnerId of partners) {
      if (!visited.has(partnerId)) {
        queue.push({ id: partnerId, generation });
      }
    }
  }

  return Object.values(generations);
}
type FlowNode = {
  id: string;
  type: string;
  data: MemberWithGeneration;
};
export function generatePositionedNodes(rawNodes: FlowNode[]) {
  const generationYGap = 250;
  const siblingXGap = 400;
  const padding = 50;
  const levels: Record<number, FlowNode[]> = {};

  // Group nodes by generation
  rawNodes.forEach((node) => {
    const { generation } = node.data;
    if (!levels[generation]) levels[generation] = [];
    levels[generation].push(node);
  });

  // Assign positions based on generation (Y) and index in generation (X)
  return Object.entries(levels).flatMap(([generation, nodesInGen]) => {
    return nodesInGen.map((node, i) => ({
      ...node,
      position: {
        x: i * siblingXGap + padding,
        y: parseInt(generation) * generationYGap + padding,
      },
    }));
  });
}

export function generateEdges(relationships: Relationship[]) {
  const Edges: Edge[] = relationships.map((relationship) => ({
    id: relationship._id,
    source: relationship.from,
    target: relationship.to,
    type: "smoothstep",
    sourceHandle: `${relationship.relationship}-from`,
    targetHandle: `${relationship.relationship}-to`,
  }));
  return Edges;
}



export function addDays(days: number) {
  const now = new Date();

  if (isNaN(days)) {
    return now.getTime();
  }

  now.setDate(now.getDate() + days);
  return now.getTime();
}

export function generateCenteredPositions(
  centerXPosition: number,
  itemCount: number,
  spacingOffset: number
) {
  if (itemCount === 0) return [];
  if (itemCount === 1) return [centerXPosition];

  const positions = [];
  const totalWidth = (itemCount - 1) * spacingOffset;
  const startPosition = centerXPosition - totalWidth / 2;

  for (let i = 0; i < itemCount; i++) {
    const position = startPosition + i * spacingOffset;
    positions.push(position);
  }
  return positions;
}

export type FamilyMemberMetaData = {
  spousePosition: {
    x: number;
    y: number;
  };
  memberPosition: {
    x: number;
    y: number;
  };
  nextChildPosition: {
    x: number;
    y: number;
  };
};

export class FamilyNode {
  metaData: FamilyMemberMetaData;
  profile: MemberWithGeneration;
  children: FamilyNode[];
  spouses: FamilyNode[];
  parents: FamilyNode[];
  xSpacing: number;
  ySpacing: number;

  constructor(
    memberProfile: MemberWithGeneration,
    position?: FamilyMemberMetaData["nextChildPosition"]
  ) {
    this.xSpacing = 300;
    this.ySpacing = 300;
    const initialPosition = {
      x: 0,
      y: memberProfile.generation * this.ySpacing,
    };
    this.profile = memberProfile;
    this.children = [];
    this.spouses = [];
    this.parents = [];
    this.metaData = {
      spousePosition: position
        ? {
            ...position,
            y: position.y + this.ySpacing,
          }
        : {
            ...initialPosition,
            y: initialPosition.y + this.ySpacing,
          },
      nextChildPosition: {
        x: position?.x || 0,
        y: (memberProfile.generation + 1) * this.ySpacing,
      },
      memberPosition: position || { ...initialPosition },
    };
  }

  addChildren(childNodes: FamilyNode[]) {
    this.children.push(...childNodes);
  }

  addSpouses(spouseNodes: FamilyNode[]) {
    this.spouses.push(...spouseNodes);
  }

  addParents(parentNodes: FamilyNode[]) {
    this.parents.push(...parentNodes);
  }
  addPosition(position: FamilyMemberMetaData["memberPosition"]) {
    this.metaData.memberPosition = position;
  }

  calculateSpousePosition() {
    const childrenSpouses = [
      // ...this.children.map((child) => child.spouses).flat(),
      ...this.children,
    ];
    if (childrenSpouses.length === 0) return null;

    childrenSpouses.sort(
      (a, b) => b.metaData.memberPosition.x - a.metaData.memberPosition.x
    );
    const maxX = childrenSpouses[0].metaData.memberPosition.x;
    const minX =
      childrenSpouses[childrenSpouses.length - 1].metaData.memberPosition.x;

    this.metaData.spousePosition = {
      x: (maxX + minX) / 2,
      y: this.metaData.memberPosition.y + this.ySpacing / 2,
    };

    for (const spouse of this.spouses) {
      spouse.metaData.spousePosition = {
        x: (maxX + minX) / 2,
        y: this.metaData.memberPosition.y + this.ySpacing / 2,
      };
    }
  }
  calculateChildlessSpousePosition() {
    const childrenSpouses = [...this.spouses, this];
    if (childrenSpouses.length === 0) return null;

    childrenSpouses.sort(
      (a, b) => b.metaData.memberPosition.x - a.metaData.memberPosition.x
    );
    const maxX = childrenSpouses[0].metaData.memberPosition.x;
    const minX =
      childrenSpouses[childrenSpouses.length - 1].metaData.memberPosition.x;

    this.metaData.spousePosition = {
      x: (maxX + minX) / 2,
      y: this.metaData.memberPosition.y + this.ySpacing / 2,
    };

    for (const spouse of this.spouses) {
      spouse.metaData.spousePosition = {
        x: (maxX + minX) / 2,
        y: this.metaData.memberPosition.y + this.ySpacing / 2,
      };
    }
  }

  calculateChildPosition() {
    const childrenSpouses = [
      ...this.children.map((child) => child.spouses).flat(),
      ...this.children,
    ];
    if (childrenSpouses.length === 0) return;
    childrenSpouses.sort(
      (a, b) => b.metaData.nextChildPosition.x - a.metaData.nextChildPosition.x
    );
    const x = childrenSpouses[0].metaData.nextChildPosition.x;
    this.metaData.nextChildPosition = {
      x: x + this.xSpacing,
      y: (this.profile.generation + 1) * this.ySpacing,
    };
  }

  calculateExtremePosition() {
    const position = this.metaData.nextChildPosition;
    this.metaData.nextChildPosition = {
      x: position.x - this.xSpacing,
      y: position.y,
    };
  }

  calculateMemberPosition() {
    const spouses = [this]; //[...this.spouses, this];
    if (spouses.length === 0) return null;

    const positions = generateCenteredPositions(
      this.metaData.spousePosition.x,
      spouses.length,
      this.xSpacing
    );

    for (let i = 0; i < spouses.length; i++) {
      const spouse = spouses[i];
      spouse.addPosition({
        x: positions[i],
        y: this.profile.generation * this.ySpacing,
      });
    }
  }
}

export function buildFamilyTreeStructure(
  allMembers: MemberWithGeneration[],
  parentNode: FamilyNode | null,
  currentGenerationMemberId: Id<"family_members">,
  familyRelationships: Doc<"relationships">[]
) {
  const memberProfile = allMembers.find(
    (member) => currentGenerationMemberId === member._id
  );
  if (!memberProfile) return;
  const currentNode = new FamilyNode(
    memberProfile,
    parentNode?.metaData.nextChildPosition
  );

  const spouseNodes = getSpouseNodes(
    allMembers,
    familyRelationships,
    currentGenerationMemberId,
    currentNode
  );

  if (parentNode) {
    currentNode.addSpouses(spouseNodes);
    currentNode.addParents([parentNode]);
    parentNode.addChildren([currentNode]);
  }

  const parentChildRelationships = familyRelationships.filter(
    (relationship) =>
      relationship.from === currentGenerationMemberId &&
      relationship.relationship === "parents"
  );
  const childrenIds = parentChildRelationships.map(
    (relationship) => relationship.to
  );

  if (childrenIds.length === 0) {
    currentNode.calculateChildlessSpousePosition();
    return;
  }

  for (const id of childrenIds) {
    buildFamilyTreeStructure(allMembers, currentNode, id, familyRelationships);
    currentNode.calculateChildPosition();
  }
  currentNode.calculateExtremePosition();
  currentNode.calculateSpousePosition();
  currentNode.calculateMemberPosition();

  return currentNode;
}

function getSpouseNodes(
  allMembers: MemberWithGeneration[],
  familyRelationships: Doc<"relationships">[],
  memberId: Id<"family_members">,
  currentNode: FamilyNode
) {
  const spouseRelationships = familyRelationships.filter(
    (relationship) =>
      (relationship.from === memberId || relationship.to === memberId) &&
      relationship.relationship === "partners"
  );

  const spouseFromId = spouseRelationships
    .map((relationship) => relationship.from)
    .filter((val) => val !== memberId);
  const spouseToId = spouseRelationships
    .map((relationship) => relationship.to)
    .filter((val) => val !== memberId);
  const spouseIds = [...spouseFromId, ...spouseToId];
  const spouseNodes: FamilyNode[] = [];
  for (let i = 0; i < spouseIds.length; i++) {
    const id = spouseIds[i];
    const memberProfile = allMembers.find((member) => id === member._id);
    if (!memberProfile) continue;
    const position = {
      x: (i + 1) * 600 + currentNode.metaData.memberPosition.x,
      y: currentNode.metaData.memberPosition.y,
    };
    const spouseNode = new FamilyNode(memberProfile, position);
    spouseNode.addSpouses([currentNode]);
    spouseNodes.push(spouseNode);
  }
  return spouseNodes;
}
type familyMemberNodeType = {
  position: {
    x: number;
    y: number;
  };
  id: Id<"family_members">;
  type: "familyNode";
  data: MemberWithGeneration;
};

type SpouseNodeType = {
  position: {
    x: number;
    y: number;
  };
  id: string;
  type: "spouseNode";
  data: {
    name: string;
  };
};
type NodeType = familyMemberNodeType | SpouseNodeType;
export function ExtractNodes(rootNode: FamilyNode, nodes: NodeType[] = []) {
  if (isInNodes(rootNode, nodes)) {
    return nodes;
  }
  nodes.push({
    position: rootNode.metaData.memberPosition,
    id: rootNode.profile._id,
    type: "familyNode",
    data: rootNode.profile,
  });
  nodes.push({
    position: rootNode.metaData.spousePosition,
    id: rootNode.profile._id + "spouse",
    type: "spouseNode",
    data: {
      name: "spouse",
    },
  });

  for (const child of rootNode.children) {
    ExtractNodes(child, nodes);
  }

  for (const spouse of rootNode.spouses) {
    ExtractNodes(spouse, nodes);
  }

  return nodes;
}

function isInNodes(rootNode: FamilyNode, nodes: NodeType[]) {
  const node = nodes.find((node) => node.id === rootNode.profile._id);
  if (!node) return false;
  return true;
}


  export const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  };