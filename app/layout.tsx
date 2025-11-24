import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navigation from "@/components/common/Navigation/Navigation";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Pixel Prince - Digital Art That Defines Your Space",
  description: "Curated digital art downloads for modern living. Posters, video game decor, and world maps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="antialiased">
        <Navigation />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
