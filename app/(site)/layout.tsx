import SmoothScroll from "../components/SmoothScroll";
import Cursor from "../components/Cursor";
import LoadingScreen from "../components/LoadingScreen";
import PageTransition from "../components/PageTransition";
import MagneticButtons from "../components/MagneticButtons";

/**
 * Marketing site chrome only — not applied to /studio.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <LoadingScreen />
      <Cursor />
      <MagneticButtons />
      <SmoothScroll>
        <PageTransition>
          <div id="main">{children}</div>
        </PageTransition>
      </SmoothScroll>
    </>
  );
}
