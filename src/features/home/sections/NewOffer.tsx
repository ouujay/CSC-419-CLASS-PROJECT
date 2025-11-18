import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function NewOffer() {
  return (
    <section className="py-12 md:py-20 bg-accent/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <h1 className="font-cardo text-2xl sm:text-3xl md:text-4xl text-primary mb-3 md:mb-4">
            Preserve Your Family Legacy in Just One Call
          </h1>
          <p className="text-base sm:text-lg max-w-xl md:max-w-2xl mx-auto text-gray-300 mb-4 md:mb-6">
            We’ll do the hard part — you just show up.
            <br />
            In 20 minutes, we’ll gather your stories, build your family tree,
            and send it to your inbox.
          </p>
        </div>
        <div className="max-w-lg md:max-w-3xl mx-auto">
          <div className="bg-gray-900/60 rounded-xl p-5 sm:p-8 mb-6 md:mb-8 text-left border border-primary/20 shadow-lg">
            <h2 className="font-sora text-base sm:text-lg text-primary mb-3 sm:mb-4">
              How It Works
            </h2>
            <ol className="list-decimal pl-5 space-y-3 sm:space-y-4 text-gray-200 text-sm sm:text-base md:text-lg font-sora">
              <li>Join a quick Google Meet call</li>
              <li>We build your family tree</li>
              <li>You receive your custom tree by email</li>
            </ol>
          </div>
          <div className="text-center">
            <Link
              href="https://cal.com/osisi/create-your-family-tree-with-us"
              className="rounded bg-primary font-sora cursor-pointer group flex gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-light items-center justify-center text-center text-white"
              target="_blank"
            >
              Create My Family Tree <ExternalLink className="size-4" />
            </Link>
            <div className="text-gray-400 mt-2 sm:mt-3 font-sora text-xs">
              Limited free sessions available each week. No stress. No cost.
              Just your story.
            </div>
            <div className="text-gray-400 mt-1 font-sora text-xs">
              This offer lasts till the 1st of August
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
