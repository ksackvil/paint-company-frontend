"use client";

import InventoryList from "@/components/inventory-list";
import { useSession } from "next-auth/react";

export default function InventoryPage() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return <InventoryList session={session} />;
  }
}
