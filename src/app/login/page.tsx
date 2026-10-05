import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getAdmin()) redirect("/");
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2 text-lg font-semibold">
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">R</span>
          RelayDesk Admin
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xs ring-1 ring-stone-200">
          <h1 className="mb-1 text-lg font-semibold">Operator sign in</h1>
          <p className="mb-5 text-sm text-stone-500">Platform administrators only.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
