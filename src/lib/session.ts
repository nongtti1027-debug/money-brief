import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";

export type SessionData = {
  isAdmin: boolean;
};

const sessionPassword = process.env.SESSION_SECRET;

if (!sessionPassword || sessionPassword.length < 32) {
  throw new Error(
    "SESSION_SECRET must be set in .env and be at least 32 characters long."
  );
}

export const sessionOptions: SessionOptions = {
  password: sessionPassword,
  cookieName: "money-brief-admin-session",
  ttl: 60 * 60 * 24 * 7, // 7 days
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
