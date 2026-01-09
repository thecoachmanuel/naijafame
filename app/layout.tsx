import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naijafame Blog",
  description: "A comprehensive collection of articles on various topics.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-white min-h-screen flex flex-col`}>
        <Providers session={session}>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
