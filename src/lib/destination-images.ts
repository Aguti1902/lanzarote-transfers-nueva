import type { TransferDestination } from "@/types";

const BY_ID: Record<string, string> = {
  "playa-blanca": "/images/tours/beach-1.jpg",
  "puerto-del-carmen": "/images/tours/coast-1.jpg",
  "costa-teguise": "/images/tours/landscape-1.jpg",
  "puerto-calero": "/images/home/private.jpg",
  arrecife: "/images/home/aeropuerto.jpg",
  "la-santa": "/images/tours/desert-1.jpg",
  "charco-del-palo": "/images/tours/canyon-1.jpg",
  haria: "/images/home/timanfaya-familia.jpg",
  orzola: "/images/tours/timanfaya-2.jpg",
  famara: "/images/tours/road-1.jpg",
  yaiza: "/images/tours/timanfaya.jpg",
  tias: "/images/tours/van-1.jpg",
  "playa-honda": "/images/home/transfer.jpg",
  "puerto-de-los-marmoles": "/images/home/cruceros.jpg",
  "punta-mujeres": "/images/home/amigas-volcan.jpg",
  "pabellon-de-tias": "/images/tours/bus-1.jpg",
};

const CYCLE = [
  "/images/tours/beach-1.jpg",
  "/images/tours/coast-1.jpg",
  "/images/tours/landscape-1.jpg",
  "/images/tours/timanfaya-1.jpg",
  "/images/tours/wine-1.jpg",
  "/images/home/minibus.jpg",
  "/images/tours/road-1.jpg",
  "/images/heroes/transfer.jpg",
];

export function destinationCover(dest: Pick<TransferDestination, "id" | "slug" | "image">): string {
  const custom = dest.image?.trim();
  if (custom) return custom;
  return (
    BY_ID[dest.id] ||
    BY_ID[dest.slug] ||
    CYCLE[Math.abs(hash(dest.id || dest.slug)) % CYCLE.length]
  );
}

function hash(value: string): number {
  let n = 0;
  for (let i = 0; i < value.length; i++) n = (n * 31 + value.charCodeAt(i)) | 0;
  return n;
}
