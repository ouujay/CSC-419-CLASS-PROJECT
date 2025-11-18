import type { Metadata } from "next";
import { Id } from "@/convex/_generated/dataModel";
import EditPreviewLinks from "@/features/layouts/components/EditPreviewLinks";

export const metadata: Metadata = {
  title: "Descendants | Layouts | Family",
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
  const familyId = familyParams.family_id as Id<"families">;

  return (
    <section className=" h-full grid grid-rows-1 relative">
      <EditPreviewLinks familyId={familyId} />
      <main className="p-0 h-full">{children}</main>
    </section>
  );
}
