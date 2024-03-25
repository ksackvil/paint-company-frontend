import { Session } from "next-auth";

/**
 * Extracts token from session object.
 * @param session should have access key otherwise error is thrown
 */
export function extractSessionToken(session: Session) {
  if (session?.access) {
    return session.access;
  } else {
    throw new Error("Error: Unauthenticated");
  }
}
