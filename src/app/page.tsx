import NavBar from "../components/osisi-ui/navs/NavigationBar";
import Hero from "../features/home/sections/Hero";
import { ThemeModeToggle } from "@/components/theme-toggle";
import Head from "next/head";
import BackgroundLeaves from "../components/osisi-ui/BackgroundLeaves";

export default function Home() {
  return (
    <>
      <Head>
        <link rel="preload" as="image" href="/community-2.png" />
        <link rel="preload" as="image" href="/family-tree.png" />
      </Head>
      <div className=" font-cardo relative min-h-screen overflow-x-clip bg-background-muted">
        <BackgroundLeaves />
        <NavBar />
        <Hero />
        <div className="fixed bottom-0 right-0 p-2">
          <ThemeModeToggle />
        </div>
      </div>
    </>
  );
}
