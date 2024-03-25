declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    access: string;
    refresh: string;
    expires: number;
    user: UserData;
  }
}

declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User extends Token {
    data: UserData;
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: UserData;
    access: string;
    refresh: string;
    expires: number;
  }
}

export interface Token {
  access: string;
  refresh: string;
}

export interface UserData {
  id: number;
  username: string;
  role: number;
  is_owner: boolean;
  first_name: string;
  last_name: string;
}

export interface Inventory {
  id: number;
  count: number;
  status: number;
  name: string;
}

export enum InventoryStatus {
  available = 0,
  running_low,
  out_of_stock,
}

export enum UserRoles {
  painter = 0,
  admin,
}
