"use client";
import React, { useState } from "react";
import {
  Authenticated,
  Unauthenticated,
  AuthLoading,
} from "@/features/account/components/helpers";
import {
  Login,
  SignUp,
} from "@/features/account/components/Socials";
import { redirect, useSearchParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import {
  c_AcceptCollaboration,
  c_GetCollaboratorDetails,
} from "@/fullstack/PublicConvexFunctions";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { tryCatch } from "@/utils/try-catch";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import Loader from "@/components/osisi-ui/skeleton/Loader";
import FamilyName from "@/components/osisi-ui/FamilyName";

export default function Page() {
  const searchParams = useSearchParams();
  const collaborationId = searchParams.get("collaborationId");
  return (
    <>
      <Authenticated>
        <Invite
          collaborationId={collaborationId as Id<"family_collaborators">}
        />
      </Authenticated>
      <Unauthenticated>
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
          <h5 className=" ">
            Welcome! You&apos;re not logged in.
          </h5>
          <p className="max-w-md ">
            To proceed with the invitation process, please authenticate your
            account.
          </p>
          <div className="flex gap-4">
            <Login
              text="Login"
              returnTo={`/invite?collaborationId=${collaborationId}`}
            />
            <SignUp
              text="Sign Up"
              returnTo={`/invite?collaborationId=${collaborationId}`}
            />
          </div>
        </div>
      </Unauthenticated>
      <AuthLoading>
        <Loader />
      </AuthLoading>
    </>
  );
}

function Invite({
  collaborationId,
}: {
  collaborationId: Id<"family_collaborators">;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { data, isPending, isError, error } = useSafeQuery(
    c_GetCollaboratorDetails,
    {
      id: collaborationId,
    }
  );

  const acceptCollaboration = useMutation(c_AcceptCollaboration);
  async function handleAcceptInvite() {
    setIsLoading(true);
    if (!data?.owner.id) {
      console.error("No Owner found");
      toast("Error fetching collaboration date");
      setIsLoading(false);
      return;
    }

    const { error } = await tryCatch<{ success: boolean }, ConvexError<string>>(
      acceptCollaboration({
        eventType: "update_collaborator",
        id: collaborationId,
      })
    );

    if (error) {
      console.error(error.data);
      toast("Error Accepting collaboration");
      setIsLoading(false);
      return;
    }

    redirect(`dashboard/families/${data?.family.id}`);
  }
  if (isPending) {
    return <Loader />;
  }
  if (isError) {
    const cError = error as ConvexError<string>;
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4">
        <h4 className="text-xl font-semibold">Something went wrong</h4>
        <p className="text-muted-foreground w-[300px] text-center">
          {cError?.data || "Unable to fetch invitation details"}
        </p>
      </div>
    );
  }

  if (data.collaborator.status === "accepted") {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4">
        <h4 className="text-xl font-semibold">Invitation Accepted</h4>
        <p className="text-muted-foreground">
          This invitation has already been Accepted
        </p>
        <Button asChild variant="outline">
          <a href={`/dashboard/families/${data?.family.id}`}>
            Go to Family Dashboard
          </a>
        </Button>
      </div>
    );
  }
  return (
    <div className="justify-center items-center flex min-h-screen flex-col gap-4">
      <h4>Accept Invitation</h4>
      <p>
        Hey{" "}
        <span className="text-primary font-medium">{data?.user.username}</span>,
        You were invited by {data?.owner.username} to join{" "}
        <span className="text-primary font-medium">
          <FamilyName name={data.family?.name || ""} />
        </span>{" "}
      </p>
      <section className="border bg-accent/5 rounded p-2 font-sora min-w-[250px] w-[400px]">
        <div></div>
        <div className="flex gap-2  items-center">
          <figure className="size-10 border border-primary bg-primary/10 grid place-content-center rounded-full uppercase">
            {data.family?.name?.[0] || ""}
          </figure>
          <div className="mr-auto">
            <h6>
              <FamilyName name={data.family?.name || ""} />
            </h6>
            <p>{data?.family.description}</p>
            <div className="flex gap-2 text-xs capitalize">
              <p>as {data?.collaborator.role}</p>
            </div>
          </div>
          <Button onClick={handleAcceptInvite} disabled={isLoading}>
            Accept
          </Button>
        </div>
      </section>
    </div>
  );
}
