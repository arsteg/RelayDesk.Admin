import "server-only";
import { cookies } from "next/headers";

const BASE = (process.env.API_INTERNAL_URL ?? "http://localhost:8000").replace(/\/$/, "");
export const ADMIN_COOKIE = "rd_admin_session";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function readToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value ?? null;
}

type ApiInit = Omit<RequestInit, "body"> & { json?: unknown };

/**
 * Call the FastAPI platform API server-side, attaching the operator's bearer
 * token from the httpOnly admin cookie. Never runs in the browser.
 */
export async function platformApi<T = unknown>(path: string, init: ApiInit = {}): Promise<T> {
  const token = await readToken();
  const headers: Record<string, string> = { ...(init.headers as Record<string, string> | undefined) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let body: BodyInit | undefined;
  if (init.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(init.json);
  }

  const res = await fetch(`${BASE}/platform${path}`, {
    method: init.method ?? (init.json !== undefined ? "POST" : "GET"),
    headers,
    body,
    cache: "no-store",
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = (data?.error ?? {}) as { message?: string; fields?: Record<string, string> };
    throw new ApiError(res.status, err.message ?? `Request failed (${res.status}).`, err.fields);
  }
  return data as T;
}
