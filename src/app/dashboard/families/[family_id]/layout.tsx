import { DashboardFamilyProvider } from "@/contexts/DashboardFamilyContext";
import { Id } from "@/convex/_generated/dataModel";
import DashboardFamilyNavigation from "@/features/family/components/DashboardFamilyNavigation";

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ family_id: string}>;
}>) {
  const familyParams = await params;
  const familyId = decodeURIComponent(familyParams.family_id) as Id<"families">;

  return (
    <section className="h-full grid grid-rows-[auto_1fr] relative ">
      <DashboardFamilyProvider familyId={familyId}>
        <DashboardFamilyNavigation />
        <main className=" h-full isolate bg-background-muted">{children}</main>
      </DashboardFamilyProvider>
    </section>
  );
}
