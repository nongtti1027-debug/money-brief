import { AdSlot } from "./AdSlot";

export function MobileStickyAd() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white md:hidden">
      <AdSlot position="mobile-sticky" />
    </div>
  );
}
