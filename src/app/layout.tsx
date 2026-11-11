import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

const manrope = Manrope({ subsets: ["latin"], weight: ["600", "800"], variable: "--font-manrope", display: "swap" });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-jetbrains-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Datum — KTU study desk", template: "%s · Datum" },
  description: "A focused KTU study desk for verified exam dates, learning resources and a practical study plan.",
  applicationName: "Datum",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg" },
  openGraph: { title: "Datum", description: "A focused KTU study desk.", type: "website", images: ["/og-image.svg"] },
  twitter: { card: "summary_large_image", title: "Datum", description: "A focused KTU study desk.", images: ["/og-image.svg"] },
};

export const viewport: Viewport = { themeColor: "#0A1628", colorScheme: "light dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${jetBrainsMono.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
