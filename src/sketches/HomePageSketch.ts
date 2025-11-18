"use client";

import { P5jsSketch } from "@/types";



export const sketch: P5jsSketch<number> = (p5, parentRef) => {
  // P5.js setup variables
  let parentStyle: CSSStyleDeclaration;
  let canvasHeight: number;
  let canvasWidth: number;
  // let cnv: any;

  // Network simulation variables
  const noNodes: number = 100;
  const noConn: number = 10;
  const gravityConstant: number = 1;
  const forceConstant: number = 1000;
  const physics: boolean = true;
  const nodes: Node[] = [] ;
  const nodeCon: NodeConnection[] = [] ;
  let clicked: boolean = false;
  let lerpValue: number = 0.2;
  const startDisMultiplier: number = 10;
  let closeNode: Node;
  // let closeNodeMag: number;

  // Vector class to match p5.js Vector functionality
  class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    copy(): Vector {
      return new Vector(this.x, this.y);
    }

    mult(scalar: number): Vector {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    }

    sub(v: Vector): Vector {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    }

    add(v: Vector): Vector {
      this.x += v.x;
      this.y += v.y;
      return this;
    }

    div(scalar: number): Vector {
      this.x /= scalar;
      this.y /= scalar;
      return this;
    }

    mag(): number {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    lerp(v: Vector, amount: number): Vector {
      this.x += (v.x - this.x) * amount;
      this.y += (v.y - this.y) * amount;
      return this;
    }
  }

  class Node {
    pos: Vector;
    force: Vector;
    mass: number;
    // fs: any[];

    constructor(pos: Vector, size: number) {
      this.pos = pos;
      this.force = new Vector(0, 0);
      this.mass = (2 * Math.PI * size) / 1.5;
      // this.fs = [];
    }

    update(): void {
      const force = this.force.copy();
      const vel = force.copy().div(this.mass);
      this.pos.add(vel);
    }

    draw(): void {
      p5.ellipse(this.pos.x, this.pos.y, 10, 10);
    }
  }

  // Type for connection between nodes
  type NodeConnection = [number, number, number]; // [node1Index, node2Index, maxDistance]

  function createVector(x: number, y: number): Vector {
    return new Vector(x, y);
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
      const node1 = nodes[con[0]];
      const node2 = nodes[con[1]];
      // const maxDis = con[2];
      const dis = node1.pos.copy().sub(node2.pos);
      // const diff = dis.mag() - maxDis;
      node1.force.sub(dis);
      node2.force.add(dis);
    });
  }

  // Setup function
  p5.setup = () => {
    p5.frameRate(24)
    parentStyle = window.getComputedStyle(parentRef);
    canvasWidth = parseInt(parentStyle.width);
    canvasHeight = parseInt(parentStyle.height);
    p5.createCanvas(canvasWidth, canvasHeight).parent(parentRef);
    p5.fill(0, 74, 88);
    // p5.fill(0, 163, 136);

    for (let i = 0; i < noNodes; i++) {
      const x = p5.random(
        -startDisMultiplier * canvasWidth,
        startDisMultiplier * canvasWidth
      ) ;
      const y = p5.random(
        -startDisMultiplier * canvasHeight,
        startDisMultiplier * canvasHeight
      );
      const node = new Node(createVector(x, y), p5.random(1, 5));
      nodes.push(node);
    }

    closeNode = nodes[0];

    for (let n = 0; n < noConn; n++) {
      nodeCon.push([
        Math.round(p5.random(noNodes - 1)),
        Math.round(p5.random(noNodes - 1)),
        p5.random(100, 300),
      ]);
    }

    nodeCon.push([0, 1, 200]);

    // Let's add a connection from all solo nodes for good measure
    const connected = new Set<number>();

    nodeCon.forEach((conn) => {
      connected.add(conn[0]);
      connected.add(conn[1]);
    });

    for (let n = 0; n < noNodes; n++) {
      if (!connected.has(n)) {
        nodeCon.push([
          n,
          Math.round(p5.random(noNodes - 1)),
          p5.random(100, 300),
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
    p5.background(17,22,35);

    nodeCon.forEach((con) => {
      const node1 = nodes[con[0]];
      const node2 = nodes[con[1]];
      p5.stroke(200,200,200,75)
      p5.line(node1.pos.x, node1.pos.y, node2.pos.x, node2.pos.y);
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
  };


  p5.windowResized = () =>{
    p5.resizeCanvas(canvasWidth, canvasHeight);
  }
};
