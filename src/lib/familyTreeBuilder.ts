import { Doc, Id } from "@/convex/_generated/dataModel";
import { Edge } from "@xyflow/react";
// import { MemberWithGeneration } from "./utils";

type FamilyMemberType = Doc<"family_members">;
type RelationshipTypes = Doc<"relationships">;

type MemberWithGeneration = FamilyMemberType & {
  generation: number;
};
type groupedGenerations = Record<number, MemberWithGeneration[]>;

type GenerationDetailMap = {
  [id: string]: MemberWithGeneration;
};

type positionType = {
  x: number;
  y: number;
};
export type FamilyTreeBuilderParams = {
  focusFamilyMemberId: Id<"family_members">;
  allFamilyMembers: FamilyMemberType[];
  familyRelationships: RelationshipTypes[];
  gap?: positionType;
  width?: number;
  height?: number;
};

// type FlowNode = {
//   id: string;
//   type: string;
//   data: MemberWithGeneration;
// };

type familyMemberNodeType = {
  position: {
    x: number;
    y: number;
  };
  id: Id<"family_members">;
  type: "familyNode" | "previewNode";
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

export function familyTreeBuilder(
  familyTreeBuilderParams: FamilyTreeBuilderParams
) {
  const focusFamilyMemberId = familyTreeBuilderParams.focusFamilyMemberId;
  const allFamilyMembers = familyTreeBuilderParams.allFamilyMembers;
  const familyRelationships = familyTreeBuilderParams.familyRelationships;
  const gap = familyTreeBuilderParams?.gap || { x: 100, y: 100 };
  const width = familyTreeBuilderParams?.width || 100;
  const height = familyTreeBuilderParams?.height || 100;

  function computeGenerations() {
    if (!focusFamilyMemberId) return [];
    const memberMap = Object.fromEntries(
      allFamilyMembers.map((m) => [m._id, m])
    );
    const childToParents: Record<string, string[]> = {};
    const parentToChildren: Record<string, string[]> = {};
    const partnerLinks: Record<string, string[]> = {};

    for (const rel of familyRelationships) {
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
      { id: focusFamilyMemberId, generation: 0 },
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

  function groupGenerations(familyMembers: MemberWithGeneration[]) {
    familyMembers.sort((b, a) => a.generation - b.generation);
    const levels: Record<number, MemberWithGeneration[]> = {};
    familyMembers.forEach((node) => {
      const { generation } = node;
      if (!levels[generation]) levels[generation] = [];
      levels[generation].push(node);
    });
    return levels;
  }

  function findRootAncestors(levels: groupedGenerations) {
    const keys = Object.keys(levels);
    keys.sort((a, b) => +a - +b);
    const base = levels[parseInt(keys[0])];
    const baseIds = base.map((base) => base._id);
    return baseIds;
  }

  function generateEdges(relationships: RelationshipTypes[]) {
    const Edges: Edge[] = relationships.map((relationship) => ({
      id: relationship._id,
      source: relationship.from,
      target: relationship.to,
      type: "smoothstep",
      data: {
        startLabel: "start edge label",
        endLabel: "end edge label",
      },
      style: {
        stroke: "#00a388",
        strokeWidth: 5,
      },
      sourceHandle: `${relationship.relationship}-from`,
      targetHandle: `${relationship.relationship}-to`,
    }));
    return Edges;
  }

  function generateCenteredPositions(
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

  class FamilyNode {
    profile: MemberWithGeneration;
    children: FamilyNode[];
    spouses: FamilyNode[];
    parents: FamilyNode[];
    spousePosition: positionType;
    memberPosition: positionType;
    nextChildPosition: positionType;

    constructor(memberProfile: MemberWithGeneration, position?: positionType) {
      const ySpacing = gap.y + height;
      const initialPosition = {
        x: 0,
        y: memberProfile.generation * ySpacing,
      };
      this.profile = memberProfile;
      this.children = [];
      this.spouses = [];
      this.parents = [];
      this.spousePosition = position
        ? {
            ...position,
            y: position.y + ySpacing,
          }
        : {
            ...initialPosition,
            y: initialPosition.y + ySpacing,
          };
      this.nextChildPosition = {
        x: position?.x || 0,
        y: (memberProfile.generation + 1) * ySpacing,
      };
      this.memberPosition = position || { ...initialPosition };
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
    addPosition(position: positionType) {
      this.memberPosition = position;
    }

    calculateSpousePosition() {
      const childrenSpouses = [
        ...this.children.map((child) => child.spouses).flat(),
        ...this.children,
      ];
      if (childrenSpouses.length === 0) return null;

      childrenSpouses.sort((a, b) => b.memberPosition.x - a.memberPosition.x);
      const maxX = childrenSpouses[0].memberPosition.x;
      const minX = childrenSpouses[childrenSpouses.length - 1].memberPosition.x;

      this.spousePosition = {
        x: (maxX + minX) / 2,
        y: this.memberPosition.y + (gap.y + height) / 2,
      };

      for (const spouse of this.spouses) {
        spouse.spousePosition = {
          x: (maxX + minX) / 2,
          y: this.memberPosition.y + (gap.y + height) / 2,
        };
      }
    }
    calculateChildlessSpousePosition() {
      const childrenSpouses = [...this.spouses, this];
      if (childrenSpouses.length === 0) return null;

      childrenSpouses.sort((a, b) => b.memberPosition.x - a.memberPosition.x);
      const maxX = childrenSpouses[0].memberPosition.x;
      const minX = childrenSpouses[childrenSpouses.length - 1].memberPosition.x;

      this.spousePosition = {
        x: (maxX + minX) / 2,
        y: this.memberPosition.y + (gap.y + height) / 2,
      };

      for (const spouse of this.spouses) {
        spouse.spousePosition = {
          x: (maxX + minX) / 2,
          y: this.memberPosition.y + (gap.y + height) / 2,
        };
      }
    }

    calculateChildPosition() {
      const childrenSpouses = [
        ...this.children.map((child) => child.spouses).flat(),
        ...this.children,
        ...this.spouses,
      ];
      if (childrenSpouses.length === 0) return;
      childrenSpouses.sort(
        (a, b) => b.nextChildPosition.x - a.nextChildPosition.x
      );
      const x = childrenSpouses[0].nextChildPosition.x;
      this.nextChildPosition = {
        x: x + (gap.x + width),
        y: (this.profile.generation + 1) * (gap.y + height),
      };
    }

    calculateExtremePosition() {
      const position = this.nextChildPosition;
      this.nextChildPosition = {
        x: position.x - (gap.x + width),
        y: position.y,
      };
    }

    calculateMemberPosition() {
      const spouses = [this, ...this.spouses]; //[this]; //
      if (spouses.length === 0) return null;

      const positions = generateCenteredPositions(
        this.spousePosition.x,
        spouses.length,
        gap.x + width
      );

      for (let i = 0; i < spouses.length; i++) {
        const spouse = spouses[i];
        spouse.addPosition({
          x: positions[i],
          y: this.profile.generation * (gap.y + height),
        });
      }
    }
  }

  function buildFamilyTreeStructure(
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
      parentNode?.nextChildPosition
    );

    const spouseNodes = getSpouseNodes(
      allMembers,
      familyRelationships,
      currentGenerationMemberId,
      currentNode
    );

    currentNode.addSpouses(spouseNodes);
    if (parentNode) {
      currentNode.addParents([parentNode]);
      parentNode.addChildren([currentNode]);
    }

    const parentChildRelationships = familyRelationships.filter(
      (relationship) =>
        relationship.from === currentGenerationMemberId &&
        relationship.relationship === "parents"
    );
    parentChildRelationships.sort((a, b) => {
      const aPos = a?.position ?? 0;
      const bPos = b?.position ?? 0;
      return aPos - bPos;
    });
    const childrenIds = parentChildRelationships.map(
      (relationship) => relationship.to
    );

    if (childrenIds.length === 0) {
      currentNode.calculateChildlessSpousePosition();
      return currentNode;
    }

    for (const id of childrenIds) {
      buildFamilyTreeStructure(
        allMembers,
        currentNode,
        id,
        familyRelationships
      );
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
        x: (i + 1) * (gap.x + width) + currentNode.memberPosition.x,
        y: currentNode.memberPosition.y,
      };

      const spouseNode = new FamilyNode(memberProfile, position);
      spouseNode.addSpouses([currentNode]);
      spouseNodes.push(spouseNode);
    }
    return spouseNodes;
  }

  function ExtractNodes(
    rootNode: FamilyNode,
    nodes: NodeType[] = [],
    nodeType: "familyNode" | "previewNode" = "familyNode"
  ) {
    if (isInNodes(rootNode, nodes)) {
      return nodes;
    }
    nodes.push({
      position: rootNode.memberPosition,
      id: rootNode.profile._id,
      type: nodeType,
      data: rootNode.profile,
    });
    // nodes.push({
    //   position: rootNode.spousePosition,
    //   id: rootNode.profile._id + "spouse",
    //   type: "spouseNode",
    //   data: {
    //     name: "spouse",
    //   },
    // });

    for (const child of rootNode.children) {
      ExtractNodes(child, nodes, nodeType);
    }

    for (const spouse of rootNode.spouses) {
      ExtractNodes(spouse, nodes, nodeType);
    }

    return nodes;
  }

  function isInNodes(rootNode: FamilyNode, nodes: NodeType[]) {
    const node = nodes.find((node) => node.id === rootNode.profile._id);
    if (!node) return false;
    return true;
  }

  return {
    computeGenerations,
    groupGenerations,
    findRootAncestors,
    generateEdges,
    buildFamilyTreeStructure,
    ExtractNodes,
    FamilyNode,
  };
}