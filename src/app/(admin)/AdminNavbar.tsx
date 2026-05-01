"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/app/ui/molecules/Navbar";
import Button from "@/app/ui/atoms/Button";
import { LogOut } from "lucide-react";

export default function AdminNavbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  };

  return (
    <Navbar
      brand="Presentation Manager"
      items={[{ label: "Projects", href: "/", active: true }]}
      variant="solid"
      sticky
      actions={
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          Salir
        </Button>
      }
    />
  );
}
