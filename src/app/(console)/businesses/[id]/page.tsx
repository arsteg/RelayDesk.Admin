import { notFound } from "next/navigation";
import { subscriptionAction, suspendAction } from "@/app/actions";
import { AccessBadge, StatusBadge } from "@/components/status";
import { Button, Card, Field, Input, PageHeader, Td, Th } from "@/components/ui";
import { ApiError, platformApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { BusinessDetail } from "@/lib/types";

export const metadata = { title: "Business" };
export const dynamic = "force-dynamic";

async function load(id: string): Promise<BusinessDetail> {
  try {
    return await platformApi<BusinessDetail>(`/businesses/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}

function SubAction({ id, action, plan, label, variant = "secondary" }: { id: string; action: string; plan?: string; label: string; variant?: "secondary" | "danger" | "primary" }) {
  return (
    <form action={subscriptionAction}>
      <input type="hidden" name="businessId" value={id} />
      <input type="hidden" name="action" value={action} />
      {plan && <input type="hidden" name="plan" value={plan} />}
      <Button type="submit" size="sm" variant={variant}>
        {label}
      </Button>
    </form>
  );
}

export default async function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await load(id);
  const sub = b.subscription;

  return (
    <>
      <PageHeader
        title={b.name}
        description={b.email ?? "No contact email on file"}
        actions={
          <span className="flex flex-wrap gap-1">
            {sub && <StatusBadge status={sub.status} />}
            <AccessBadge level={b.access.level} />
          </span>
        }
      />

      {b.access.reason && <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-amber-200">{b.access.reason}</p>}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Overview">
          <dl className="space-y-2 text-sm">
            <Row label="Owner" value={b.owner ? `${b.owner.name} · ${b.owner.email}` : "—"} />
            <Row label="Created" value={formatDate(b.createdAt)} />
            <Row label="Members" value={String(b.usage.members)} />
            <Row label="Clients" value={String(b.usage.clients)} />
            <Row label="Orders (this month / all)" value={`${b.usage.monthlyOrders} / ${b.usage.totalOrders}`} />
          </dl>
        </Card>

        <Card title="Subscription" className="lg:col-span-2">
          {sub ? (
            <dl className="mb-4 grid grid-cols-2 gap-2 text-sm">
              <Row label="Plan" value={sub.plan === "PRO" ? "Pro" : "Starter"} />
              <Row label="Status" value={sub.status} />
              <Row label="Trial ends" value={formatDate(sub.trialEndsAt)} />
              <Row label="Period ends" value={formatDate(sub.currentPeriodEnd)} />
            </dl>
          ) : (
            <p className="mb-4 text-sm text-stone-500">No subscription row yet — any action below creates one.</p>
          )}
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-500">Change plan</p>
          <div className="mb-4 flex flex-wrap gap-2">
            <SubAction id={b.id} action="set_plan" plan="STARTER" label="Set Starter" />
            <SubAction id={b.id} action="set_plan" plan="PRO" label="Set Pro" />
          </div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-500">Lifecycle</p>
          <div className="mb-4 flex flex-wrap gap-2">
            <SubAction id={b.id} action="activate" label="Mark active" variant="primary" />
            <SubAction id={b.id} action="expire_trial" label="Expire trial" />
            <SubAction id={b.id} action="past_due" label="Mark past due" />
            <SubAction id={b.id} action="cancel" label="Cancel" variant="danger" />
            <SubAction id={b.id} action="reactivate" label="Reactivate" />
          </div>
          <form action={subscriptionAction} className="flex items-end gap-2">
            <input type="hidden" name="businessId" value={b.id} />
            <input type="hidden" name="action" value="start_trial" />
            <Field label="Start / extend trial (days)" htmlFor="days" className="max-w-[12rem]">
              <Input id="days" name="days" type="number" min={1} max={365} defaultValue={14} />
            </Field>
            <Button type="submit" size="sm" variant="secondary">
              Start trial
            </Button>
          </form>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title={b.suspendedAt ? "Suspension" : "Suspend business"}>
          {b.suspendedAt ? (
            <form action={suspendAction} className="space-y-3">
              <p className="text-sm text-stone-600">Suspended {formatDate(b.suspendedAt)}{b.suspendedReason ? `: ${b.suspendedReason}` : ""}.</p>
              <input type="hidden" name="businessId" value={b.id} />
              <input type="hidden" name="suspend" value="0" />
              <Button type="submit" variant="secondary" size="sm">
                Reactivate
              </Button>
            </form>
          ) : (
            <form action={suspendAction} className="space-y-3">
              <input type="hidden" name="businessId" value={b.id} />
              <input type="hidden" name="suspend" value="1" />
              <Field label="Reason" htmlFor="reason" hint="Shown to the business. At least 3 characters.">
                <Input id="reason" name="reason" required minLength={3} maxLength={500} placeholder="e.g. payment fraud" />
              </Field>
              <Button type="submit" variant="danger" size="sm">
                Suspend
              </Button>
            </form>
          )}
        </Card>

        <Card title="Recent activity" className="lg:col-span-2">
          {b.audit.length === 0 ? (
            <p className="text-sm text-stone-500">No recorded activity.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    <Th>Action</Th>
                    <Th>Actor</Th>
                    <Th>Details</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {b.audit.map((a, i) => (
                    <tr key={i}>
                      <Td>
                        <code className="text-xs">{a.action}</code>
                      </Td>
                      <Td className="text-stone-500">{a.actorEmail ?? "—"}</Td>
                      <Td className="max-w-md truncate text-xs text-stone-500">{a.metadata ? JSON.stringify(a.metadata) : "—"}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-stone-500">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
