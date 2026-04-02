"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const topLinks = [
  { href: "/", label: "VAULT" },
  { href: "/network-nodes", label: "NETWORK" },
  { href: "/billing", label: "LEDGER" },
];

const sideLinks = [
  { href: "/", label: "UPLOAD CONSOLE", icon: "stack" },
  { href: "/network-nodes", label: "BLOB INSPECTOR", icon: "bars" },
  { href: "/billing", label: "BILLING LEDGER", icon: "clock" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function iconMarkup(icon: string) {
  if (icon === "stack") {
    return (
      <span className="nav-icon" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    );
  }

  if (icon === "bars") {
    return (
      <span className="nav-icon nav-icon-bars" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    );
  }

  return (
    <span className="nav-icon nav-icon-clock" aria-hidden="true">
      <span />
    </span>
  );
}

export function TopNavigation() {
  const pathname = usePathname();

  return (
    <nav className="top-nav" aria-label="Primary">
      {topLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={isActive(pathname, link.href) ? "is-active" : undefined}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function SideNavigation() {
  const pathname = usePathname();

  return (
    <nav className="side-nav" aria-label="Section">
      {sideLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={isActive(pathname, link.href) ? "is-active" : undefined}
        >
          {iconMarkup(link.icon)}
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>
  );
}
