import { Login } from "@/features/account/components/Socials";
import Link from "next/link";
import React from "react";

export function LoadingError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 h-full">
      <svg
        className="size-6 text-red-400 mb-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 className="text-lg font-semibold mb-4">Failed to Load Data</h3>
      <p>{message}</p>
      <p>or</p>
      <p className=" text-sm mt-8">
        Please try refreshing the page or check your connection.
      </p>
    </div>
  );
}

export function UserError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 h-full">
      <svg
        className="size-6 text-red-400 mb-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 className="text-lg font-semibold mb-4">Error</h3>
      <p>{message}</p>
      <div className="flex gap-6 mt-4">
        <Link
          href="/"
          className="px-4 py-2 text-primary hover:opacity-75 hover:underline font-medium"
        >
          Return to Home
        </Link>
        <Login text="Try Again" />
      </div>
    </div>
  );
}
