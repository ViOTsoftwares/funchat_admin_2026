import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Header />
        <main style={{ padding: "20px" }}>
          <AuthGuard>{children}</AuthGuard>
        </main>
      </div>
    </div>
  );
}
