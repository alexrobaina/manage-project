import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/ui/molecules/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Presentation Manager",
  description: "Manage and view HTML presentations by project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <Navbar
          brand="Presentation Manager"
          items={[{ label: "Projects", href: "/", active: true }]}
          variant="solid"
          sticky
        />
        <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
