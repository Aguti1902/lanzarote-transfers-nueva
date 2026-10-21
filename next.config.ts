import type { NextConfig } from "next";

/**
 * Redirects estáticos (301/308). El resto de URLs antiguas (excursiones,
 * cruceros, casas) se resuelven en middleware (`resolveLegacyRedirect`).
 */
function supabaseImageHosts() {
  const hosts = new Set<string>(["wdnviethdarcmneghhqv.supabase.co"]);
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (raw) {
    try {
      hosts.add(new URL(raw).hostname);
    } catch {
      /* ignore invalid URL */
    }
  }
  return [...hosts].map((hostname) => ({
    protocol: "https" as const,
    hostname,
  }));
}

const nextConfig: NextConfig = {
  // Cloud agent / remote browser may hit the app via 127.0.0.1
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  serverExternalPackages: ["exceljs"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },
  images: {
    qualities: [70, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.holidu.com",
      },
      ...supabaseImageHosts(),
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "www.lanzaroteexperiencetours.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/en/airport-transfers",
        destination: "/en/lanzarote-airport-transfer",
        permanent: true,
      },
      {
        source: "/en/airport-transfers/:path*",
        destination: "/en/lanzarote-airport-transfer/:path*",
        permanent: true,
      },
      {
        source: "/de/flughafen-transfer",
        destination: "/de/lanzarote-flughafen-transfer",
        permanent: true,
      },
      {
        source: "/de/flughafen-transfer/:path*",
        destination: "/de/lanzarote-flughafen-transfer/:path*",
        permanent: true,
      },
      {
        source: "/de/ausfluge",
        destination: "/de/lanzarote-flughafen-transfer",
        permanent: true,
      },
      {
        source: "/de/ausfluge/:path*",
        destination: "/de/lanzarote-flughafen-transfer",
        permanent: true,
      },
      {
        source: "/en/excursions",
        destination: "/en/lanzarote-airport-transfer",
        permanent: true,
      },
      {
        source: "/en/excursions/:path*",
        destination: "/en/lanzarote-airport-transfer",
        permanent: true,
      },
      {
        source: "/en/shore-excursions",
        destination: "/en/lanzarote-airport-transfer",
        permanent: true,
      },
      {
        source: "/en/shore-excursions/:path*",
        destination: "/en/lanzarote-airport-transfer",
        permanent: true,
      },
      {
        source: "/en/cruises",
        destination: "/en/lanzarote-airport-transfer",
        permanent: true,
      },
      {
        source: "/en/cruise/:path*",
        destination: "/en/lanzarote-airport-transfer",
        permanent: true,
      },
      {
        source: "/de/ausfluege",
        destination: "/de/lanzarote-flughafen-transfer",
        permanent: true,
      },
      {
        source: "/de/ausfluege/:path*",
        destination: "/de/lanzarote-flughafen-transfer",
        permanent: true,
      },
      {
        source: "/de/kreuzfahrten",
        destination: "/de/lanzarote-flughafen-transfer",
        permanent: true,
      },
      {
        source: "/de/kreuzfahrt/:path*",
        destination: "/de/lanzarote-flughafen-transfer",
        permanent: true,
      },
      {
        source: "/es/excursiones",
        destination: "/es/traslados-aeropuerto-lanzarote",
        permanent: true,
      },
      {
        source: "/es/excursiones/:path*",
        destination: "/es/traslados-aeropuerto-lanzarote",
        permanent: true,
      },
      {
        source: "/es/cruceros",
        destination: "/es/traslados-aeropuerto-lanzarote",
        permanent: true,
      },
      {
        source: "/admin/excursiones",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/admin/excursiones/:path*",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/admin/cruceros",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/admin/cruceros/:path*",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/admin/casas",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/blog",
        destination: "/es",
        permanent: true,
      },
      {
        source: "/blog/:path*",
        destination: "/es",
        permanent: true,
      },
      {
        source: "/:locale(es|en|de)/blog",
        destination: "/:locale",
        permanent: true,
      },
      {
        source: "/:locale(es|en|de)/blog/:path*",
        destination: "/:locale",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
