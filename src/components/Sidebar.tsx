"use client";

import { menuList } from "@/Router";
import MenuItem from "./MenuItem";
import { useAppSelector } from "@/store/hooks";
import { useMemo } from "react";

export default function Sidebar() {
  const user = useAppSelector((state) => state.auth.user);

  const filteredMenu = useMemo(() => {
    if (!user || user.role === "superadmin") return menuList;

    const permissions = Array.isArray(user.restriction)
      ? user.restriction
      : [];
    const canView = (label: string) => {
      const match = permissions.find((p) => p?.module === label);
      return Boolean(match?.view);
    };

    return menuList
      .map((menu) => {
        if (menu.subMenu && menu.subMenu.length > 0) {
          const subMenu = menu.subMenu.filter((sub) => canView(sub.label));
          if (subMenu.length === 0) return null;
          return { ...menu, subMenu };
        }
        if (menu.path && canView(menu.label)) return menu;
        return null;
      })
      .filter(Boolean) as typeof menuList;
  }, [user]);

  return (
    <aside
      style={{
        width: "250px",
        background: "#0f172a",
        color: "#fff",
        padding: "20px",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      <h2 style={{ marginBottom: "30px", fontSize: "20px" }}>Admin Panel</h2>

      {filteredMenu.map((menu) => (
        <MenuItem key={menu.label} menu={menu} />
      ))}
    </aside>
  );
}
