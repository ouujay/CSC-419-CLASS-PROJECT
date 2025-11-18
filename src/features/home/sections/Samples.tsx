// SampleExplorer.jsx
import React from "react";
import { DemoDescendantsPage } from "@/features/layouts/components/DescendantsPage";
import { DemoFamilyProvider } from "@/contexts/DemoFamilyContext";
import { SignUp } from "@/features/account/components/Socials";

export default function SampleExplorer() {
  return (
    <section className=" grid  gap-6 md:gap-8 lg:gap-12 py-10 md:py-16 items-center lg:max-w-7xl mx-auto px-4">
      <div className="space-y-3 px-8 text-center ">
        <h3 className=" font-cardo text-primary leading-tight">Share your family tree with your family</h3>
        <p>{`Download and share a beautiful image of your tree with loved ones.`}</p>
        <SignUp text="Preserve your family for free" variant="default" size="lg" />
      </div>
      <div className="w-full h-full">
        <DemoFamilyProvider>
          <div className="w-full h-[75dvh] bg-background-muted m-auto rounded-2xl border-2">
            <DemoDescendantsPage />
          </div>
        </DemoFamilyProvider>
      </div>
    </section>
  );
}
