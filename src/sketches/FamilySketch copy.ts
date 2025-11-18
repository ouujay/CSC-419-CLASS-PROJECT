"use client";
import { P5jsSketch } from "@/types";
import * as p5Types from "p5";
import { createControls } from "./controls";

export type SampleSketchProps = null;
export const SampleSketch: P5jsSketch<SampleSketchProps> = (
  p5,
  parentRef,
  data
) => {
  let parentStyle: CSSStyleDeclaration;
  let canvasHeight: number;
  let canvasWidth: number;
  let currentWord: string;
  let tree: p5Types.Graphics | undefined;
  const angle = 45 * (Math.PI / 180);
  const rules: Record<string, string> = {
    X: "F[F+X]F[F-X]F[F+X]F[F-X]F[F+X]F[F-X]FFF",
    F: "FF[+]",
  };
  const len = 3;
  const baseStrokeWeight = 10;
  let strokeStack: number[] = [];
  let drawRules: Record<string, () => void>;
  let noiseOffset = 0;
  console.log(data);

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

  p5.preload = () => {};

  function prerenderTree() {
    const pg = p5.createGraphics(2000, 2000);
    pg.background(155);
    drawRules = {
      F: () => {
        const w = strokeStack[strokeStack.length - 1];
        pg.strokeWeight(w);
        pg.line(0, 0, 0, -len);
        pg.translate(0, -len);
        strokeStack[strokeStack.length - 1] = Math.max(w - 0.001, 0.1);
      },
      X: () => {
        const w = strokeStack[strokeStack.length - 1];
        pg.noStroke();
        const radius = w * 6;
        pg.fill("green");
        pg.circle(0, 0, radius);
        pg.noFill();
      },
      "+": () => {
        const noiseVal = pg.noise(noiseOffset);
        noiseOffset += 0.1;
        pg.rotate(angle * pg.map(noiseVal, 0, 1, 0.5, 1.5));
      },
      "-": () => {
        const noiseVal = pg.noise(noiseOffset);
        noiseOffset += 0.1;
        pg.rotate(-angle * pg.map(noiseVal, 0, 1, 0.5, 1.5));
      },
      "[": () => {
        pg.push();
        const currentW = strokeStack[strokeStack.length - 1];
        strokeStack.push(currentW * 0.75);
      },
      "]": () => {
        pg.pop();
        strokeStack.pop();
      },
    };
    pg.translate(pg.width / 2, pg.height);
    strokeStack = [baseStrokeWeight];
    noiseOffset = 0;
    for (const char of currentWord) {
      if (char in drawRules) {
        drawRules[char]();
      }
    }
    return pg;
  }

  p5.setup = () => {
    p5.frameRate(24);
    parentStyle = window.getComputedStyle(parentRef);
    canvasWidth = parseInt(parentStyle.width);
    canvasHeight = parseInt(parentStyle.height);
    p5.createCanvas(canvasWidth, canvasHeight).parent(parentRef);
    const initialWord = "X";
    const iterations = baseStrokeWeight / 2;
    currentWord = generateLSystem(initialWord, rules, iterations);
    tree = prerenderTree();
  };

  p5.draw = () => {
    p5.background(255);
    controls();
    if (tree) {
      p5.image(
        tree,
        (canvasWidth - 1000) / 2,
        (canvasHeight - 1000) / 2,
        2000,
        2000
      );
    }

    // p5.noLoop();
  };

  p5.mousePressed = () => {};
  p5.mouseReleased = () => {};

  p5.windowResized = () => {
    p5.resizeCanvas(canvasWidth, canvasHeight);
  };
};

function generateNext(word: string, rules: Record<string, string>) {
  let nextWord = "";
  for (const char of word) {
    nextWord += rules[char] || char;
  }
  return nextWord;
}

function generateLSystem(
  initialWord: string,
  rules: Record<string, string>,
  iterations: number = 3
) {
  let currentWord = initialWord;
  for (let i = 0; i < iterations; i++) {
    currentWord = generateNext(currentWord, rules);
  }
  return currentWord;
}
