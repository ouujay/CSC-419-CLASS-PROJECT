import { Button } from "@/components/ui/button";
import { SignUp } from "@/features/account/components/Socials";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export function ValueProps2() {
  return (
    <section className=" grid grid-cols-1 border-y py-5 sm:py-10">
      <div className="max-w-3xl m-auto space-y-6 px-4 py-12 md:py-0 text-center">
        <h2 className=" font-cardo text-primary leading-tight">Create Your Family Tree Digitally</h2>
        <p className=" text-base sm:text-lg text-foreground/80">
          Our platform offers powerful tools to document, preserve, and share your family&apos;s legacy.
        </p>
      </div>
      <div className="w-full h-screen">
        <Image
          src="/family-tree-1.png"
          alt="family-tree"
          width={600}
          height={600}
          className="w-full h-full object-cover"
          priority
        />
      </div>
      <div className="text-center">
        <SignUp text="Create Family Tree" variant="default" size="lg" />
      </div>
    </section>
  );
}

export function ValueProps3() {
  return (
    <section className="min-h-[50dvh] grid grid-cols-1 md:grid-cols-2 border-y">
      <div className="max-w-xl m-auto space-y-6 px-4 py-12 md:py-0">
        <h2 className=" font-cardo text-primary leading-tight">Preserve it Physically</h2>
        <p className="max-w-md text-base sm:text-lg text-foreground/80">
          Order an Osisi frames of your family tree that you can hang it your home.
        </p>
        <SignUp text="Get Family Tree Certificate" variant="default" size="lg" />
      </div>
      <div className="w-full h-64 md:h-full">
        <Image
          src="/framed-family-tree.png"
          alt="framed-family-tree"
          width={600}
          height={600}
          className="w-full h-full object-cover"
          priority
        />
      </div>
    </section>
  );
}

export function ValueProps4() {
  return (
    <section className="min-h-screen bg-[url(/community-2.png)] bg-cover bg-center bg-no-repeat grid grid-cols-1 border-y ">
      <div className="w-full space-y-6 py-5 sm:py-10 px-4 text-center h-full bg-primary/10 flex justify-center items-center flex-col">
        <h2 className=" font-cardo leading-tight text-primary-foreground">Join our community today.</h2>
        <p className=" text-base sm:text-lg text-primary-foreground">
          {"Discover, connect, and preserve your family's story together."}
        </p>
        <div className="text-center">
          <Button asChild>
            <Link href={"https://chat.whatsapp.com/Llm52N4wZpF56vSdrE1k91"}>Join Our WhatsApp Community</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
