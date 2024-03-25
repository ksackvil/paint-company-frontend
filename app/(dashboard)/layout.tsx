"use client";
import { Header } from "@/components/header";
import { useSession } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { status } = useSession();
  if (status === "authenticated") {
    // Show header if user is logged in
    return (
      <>
        <Header />
        {children}
      </>
    );
  } else {
    return <>{children}</>;
  }
}
