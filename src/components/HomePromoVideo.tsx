"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

export const HOME_PROMO_VIDEO = {
  src: "/videos/lanzarote-transfers-transporte-privado-lanzarote.mp4",
  poster: "/images/home/lanzarote-transfers-poster.jpg",
  title: "Lanzarote Transfers | Tu viaje comienza con nosotros.",
} as const;

export function HomePromoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    const el = videoRef.current;
    if (!el) return;
    el.play().catch(() => {
      el.muted = true;
      void el.play();
    });
  }, [active]);

  if (!active) {
    return (
      <button
        type="button"
        onClick={() => setActive(true)}
        className="group relative block aspect-video w-full overflow-hidden rounded-2xl bg-[#122033] shadow-xl ring-1 ring-sand-line"
        aria-label={HOME_PROMO_VIDEO.title}
      >
        <img
          src={HOME_PROMO_VIDEO.poster}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ocean text-white shadow-lg ring-4 ring-white/30 transition group-hover:scale-105 group-hover:bg-ocean-deep">
            <Play className="ml-0.5 h-7 w-7 fill-current" />
          </span>
        </span>
      </button>
    );
  }

  return (
    <video
      ref={videoRef}
      className="aspect-video w-full rounded-2xl bg-black shadow-xl ring-1 ring-sand-line"
      controls
      playsInline
      preload="none"
      poster={HOME_PROMO_VIDEO.poster}
      title={HOME_PROMO_VIDEO.title}
      aria-label={HOME_PROMO_VIDEO.title}
    >
      <source src={HOME_PROMO_VIDEO.src} type="video/mp4" />
    </video>
  );
}
