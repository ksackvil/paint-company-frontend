"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Inventory, InventoryStatus } from "@/lib/types";

interface ModelFormProps {
  title: string;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}
export default function ModelForm({
  title,
  onClose,
  onSave,
  children,
}: ModelFormProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="relative p-4 w-full max-w-sm max-h-full">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">
              Editing {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            >
              <svg
                className="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 mb-5 md:p-5 space-y-4 w-80 h-40">
            {/* Form content here */}
            {children}
          </div>
          <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
            <button
              onClick={onSave}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
