import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Provider } from "@/components/provider";

export const metadata: Metadata = {
  title: "A Paint Company",
  description: "BC's best paint inventory manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body className="flex flex-col min-h-screen">
          <Header />
          {children}
        </body>
      </Provider>
    </html>
  );
}
