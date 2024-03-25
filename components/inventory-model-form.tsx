"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Inventory, InventoryStatus } from "@/lib/types";
import ModelForm from "./model-form";

interface InventoryModelFormProps {
  selectedPaints: Inventory[];
  setSelectedPaints: Dispatch<SetStateAction<Inventory[]>>;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  updateInventory: (
    id: number,
    newCount: number,
    newStatus: InventoryStatus | -1
  ) => Promise<void>;
}
export default function InventoryModelForm({
  selectedPaints,
  setSelectedPaints,
  setIsVisible,
  updateInventory,
}: InventoryModelFormProps) {
  const [count, setCount] = useState<number>(-1);
  const [status, setStatus] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);

  function generateListOfPaintNames() {
    // Extract paint names from the paints array
    const paintNames = selectedPaints.map((paint) => paint.name);
    return paintNames.join(", ");
  }

  function handleClose() {
    setIsVisible(false);
  }

  async function handleSave() {
    setLoading(true);
    try {
      // Create an array of promises for each updateInventory call
      const updatePromises = selectedPaints.map((paint) =>
        updateInventory(paint.id, count, status)
      );

      // Wait for all updateInventory calls to finish
      await Promise.all(updatePromises);

      setSelectedPaints([]);
      setIsVisible(false);
    } catch (error) {
      console.error("Error updating inventory:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModelForm
      title={generateListOfPaintNames()}
      onClose={handleClose}
      onSave={handleSave}
      loading={loading}
    >
      <div>
        <label
          htmlFor="count"
          className="block text-sm font-medium text-gray-700"
        >
          Count
        </label>
        <input
          type="number"
          id="count"
          name="count"
          value={count >= 0 ? count : ""}
          placeholder="Keep the same"
          onChange={(e) => setCount(Number(e.target.value))}
          min={0}
          max={100000}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      {/* Dropdown for status */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={(e) => setStatus(Number(e.target.value) as InventoryStatus)}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value={-1}>Keep the same</option>
          <option value={InventoryStatus.available}>Available</option>
          <option value={InventoryStatus.running_low}>Running Low</option>
          <option value={InventoryStatus.out_of_stock}>Out of Stock</option>
        </select>
      </div>
    </ModelForm>
  );
}
