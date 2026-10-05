import "server-only";
import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "./api";

const TTL_DAYS = Number(process.env.ADMIN_SESSION_TTL_DAYS ?? 30);

export async function setAdminCookie(token: string) {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TTL_DAYS * 24 * 60 * 60,
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}
