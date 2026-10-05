import Link from "next/link";
import { AccessBadge, StatusBadge } from "@/components/status";
import { Badge, Button, EmptyState, Input, PageHeader, Select, TableWrap, Td, Th } from "@/components/ui";
import { platformApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { BusinessSummary, Page } from "@/lib/types";

export const metadata = { title: "Businesses" };
export const dynamic = "force-dynamic";

const STATUS_OPTIONS = [
  ["", "All"],
  ["TRIALING", "Trialing"],
  ["ACTIVE", "Active"],
  ["PAST_DUE", "Past due"],
  ["CANCELED", "Canceled"],
  ["suspended", "Suspended"],
] as const;

export default async function BusinessesPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { q = "", status = "" } = await searchParams;
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (status) params.set("status", status);
  params.set("pageSize", "50");
  const { rows } = await platformApi<Page<BusinessSummary>>(`/businesses?${params.toString()}`);

  return (
    <>
      <PageHeader title="Businesses" description="Client businesses on the platform — subscription state and usage. No tenant business records are shown and there is no impersonation." />
      <form className="mb-4 flex flex-wrap gap-2">
        <Input name="q" defaultValue={q} placeholder="Business or owner email" className="max-w-xs" aria-label="Search" />
        <Select name="status" defaultValue={status} className="w-auto" aria-label="Status">
          {STATUS_OPTIONS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="secondary">
          Filter
        </Button>
      </form>

      {rows.length === 0 ? (
        <EmptyState title="No businesses found" description="Try a different search or filter." />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Business</Th>
              <Th>Owner</Th>
              <Th>Plan</Th>
              <Th>Subscription</Th>
              <Th className="text-right">Members</Th>
              <Th className="text-right">Orders (mo / all)</Th>
              <Th className="text-right">Clients</Th>
              <Th>Created</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((b) => (
              <tr key={b.id} className="hover:bg-stone-50">
                <Td>
                  <Link href={`/businesses/${b.id}`} className="font-medium text-brand-700 hover:underline">
                    {b.name}
                  </Link>
                  {b.suspendedReason && <p className="text-xs text-red-600">Suspended: {b.suspendedReason}</p>}
                </Td>
                <Td>
                  {b.owner ? (
                    <>
                      <p>{b.owner.name}</p>
                      <p className="text-xs text-stone-500">{b.owner.email}</p>
                    </>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td>{b.subscription ? (b.subscription.plan === "PRO" ? "Pro" : "Starter") : "—"}</Td>
                <Td>
                  <span className="flex flex-wrap gap-1">
                    {b.subscription && <StatusBadge status={b.subscription.status} />}
                    {b.access.level !== "full" && <AccessBadge level={b.access.level} />}
                  </span>
                </Td>
                <Td className="text-right tabular-nums">{b.usage.members}</Td>
                <Td className="text-right tabular-nums">
                  {b.usage.monthlyOrders} / {b.usage.totalOrders}
                </Td>
                <Td className="text-right tabular-nums">{b.usage.clients}</Td>
                <Td className="whitespace-nowrap text-stone-500">{formatDate(b.createdAt)}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
      {rows.length >= 50 && <p className="mt-3 text-xs text-stone-500">Showing the first 50 results — refine the search to narrow down.</p>}
      <noscript>
        <p className="mt-2 text-xs text-stone-400">
          <Badge>Tip</Badge> Filtering uses a standard form submit.
        </p>
      </noscript>
    </>
  );
}
