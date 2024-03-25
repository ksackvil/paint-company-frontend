import { Session } from "next-auth";

export function extractSessionToken(session: Session) {
  if (session?.access) {
    return session.access;
  } else {
    throw new Error("UseChatMessages Error: Unauthenticated");
  }
}
