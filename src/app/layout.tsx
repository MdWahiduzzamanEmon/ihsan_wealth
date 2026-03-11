import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Amiri } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ServiceWorkerRegister } from "@/components/providers/sw-register";
import { ChatFloatingWidget } from "@/components/chat/chat-floating-widget";
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
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "IhsanWealth - إحسان الثروة | Zakat Calculator",
  description:
    "IhsanWealth — Professional Zakat calculator with live gold & silver prices. Calculate your Zakat obligation based on Islamic Fiqh with support for cash, gold, silver, investments, business assets, and more.",
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
    title: "IhsanWealth - إحسان الثروة",
    description: "Professional Zakat Calculator with live gold & silver prices",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <ChatFloatingWidget />
        </AuthProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
