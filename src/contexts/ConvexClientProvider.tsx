"use client";

import { clientId, customDomain, domain } from "@/utils/constants";
import { Auth0Provider } from "@auth0/auth0-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth0 } from "convex/react-auth0";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
export function ConvexClientProvider({ children }: { children: ReactNode }) {

  return (
    <Auth0Provider
      domain={customDomain!}
      clientId={clientId!}
      authorizationParams={{
        redirect_uri:
          typeof window !== "undefined"
            ? window.location.origin + "/account"
            : "",
        audience: `https://${domain}/api/v2/`,
        scope: "openid profile email"
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
      onRedirectCallback={(appState) => {
        if (typeof window !== "undefined") {
          window.location.href = appState?.returnTo || "/account";
        }
      }}
    >
      <ConvexProviderWithAuth0 client={convex}>
        {children}
      </ConvexProviderWithAuth0>
    </Auth0Provider>
  );
}
