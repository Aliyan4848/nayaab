import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const editorial = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
});

const ui = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NAYAAB — Premium Pakistani Women's Unstitched Fashion",
  description:
    "Considered fabric, considered craft. Shop premium unstitched lawn, chiffon, linen and khaddar from NAYAAB, with nationwide delivery and cash on delivery.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${editorial.variable} ${ui.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
