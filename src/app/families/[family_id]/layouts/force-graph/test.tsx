// // components/FamilySketch.tsx
// "use client";

// import * as d3 from "d3";
// import { useEffect, useRef } from "react";
// import { FamilySketchProps } from "@/types/p5Types";

// export function FamilySketch({ familyMembers, familyRelationships }: FamilySketchProps) {
//   const ref = useRef<SVGSVGElement | null>(null); // Ref for the SVG container

//   useEffect(() => {
//     if (!ref.current) return;

//     const width = 928;
//     const height = 680;

//     const color = d3.scaleOrdinal(d3.schemeCategory10); // Color scale for node groups

//     // Format nodes from familyMembers
//     const nodes = familyMembers.map((member) => ({
//       id: member._id,
//       name: member.full_name,
//       group: member.sex ?? "unknown",
//       photo: member.photo_url || null,
//     }));

//     // Format links from relationships
//     const links = familyRelationships.map((rel) => ({
//       source: rel.from,
//       target: rel.to,
//       value: 1,
//     }));

//     const svg = d3.select(ref.current);
//     svg.selectAll("*").remove(); // Clear any existing SVG elements

//     // Define zoom behavior and apply it to the SVG
//     const zoom = d3.zoom<SVGSVGElement, unknown>()
//       .scaleExtent([0.1, 4]) // Allow zooming from 10% to 400%
//       .on("zoom", (event) => {
//         g.attr("transform", event.transform);
//       });

//     svg.call(zoom);

//     // Create a container group for all visual elements
//     const g = svg
//       .append("g")
//       .attr("transform", "translate(0,0)");

//     svg
//       .attr("viewBox", [-width / 2, -height / 2, width, height].toString())
//       .attr("width", "100%")
//       .attr("height", height)
//       .style("maxWidth", "100%")
//       .style("height", "auto");

//     // Force simulation with increased node distance
//     const simulation = d3
//       .forceSimulation(nodes as any)
//       .force("link", d3.forceLink(links).id((d: any) => d.id).distance(200)) // Increased node distance
//       .force("charge", d3.forceManyBody().strength(-200)) // Repulsion strength
//       .force("x", d3.forceX())
//       .force("y", d3.forceY());

//     // Draw the relationship lines
//     const link = g
//       .append("g")
//       .attr("stroke", "#999")
//       .attr("stroke-opacity", 0.6)
//       .selectAll("line")
//       .data(links)
//       .join("line")
//       .attr("stroke-width", 1.5);

//     // Create draggable node containers
//     const node = g
//       .append("g")
//       .selectAll("g")
//       .data(nodes)
//       .join("g")
//       .call(
//         d3.drag()
//           .on("start", (event, d: any) => {
//             if (!event.active) simulation.alphaTarget(0.3).restart();
//             d.fx = d.x;
//             d.fy = d.y;
//           })
//           .on("drag", (event, d: any) => {
//             d.fx = event.x;
//             d.fy = event.y;
//           })
//           .on("end", (event, d: any) => {
//             if (!event.active) simulation.alphaTarget(0);
//             d.fx = null;
//             d.fy = null;
//           })
//       );

//     // Append a profile image or fallback circle
//     node.each(function (d: any) {
//       const g = d3.select(this);
//       if (d.photo) {
//         g.append("image")
//           .attr("href", d.photo)
//           .attr("x", -16)
//           .attr("y", -16)
//           .attr("width", 32)
//           .attr("height", 32)
//           .attr("clip-path", "circle(16px at center)");
//       } else {
//         g.append("circle")
//           .attr("r", 8)
//           .attr("fill", color(d.group));
//       }
//     });

//     // Add full name labels below each node
//     const labels = g
//       .append("g")
//       .selectAll("text")
//       .data(nodes)
//       .join("text")
//       .text((d: any) => d.name)
//       .attr("fill", "white")
//       .attr("font-size", 12)
//       .attr("text-anchor", "middle")
//       .attr("dy", 28); // Position text below node

//     // Update positions on each simulation tick
//     simulation.on("tick", () => {
//       link
//         .attr("x1", (d: any) => d.source.x)
//         .attr("y1", (d: any) => d.source.y)
//         .attr("x2", (d: any) => d.target.x)
//         .attr("y2", (d: any) => d.target.y);

//       node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);

//       labels
//         .attr("x", (d: any) => d.x)
//         .attr("y", (d: any) => d.y);
//     });

//     return () => simulation.stop(); // Clean up on unmount
//   }, [familyMembers, familyRelationships]);

//   return <svg ref={ref}></svg>;
// }
import React from 'react'

export default function test() {
  return (
    <div>test</div>
  )
}
