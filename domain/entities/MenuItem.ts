import { UserRole } from "./User";

/**
 * MenuItem entity - represents a navigation menu item in the dashboard
 */
export interface MenuItem {
  label: string;
  href: string;
  roles: UserRole[];
  icon?: React.ComponentType<{ className?: string }>;
}
