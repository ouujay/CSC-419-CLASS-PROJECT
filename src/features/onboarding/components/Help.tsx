import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Help() {
  return (
    <Link
      href="https://cal.com/osisi/create-your-family-tree-with-us"
      className="rounded border border-secondary font-sora cursor-pointer group flex gap-2 px-6 py-3 text-base font-light text-secondary items-center"
      target="_blank"
    >
      Book a call <ExternalLink className="size-4" />
    </Link>
  );
}
