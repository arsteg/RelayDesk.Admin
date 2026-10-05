import Link from "next/link";
import { logoutAction } from "@/app/actions";
import { requireAdmin } from "@/lib/auth";
import { NavLinks } from "./nav";

export const dynamic = "force-dynamic";

export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-dvh">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span aria-hidden className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-xs font-bold text-white">R</span>
            RelayDesk Admin
          </Link>
          <NavLinks />
          <div className="flex items-center gap-3 text-sm text-stone-500">
            <span className="hidden sm:inline">{admin.email}</span>
            <form action={logoutAction}>
              <button type="submit" className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-100">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
