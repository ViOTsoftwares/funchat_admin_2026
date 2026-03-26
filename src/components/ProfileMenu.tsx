"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleLogout } from "@/lib/adminFun";
import { useAppSelector } from "@/store/hooks";
export default function ProfileMenu() {
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const username = user?.username || "Admin";
  const initials =
    username
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "A";

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={btn}>
        <span style={avatar}>{initials}</span>
        <span>{username}</span>
      </button>

      {open && (
        <div style={dropdown}>
          <button
            style={item}
            onClick={() => {
              navigate.push("/change-password");
              setOpen(!open);
            }}
          >
            Profile
          </button>
          <button
            style={item}
            onClick={() => {
              navigate.push("/change-password");
              setOpen(!open);
            }}
          >
            Change Password
          </button>
          <button
            style={{ ...item, color: "red" }}
            onClick={() => {
              handleLogout(navigate);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

const btn: React.CSSProperties = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
};

const dropdown: React.CSSProperties = {
  position: "absolute",
  right: 0,
  top: "40px",
  background: "#fff",
  borderRadius: "6px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  overflow: "hidden",
};

const item: React.CSSProperties = {
  width: "160px",
  padding: "10px",
  background: "transparent",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
};

const avatar: React.CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #0f172a, #334155)",
  color: "#fff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.5px",
};

const chevron: React.CSSProperties = {
  fontSize: "12px",
  opacity: 0.7,
};
