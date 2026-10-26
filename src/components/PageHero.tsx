import Image from "next/image";
import { plainTextFromHtml } from "@/lib/sanitize-html";

/** Altura unificada de héroes internos (igual que cruceros). La home usa su propio hero alto. */
const HERO_MIN = "min-h-[40vh]";
const HERO_PAD = "min-h-[40vh] pb-12 pt-24";

export function PageHero({
  image,
  title,
  subtitle,
  eyebrow,
  compact: _compact = false,
  objectPosition = "50% 40%",
  scrim = "soft",
  frameClassName,
}: {
  image: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  /** @deprecated Todos los héroes internos usan ya la altura compacta de cruceros. */
  compact?: boolean;
  /** Encuadre CSS, p. ej. "50% 30%" (ajustable desde Admin → Ajustes). */
  objectPosition?: string;
  /** Más contraste detrás del texto cuando la foto es clara. */
  scrim?: "soft" | "strong";
  /** Clase con object-position responsive. Si se pasa, ignora objectPosition. */
  frameClassName?: string;
}) {
  void _compact;
  const titleWidth = scrim === "strong" ? "max-w-xl" : "max-w-3xl";
  const subtitleWidth = scrim === "strong" ? "max-w-md" : "max-w-2xl";
  return (
    <section
      className={`relative overflow-hidden bg-[#2a3344] text-white ${HERO_MIN}`}
    >
      <Image
        src={image}
        alt=""
        fill
        priority
        className={`hero-still object-cover ${frameClassName || ""}`}
        sizes="100vw"
        style={frameClassName ? undefined : { objectPosition }}
      />
      <div
        className={
          scrim === "strong"
            ? "absolute inset-0 bg-gradient-to-r from-black/55 via-black/18 to-transparent"
            : "absolute inset-0 bg-gradient-to-r from-black/28 via-black/8 to-transparent"
        }
      />
      <div
        className={
          scrim === "strong"
            ? "absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
            : "absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/5"
        }
      />
      <div
        className={`relative mx-auto flex max-w-6xl flex-col justify-end px-4 md:px-6 ${HERO_PAD}`}
      >
        {eyebrow && (
          <p className="animate-fade-up mb-3 text-xs font-bold tracking-[0.18em] text-[#cfe8d4] uppercase">
            {eyebrow}
          </p>
        )}
        <h1
          className={`animate-fade-up-delay text-hero-shadow ${titleWidth} font-display font-extrabold tracking-tight ${
            scrim === "strong" ? "text-3xl md:text-5xl" : "text-4xl md:text-6xl"
          }`}
        >
          {title}
        </h1>
        {plainTextFromHtml(subtitle || "") && (
          <p
            className={`animate-fade-up-delay-2 text-hero-shadow mt-4 ${subtitleWidth} text-base leading-relaxed text-white md:text-lg`}
          >
            {plainTextFromHtml(subtitle || "")}
          </p>
        )}
      </div>
    </section>
  );
}
