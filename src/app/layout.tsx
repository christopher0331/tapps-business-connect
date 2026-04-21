import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tapps Business Connect | Local Businesses & Services in Lake Tapps, Bonney Lake & Puyallup",
  description:
    "Tapps Business Connect — high-standard businesses, real relationships, trusted referrals. A networking group for professionals in Lake Tapps, Bonney Lake, Sumner, Puyallup, Buckley & surrounding areas.",
  openGraph: {
    title: "Tapps Business Connect | Local Businesses & Services",
    description:
      "High-standard businesses, real relationships, trusted referrals in East Pierce County.",
    siteName: "Tapps Business Connect",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
