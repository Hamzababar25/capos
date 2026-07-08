import type { Metadata, Viewport } from "next";
import SmoothScroll from "./components/SmoothScroll";
import Cursor from "./components/Cursor";
import LoadingScreen from "./components/LoadingScreen";
import PageTransition from "./components/PageTransition";
import MagneticButtons from "./components/MagneticButtons";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://capos.coffee"),
  title: "CAPOS Coffee | Premium Coffee Cart Catering — Tri-State Area",
  description: "Handcrafted espresso experiences for weddings, corporate events & private gatherings across NY, NJ, CT & PA. A marriage of cultures, one unforgettable cup at a time.",
  keywords: "coffee catering, wedding coffee bar, corporate coffee service, espresso cart, CAPOS coffee, tri-state coffee catering, mobile coffee bar",
  authors: [{ name: "CAPOS Coffee" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "CAPOS Coffee | Premium Coffee Cart Catering",
    description: "Handcrafted espresso experiences, tailored to every occasion. Serving NY, NJ, CT & PA.",
    type: "website",
    locale: "en_US",
    siteName: "CAPOS Coffee",
    images: [{ url: "/logo.png", width: 596, height: 627, alt: "CAPOS Coffee" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CAPOS Coffee | Premium Coffee Cart Catering",
    description: "Handcrafted espresso experiences, tailored to every occasion.",
    images: ["/logo.png"],
  },
};

/* Explicit viewport meta so mobile browsers render at the right density
   and don't allow accidental pinch-zoom breaking the WebGL cursor. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#080d0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Accessible skip-to-content — invisible until keyboard-focused */}
        <a href="#main" className="skip-link">Skip to content</a>
        <LoadingScreen />
        <Cursor />
        <MagneticButtons />
        <SmoothScroll>
          <PageTransition>
            <div id="main">{children}</div>
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}
