import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileStickyAd } from "@/components/MobileStickyAd";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col pb-14 md:pb-0">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <MobileStickyAd />
    </div>
  );
}
