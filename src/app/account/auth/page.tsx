import AuthPage from "@/features/account/features/auth/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Osisi",
  description: "Login to your Osisi account to access personalized features.",
};
export default function Page() {
  return <AuthPage />;
}
