import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileStickyAd } from "@/components/MobileStickyAd";

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col pb-14 md:pb-0">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <MobileStickyAd />
      {adsenseClientId && (
        // Plain <script>, not next/script: AdSense's site-verification
        // crawler reads the raw HTML response and needs a literal
        // <script src="..."> tag. next/script's beforeInteractive strategy
        // instead ships it as a preload link + hydration payload, which
        // that crawler doesn't recognize as "the snippet is present".
        // Scoped to this (site) layout only, not the root layout, so it
        // never loads on /admin/* pages (no publisher content there).
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
          crossOrigin="anonymous"
        />
      )}
    </div>
  );
}
