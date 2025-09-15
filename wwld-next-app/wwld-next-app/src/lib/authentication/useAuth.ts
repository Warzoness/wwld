// hooks/useAuth.ts
"use client";
import { useEffect, useState } from "react";

export type UserDTO = { username?: string; fullname?: string; role?: string };

export function useAuth() {
  const [user, setUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("userDTO");
      setUser(raw ? JSON.parse(raw) : null);
    } catch { setUser(null); }
  }, []);

  return {
    user,
    role: user?.role ?? null,
    displayName: user?.fullname?.trim() || user?.username || "Người dùng",
  };
}
