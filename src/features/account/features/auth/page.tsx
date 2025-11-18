"use client";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import Loader from "@/components/osisi-ui/skeleton/Loader";

export default function AuthPage() {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const redirectUri = window.location.origin + "/account";
      loginWithRedirect({
        authorizationParams: {
          connection: "",
          redirect_uri: redirectUri,
        },
      });
    }
  }, [loginWithRedirect]);
  return <Loader />;
}
