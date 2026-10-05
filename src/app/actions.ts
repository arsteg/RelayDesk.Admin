"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError, platformApi } from "@/lib/api";
import { clearAdminCookie, setAdminCookie } from "@/lib/cookie";

export type ActionState = { error: string } | null;

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function optInt(fd: FormData, key: string): number | null {
  const v = str(fd, key);
  return v === "" ? null : Number(v);
}

export async function loginAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const email = str(fd, "email");
  const password = String(fd.get("password") ?? "");
  try {
    const { token } = await platformApi<{ token: string }>("/auth/login", { method: "POST", json: { email, password } });
    await setAdminCookie(token);
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Sign in failed. Try again." };
  }
  redirect("/");
}

export async function logoutAction() {
  try {
    await platformApi("/auth/logout", { method: "POST" });
  } catch {
    // ignore — clear the cookie regardless
  }
  await clearAdminCookie();
  redirect("/login");
}

export async function suspendAction(fd: FormData) {
  const id = str(fd, "businessId");
  const suspend = str(fd, "suspend") === "1";
  const reason = str(fd, "reason");
  await platformApi(`/businesses/${id}/suspend`, { method: "POST", json: { suspend, reason: reason || null } });
  revalidatePath(`/businesses/${id}`);
  revalidatePath("/businesses");
}

export async function subscriptionAction(fd: FormData) {
  const id = str(fd, "businessId");
  const action = str(fd, "action");
  const plan = str(fd, "plan") || null;
  const days = optInt(fd, "days");
  await platformApi(`/businesses/${id}/subscription`, { method: "POST", json: { action, plan, days } });
  revalidatePath(`/businesses/${id}`);
}

export async function planAction(fd: FormData) {
  const code = str(fd, "code");
  await platformApi(`/plans/${code}`, {
    method: "PATCH",
    json: {
      name: str(fd, "name"),
      description: str(fd, "description"),
      priceLabel: str(fd, "priceLabel"),
      maxMembers: optInt(fd, "maxMembers"),
      maxMonthlyOrders: optInt(fd, "maxMonthlyOrders"),
      stripePriceId: str(fd, "stripePriceId") || null,
      isPublic: fd.get("isPublic") === "on",
      isActive: fd.get("isActive") === "on",
    },
  });
  revalidatePath("/plans");
}

export async function adminAction(fd: FormData) {
  const email = str(fd, "email");
  const grant = str(fd, "grant") === "1";
  await platformApi("/admins", { method: "POST", json: { email, grant } });
  revalidatePath("/admins");
}
