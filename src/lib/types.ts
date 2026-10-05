// Shapes returned by the FastAPI /platform API (plain dicts there).

export type AccessLevel = "full" | "readonly" | "suspended";
export type PlanCode = "STARTER" | "PRO";
export type SubscriptionStatus = "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED";

export interface Admin {
  id: string;
  email: string;
  name: string;
}

export interface Access {
  level: AccessLevel;
  reason: string | null;
  warning: string | null;
}

export interface SubscriptionDto {
  plan: PlanCode;
  status: SubscriptionStatus;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  pastDueSince: string | null;
  canceledAt: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

export interface Usage {
  members: number;
  clients: number;
  monthlyOrders: number;
  totalOrders: number;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
}

export interface BusinessSummary {
  id: string;
  name: string;
  email: string | null;
  createdAt: string | null;
  suspendedAt: string | null;
  suspendedReason: string | null;
  owner: Owner | null;
  subscription: SubscriptionDto | null;
  access: Access;
  usage: Usage;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "STAFF";
}

export interface AuditEntry {
  action: string;
  actorEmail: string | null;
  entityType: string;
  metadata: Record<string, unknown> | null;
}

export interface BusinessDetail extends BusinessSummary {
  members: Member[];
  audit: AuditEntry[];
}

export interface Stats {
  businesses: number;
  users: number;
  suspended: number;
  byStatus: Partial<Record<SubscriptionStatus, number>>;
  byPlan: Partial<Record<PlanCode, number>>;
  recentSignups: { id: string; name: string; createdAt: string | null }[];
}

export interface Plan {
  code: PlanCode;
  name: string;
  description: string;
  priceLabel: string;
  maxMembers: number | null;
  maxMonthlyOrders: number | null;
  stripePriceId: string | null;
  isPublic: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface Page<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PlatformAuditEntry {
  action: string;
  scope: string;
  actorEmail: string | null;
  businessName: string | null;
  entityType: string;
  metadata: Record<string, unknown> | null;
}
