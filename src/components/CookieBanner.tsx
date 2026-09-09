"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocale } from "@/components/LocaleProvider";
import {
  applyCookieConsent,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsent,
} from "@/lib/cookie-consent";

type CookieConsentContextValue = {
  consent: CookieConsent | null;
  openSettings: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
);

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return ctx;
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const stored = readCookieConsent();
    setConsent(stored);
    applyCookieConsent(stored);
    setReady(true);
  }, []);

  const save = useCallback((optional: boolean) => {
    const next = writeCookieConsent(optional);
    setConsent(next);
    setSettingsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      consent,
      openSettings: () => setSettingsOpen(true),
    }),
    [consent]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      {ready ? (
        <CookieBanner
          visible={!consent || settingsOpen}
          onAccept={() => save(true)}
          onReject={() => save(false)}
        />
      ) : null}
    </CookieConsentContext.Provider>
  );
}

function CookieBanner({
  visible,
  onAccept,
  onReject,
}: {
  visible: boolean;
  onAccept: () => void;
  onReject: () => void;
}) {
  const pathname = usePathname();
  const { dict, href } = useLocale();

  if (!visible || pathname.startsWith("/admin")) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[80] p-3 md:p-5"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-body"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl bg-bg-deep px-4 py-4 text-white shadow-[0_18px_50px_rgba(16,24,20,0.38)] ring-1 ring-white/10 sm:px-6 md:flex-row md:items-center md:gap-6">
        <div className="min-w-0 flex-1">
          <p
            id="cookie-banner-title"
            className="text-sm font-bold tracking-wide uppercase"
          >
            {dict.cookieBanner.title}
          </p>
          <p
            id="cookie-banner-body"
            className="mt-1.5 text-sm leading-relaxed text-white/75"
          >
            {dict.cookieBanner.body}{" "}
            <Link
              href={href("/cookies")}
              className="font-semibold text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
            >
              {dict.cookieBanner.policy}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onReject}
            className="rounded-full border border-white/25 px-4 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            {dict.cookieBanner.reject}
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="rounded-full bg-ocean px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ocean-deep"
          >
            {dict.cookieBanner.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
