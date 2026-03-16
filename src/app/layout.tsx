import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Amiri } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ServiceWorkerRegister } from "@/components/providers/sw-register";
import { ChatFloatingWidget } from "@/components/chat/chat-floating-widget";
import { FloatingIslamicDecor } from "@/components/ui/floating-islamic-decor";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

export const viewport: Viewport = {
  themeColor: "#065f46",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const BASE_URL = "https://ihsan-wealth.onrender.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "IhsanWealth — Zakat Calculator, Quran, Prayer Times & Islamic Tools",
    template: "%s | IhsanWealth",
  },
  description:
    "Your complete Islamic companion — Zakat calculator with live gold & silver prices, Holy Quran with Tafhimul Quran tafsir, accurate prayer times, Qibla finder, 30+ duas, Hijri calendar, Sadaqah tracker and more. Completely free.",
  keywords: [
    "Zakat calculator",
    "Islamic finance",
    "Quran online",
    "Tafhimul Quran",
    "tafsir",
    "prayer times",
    "Qibla finder",
    "dua",
    "Hijri calendar",
    "Sadaqah tracker",
    "gold price",
    "silver price",
    "Nisab",
    "Islamic app",
    "Muslim tools",
    "IhsanWealth",
  ],
  authors: [{ name: "Md Wahiduzzaman Emon", url: "https://github.com/MdWahiduzzamanEmon" }],
  creator: "Md Wahiduzzaman Emon",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "IhsanWealth",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "IhsanWealth",
    title: "IhsanWealth — Zakat Calculator, Quran, Prayer Times & Islamic Tools",
    description:
      "Your complete Islamic companion — Zakat calculator, Holy Quran with tafsir, prayer times, Qibla finder, duas, Hijri calendar, and Sadaqah tracker. Free & open source.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "IhsanWealth — Your Complete Islamic Companion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IhsanWealth — Zakat Calculator, Quran & Islamic Tools",
    description:
      "Free Islamic companion app: Zakat calculator, Quran with tafsir, prayer times, Qibla, duas, Hijri calendar & more.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: "Islamic Finance & Worship",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.quran.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} antialiased`}
      >
        <AuthProvider>
          <FloatingIslamicDecor />
          {children}
          <ChatFloatingWidget />
        </AuthProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
