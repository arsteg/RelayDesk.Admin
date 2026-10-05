import Link from "next/link";
import { Card, PageHeader, Stat } from "@/components/ui";
import { platformApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Stats } from "@/lib/types";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const s = await platformApi<Stats>("/stats");
  const totalSubs = Object.values(s.byPlan).reduce((a, b) => a + (b ?? 0), 0) || 1;
  return (
    <>
      <PageHeader title="Dashboard" description="Platform health across all client businesses." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Stat label="Businesses" value={s.businesses} />
        <Stat label="Users" value={s.users} />
        <Stat label="Active" value={s.byStatus.ACTIVE ?? 0} tone="green" />
        <Stat label="Trialing" value={s.byStatus.TRIALING ?? 0} />
        <Stat label="Past due" value={s.byStatus.PAST_DUE ?? 0} />
        <Stat label="Suspended" value={s.suspended} tone={s.suspended ? "red" : undefined} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Subscriptions by plan">
          <ul className="space-y-3">
            {(["STARTER", "PRO"] as const).map((code) => {
              const n = s.byPlan[code] ?? 0;
              return (
                <li key={code}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{code === "STARTER" ? "Starter" : "Pro"}</span>
                    <span className="text-stone-500">{n}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-stone-100">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.round((n / totalSubs) * 100)}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card title="Recent signups">
          {s.recentSignups.length === 0 ? (
            <p className="text-sm text-stone-500">No businesses yet.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {s.recentSignups.map((b) => (
                <li key={b.id} className="flex items-center justify-between py-2 text-sm">
                  <Link href={`/businesses/${b.id}`} className="font-medium text-brand-700 hover:underline">
                    {b.name}
                  </Link>
                  <span className="text-stone-500">{formatDate(b.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
