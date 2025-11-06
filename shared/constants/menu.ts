import { MenuItem } from "@/domain/entities";

/**
 * Dashboard menu items for different user roles
 */
export const DASHBOARD_MENU: MenuItem[] = [
  // Employee menu items
  {
    label: "Home",
    href: "/dashboard/home",
    roles: ["employee"],
  },
  {
    label: "My Ticket",
    href: "/dashboard/my-ticket",
    roles: ["employee"],
  },
  {
    label: "FAQ",
    href: "/dashboard/faq",
    roles: ["employee"],
  },

  // Admin menu items
  {
    label: "Ticket",
    href: "/dashboard/ticket",
    roles: ["admin"],
  },
  {
    label: "List Employee",
    href: "/dashboard/employees",
    roles: ["admin"],
  },
];
