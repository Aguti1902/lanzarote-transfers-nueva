"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { useCookieConsent } from "@/components/CookieBanner";
import { useLocale } from "@/components/LocaleProvider";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/mail-routing";

export function Footer() {
  const pathname = usePathname();
  const { dict, href } = useLocale();
  const { openSettings } = useCookieConsent();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto bg-bg-deep text-white">
      <div className="h-1 bg-gradient-to-r from-ocean via-[#4f90d4] to-ocean" />
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="mb-5">
              <BrandLogo variant="onDark" />
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/65">
              {dict.footer.blurb}
            </p>
            <p className="mt-4 font-display text-lg text-sky-mist">{dict.footer.tagline}</p>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-white/45 uppercase">
              {dict.footer.explore}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              <li>
                <Link href={href("/traslados")} className="transition hover:text-white">
                  {dict.nav.transfers}
                </Link>
              </li>
              <li>
                <Link href={href("/sobre-nosotros")} className="transition hover:text-white">
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link href={href("/contacto")} className="transition hover:text-white">
                  {dict.nav.contact}
                </Link>
              </li>
              <li>
                <Link
                  href={href("/gestionar-reserva")}
                  className="transition hover:text-white"
                >
                  {dict.nav.manageBooking}
                </Link>
              </li>
              <li>
                <Link
                  href={href("/cancelar-reserva")}
                  className="transition hover:text-white"
                >
                  {dict.cancel.title}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-white/45 uppercase">
              {dict.footer.contact247}
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/85">
              <li>
                <a
                  href="tel:+34646080585"
                  className="inline-flex items-center gap-2 transition hover:text-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ocean/20">
                    <Phone className="h-3.5 w-3.5 text-sky-mist" />
                  </span>
                  +34 646 08 05 85
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${PUBLIC_CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 transition hover:text-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ocean/20">
                    <Mail className="h-3.5 w-3.5 text-sky-mist" />
                  </span>
                  {PUBLIC_CONTACT_EMAIL}
                </a>
              </li>
            </ul>
            <p className="mt-5 text-xs text-white/45">{dict.footer.agencyLicense}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-white/40">
          <p>
            Lanzarote Transfers · 2009/{new Date().getFullYear()} ·{" "}
            {dict.footer.rights}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href={href("/privacidad")} className="hover:text-white/70">
              {dict.footer.privacy}
            </Link>
            <Link href={href("/condiciones")} className="hover:text-white/70">
              {dict.footer.terms}
            </Link>
            <Link href={href("/cookies")} className="hover:text-white/70">
              {dict.footer.cookies}
            </Link>
            <button
              type="button"
              onClick={openSettings}
              className="hover:text-white/70"
            >
              {dict.cookieBanner.manage}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
