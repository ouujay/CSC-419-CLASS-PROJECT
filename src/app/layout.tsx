import type { Metadata } from "next";
import "./globals.css";
import { cardo, sora } from "@/utils/font";
import { ConvexClientProvider } from "../contexts/ConvexClientProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Osisi",
  description: "Remembering our roots",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" className="scroll-smooth">
        {/* <head>
          <script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
          />
        </head> */}
        <body
          className={`${sora.variable} ${cardo.variable} antialiased bg-background`}
        >
          <main>
            <ConvexClientProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
              >
                {children}
              </ThemeProvider>
            </ConvexClientProvider>
            <Toaster />
          </main>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
