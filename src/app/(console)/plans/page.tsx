import { planAction } from "@/app/actions";
import { Badge, Button, Card, Field, Input, PageHeader, Textarea } from "@/components/ui";
import { platformApi } from "@/lib/api";
import type { Plan } from "@/lib/types";

export const metadata = { title: "Plans" };
export const dynamic = "force-dynamic";

export default async function PlansPage() {
  const plans = await platformApi<Plan[]>("/plans");
  return (
    <>
      <PageHeader title="Pricing plans" description="Edit the Starter and Pro tiers. The web app reads these values (with built-in defaults as a fallback)." />
      <div className="grid gap-6 lg:grid-cols-2">
        {plans.map((p) => (
          <Card key={p.code} title={<span className="flex items-center gap-2">{p.name} <Badge>{p.code}</Badge></span>}>
            <form action={planAction} className="space-y-3">
              <input type="hidden" name="code" value={p.code} />
              <Field label="Name" htmlFor={`name-${p.code}`}>
                <Input id={`name-${p.code}`} name="name" defaultValue={p.name} required maxLength={120} />
              </Field>
              <Field label="Description" htmlFor={`desc-${p.code}`}>
                <Textarea id={`desc-${p.code}`} name="description" defaultValue={p.description} maxLength={500} />
              </Field>
              <Field label="Price label" htmlFor={`price-${p.code}`} hint="Display only, e.g. ₹999 / month.">
                <Input id={`price-${p.code}`} name="priceLabel" defaultValue={p.priceLabel} required maxLength={80} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Max members" htmlFor={`mm-${p.code}`} hint="Blank = unlimited">
                  <Input id={`mm-${p.code}`} name="maxMembers" type="number" min={1} defaultValue={p.maxMembers ?? ""} />
                </Field>
                <Field label="Max orders / month" htmlFor={`mo-${p.code}`} hint="Blank = unlimited">
                  <Input id={`mo-${p.code}`} name="maxMonthlyOrders" type="number" min={1} defaultValue={p.maxMonthlyOrders ?? ""} />
                </Field>
              </div>
              <Field label="Stripe price id" htmlFor={`sp-${p.code}`} hint="Optional; links this tier to a Stripe price.">
                <Input id={`sp-${p.code}`} name="stripePriceId" defaultValue={p.stripePriceId ?? ""} maxLength={255} placeholder="price_…" />
              </Field>
              <div className="flex gap-5 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isPublic" defaultChecked={p.isPublic} className="h-4 w-4 rounded border-stone-300" />
                  Public (shown on pricing)
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isActive" defaultChecked={p.isActive} className="h-4 w-4 rounded border-stone-300" />
                  Active (selectable)
                </label>
              </div>
              <Button type="submit" size="sm">
                Save {p.name}
              </Button>
            </form>
          </Card>
        ))}
      </div>
    </>
  );
}
