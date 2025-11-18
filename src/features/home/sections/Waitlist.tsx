"use client";

import FormInput from "@/components/osisi-ui/inputs/input";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { WaitlistSchema } from "@/convex/tables";
import { c_AddToWaitlist } from "@/fullstack/PublicConvexFunctions";
import { tryCatch } from "@/utils/try-catch";
import {  useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Check, LoaderCircle, Send, X } from "lucide-react";
import React, { useState } from "react";

interface messageType {
  message: string | null;
  success: boolean;
}
export default function Waitlist() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<messageType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const addToWaitlist = useMutation(c_AddToWaitlist);

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  async function uploadEmailData() {
    setMessage(null);
    setIsLoading(true);
    const { error: validationError } = WaitlistSchema.safeParse({ email, full_name: fullName })

    if (validationError) {
      setMessage({
        message: "Invalid email or Fullname",
        success: false,
      });
      setIsLoading(false);
      return;
    }

    const { error } = await tryCatch<Id<"waitlist">, ConvexError<string>>(
      addToWaitlist({ email, full_name: fullName })
    );

    if (error) {
      console.error(error.message);
      setMessage({ message: error.data, success: false });
      setIsLoading(false);
      return;
    }

    setMessage({ message: "You're on the waitlist! Check your email for confirmation.", success: true });
    setEmail("");
    setFullName("");
    setIsLoading(false);
  }

  return (
    <section className="py-20 bg-background border-t" id="waitlist">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-cardo text-primary mb-4">
            Join Our Waitlist
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Be one of the first to preserve and celebrate your family heritage
            on Osisi. Early access members will receive premium features free
            for life.
          </p>

          <div className="bg-background/10 backdrop-blur-sm p-8 rounded-lg border border-primary/20 max-w-md mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                uploadEmailData();
              }}
              className="flex flex-col gap-4 z-50"
            >
              <FormInput
                label="Full Name"
                placeholder="eg. Uju Ike"
                name="full_name"
                onChange={handleFullNameChange}
                value={fullName}
              />
              <FormInput
                label="Email"
                placeholder="example@osisi.xyz"
                name="email"
                onChange={handleEmailChange}
                value={email}
                type="email"
              />
              <div className="w-full mt-2">
                <Button
                  className="rounded bg-primary hover:bg-primary/90 cursor-pointer group w-full py-6 text-lg"
                  type="submit"
                  disabled={!!isLoading}
                >
                  <span>Get Early Access</span>
                  {isLoading ? (
                    <LoaderCircle className="ml-2 animate-spin" />
                  ) : (
                    <Send className="ml-2 translate-x-0 translate-y-0 group-hover:translate-x-1 group-hover:-translate-y-1 duration-300" />
                  )}
                </Button>
                {message && (
                  <div
                    className={`flex gap-2 items-center mt-3 p-3 rounded-md ${message.success ? "bg-green-500/10" : "bg-red-500/10"}`}
                  >
                    {message.success ? (
                      <span className="bg-green-500 rounded-full p-1 text-background">
                        <Check className="size-3" />
                      </span>
                    ) : (
                      <span className="bg-red-500 rounded-full p-1 text-background">
                        <X className="size-3" />
                      </span>
                    )}
                    <p
                      className={`text-sm ${message.success ? "text-green-400" : "text-red-400"}`}
                    >
                      {message.message}
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="mt-8 text-sm text-gray-400">
            <p>{`By joining our waitlist, you'll be the first to know when we launch.`}</p>
            <p>
              We respect your privacy and will never share your information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
