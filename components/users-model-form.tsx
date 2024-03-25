"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { UserData, UserRoles } from "@/lib/types";
import ModelForm from "@/components/model-form";

interface UsersModelFormProps {
  signedInUser: UserData;
  selectedUser: UserData;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  updateUser: (id: number, newRole: UserRoles) => Promise<void>;
}
export default function UsersModelForm({
  signedInUser,
  selectedUser,
  setIsVisible,
  updateUser,
}: UsersModelFormProps) {
  const [role, setRole] = useState<number>(selectedUser.role);
  const [loading, setLoading] = useState<boolean>(false);

  function handleClose() {
    setIsVisible(false);
  }

  async function handleSave() {
    setLoading(true);
    await updateUser(selectedUser.id, role);
    setIsVisible(false);
    setLoading(false);
  }

  return (
    <ModelForm
      title={selectedUser.first_name + " " + selectedUser.last_name}
      onClose={handleClose}
      onSave={handleSave}
      loading={loading}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(Number(e.target.value) as UserRoles)}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value={UserRoles.painter}>Painter</option>
          <option value={UserRoles.admin}>Admin</option>
        </select>
      </div>
      {selectedUser.id === signedInUser.id ? (
        <p>Note: You will need to sign in again when changing your own role.</p>
      ) : null}
    </ModelForm>
  );
}
