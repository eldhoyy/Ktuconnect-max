import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { MotionPreferenceProvider } from "@/components/motion-preferences";

export const metadata: Metadata = {
  title: { default: "Cohertx — KTU student workspace", template: "%s · Cohertx" },
  description: "A focused KTU student workspace for verified exam dates, learning resources and study planning.",
  applicationName: "Cohertx",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg" },
};
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F5FA" },
    { media: "(prefers-color-scheme: dark)", color: "#121118" },
  ],
  colorScheme: "light dark",
};
const themeScript = `(()=>{try{const s=localStorage.getItem("datum-theme")||localStorage.getItem("cohertx-theme");const d=matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=s==="light"||s==="dark"?s:d?"dark":"light";const r=localStorage.getItem("datum-reduce-motion")??localStorage.getItem("cohertx-reduce-motion");document.documentElement.dataset.reduceMotion=String(r===null?matchMedia("(prefers-reduced-motion: reduce)").matches:r==="true")}catch{document.documentElement.dataset.theme="light";document.documentElement.dataset.reduceMotion="false"}})();`;
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body><MotionPreferenceProvider><AppShell>{children}</AppShell></MotionPreferenceProvider></body></html>;
}
