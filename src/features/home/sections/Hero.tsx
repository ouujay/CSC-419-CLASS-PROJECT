import { Badge } from "@/components/ui/badge";
import { SignUp } from "@/features/account/components/Socials";
// import Image from "next/image";
import React from "react";

export default function Hero() {
  return (
    <section className="min-h-screen grid relative isolate">
      {/* <Image
        src="/hero-pic-2.jpg"
        alt="Hero Pic"
        width={600}
        height={600}
        className="w-full h-full object-cover absolute -z-10"
        priority
      /> */}
      {/* Left Content */}
      <div className=" m-auto space-y-6 px-2 py-12 md:py-8  h-full w-full text-center flex flex-col justify-center  items-center ">
        <Badge className="font-sora" variant={"outline"}>
          1000+ family members preserved on osisi
        </Badge>
        <h2 className=" font-cardo leading-tight text-primary">
          Preserve your family history <br /> for the next generation.
        </h2>
        <SignUp text="Preserve Your Family History" size="xl" variant="default" />
        <div className="flex gap-2 justify-center items-center">
          <Badge className="font-sora" variant={"outline"}>
            Get started for free
          </Badge>
        </div>
      </div>
    </section>
  );
}
