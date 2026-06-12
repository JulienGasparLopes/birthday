import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserSwitcher } from "./components/UserSwitcher";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "30s Birthday Cocktail",
  description: "La soirée la plus convoitée de l'année",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${interSans.variable}`}>
      <body className="min-h-full flex flex-col">
        <UserSwitcher />
        {children}
      </body>
    </html>
  );
}
