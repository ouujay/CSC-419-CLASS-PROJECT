"use client";
import { P5jsContainer } from "@/components/p5js/P5jsContainer";
import { useFamilyData } from "@/contexts/DashboardFamilyContext";
import { FamilySketchProps } from "@/sketches/FamilySketch";
import { RealTreeSketch } from "@/sketches/RealTree";

export default function RealTreePage() {
  const { data } = useFamilyData();
  const familyMembers = data.members;
  const familyRelationships = data.relationships;

  const sketchData: FamilySketchProps = {
    familyMembers: familyMembers || [],
    familyRelationships: familyRelationships || [],
  };

  return (
    <div className={`h-full w-full flex overflow-x-auto sec-font text-base`}>
      <P5jsContainer<FamilySketchProps>
        sketch={RealTreeSketch}
        className="h-full w-full"
        data={sketchData}
      />
    </div>
  );
}
