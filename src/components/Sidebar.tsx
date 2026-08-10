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
      className="admin-sidebar"
      style={{
        width: "260px",
        minWidth: "260px",
        background: "#0f172a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        maxHeight: "100vh",
        boxSizing: "border-box",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        zIndex: 100,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: "20px 20px 16px 20px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #6366f1, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "18px",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.35)",
          }}
        >
          ⚡
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700, letterSpacing: "-0.3px" }}>
            FunChat Admin
          </h2>
          <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.5)", fontWeight: 500 }}>
            Management Portal
          </span>
        </div>
      </div>

      {/* Scrollable Navigation List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "16px 14px",
        }}
        className="sidebar-scroll"
      >
        {filteredMenu.map((menu) => (
          <MenuItem key={menu.label} menu={menu} />
        ))}
      </div>
    </aside>
  );
}
