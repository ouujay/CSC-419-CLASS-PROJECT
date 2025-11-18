"use client";
import React, { useState } from "react";

const testimonials = [
  {
    preview: "I think Osisi is that product that I've always wanted but never knew I'd be able to get.",
    quote:
      "I think Osisi is that product that I've always wanted but never knew I'd be able to get. Being able to have a digital keepsake of my family tree from generations back is the coolest thing anybody who's passionate about history and family lore could ever have! The whole process is fun and exciting and might I say, a means to family reconnection.",
    author: "Nicole Nwaeze",
  },
  {
    preview:
      "Osisi is not a luxury; it is a necessity for every family that truly cares about their roots and heritage.",
    quote:
      "Osisi is the first indigenous family tree management application, and it delivers impressively on the quality of service it promises. Africa, in general, is not widely known for preserving history through accurate oral narrations, and this has long been one of our greatest cultural setbacks. In light of this, Osisi comes as a timely and invaluable solution. With Osisi, you can preserve the treasured story of your family lineage, ensuring an uncompromised narrative that can be passed down faithfully for generations—even long after you are gone. Osisi is not a luxury; it is a necessity for every family that truly cares about their roots and heritage.",
    author: "Adediwura Adelabu",
  },
  {
    preview: "Even in the Alpha stage, Osisi has been wonderful and convenient to use.",
    quote:
      "Even in the Alpha stage, Osisi has been wonderful and convenient to use. The layout and functionality of the app are user-friendly, and the team behind it is very open to opinions and actively looking for ways to perfect it. Definitely recommend!",
    author: "Oluwatosin Iluromi",
  },
  {
    preview: "Using Osisi made me realize the knowledge gaps I had about my family background.",
    quote: `I had never thought to ask about my paternal grandmother's name.

      She passed away long before I was born. Using Osisi made me realize the knowledge gaps I had about my family background.
      
      The app's interface really guided me through gathering information, and it felt nostalgic and meaningful to piece together all these family histories I'd never known.`,
    author: "Sharon Ibejih",
  },
];

export default function Testimonials() {
  // const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-10 md:py-16 w-full">
      <div className="relative">
        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .animate-scroll {
            animation: scroll 10s linear infinite;
          }

          .animate-scroll.paused {
            animation-play-state: paused;
          }
        `}</style>

        <div
          className={`flex gap-4 md:gap-6 animate-scroll ${isPaused ? "paused" : ""}`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            // setHoveredIndex(null);
          }}
        >
          {duplicatedTestimonials.map((testimonial, index) => {
            // const isExpanded = hoveredIndex === index;
            // const displayText = isExpanded ? testimonial.quote : testimonial.preview;

            return (
              <div
                key={index}
                // onMouseEnter={() => setHoveredIndex(index)}
                className="flex-shrink-0 w-[300px] md:w-[400px] p-4 md:p-6 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary relative group bg-background shadow-md"
              >
                <div className="flex flex-col justify-between min-h-[140px]">
                  <div className="">
                    <h6 className="italic text-sm md:text-base leading-relaxed transition-all duration-300 font-sora">
                      {testimonial.preview}
                    </h6>
                  </div>

                  <p className="font-medium text-primary mt-3 md:mt-4 text-sm md:text-base font-cardo">
                    — {testimonial.author}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
