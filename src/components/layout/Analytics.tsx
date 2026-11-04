"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";
import {
  analyticsConfigured,
  CONSENT_EVENT,
  GA_ID,
  getConsent,
  PLAUSIBLE_DOMAIN,
  setConsent,
  track,
  type Consent,
} from "@/lib/analytics";

function subscribe(cb: () => void) {
  window.addEventListener(CONSENT_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CONSENT_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

const getSnapshot = () => getConsent();
const getServerSnapshot = (): Consent | "unknown" => "unknown";

/**
 * Loads GA4 or Plausible only after consent, shows the consent banner, and
 * tracks outbound WhatsApp / phone / email clicks through one delegated
 * listener (links opt in with data-wa-context, or are detected by href).
 */
export function Analytics() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("https://wa.me/")) {
        track("whatsapp_click", {
          context: a.getAttribute("data-wa-context") ?? "general",
          page: window.location.pathname,
        });
      } else if (href.startsWith("tel:")) {
        track("phone_click", { page: window.location.pathname });
      } else if (href.startsWith("mailto:")) {
        track("email_click", { page: window.location.pathname });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!analyticsConfigured) return null;

  return (
    <>
      {consent === "granted" && GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false});`}
          </Script>
        </>
      ) : null}
      {consent === "granted" && PLAUSIBLE_DOMAIN ? (
        <>
          <Script id="plausible-init" strategy="afterInteractive">
            {`window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}`}
          </Script>
          <Script
            src="https://plausible.io/js/script.js"
            data-domain={PLAUSIBLE_DOMAIN}
            strategy="afterInteractive"
          />
        </>
      ) : null}
      {consent === null ? <ConsentBanner /> : null}
    </>
  );
}

function ConsentBanner() {
  return (
    <section
      aria-label="Analytics consent"
      className="fixed inset-x-3 bottom-[calc(var(--action-bar-h)+env(safe-area-inset-bottom)+12px)] z-40 max-w-md rounded-card border border-line bg-white p-5 shadow-float md:bottom-6 md:left-6"
    >
      <p className="text-meta text-ink">
        May we use privacy-friendly analytics to see which pages help people? We never send names,
        contact details or health information.{" "}
        <Link href="/privacy#cookies" className="link">
          Privacy notice
        </Link>
      </p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => setConsent("granted")}
          className="inline-flex h-10 items-center rounded-btn bg-blue-600 px-4 text-[14px] font-semibold text-white hover:bg-blue-700"
        >
          Allow analytics
        </button>
        <button
          type="button"
          onClick={() => setConsent("denied")}
          className="inline-flex h-10 items-center rounded-btn border border-slate-300 bg-white px-4 text-[14px] font-semibold text-blue-900 hover:bg-blue-50"
        >
          No, thanks
        </button>
      </div>
    </section>
  );
}
