"use client";

import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import * as api from "@/lib/api";
import { extractSessionToken } from "@/lib/utils";
import { UserData, UserRoles } from "@/lib/types";
import { toast } from "react-toastify";

export default function useUsers(session: Session) {
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    if (session?.access) {
      // Initial fetch
      fetchUsers();
    }

    // Line below allows us to have fetchUsers outside of useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function fetchUsers() {
    try {
      const response = await api.getUsers(extractSessionToken(session));
      setUsers(response);
    } catch (error) {
      toast.error(
        "Unable to fetch users, if your role has recently changed try logging out and back in"
      );
    }
  }

  async function updateUser(id: number, newRole: UserRoles) {
    if (newRole === undefined || id === undefined) {
      // No updates to be made
      return;
    }

    // Build the request body
    const body: Record<string, any> = {};
    if (newRole !== undefined) {
      body["role"] = newRole;
    }

    try {
      const updatedUser = await api.updateUser(
        extractSessionToken(session),
        id,
        body
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
    } catch (error) {
      toast.error(
        "Unable to update user, if your role has recently changed try logging out and back in"
      );
    }

    if (session.user.id === id) {
      // User is changing their own role, force them to sign in again to ensure
      // proper permissions are set.
      signOut({ callbackUrl: "/" });
    }
  }

  return { users, updateUser };
}
