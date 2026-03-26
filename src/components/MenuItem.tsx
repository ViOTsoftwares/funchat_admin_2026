"use client";

import { Menu } from "@/Router";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function MenuItem({ menu }: { menu: Menu }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(
    menu.subMenu?.some((sub) => sub.path === pathname) ?? false,
  );

  const isActive = menu.path === pathname;

  if (menu.subMenu) {
    return (
      <div className="menu-group">
        <button
          onClick={() => setOpen(!open)}
          className={`menu-btn ${open ? "active" : ""}`}
        >
          <span>{menu.label}</span>
          <span className={`arrow ${open ? "rotate" : ""}`}>▸</span>
        </button>

        <div className={`submenu ${open ? "open" : ""}`}>
          {menu.subMenu.map((sub) => (
            <Link
              key={sub.label}
              href={sub.path}
              className={`submenu-item ${
                pathname === sub.path ? "active" : ""
              }`}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Link
      href={menu.path || "#"}
      className={`menu-btn ${isActive ? "active" : ""}`}
    >
      {menu.label}
    </Link>
  );
}
