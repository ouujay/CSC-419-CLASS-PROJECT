"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { redirect } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";
import { tryCatch } from "@/utils/try-catch";
import { ConvexError } from "convex/values";
import { c_CreateUser } from "@/fullstack/PublicConvexFunctions";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import { Login } from "./components/Socials";

export default function Authenticate() {
  const { isLoading, logout } = useAuth0();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const saveUser = useMutation(c_CreateUser);

  useEffect(() => {
    async function addNewUser() {
      const { error } = await tryCatch<Id<"users">, ConvexError<string>>(
        saveUser()
      );
      if (error) {
        setErrorMessage(error.data);
        return;
      }

      redirect("/dashboard");
    }
    if (!isLoading) {
      addNewUser();
    }
  }, [saveUser, isLoading, logout]);

  if (errorMessage) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Authentication Error</h2>
          <p className=" text-lg">{errorMessage}</p>
        </div>
        <div className="flex gap-6 mt-4">
          <Link
            href="/"
            className="px-4 py-2 text-primary hover:opacity-75 hover:underline font-medium"
          >
            Return to Home
          </Link>
          <Login text="Login Again" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Loading...</p>
    </div>
  );
}
