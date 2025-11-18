import React from "react";
import { Button } from "../ui/button";

export default function BackButton() {
  return (
    <Button variant="outline" size="sm" onClick={() => window.history.back()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
      Back
    </Button>
  );
}
