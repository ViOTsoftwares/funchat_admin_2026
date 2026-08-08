import ProfileMenu from "./ProfileMenu";
import Link from "next/link";

export default function Header() {
  return (
    <header className="admin-header">
      {/* Brand */}
      <div className="admin-header-brand">
        <div className="admin-header-logo">
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L22 7.5V20.5L14 26L6 20.5V7.5L14 2Z" fill="url(#hbolt)" />
            <path d="M16 8L11 15H14L12 20L17 13H14L16 8Z" fill="white" />
            <defs>
              <linearGradient id="hbolt" x1="6" y1="2" x2="22" y2="26" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <span className="admin-header-title">FunChat</span>
          <span className="admin-header-badge">Admin</span>
        </div>
      </div>

      {/* Right section */}
      <div className="admin-header-right">
        {/* Notification bell */}
        <button className="admin-header-icon-btn" title="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        {/* Profile menu */}
        <ProfileMenu />
      </div>
    </header>
  );
}
