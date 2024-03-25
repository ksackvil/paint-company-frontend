import { Session } from "next-auth";
import { useState } from "react";
import UsersModelForm from "./users-model-form";
import useUsers from "@/lib/hooks/use-users";
import { UserData, UserRoles } from "@/lib/types";

interface UsersListProps {
  session: Session;
}

export default function UsersList({ session }: UsersListProps) {
  const { users, updateUser } = useUsers(session);
  const [selectedUser, setSelectedUser] = useState<UserData | undefined>(
    undefined
  );
  const [isEditing, setIsEditing] = useState(false);

  function extractUsersRole(role: UserRoles, is_owner: boolean): string {
    if (is_owner) {
      return "owner (not editable)";
    }

    switch (role) {
      case UserRoles.painter:
        return "painter";
      case UserRoles.admin:
        return "admin";
      default:
        return "Unknown";
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center p-4">
        <h1 className="text-2xl font-semibold mb-4">Users</h1>
        <div className="max-w-md w-full">
          {users.map((user) => (
            <div
              onClick={() => {
                if (!user.is_owner) {
                  setSelectedUser(user);
                  setIsEditing(true);
                }
              }}
              key={user.id}
              className={`border ${
                user.is_owner
                  ? "pointer-events-none opacity-50 bg-gray-50"
                  : "cursor-pointer hover:bg-gray-100"
              } border-gray-300 shadow-sm rounded-md p-4 mb-4 flex items-center justify-between`}
            >
              <div>
                <h2 className="text-lg font-semibold">
                  {user.first_name} {user.last_name}{" "}
                  {user.id === session.user.id ? "(you)" : null}
                </h2>
                <p className="text-gray-600">
                  role: {extractUsersRole(user.role, user.is_owner)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Model for editing a users role */}
      {isEditing && selectedUser ? (
        <UsersModelForm
          signedInUser={session.user}
          selectedUser={selectedUser}
          setIsVisible={setIsEditing}
          updateUser={updateUser}
        />
      ) : null}
    </div>
  );
}
