import { redirect } from "next/navigation";
import { resolveLocale } from "@/i18n/get-locale";
import { localePath } from "@/i18n/path";

export async function redirectToTransfers(rawLocale: string) {
  const locale = resolveLocale(rawLocale);
  redirect(localePath(locale, "/traslados-aeropuerto-lanzarote"));
}
