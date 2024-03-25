"use client";

import UsersList from "@/components/users-list";
import { UserRoles } from "@/lib/types";
import { useSession } from "next-auth/react";

export default function UsersPage() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    if (session.user.role === UserRoles.admin) {
      return <UsersList session={session} />;
    } else {
      return (
        <div className="text-center py-8">
          <p className="text-lg font-semibold mb-4">
            You do not have access to this page.
          </p>
          <p className="text-gray-600">
            If your role was changed recently, you may need to log in and out
            again.
          </p>
        </div>
      );
    }
  }
}
