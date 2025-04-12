"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const router = useRouter();
  // eslint-disable-next-line
  const [user, setUser] = useState<any>(null);

  // Load the user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const handleDashboard = () => {
    router.push("/owner");
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-black-200">
      {/* App Branding */}
      <div>
        <Link href="/">
          <span className="font-bold text-lg">Shelf Assignment Submission</span>
        </Link>
      </div>
      {/* Dashboard button */}
      <div className="flex gap-2">
        <div>
          {user?.role === "owner" ? (
            <Button onClick={handleDashboard}>Dashboard</Button>
          ) : (
            ""
          )}
        </div>
        {/* Login / Logout button */}
        <div>
          {user ? (
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button variant="default" onClick={() => router.push("/login")}>
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
