import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hospital Parking System",
  description: "Visitor parking management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <Providers session={session}>
          <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 pb-24 shadow-lg ring-1 ring-slate-900/5 md:pb-6">
              {children}
              <BottomNav />
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
