import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WalletContextProvider from "./WalletContextProvider";
import Script from "next/script";
import { Providers } from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Update these values to match your domain and branding.
export const metadata: Metadata = {
  title: "soengageai",
  description:
    "Experience the future of social media engagement—Interact and chat with AI influencers who create and share content just for you.",
  alternates: {
    canonical: "https://soengageai.com", // Replace with your site's URL
  },
  openGraph: {
    title: "soengageai",
    description: "Socialize with AI influencers",
    url: "https://soengageai.com", // Replace with your site's URL
    siteName: "soengageai",
    images: [
      {
        url: "/BG.png", // Path relative to the public folder
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
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
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
        <script
          defer
          data-website-id="67fb3a33cf1b2146d1729a48"
          data-domain="soengageai.com"
          src="https://datafa.st/js/script.js"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <WalletContextProvider>{children}</WalletContextProvider>
        </Providers>
      </body>
    </html>
  );
}
