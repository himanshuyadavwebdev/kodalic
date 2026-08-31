import { hasPermission } from "./permissions";
import { adminNavigation } from "./admin-navigation";

export type AllowedNavItem = {
  label: string;
  href: string;
  permission: string;
  icon: string;
};

export async function getAdminNavigation(): Promise<AllowedNavItem[]> {
  const results = await Promise.all(
    adminNavigation.map(async (item) => {
      const allowed = await hasPermission(item.permission);

      if (!allowed) {
        return null;
      }

      return {
        label: item.label,
        href: item.href,
        permission: item.permission,
        icon: item.icon,
      };
    })
  );

  return results.filter(
    (item): item is AllowedNavItem => item !== null
  );
}