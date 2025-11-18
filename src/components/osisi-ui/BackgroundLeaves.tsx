'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const leafSvgs = [
  '/svgs/leaf/leaves-2-svgrepo-com.svg',
  '/svgs/leaf/leaves-3-svgrepo-com.svg',
  '/svgs/leaf/leaves-4-svgrepo-com.svg',
  '/svgs/leaf/leaves-5-svgrepo-com.svg',
];

interface Leaf {
  id: number;
  src: string;
  top: number;
  left: number;
  rotate: number;
  scale: number;
}

export default function BackgroundLeaves() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const generatedLeaves: Leaf[] = [];
    for (let i = 0; i < 200; i++) {
      generatedLeaves.push({
        id: i,
        src: leafSvgs[Math.floor(Math.random() * leafSvgs.length)],
        top: Math.random() * 100,
        left: Math.random() * 100,
        rotate: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5, // 0.5 to 1.0
      });
    }
    setLeaves(generatedLeaves);
  }, []);

  return (
    <div className=" absolute inset-0 pointer-events-none -z-10 h-full">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute opacity-20"
          style={{
            top: `${leaf.top}%`,
            left: `${leaf.left}%`,
            transform: `rotate(${leaf.rotate}deg) scale(${leaf.scale})`,
          }}
        >
          <Image
            src={leaf.src}
            alt="leaf"
            width={50}
            height={50}
            className="w-12 h-12"
            priority
          />
        </div>
      ))}
    </div>
  );
}