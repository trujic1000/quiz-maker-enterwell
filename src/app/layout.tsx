import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import Link from "next/link";

import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Quiz Maker | Enterwell",
  description: "Quiz Maker application...",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <div className="px-4 py-4 sm:px-14">
            <nav className="container mx-auto flex items-center">
              <Link href="/" className="text-3xl font-bold">
                Quiz Maker
              </Link>
            </nav>
          </div>
          <main className="text-black">
            <div className="px-4 py-10 sm:px-14">
              <div className="container mx-auto">{children}</div>
            </div>
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
