import * as api from "@/lib/api";
import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { toast } from "react-toastify";

const BACKEND_ACCESS_TOKEN_LIFETIME = 23 * 60 * 60; // 23 hours
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60; // 6 days

const getCurrentEpochTime = () => {
  return Math.floor(new Date().getTime() / 1000);
};

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  theme: {
    colorScheme: "light",
  },
  session: {
    strategy: "jwt",
    maxAge: BACKEND_REFRESH_TOKEN_LIFETIME,
  },
  providers: [
    CredentialsProvider({
      name: "username",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const token = await api.getToken(
            credentials!.username,
            credentials!.password
          );
          const userData = await api.getUserData(token.access);
          return { ...token, data: userData } as User;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // create updated custom token
        console.log("LOGIN EVENT");
        token.access = user.access;
        token.refresh = user.refresh;
        token.expires = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
        token.user = user.data;
      } else if (getCurrentEpochTime() > token.expires) {
        // Access token has expired, refresh it
        console.log("REFRESH EVENT");
        const response = await api.getRefreshToken(token.refresh);
        token.access = response.access;
        token.refresh = response.refresh;
        token.expires = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
      }

      return token;
    },
    async session({ session, token, user }) {
      session.access = token.access;
      session.refresh = token.refresh;
      session.user = token.user;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
