import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { Header } from "@/components/layout/header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FocusForge | Build Unbreakable Focus",
  description:
    "Progressive focus training with browser blocking. Start with 5 minutes, unlock up to 120 minutes. Build lasting focus habits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <ConvexClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
