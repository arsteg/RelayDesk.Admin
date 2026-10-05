import "server-only";
import { redirect } from "next/navigation";
import { ApiError, platformApi } from "./api";
import type { Admin } from "./types";

/** Current operator, or null when not signed in / not a platform admin. */
export async function getAdmin(): Promise<Admin | null> {
  try {
    return await platformApi<Admin>("/me");
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) return null;
    throw e;
  }
}

/** Guard for console pages: redirect to /login unless signed in as an operator. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/login");
  return admin;
}
