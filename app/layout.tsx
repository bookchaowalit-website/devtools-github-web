import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SITE } from "@/components/shelf-views";
import "./globals.css";

// The font variable sits on <html>: the Reader shell tokens live on :root and read it from there.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const description = "A curated repository shelf with context before the click.";

export const metadata: Metadata = {
  title: { default: "GitHub shelf | Bookchaowalit", template: "%s | GitHub shelf" },
  description,
  authors: [{ name: "Bookchaowalit", url: "https://bookchaowalit.com" }],
  creator: "Bookchaowalit",
  metadataBase: new URL(SITE),
  alternates: { canonical: "/" },
  openGraph: { type: "website", title: "GitHub shelf | Bookchaowalit", description, siteName: "Bookchaowalit" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>{children}</body>
    </html>
  );
}
