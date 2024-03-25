"use client";

import { useState, useEffect, useRef } from "react";
import { Session } from "next-auth";
import * as api from "@/lib/api";
import { extractSessionToken } from "@/lib/utils";
import { Inventory, InventoryStatus } from "@/lib/types";
import { toast } from "react-toastify";

export default function useInventory(session: Session) {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const intervalIdRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (session?.access) {
      // Initial fetch
      fetchInventory();

      // Polling interval in milliseconds
      const pollingInterval = 2000;

      // Polling function
      const intervalId = setInterval(fetchInventory, pollingInterval);
      intervalIdRef.current = intervalId;

      // Cleanup function to clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }

    // Line below allows us to have fetchInventory outside of useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function fetchInventory() {
    try {
      const response = await api.getInventory(extractSessionToken(session));
      if (response) {
        setInventory(response);
      }
    } catch (error) {
      clearInterval(intervalIdRef.current); // Stop polling
      toast.error("Unable to fetch inventory, try refreshing this page later");
    }
  }

  /**
   * @param id id of item to update
   * @param newCount number to update the item.count to. If -1 no updates are made
   * @param newCount status to update the item.status to. If -1 no updates are made
   */
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

      // Refresh local inventory list with updatedItem
      setInventory((prevInventory) =>
        prevInventory.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        )
      );
    } catch (error) {
      toast.error("Unable to update inventory, try again later");
    }
  }

  return { inventory, updateInventory };
}
