"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/components/ui";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/businesses", label: "Businesses" },
  { href: "/plans", label: "Plans" },
  { href: "/admins", label: "Admins" },
  { href: "/audit", label: "Audit" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-1">
      {LINKS.map((l) => {
        const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cx(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition",
              active ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100",
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
