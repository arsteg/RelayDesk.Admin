import { Badge, EmptyState, PageHeader, TableWrap, Td, Th } from "@/components/ui";
import { platformApi } from "@/lib/api";
import type { PlatformAuditEntry } from "@/lib/types";

export const metadata = { title: "Audit" };
export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const rows = await platformApi<PlatformAuditEntry[]>("/audit?take=200");
  return (
    <>
      <PageHeader title="Audit log" description="Platform-level events: suspensions, subscription and plan changes, and admin grants." />
      {rows.length === 0 ? (
        <EmptyState title="No platform events yet" />
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Action</Th>
              <Th>Scope</Th>
              <Th>Business</Th>
              <Th>Actor</Th>
              <Th>Details</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((r, i) => (
              <tr key={i}>
                <Td>
                  <code className="text-xs">{r.action}</code>
                </Td>
                <Td>
                  <Badge tone={r.scope === "platform" ? "blue" : "gray"}>{r.scope}</Badge>
                </Td>
                <Td className="text-stone-600">{r.businessName ?? "—"}</Td>
                <Td className="text-stone-500">{r.actorEmail ?? "—"}</Td>
                <Td className="max-w-md truncate text-xs text-stone-500">{r.metadata ? JSON.stringify(r.metadata) : "—"}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </>
  );
}
