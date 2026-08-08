"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { handleLogout } from "@/lib/adminFun";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.auth.user);
  const username = user?.username || "Admin";
  const initials =
    username
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "A";

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="pm-root">
      {/* Avatar Button */}
      <button onClick={() => setOpen(!open)} className="pm-trigger" aria-expanded={open}>
        <div className="pm-avatar">{initials}</div>
        <div className="pm-info">
          <span className="pm-name">{username}</span>
          <span className="pm-role">Administrator</span>
        </div>
        <span className={`pm-chevron ${open ? "pm-chevron-open" : ""}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="pm-dropdown">
          {/* Header */}
          <div className="pm-dropdown-header">
            <div className="pm-dropdown-avatar">{initials}</div>
            <div>
              <p className="pm-dropdown-name">{username}</p>
              <p className="pm-dropdown-tag">Admin Panel</p>
            </div>
          </div>

          <div className="pm-divider" />

          {/* Menu Items */}
          <div className="pm-menu">
            <button
              className="pm-item"
              onClick={() => {
                navigate.push("/admin");
                setOpen(false);
              }}
            >
              <span className="pm-item-icon pm-icon-profile">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <span>My Profile</span>
            </button>

            <button
              className="pm-item"
              onClick={() => {
                navigate.push("/change-password");
                setOpen(false);
              }}
            >
              <span className="pm-item-icon pm-icon-key">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <span>Change Password</span>
            </button>
          </div>

          <div className="pm-divider" />

          <div className="pm-menu">
            <button
              className="pm-item pm-item-danger"
              onClick={() => {
                setOpen(false);
                handleLogout(navigate);
              }}
            >
              <span className="pm-item-icon pm-icon-logout">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
