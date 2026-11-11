import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

const bodyFont = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const displayFont = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Cohertx — KTU, in good order", template: "%s · Cohertx" },
  description: "A considered learning and exam-planning workspace for KTU students.",
  applicationName: "Cohertx",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg" },
  openGraph: { title: "Cohertx", description: "Learn with clarity. Plan with confidence.", type: "website", images: ["/og-image.svg"] },
  twitter: { card: "summary_large_image", title: "Cohertx", description: "Learn with clarity. Plan with confidence.", images: ["/og-image.svg"] },
};

export const viewport: Viewport = { themeColor: "#f2efe6", colorScheme: "light dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}