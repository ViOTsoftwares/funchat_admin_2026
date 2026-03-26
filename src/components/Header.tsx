import ProfileMenu from "./ProfileMenu";

export default function Header() {
  return (
    <header
      style={{
        height: "60px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ fontSize: "18px", fontWeight: "bold" }}>
        Portfolio Admin
      </div>

      <ProfileMenu />
    </header>
  );
}
