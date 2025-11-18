import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/sidebar/app-sidebar";
import { DashboardHeader } from "@/components/osisi-ui/DashboardHeader";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
} from "@/features/account/components/helpers";
import Loader from "@/components/osisi-ui/skeleton/Loader";
import { OnboardingProvider } from "@/features/onboarding/contexts/OnboardingContext";
import { Login } from "@/features/account/components/Socials";

export const metadata: Metadata = {
  title: "Dashboard | Osisi",
  description: "Remember your roots",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Authenticated>
        <OnboardingProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="relative">
              <DashboardHeader />
              <div className=" h-full overflow-auto bg-background-muted">{children}</div>
            </SidebarInset>
          </SidebarProvider>
        </OnboardingProvider>
      </Authenticated>
      <Unauthenticated>
        <div className="flex flex-col gap-4 justify-center items-center h-screen">
          <p>Please login to access the dashboard</p>

          <Login text="Login" />
        </div>
      </Unauthenticated>
      <AuthLoading>
        <Loader />
      </AuthLoading>
    </>
  );
}
