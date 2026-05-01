import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 py-8">
        {children}
      </main>
    </div>
  );
}
