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
  sizes = "300px",
}: Props) {
  const onLight = variant === "onLight";

  return (
    <span
      className={`relative inline-flex ${className || "h-9 w-[168px] md:h-11 md:w-[210px]"}`}
    >
      <Image
        src={
          onLight
            ? "/images/brand/lanzarote-transfers-dark.png"
            : "/images/brand/lanzarote-transfers.png"
        }
        alt="Lanzarote Transfers"
        fill
        priority={priority}
        sizes={sizes}
        className="object-contain object-left"
      />
    </span>
  );
}
