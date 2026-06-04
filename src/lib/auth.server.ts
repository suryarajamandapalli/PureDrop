import { FileDatabase, User } from "./db.server";

export interface SessionData {
  userId: string;
  email: string;
  role: "admin" | "agent" | "customer";
}

/**
 * Validates user credentials and returns user details.
 */
export async function authenticateUser(email: string, passwordHash: string): Promise<SessionData> {
  const db = await FileDatabase.get();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === passwordHash
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  return {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
}

/**
 * Verifies a session token.
 */
export async function verifySessionToken(token: string | null): Promise<SessionData> {
  if (!token) {
    throw new Error("Unauthorized: No session token provided");
  }

  const db = await FileDatabase.get();
  const user = db.users.find((u) => u.id === token);

  if (!user) {
    throw new Error("Unauthorized: Session is invalid");
  }

  return {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
}

/**
 * Helper to parse cookies from raw headers
 */
export function parseCookieHeader(cookieHeader: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    const name = parts[0]?.trim();
    const val = parts.slice(1).join("=");
    if (name) {
      cookies[name] = decodeURIComponent(val.trim());
    }
  });

  return cookies;
}
