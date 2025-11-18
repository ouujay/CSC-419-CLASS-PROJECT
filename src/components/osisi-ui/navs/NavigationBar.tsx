"use client";
import { Button } from "@/components/ui/button";
import {  SignUp } from "@/features/account/components/Socials";
import { useConvexAuth } from "convex/react";
import { Leaf, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function NavigationBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoading, isAuthenticated } = useConvexAuth();

  return (
    <nav className="w-full bg-background py-4 px-4 md:px-8 text-foreground border-b sticky top-0 left-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={"/"} className="flex gap-1 items-center">
          <Leaf className="size-6 text-primary" />
          <h4 className="text-primary">Osisi</h4>
        </Link>

        <div className="hidden md:flex space-x-4 font-sora items-center">
          <Button variant={"link"} asChild>
            <Link href={"/families"}>Sample Families</Link>
          </Button>
          {isLoading ? (
            <Button>Loading</Button>
          ) : (
            <>
              {isAuthenticated ? (
                <Button asChild>
                  <Link href={"/dashboard"}>Dashboard</Link>
                </Button>
              ) : (
                <>
                  <SignUp text="Get Started" variant="default" size="lg" />
                </>
              )}
            </>
          )}
        </div>

        <div className="md:hidden focus:outline-none">
          {menuOpen ? (
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => setMenuOpen(!menuOpen)}
              className=""
            >
              <X className="size-6 text-primary" />
            </Button>
          ) : (
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => setMenuOpen(!menuOpen)}
              className=""
            >
              <Menu className="size-6 text-primary" />
            </Button>
          )}
        </div>

        {/* Mobile Toggle Button */}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col  gap-4  font-sora">
          <Button variant={"link"} asChild>
            <Link href={"/families"}>Sample Families</Link>
          </Button>
          {isLoading ? (
            <Button>Loading</Button>
          ) : (
            <>
              {isAuthenticated ? (
                <Button asChild>
                  <Link href={"/dashboard"}>Dashboard</Link>
                </Button>
              ) : (
                <SignUp text="Get Started" variant="default" size="lg" />
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
}
