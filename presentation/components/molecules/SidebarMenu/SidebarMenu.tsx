import { MenuItem } from "@/domain/entities";
import { SidebarItem } from "@/presentation/components/atoms";

interface SidebarMenuProps {
  items: MenuItem[];
}

/**
 * SidebarMenu - Molecule component that renders list of sidebar items
 * Receives filtered menu items and renders SidebarItem atoms
 */
export const SidebarMenu: React.FC<SidebarMenuProps> = ({ items }) => {
  return (
    <nav className="flex flex-col gap-2">
      {items.map((item) => (
        <SidebarItem
          key={item.href}
          label={item.label}
          href={item.href}
          icon={item.icon}
        />
      ))}
    </nav>
  );
};
