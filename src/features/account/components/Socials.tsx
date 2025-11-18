"use client";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";

export function Login({
  text,
  returnTo,
  variant,
  children,
  size,
  className,
}: {
  size?: "sm" | "lg" | "icon";
  text?: string;
  returnTo?: string;
  children?: React.ReactNode;
  variant?: "outline" | "default";
  className?: string;
}) {
  const { loginWithRedirect } = useAuth0();
  return (
    <Button
      onClick={() =>
        loginWithRedirect({
          authorizationParams: {
            connection: "",
            redirect_uri: window.location.origin + "/account",
            screen_hint: "login",
          },
          appState: {
            returnTo: returnTo,
          },
        })
      }
      className={cn(className)}
      size={size}
      variant={variant || "default"}
      aria-label="Sign in to your Osisi account"
    >
      {children || text || "Sign in"}
    </Button>
  );
}

export function SignUp({
  text,
  returnTo,
  variant,
  children,
  size,
  className,
}: {
  size?: "sm" | "lg" | "xl"| "icon";
  text?: string;
  returnTo?: string;
  children?: React.ReactNode;
  variant?: "outline" | "default";
  className?: string;
}) {
  const { loginWithRedirect } = useAuth0();
  return (
    <Button
      onClick={() =>
        loginWithRedirect({
          authorizationParams: {
            connection: "",
            redirect_uri: window.location.origin + "/account",
            screen_hint: "signup",
          },
          appState: {
            returnTo: returnTo,
          },
        })
      }
      className={cn(className)}
      variant={variant || "outline"}
      size={size}
      aria-label="Sign up to your Osisi account"
    >
      {children || text || "Sign up"}
    </Button>
  );
}
