import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/layout/client-layout";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AmharicQuest - Learn Amharic",
  description: "The fun and effective way to learn Amharic. Master the Fidel script, build vocabulary, and speak with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} antialiased`} style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif' }}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
