// "use client";
// import { useViewFamilyStore } from "../../../../../../contexts/ViewMembersContext";
// // import { P5jsContainer } from "@/components/p5js/P5jsContainer";
// // import { FamilySketch } from "@/sketches/FamilySketch";
// import { FamilySketchProps } from "@/types/p5Types";
// import { FamilySketch } from "./test";

// function ForceGraphPage() {
//   const familyMembers = useViewFamilyStore(
//     (state) => state.family.familyMembers
//   );
//   const familyRelationships = useViewFamilyStore(
//     (state) => state.family.relationships
//   );

//   // Create data object with fallback to empty array if familyMembers is undefined
//   const sketchData: FamilySketchProps = {
//     familyMembers: familyMembers || [],
//     familyRelationships: familyRelationships || [],
//   };

//   return (
//     <div className={`h-full w-full flex overflow-x-auto sec-font text-base`}>
//       {/* <P5jsContainer<FamilySketchProps>
//         sketch={FamilySketch}
//         className="h-full w-full"
//         data={sketchData}
//       /> */}
//       <FamilySketch
//         familyMembers={sketchData.familyMembers}
//         familyRelationships={sketchData.familyRelationships}
//       />
//     </div>
//   );
// }

// export default ForceGraphPage;
import React from 'react'

export default function ForceGraph() {
  return (
    <div>ForceGraph</div>
  )
}
