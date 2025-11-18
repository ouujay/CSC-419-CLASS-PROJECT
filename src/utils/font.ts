import { Sora, Cardo } from "next/font/google";

export const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const cardo = Cardo({
  weight: "400",
  variable: "--font-cardo",
  subsets: ["latin"],
});
