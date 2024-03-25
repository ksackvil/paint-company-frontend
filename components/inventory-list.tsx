"use client";

import { useState } from "react";
import { Session } from "next-auth";
import useInventory from "@/lib/hooks/use-inventory";
import { Inventory, InventoryStatus } from "@/lib/types";
import InventoryModelForm from "./inventory-model-form";

interface InventoryListProps {
  session: Session;
}
export default function InventoryList({ session }: InventoryListProps) {
  const { inventory, updateInventory } = useInventory(session);
  const [selectedPaints, setSelectedPaints] = useState<Inventory[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Organize paint inventory into swimlanes based on status
  const lanes = {
    available: inventory.filter(
      (paint) => paint.status === InventoryStatus.available
    ),
    running_low: inventory.filter(
      (paint) => paint.status === InventoryStatus.running_low
    ),
    out_of_stock: inventory.filter(
      (paint) => paint.status === InventoryStatus.out_of_stock
    ),
  };

  function formatLaneTitle(title: string) {
    /* Converts snake case lane title to title case */
    return title
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function addToSelectedPaints(paintToAdd: Inventory) {
    setSelectedPaints((prevSelectedPaints) => [
      ...prevSelectedPaints,
      paintToAdd,
    ]);
  }

  function removeFromSelectedPaints(paintToRemove: Inventory) {
    setSelectedPaints((prevSelectedPaints) =>
      prevSelectedPaints.filter(
        (selectedPaint) => selectedPaint.id !== paintToRemove.id
      )
    );
  }

  function paintIsSelected(paint: Inventory) {
    return selectedPaints.some(
      (selectedPaint) => selectedPaint.id === paint.id
    );
  }

  function handlePaintSelect(paint: Inventory) {
    if (paintIsSelected(paint)) {
      removeFromSelectedPaints(paint);
    } else {
      addToSelectedPaints(paint);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Paint Inventory</h1>
      <button
        disabled={selectedPaints.length <= 0}
        onClick={() => setIsEditing(selectedPaints.length > 0)}
        className={`bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          selectedPaints.length <= 0 && "opacity-50 cursor-not-allowed"
        }`}
      >
        Edit {selectedPaints.length} items
      </button>
      <button
        disabled={selectedPaints.length <= 0}
        onClick={() => setSelectedPaints([])}
        className={`ml-2 bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          selectedPaints.length <= 0 && "opacity-50 cursor-not-allowed"
        }`}
      >
        Clear Selected
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 py-4">
        {/* Render lanes */}
        {Object.entries(lanes).map(([status, paints]) => (
          <div key={status}>
            <h2 className="text-xl font-semibold capitalize mb-2">
              {formatLaneTitle(status)}
            </h2>
            <div className="space-y-4">
              {/* Map through paints in the current lane */}
              {paints.map((paint, index) => (
                <div
                  onClick={() => {
                    setSelectedPaints([paint]);
                    setIsEditing(true);
                  }}
                  key={index}
                  className="cursor-pointer hover:bg-gray-100 rounded-lg px-4 py-2 shadow-sm border border-gray-300 flex flex-col relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div
                        className="w-6 h-6 mr-2 border border-black-300"
                        style={{ backgroundColor: paint.name.toLowerCase() }}
                      ></div>
                      <p className="text-lg font-semibold">{paint.name}</p>
                    </div>
                    {/* Select button */}
                    <button
                      className="w-10 h-10"
                      onClick={(e) => {
                        e.stopPropagation(); // Stops the model from opening
                        handlePaintSelect(paint);
                      }}
                    >
                      <input
                        type="checkbox"
                        readOnly
                        checked={paintIsSelected(paint)}
                        className="h-3 w-3 my-1 rounded-full border border-gray-400 appearance-none checked:bg-blue-500 checked:border-transparent checked:ring-2 checked:ring-blue-600 checked:ring-offset-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm">Count: {paint.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Model for editing paints */}
      {selectedPaints.length > 0 && isEditing && (
        <InventoryModelForm
          selectedPaints={selectedPaints}
          setSelectedPaints={setSelectedPaints}
          setIsVisible={setIsEditing}
          updateInventory={updateInventory}
        />
      )}
    </div>
  );
}
