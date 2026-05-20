import type { Metadata } from "next";
import SmoothScroll from "./components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "CAPOS | Exceptional Coffee Moments",
  description: "Premium single-origin and artisanal coffee blends. Ethically sourced, expertly roasted, thoughtfully crafted.",
  keywords: "coffee, specialty coffee, artisanal, single origin, CAPOS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
