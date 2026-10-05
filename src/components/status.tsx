import { Badge, type BadgeTone } from "@/components/ui";
import type { AccessLevel, SubscriptionStatus } from "@/lib/types";

const STATUS: Record<SubscriptionStatus, { label: string; tone: BadgeTone }> = {
  TRIALING: { label: "Trialing", tone: "blue" },
  ACTIVE: { label: "Active", tone: "green" },
  PAST_DUE: { label: "Past due", tone: "amber" },
  CANCELED: { label: "Canceled", tone: "gray" },
};

const ACCESS: Record<AccessLevel, { label: string; tone: BadgeTone }> = {
  full: { label: "Full", tone: "green" },
  readonly: { label: "Read-only", tone: "amber" },
  suspended: { label: "Suspended", tone: "red" },
};

export function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const s = STATUS[status];
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export function AccessBadge({ level }: { level: AccessLevel }) {
  const a = ACCESS[level];
  return <Badge tone={a.tone}>{a.label}</Badge>;
}
