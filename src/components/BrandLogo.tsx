import Image from "next/image";

type Props = {
  variant: "onDark" | "onLight";
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function BrandLogo({
  variant,
  className = "",
  priority,
  sizes = "210px",
}: Props) {
  const onLight = variant === "onLight";

  return (
    <span
      className={`relative inline-flex ${
        onLight ? "overflow-hidden rounded-md bg-bg-deep" : ""
      } ${className || "h-9 w-[168px] md:h-11 md:w-[210px]"}`}
    >
      <Image
        src="/images/brand/lanzarote-transfers.png"
        alt="Lanzarote Transfers"
        fill
        priority={priority}
        sizes={sizes}
        className={`object-contain object-left ${onLight ? "" : "[mix-blend-mode:lighten]"}`}
      />
    </span>
  );
}
