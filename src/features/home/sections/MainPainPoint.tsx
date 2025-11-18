import { SignUp } from "@/features/account/components/Socials";
import Image from "next/image";
import React from "react";

export default function MainPainPoint() {
  return (
    <section className="min-h-[50dvh] grid grid-cols-1 md:grid-cols-2 border-y">
      <div className="w-full h-64 md:h-full">
        <Image
          src="/landing-pic-1.jpg"
          alt="Hero Pic"
          width={600}
          height={600}
          className="w-full h-full object-cover"
          priority
        />
      </div>
      <div className="max-w-xl m-auto space-y-6 px-4 py-12 md:py-0">
        <h2 className=" font-cardo text-primary leading-tight">
          Don&apos;t Let Your Family&apos;s Story Disappear
        </h2>
        <p className="max-w-md text-base sm:text-lg text-foreground/80">
          Waiting until it&apos;s too late or using generic tools—means stories
          get lost, names fade, and connections break.
        </p>

        <p className="max-w-md text-base sm:text-lg text-foreground/80">
          Osisi makes preserving your heritage simple and culturally relevant.
          From visual family trees to collaborative storytelling, we help you
          capture, protect, and share your family&apos;s story for generations
          to come.
        </p>
        <SignUp text="Start Preserving Today" variant="default" size="lg" />
      </div>
    </section>
  );
}
