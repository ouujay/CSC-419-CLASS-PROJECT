import type { Metadata } from "next";
import { PublicFamilyProvider } from "@/contexts/PublicFamilyContext";
import { Id } from "@/convex/_generated/dataModel";
import PublicFamilyNavigation from "@/features/family/components/PublicFamilyNavigation";

export const metadata: Metadata = {
  title: "Family",
  description: "Remembering your roots",
};

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ family_id: string }>;
}>) {
  const familyParams = await params;
  const familyId = decodeURIComponent(familyParams.family_id) as Id<"families">;

  return (
    <PublicFamilyProvider familyId={familyId}>
      <section className="h-full grid grid-rows-[auto_1fr] relative  z-20 ">
        <PublicFamilyNavigation />
        <main className=" h-full">{children}</main>
      </section>
    </PublicFamilyProvider>
  );
}
