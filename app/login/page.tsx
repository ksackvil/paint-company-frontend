"use client";

import LoadingSpinner from "@/components/loading-spinner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: any) {
    e.preventDefault();
    setLoading(true);
    const signInEvent = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    if (signInEvent?.ok === true) {
      router.push("/");
    } else {
      toast.error("Failed to sign in. Please check your credentials.");
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {loading ? (
        <div className="flex items-center justify-center p-8 b">
          <LoadingSpinner />
        </div>
      ) : (
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 px-10 rounded shadow-md"
        >
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Login
          </button>
        </form>
      )}
    </div>
  );
}
