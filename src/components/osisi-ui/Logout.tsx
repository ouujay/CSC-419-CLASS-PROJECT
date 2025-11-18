"use client";
import { api } from "@/convex/_generated/api";
import { tryCatch } from "@/utils/try-catch";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export function LogoutButton() {
  const { logout } = useAuth0();
  const updateLogout = useMutation(api.users.mutations.logout);

  const handleLogout = async () => {
    const { error } = await tryCatch<null, ConvexError<string>>(updateLogout());

    if (error) {
      toast(error.data);
      return;
    }

    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <button onClick={handleLogout} className="flex gap-2 w-full">
      <LogOut />
      Log out
    </button>
  );
}
