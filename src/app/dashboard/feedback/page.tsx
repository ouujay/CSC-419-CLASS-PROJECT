import Link from "next/link";
import React from "react";
import Form from "./Form";

export default function page() {
  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 md:px-8 lg:px-12">
      <h3 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8">
        Feedback
      </h3>

      {/* Cal.com Meeting Section */}
      <section className="mb-6 sm:mb-8 p-4 sm:p-6 rounded border  shadow-sm">
        <h5 className="text-lg font-medium mb-2 sm:mb-4">
          Setup a Meeting (Recommended)
        </h5>
        <p className="text-sm sm:text-base mb-4 text-muted-foreground">
          Schedule a one-on-one meeting with our team.
        </p>
        <Link
          href="https://cal.com/osisi/feedback-call"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-white text-sm sm:text-base px-4 py-2 rounded hover:opacity-80 inline-block transition"
        >
          Schedule Meeting
        </Link>
      </section>

      {/* Feedback Form */}
      <div className="mb-6 sm:mb-8">
        <Form />
      </div>

      {/* Email Section */}
      <section className="p-4 sm:p-6 rounded border  shadow-sm">
        <h5 className="text-lg font-medium mb-2 sm:mb-4">Send us an Email</h5>
        <a
          href="mailto:support@osisi.com"
          className="text-primary text-sm sm:text-base hover:underline"
        >
          osisi.team@gmail.com
        </a>
      </section>
    </div>
  );
}
