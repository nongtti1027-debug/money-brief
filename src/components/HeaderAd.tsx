"use client";

import { usePathname } from "next/navigation";
import { AdSlot } from "./AdSlot";

// Pages with little or no publisher content (a bare search box, a legal
// text page) shouldn't carry ads — Google's policy flags "ads on screens
// with no content" at the domain level even if the ad only appears in a
// shared header. Hide it here instead of gating every page individually.
const NO_AD_PREFIXES = ["/search", "/privacy"];

export function HeaderAd() {
  const pathname = usePathname();
  if (NO_AD_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }
  return (
    <div className="border-t border-neutral-100 bg-neutral-50 py-2">
      <div className="mx-auto max-w-6xl px-4">
        <AdSlot position="header" />
      </div>
    </div>
  );
}
