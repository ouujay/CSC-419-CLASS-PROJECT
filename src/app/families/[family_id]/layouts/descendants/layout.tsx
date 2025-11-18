import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Descendants | Layouts | Family",
  description: "Remembering your roots",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className=" h-full grid grid-rows-1 relative">
      <main className="p-0 h-full">{children}</main>
    </section>
  );
}
