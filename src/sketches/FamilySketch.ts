"use client";
import { p5Colors } from "@/utils/constants";
import * as p5Types from "p5";
import { ExtendedRelationshipsType, P5jsSketch } from "@/types";
import { Doc, Id } from "@/convex/_generated/dataModel";

export type FamilySketchProps = {
  familyMembers: Doc<"family_members">[];
  familyRelationships: Doc<"relationships">[];
};

export type relationshipType = ExtendedRelationshipsType;
type NodeConnection = [
  Id<"family_members">, // node1Index
  Id<"family_members">, // node2Index
  number, // maxDistance
  Exclude<relationshipType, "children">, // relationship
];

export const FamilySketch: P5jsSketch<FamilySketchProps> = (
  p5,
  parentRef,
  data
) => {
  let parentStyle: CSSStyleDeclaration;
  let canvasHeight: number;
  let canvasWidth: number;
  let familyImage: p5Types.Image;

  const gravityConstant: number = 2;
  const forceConstant: number = 10_000;
  const physics: boolean = true;
  const nodes: Node[] = [];
  const nodeCon: NodeConnection[] = [];
  let clicked: boolean = false;
  let lerpValue: number = 0.2;
  const startDisMultiplier: number = 0.5;
  let closeNode: Node;
  // let closeNodeMag: number;

  class Node {
    pos: p5Types.Vector;
    force: p5Types.Vector;
    mass: number;
    profile: Doc<"family_members">;

    constructor(
      pos: p5Types.Vector,
      size: number,
      profile: Doc<"family_members">
    ) {
      this.pos = pos;
      this.force = p5.createVector(0, 0);
      this.mass = (2 * Math.PI * size) / 1.5;
      this.profile = profile;
    }

    update(): void {
      const force = this.force.copy();
      const vel = force.copy().div(this.mass);
      this.pos.add(vel);
    }

    draw(): void {
      p5.noStroke();
      p5.fill(p5Colors.node[0], p5Colors.node[1], p5Colors.node[2]);
      p5.ellipse(this.pos.x, this.pos.y, 20, 20);
      p5.fill(p5Colors.text[0], p5Colors.text[1], p5Colors.text[2]);
      p5.textSize(16);
      p5.text(
        `${this.profile.full_name || ""}`,
        this.pos.x + 10,
        this.pos.y - 10
      );
      // Draw the image if it's loaded
      if (familyImage) {
        p5.imageMode(p5.CENTER);
        p5.image(familyImage, this.pos.x, this.pos.y, 25, 25); // Adjust size as needed
      }
    }
  }

  function createVector(x: number, y: number): p5Types.Vector {
    return p5.createVector(x, y);
  }

  function applyForces(nodes: Node[]): void {
    // Apply force towards center
    nodes.forEach((node) => {
      const gravity = node.pos.copy().mult(-1).mult(gravityConstant);
      node.force = gravity;
    });

    // Apply repulsive force between nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const pos = nodes[i].pos;
        const dir = nodes[j].pos.copy().sub(pos);
        const force = dir.div(dir.mag() * dir.mag());
        force.mult(forceConstant);
        nodes[i].force.add(force.copy().mult(-1));
        nodes[j].force.add(force);
      }
    }

    // Apply forces applied by connections
    nodeCon.forEach((con) => {
      const node1 = nodes.find((node) => node.profile._id === con[0]);
      const node2 = nodes.find((node) => node.profile._id === con[1]);
      if (node1 && node2) {
        const maxDis = con[2];
        const dis = node1.pos.copy().sub(node2.pos);
        const diff = dis.mag() - maxDis;
        node1?.force.sub(diff);
        node2?.force.add(diff);
      }
    });
  }

  p5.preload = () => {
    familyImage = p5.loadImage("/placeholder.jpg");
  };

  // Setup function
  p5.setup = () => {
    p5.frameRate(24);
    parentStyle = window.getComputedStyle(parentRef);
    canvasWidth = parseInt(parentStyle.width);
    canvasHeight = parseInt(parentStyle.height);
    p5.createCanvas(canvasWidth, canvasHeight).parent(parentRef);
    p5.fill(0, 74, 88);
    // p5.fill(0, 163, 136);

    // Create nodes based on family members when available
    const members = data.familyMembers;
    const relationships = data?.familyRelationships || [];
    const numNodes = members.length || 0;

    for (let i = 0; i < numNodes; i++) {
      const x = p5.random(
        -startDisMultiplier * canvasWidth,
        startDisMultiplier * canvasWidth
      );
      const y = p5.random(
        -startDisMultiplier * canvasHeight,
        startDisMultiplier * canvasHeight
      );
      const node = new Node(
        createVector(x, y),
        p5.random(1, 5),
        data.familyMembers[i]
      );
      nodes.push(node);
    }

    closeNode = nodes[0];

    for (const relationship of relationships) {
      nodeCon.push([
        relationship.from,
        relationship.to,
        300,
        relationship.relationship,
      ]);
      if (relationship.relationship === "partners") {
        nodeCon.push([
          relationship.to,
          relationship.from,
          300,
          relationship.relationship,
        ]);
      }
    }
  };

  // Mouse events
  p5.mousePressed = () => {
    if (
      p5.mouseX > 0 &&
      p5.mouseX < canvasWidth &&
      p5.mouseY > 0 &&
      p5.mouseY < canvasHeight
    ) {
      clicked = true;
      const mousePos = createVector(
        p5.mouseX - canvasWidth / 2,
        p5.mouseY - canvasHeight / 2
      );

      nodes.forEach((node) => {
        if (
          mousePos.copy().sub(node.pos).mag() - node.mass / (2 * Math.PI) <
          mousePos.copy().sub(closeNode.pos).mag() -
            closeNode.mass / (2 * Math.PI)
        ) {
          closeNode = node;
        }
      });

      return false; // Prevent default
    }
  };

  p5.mouseReleased = () => {
    clicked = false;
    lerpValue = 0.2;
  };

  // Draw function
  p5.draw = () => {
    p5.translate(canvasWidth / 2, canvasHeight / 2);
    p5.background(17, 22, 35);

    nodeCon.forEach((con) => {
      const node1 = nodes.find((node) => node.profile._id === con[0]);
      const node2 = nodes.find((node) => node.profile._id === con[1]);
      if (node1 && node2) {
        p5.strokeWeight(2);
        p5.stroke(
          p5Colors.line[con[3]][0],
          p5Colors.line[con[3]][1],
          p5Colors.line[con[3]][2],
          100
        );
        p5.fill(
          p5Colors.line[con[3]][0],
          p5Colors.line[con[3]][1],
          p5Colors.line[con[3]][2]
        );
        arrow(node1.pos.x, node1.pos.y, node2.pos.x, node2.pos.y, 10, 0.9);
      }
    });

    applyForces(nodes);

    nodes.forEach((node) => {
      node.draw();
      if (physics) {
        node.update();
      }
    });

    if (clicked) {
      const mousePos = createVector(
        p5.mouseX - canvasWidth / 2,
        p5.mouseY - canvasHeight / 2
      );
      closeNode.pos.lerp(mousePos, lerpValue);
      if (lerpValue < 0.95) {
        lerpValue += 0.02;
      }
    }

    // Draw legend in top left
    const legendX = -canvasWidth / 2 + 20;
    const legendY = -canvasHeight / 2 + 20;
    const lineHeight = 25;

    p5.textAlign(p5.LEFT);
    p5.textSize(14);

    // Draw legend title
    p5.noStroke();
    p5.fill(p5Colors.text[0], p5Colors.text[1], p5Colors.text[2]);
    p5.text("Relationship Types:", legendX, legendY);

    // Draw legend items
    Object.entries(p5Colors.line).forEach(([relationship, color], index) => {
      const y = legendY + (index + 1) * lineHeight;

      // // Draw line sample

      // p5.line(legendX, y, legendX + 30, y);

      if (relationship === "parents") {
        p5.noStroke();
        p5.fill(p5Colors.text[0], p5Colors.text[1], p5Colors.text[2]);
        p5.text("Parent", legendX, y + 5);
        //
        p5.stroke(color[0], color[1], color[2]);
        p5.fill(color[0], color[1], color[2]);
        p5.strokeWeight(2);
        arrow(legendX + 60, y, legendX + 100, y, 5, 1);
        //
        p5.noStroke();
        p5.fill(p5Colors.text[0], p5Colors.text[1], p5Colors.text[2]);
        p5.text("Child", legendX + 110, y + 5);
      } else if (relationship === "partners") {
        p5.noStroke();
        p5.fill(p5Colors.text[0], p5Colors.text[1], p5Colors.text[2]);
        p5.text("Partner", legendX, y + 5);
        //
        p5.stroke(color[0], color[1], color[2]);
        p5.fill(color[0], color[1], color[2]);
        p5.strokeWeight(2);
        arrow(legendX + 60, y, legendX + 100, y, 5, 1);
        arrow(legendX + 100, y, legendX + 60, y, 5, 1);
        //
        p5.noStroke();
        p5.fill(p5Colors.text[0], p5Colors.text[1], p5Colors.text[2]);
        p5.text("Partner", legendX + 110, y + 5);
      }
    });
  };

  p5.windowResized = () => {
    p5.resizeCanvas(canvasWidth, canvasHeight);
  };

  function arrow(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    size: number,
    offset: number = 1
  ) {
    if (offset > 1) {
      offset = 1;
    }

    if (offset < 0) {
      offset = 0;
    }

    // this code is to make the arrow point
    const _x1 = p5.lerp(x1, x2, 1 - offset);
    const _y1 = p5.lerp(y1, y2, 1 - offset);
    const _x2 = p5.lerp(x1, x2, offset);
    const _y2 = p5.lerp(y1, y2, offset);
    p5.line(_x1, _y1, _x2, _y2);
    p5.push(); //start new drawing state

    const angle = p5.atan2(_y1 - _y2, _x1 - _x2); //gets the angle of the line
    p5.translate(_x2, _y2); //translates to the destination vertex
    p5.rotate(angle - p5.HALF_PI); //rotates the arrow point
    p5.triangle(-size * 0.6, size * 1.5, size * 0.6, size * 1.5, 0, 0); //draws the arrow point as a triangle
    p5.pop();
  }
};
