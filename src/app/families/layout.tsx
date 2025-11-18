import type { Metadata } from "next";
import NavBar from "../../components/osisi-ui/navs/NavigationBar";

export const metadata: Metadata = {
  title: "Family",
  description: "Remember your roots",
};
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" font-cardo relative min-h-screen overflow-x-clip grid grid-rows-[auto_1fr]">
      <NavBar />
      <div className=" h-full bg-background-muted">{children}</div>
    </div>
  );
}
