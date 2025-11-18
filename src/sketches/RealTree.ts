"use client";
import * as p5Types from "p5";
import {
  buildFamilyTreeStructure,
  computeGenerations,
  FamilyNode,
  MemberWithGeneration,
} from "@/utils/utils";
import { Id } from "@/convex/_generated/dataModel";
import { createControls } from "./controls";
import { FamilySketchProps } from "./FamilySketch";
import { P5jsSketch } from "@/types";

export const RealTreeSketch: P5jsSketch<FamilySketchProps> = (
  p5,
  parentRef,
  data
) => {
  let parentStyle: CSSStyleDeclaration;
  let canvasHeight: number;
  let canvasWidth: number;
  let minThick: number;
  let maxThick: number;
  let family: FamilyNode | undefined;
  let trees: p5Types.Graphics | undefined;

  const {
    controls,
    touchStarted,
    touchMoved,
    touchEnded,
    mouseWheel,
    mouseDragged,
  } = createControls(p5);

  p5.touchStarted = touchStarted;
  p5.touchMoved = touchMoved;
  p5.touchEnded = touchEnded;
  p5.mouseWheel = mouseWheel;
  p5.mouseDragged = mouseDragged;

  p5.preload = () => {
    // familyImage = p5.loadImage("/placeholder.jpg");
  };

  // Setup function
  p5.setup = () => {
    p5.frameRate(24);
    parentStyle = window.getComputedStyle(parentRef);
    canvasWidth = parseInt(parentStyle.width);
    canvasHeight = parseInt(parentStyle.height);
    p5.createCanvas(canvasWidth, canvasHeight).parent(parentRef);
    p5.angleMode(p5.DEGREES);
    const input = {
      rootMember: data.familyMembers[0]._id,
      members: data.familyMembers,
      relationships: data.familyRelationships,
    };
    const rawNodes = computeGenerations(input);
    rawNodes.sort((b, a) => a.generation - b.generation);
    const levels: Record<number, MemberWithGeneration[]> = {};

    // Group nodes by generation
    rawNodes.forEach((node) => {
      const { generation } = node;
      if (!levels[generation]) levels[generation] = [];
      levels[generation].push(node);
    });
    const keys = Object.keys(levels);
    keys.sort((a, b) => +a - +b);
    minThick = +keys[0];
    maxThick = +keys[keys.length - 1];

    const base = levels[parseInt(keys[0])];
    const baseIds = base.map((base) => base._id);
    family = buildFamilyTreeStructure(
      rawNodes,
      null,
      baseIds[0],
      data.familyRelationships
    );

    trees = prerenderBranches();
    // if (family) {
    // }
  };

  p5.mousePressed = () => {};
  p5.mouseReleased = () => {};

  p5.draw = () => {
    p5.background("#111623");
    controls();
    p5.imageMode(p5.CENTER);
    if (family && trees) {
      renderFamilyTree(family);
      p5.image(
        trees,
        family.metaData.memberPosition.x + 300,
        family.metaData.memberPosition.y,
        500,
        500
      );
    }
  };

  function render(
    p5: p5Types,
    family: FamilyNode,
    seenSpouses: Id<"family_members">[]
  ) {
    const thickness = p5.map(
      family.profile.generation,
      minThick,
      maxThick,
      10,
      2
    );
    p5.noFill();
    p5.stroke("#F5F5F5");
    p5.strokeWeight(thickness);

    const offset = 0;
    smoothLine(
      p5,
      family.metaData.memberPosition.x,
      family.metaData.memberPosition.y + offset,
      family.metaData.spousePosition.x,
      family.metaData.spousePosition.y + offset
    );
    // smoothLine(
    //   p5,
    //   family.metaData.memberPosition.x,
    //   -(family.metaData.memberPosition.y + offset),
    //   family.metaData.spousePosition.x,
    //   -(family.metaData.spousePosition.y + offset)
    // );
    drawProfile(
      p5,
      family.profile,
      family.metaData.memberPosition.x,
      family.metaData.memberPosition.y
    );
    // drawProfile(
    //   p5,
    //   family.profile,
    //   family.metaData.memberPosition.x,
    //   -family.metaData.memberPosition.y
    // );
    p5.noStroke();

    p5.noFill();
    // let i = 0;
    for (const child of family.children) {
      p5.stroke("#f5f5f5");
      p5.strokeWeight(thickness);
      smoothLine(
        p5,
        family.metaData.spousePosition.x,
        family.metaData.spousePosition.y + offset + offset,
        child.metaData.memberPosition.x,
        child.metaData.memberPosition.y + offset + offset
      );
      // smoothLine(
      //   p5,
      //   family.metaData.spousePosition.x,
      //   -(family.metaData.spousePosition.y + offset + offset),
      //   child.metaData.memberPosition.x,
      //   -(child.metaData.memberPosition.y + offset + offset)
      // );
      p5.noStroke();

      if (child.children.length === 0) {
        p5.push();
        p5.translate(
          child.metaData.spousePosition.x,
          child.metaData.spousePosition.y
        );
        // p5.translate(
        //   child.metaData.spousePosition.x,
        //   -child.metaData.spousePosition.y
        // );
        // if (trees && trees.length > 0) {
        //   p5.imageMode(p5.CENTER);
        //   const index = i % trees.length;
        //   p5.image(trees[index], 0, -300);
        //   i++;
        // }
        p5.pop();
      }
      render(p5, child, seenSpouses);
    }

    for (const spouse of family.spouses) {
      if (seenSpouses.includes(spouse.profile._id)) continue;
      seenSpouses.push(spouse.profile._id);
      render(p5, spouse, seenSpouses);
    }

    return;
  }
  p5.windowResized = () => {
    p5.resizeCanvas(canvasWidth, canvasHeight);
  };

  function smoothLine(
    p5: p5Types,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) {
    p5.bezier(x1, y1, x1, y2, x2, y1, x2, y2);
  }

  function renderFamilyTree(family?: FamilyNode) {
    if (!family) return;
    p5.angleMode(p5.DEGREES);
    p5.push();
    p5.translate(p5.width / 2, p5.height - 100);
    render(p5, family, []);
    p5.pop();
  }

  function prerenderBranches() {
    const pg = p5.createGraphics(3000, 3000);
    // pg.background(100);
    pg.angleMode(pg.DEGREES);
    pg.push();
    pg.translate(pg.width / 2, pg.height - 100);

    branch(pg, 6, 500, maxThick);
    pg.pop();
    return pg;
  }

  function branch(
    p5: p5Types,
    maxDept: number,
    len: number,
    thickness: number
  ) {
    const angle = 45;
    const branches = 4;
    const interval = (2 * angle) / (branches - 1);

    if (maxDept < 3) {
      const r = 80 + p5.random(-20, 20);
      const g = 120 + p5.random(-20, 20);
      const b = 40 + p5.random(-20, 20);
      p5.fill(r, g, b);
      p5.noStroke();

      p5.beginShape();
      for (let i = 45; i < 135; i++) {
        const rad = 15;
        const x = rad * p5.cos(i);
        const y = rad * p5.sin(i);
        p5.vertex(x, y);
      }
      for (let i = 135; i > 40; i--) {
        const rad = 15;
        const x = rad * p5.cos(i);
        const y = rad * p5.sin(-i) + 20;
        p5.vertex(x, y);
      }
      p5.endShape(p5.CLOSE);
      return;
    }

    p5.push();
    thickness = p5.map(thickness, 0, thickness, 1, thickness - 2);
    p5.stroke("#F5F5F5");
    p5.strokeWeight(thickness);
    p5.line(0, 0, 0, -len);
    p5.translate(0, -len);

    for (let i = 0; i < branches; i++) {
      const angl = angle - i * interval + p5.random(-10, 10);
      const newLen = len * p5.random(0.9, 1);
      p5.push();
      p5.rotate(angl);
      branch(p5, maxDept - 1, newLen, thickness * 0.8);
      p5.pop();
    }
    p5.pop();
  }

  function drawProfile(
    p5: p5Types,
    member: MemberWithGeneration,
    x: number,
    y: number,
    isSpouse = false
  ) {
    const profileWidth = 160;
    const profileHeight = 120;

    // Profile background
    p5.fill(p5.color("#111623"));
    p5.stroke(p5.color("#00a388"));
    p5.strokeWeight(1);
    p5.rect(
      x - profileWidth / 2,
      y - profileHeight / 2,
      profileWidth,
      profileHeight,
      8
    );

    // Profile photo placeholder
    const photoSize = 40;
    p5.fill(220);
    p5.stroke(150);
    p5.circle(x, y - 25, photoSize);

    // Name
    p5.stroke("#f5f5f5");
    p5.noStroke();
    p5.textAlign(p5.CENTER);
    p5.textSize(12);
    p5.textStyle(p5.BOLD);
    const displayName =
      member.full_name.length > 18
        ? member.full_name.substring(0, 15) + "..."
        : member.full_name;
    p5.text(displayName, x, y + 5);

    // Birth/Death dates if available
    p5.textSize(9);
    p5.textStyle(p5.NORMAL);
    p5.fill(100);
    if (member.dates?.birth?.year) {
      const birthYear = new Date(member.dates.birth.year).getFullYear();
      const deathYear = member.dates?.birth.year
        ? new Date(member.dates?.birth.year).getFullYear()
        : "";
      const dates = deathYear
        ? `${birthYear} - ${deathYear}`
        : `b. ${birthYear}`;
      p5.text(dates, x, y + 18);
    }

    // Generation indicator
    p5.textSize(8);
    p5.fill(120);
    p5.text(`Gen ${member.generation}`, x, y + 30);

    // Spouse indicator
    if (isSpouse) {
      p5.fill(165, 42, 42);
      p5.textSize(8);
      p5.text("Spouse", x, y + 42);
    }
  }
};
