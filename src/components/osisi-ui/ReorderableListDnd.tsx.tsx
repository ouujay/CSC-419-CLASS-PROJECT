"use client";
import React, { useEffect, useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { c_UpdateRelationships } from "@/fullstack/PublicConvexFunctions";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { GripVertical } from "lucide-react";
import { Gender, LifeStatus } from "./tags/FamilyMemberTags";
import { useMutation } from "convex/react";
import { useFamilyData } from "@/contexts/DashboardFamilyContext";
import { ExtendedRelationshipsType } from "@/types";
import { relationshipFinder } from "@/convex/familyMembers/helpers";
import { Button } from "../ui/button";

interface SortableItemProps {
  id: Id<"family_members">;
  content: getRelatedFamilyMembersType[number];
}

function SortableItem({ id, content }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        mb-2 p-2 bg-background rounded-lg border cursor-move transition-all
        ${isDragging ? " shadow-2xl" : "shadow-sm"}
      `}
    >
      <div className="flex items-center space-x-2">
        {content.details?.profile_picture && (
          <Image
            width={50}
            height={50}
            src={content.details?.profile_picture}
            alt={`${content.details?.full_name}'s profile`}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <div>
          <h6 className="text-base">
            {content.details.full_name_s}{" "}
            <span className="font-normal font-sora text-xs">
              (
              {content.relationship.relationship === "parents"
                ? content.relationship.parentage_type
                : content.relationship.partnership_type}
              )
            </span>
          </h6>
          <div className="flex flex-wrap gap-3 mt-1 text-xs">
            <LifeStatus isDeceased={content.details.is_deceased} />
            <Gender sex={content.details.sex} />
          </div>
        </div>
        <Button
          size="icon"
          variant={null}
          className="ml-auto  active:cursor-grabbing hover:cursor-grab"
        >
          <GripVertical />
        </Button>
      </div>
    </div>
  );
}

interface ReorderableListDndProps {
  relationship: ExtendedRelationshipsType;
  familyId: Id<"families">;
  familyMemberId: Id<"family_members">;
}

export default function RelationshipList({
  relationship,
  familyId,
  familyMemberId,
}: ReorderableListDndProps) {
  const { data } = useFamilyData();
  const updateRelationships = useMutation(c_UpdateRelationships);
  const relatedFamilyMembers = getRelatedFamilyMembers(
    familyMemberId,
    data.relationships,
    data.members,
    relationship
  );

  const handleSaveOrder = async (items: getRelatedFamilyMembersType) => {
    const relationships = items.map((item, index) => ({
      ...item.relationship,
      position: index + 1,
    }));

    await updateRelationships({
      relationships,
      familyId,
      eventType: "update_relationship",
    });
  };

  return (
    <section>
      <h6 className="capitalize text-lg">{relationship}</h6>
      <ReorderableListDnd
        initialItems={relatedFamilyMembers}
        onReorder={handleSaveOrder}
      />
    </section>
  );
}

export function ReorderableListDnd({
  initialItems,
  onReorder,
}: {
  initialItems: getRelatedFamilyMembersType;
  onReorder?: (items: getRelatedFamilyMembersType) => void;
}) {
  const [items, setItems] = useState<getRelatedFamilyMembersType>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prevItems) => {
      const oldIndex = prevItems.findIndex(
        (c) => c._id.toString() === active.id
      );
      const newIndex = prevItems.findIndex((c) => c._id.toString() === over.id);
      const reordered = arrayMove(prevItems, oldIndex, newIndex);

      // 🔥 trigger save to DB
      onReorder?.(reordered);

      return reordered;
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i._id.toString())}
        strategy={verticalListSortingStrategy}
      >
        {items.length > 0 ? (
          <div className="">
            {items.map((item) => (
              <SortableItem
                key={item._id.toString()}
                id={item._id}
                content={item}
              />
            ))}
          </div>
        ) : (
          <div
            className={`
        mb-2 p-2 bg-background rounded-lg border cursor-move transition-all opacity-75`}
          >
            <div className="flex items-center space-x-2">
              <div>
                <h6 className="text-base ">No family members found</h6>
              </div>
            </div>
          </div>
        )}
      </SortableContext>
    </DndContext>
  );
}
type getRelatedFamilyMembersType = ReturnType<typeof getRelatedFamilyMembers>;
function getRelatedFamilyMembers(
  familyMemberId: Id<"family_members">,
  relationships: Doc<"relationships">[],
  familyMembers: Doc<"family_members">[],
  relationship: ExtendedRelationshipsType
) {
  const relationshipPathMap: Record<
    ExtendedRelationshipsType,
    ExtendedRelationshipsType[]
  > = {
    parents: ["parents"],
    children: ["children"],
    partners: ["partners"],
  };

  const familyMemberIds = relationshipFinder(
    relationships,
    [familyMemberId],
    relationshipPathMap[relationship]
  );

  const seletedFamilyMembers = familyMemberIds.map((id) => {
    const a = relationships.filter(
      (relationship) =>
        relationship.from === familyMemberId && relationship.to === id
    );
    const b = relationships.filter(
      (relationship) =>
        relationship.from === id && relationship.to === familyMemberId
    );
    const relationship = [...a, ...b];
    const familyMember = familyMembers.find(
      (familyMember) => familyMember._id === id
    );

    if (!familyMember || relationship.length === 0) {
      return undefined;
    }

    return {
      _id: familyMember?._id,
      details: familyMember,
      relationship: relationship[0],
    };
  });
  const relatedFamilyMembers = seletedFamilyMembers.filter(
    (familyMember) => familyMember !== undefined
  );
  relatedFamilyMembers.sort(
    (a, b) => (a.relationship?.position || 0) - (b.relationship?.position || 0)
  );
  return relatedFamilyMembers;
}
