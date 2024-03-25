import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Provider } from "@/components/provider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          <ToastContainer />
          <Header />
          {children}
        </body>
      </Provider>
    </html>
  );
}
