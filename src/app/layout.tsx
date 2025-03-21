import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WalletContextProvider from "./WalletContextProvider";
// import { WalletAuthProvider } from "./WalletAuthProvider";
import { Providers } from "./Providers";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "soengageai",
  description: "Socialise with ai influencers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <WalletContextProvider>
            {/* <WalletAuthProvider> */}
            {children}
            {/* </WalletAuthProvider> */}
            
          </WalletContextProvider>
        </Providers>
          
      </body>
    </html>
  );
}
