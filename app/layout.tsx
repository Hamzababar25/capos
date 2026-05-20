import type { Metadata } from "next";
import SmoothScroll from "./components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "CAPOS Coffee | Premium Artisanal Coffee Roasters",
  description: "Experience exceptional coffee moments with CAPOS. Premium single-origin and artisanal coffee blends, ethically sourced and expertly roasted in small batches.",
  keywords: "coffee, specialty coffee, artisanal coffee, single origin, coffee roasters, premium coffee, CAPOS, ethically sourced coffee, small batch roasting",
  authors: [{ name: "CAPOS Coffee" }],
  openGraph: {
    title: "CAPOS Coffee | Premium Artisanal Coffee Roasters",
    description: "Experience exceptional coffee moments with CAPOS. Premium single-origin and artisanal coffee blends.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CAPOS Coffee | Premium Artisanal Coffee Roasters",
    description: "Experience exceptional coffee moments with CAPOS.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
