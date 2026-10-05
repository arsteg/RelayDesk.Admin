import { adminAction } from "@/app/actions";
import { Button, Card, EmptyState, Field, Input, PageHeader, TableWrap, Td, Th } from "@/components/ui";
import { platformApi } from "@/lib/api";
import type { Admin } from "@/lib/types";

export const metadata = { title: "Admins" };
export const dynamic = "force-dynamic";

export default async function AdminsPage() {
  const admins = await platformApi<Admin[]>("/admins");
  return (
    <>
      <PageHeader title="Platform admins" description="Operators with access to this console. The person must already have a RelayDesk account." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Grant access" className="lg:col-span-1">
          <form action={adminAction} className="space-y-3">
            <input type="hidden" name="grant" value="1" />
            <Field label="Email" htmlFor="email" hint="Of an existing registered user.">
              <Input id="email" name="email" type="email" required />
            </Field>
            <Button type="submit" size="sm">
              Grant admin
            </Button>
          </form>
        </Card>

        <div className="lg:col-span-2">
          {admins.length === 0 ? (
            <EmptyState title="No platform admins" />
          ) : (
            <TableWrap>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {admins.map((a) => (
                  <tr key={a.id}>
                    <Td className="font-medium">{a.name}</Td>
                    <Td className="text-stone-600">{a.email}</Td>
                    <Td className="text-right">
                      <form action={adminAction}>
                        <input type="hidden" name="email" value={a.email} />
                        <input type="hidden" name="grant" value="0" />
                        <Button type="submit" variant="danger" size="sm">
                          Revoke
                        </Button>
                      </form>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
          <p className="mt-3 text-xs text-stone-500">Revoking signs the operator out of all sessions immediately.</p>
        </div>
      </div>
    </>
  );
}
