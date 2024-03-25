"use client";

import { useState, useEffect } from "react";
import { Session } from "next-auth";
import * as api from "@/lib/api";
import { extractSessionToken } from "@/lib/utils";
import { Inventory, InventoryStatus } from "@/lib/types";

export default function useInventory(session: Session) {
  const [inventory, setInventory] = useState<Inventory[]>([]);

  useEffect(() => {
    if (session?.access) {
      // Initial fetch
      fetchInventory();

      // Polling interval in milliseconds
      const pollingInterval = 5000;

      // Polling function
      const intervalId = setInterval(fetchInventory, pollingInterval);

      // Cleanup function to clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }

    // Line below allows us to have fetchInventory outside of useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function fetchInventory() {
    try {
      const response = await api.getInventory(extractSessionToken(session));
      setInventory(response);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  }

  async function updateInventory(
    id: number,
    newCount: number,
    newStatus: InventoryStatus | -1
  ) {
    if (newCount === -1 && newStatus === -1) {
      // No updates to be made
      return;
    }

    // Build the request body
    const body: Record<string, any> = {};
    if (newCount !== -1) {
      body["count"] = newCount;
    }
    if (newStatus !== -1) {
      body["status"] = newStatus;
    }

    try {
      const updatedItem = await api.updateInventory(
        extractSessionToken(session),
        id,
        body
      );
      setInventory((prevInventory) =>
        prevInventory.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        )
      );
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  }

  return { inventory, updateInventory };
}
