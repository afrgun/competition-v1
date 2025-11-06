"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * SidebarItem - Atom component for individual sidebar menu item
 * Displays menu item with active state based on current path
 */
export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  href,
  icon: Icon,
}) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg
        transition-colors duration-200
        ${
          isActive
            ? "bg-gray-700 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }
      `}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span className="font-medium">{label}</span>
    </Link>
  );
};
