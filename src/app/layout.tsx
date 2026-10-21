import type { Metadata } from "next";
import { Figtree, Outfit } from "next/font/google";
import { AppLoadingProvider } from "@/components/AppLoadingProvider";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lanzarote Transfers - Traslados privados aeropuerto",
    template: "%s | Lanzarote Transfers",
  },
  description:
    "Traslados privados en Lanzarote entre el aeropuerto ACE y su hotel. Chófer con cartel, vehículo climatizado y recogida a cualquier hora.",
  other: {
    "theme-color": "#1a5fa8",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${figtree.variable} ${outfit.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans antialiased">
        <AppLoadingProvider>{children}</AppLoadingProvider>
      </body>
    </html>
  );
}
