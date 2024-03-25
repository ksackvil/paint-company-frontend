"use client";

import InventoryList from "@/components/inventory-list";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function InventoryPage() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return <InventoryList session={session} />;
  } else if (status === "unauthenticated") {
    redirect("/login");
  }
}
