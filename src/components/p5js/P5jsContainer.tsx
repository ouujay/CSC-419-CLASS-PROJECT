'use client'
import React, { useEffect, useRef, useState } from "react";
import p5Types from "p5";
import { cn } from "@/utils/utils"; // Update the import path to match your project structure
import { P5jsContainerRef, P5jsSketch } from "@/types";

// Component definition with generic type and className prop
export function P5jsContainer<T>({ 
  sketch, 
  data,
  className
}: { 
  sketch: P5jsSketch<T>, 
  data?: T,
  className?: string
}): React.JSX.Element {
  const parentRef = useRef<P5jsContainerRef>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // on mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let p5instance: p5Types | null = null;
    const initP5 = async () => {
      try {
        // import the p5 and p5-sounds client-side
        const p5 = (await import("p5")).default;
        new p5((p) => {
          if (parentRef.current) {
            sketch(p, parentRef.current, data as T);
          }
          p5instance = p;
        });
      } catch (error) {
        console.log(error);
      }
    };
    initP5();

    return () => {
      if (p5instance) {
        p5instance.remove();
      }
    };
  }, [isMounted, sketch, data]); 

  return (
    <div 
      ref={parentRef} 
      className={cn("", className)}
      key={'osisi'}
    ></div>
  );
}