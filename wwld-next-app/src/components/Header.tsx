"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type UserDTO = {
  id?: number;
  username?: string;
  fullname?: string;
  role?: string;
  avatar?: string;
};

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Max-Age=0; path=/;`;
}

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserDTO | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // lấy user từ localStorage (bạn đã lưu sau khi login)
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("userDTO") : null;
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }

    // đóng menu khi click ra ngoài
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // ví dụ trong Header.tsx (client)
  async function onLogout() {
    try {
      await fetch("/api/auth/clear-session", { method: "POST" });
    } finally {
      localStorage.removeItem("userDTO");
      localStorage.removeItem("access_token");
      // chuyển hướng về trang login
      router.push("/authenticate/login");
    }
  }


  const displayName = user?.fullname?.trim() || user?.username || "Người dùng";
  const isLoggedIn = !!user;

  return (
    <header className="iris-header sticky-top">
      <div className="container-fluid py-2">
        <div className="row align-items-center g-2">
          {/* Logo */}
          <div className="col-6 col-md-3">
            <Link href="/" className="logo-link d-inline-flex align-items-center text-decoration-none">
              <span className="iris-logo">WWLD</span>
            </Link>
          </div>

          {/* Search (giữ nguyên nếu bạn cần) */}
          <div className="col-12 col-md-7 order-3 order-md-2">
            <form className="w-100" role="search">
              <div className="iris-search">
                <i className="bi bi-search me-2"></i>
                <input
                  type="text"
                  className="form-control iris-input"
                  placeholder="Nhập từ khóa tìm kiếm hoặc hashtag"
                />
                <button type="button" className="iris-chip ms-2" aria-label="Bộ lọc">
                  <i className="bi bi-funnel"></i>
                </button>
              </div>
            </form>
          </div>

          {/* Auth / User */}
          <div className="col-6 col-md-2 order-2 order-md-3 text-end" ref={menuRef}>
            {isLoggedIn ? (
              <>
                <button
                  className="iris-btn iris-btn--primary d-inline-flex align-items-center"
                  aria-expanded={open}
                  aria-haspopup="menu"
                  onClick={() => setOpen((v) => !v)}
                >
                  {/* avatar nhỏ nếu có */}
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="rounded-circle me-2"
                      style={{ width: 24, height: 24, objectFit: "cover" }}
                    />
                  ) : (
                    <span
                      className="rounded-circle bg-light me-2 d-inline-flex justify-content-center align-items-center"
                      style={{ width: 24, height: 24 }}
                    >
                      <i className="bi bi-person" />
                    </span>
                  )}
                  <span className="text-truncate" style={{ maxWidth: 120 }}>{displayName}</span>
                  <i className="bi bi-caret-down-fill ms-2" />
                </button>

                <ul
                  role="menu"
                  className={`dropdown-menu dropdown-menu-end iris-dropdown ${open ? "show" : ""}`}
                  style={{ position: "absolute", right: 0, zIndex: 2000 }}
                >
                  <li role="none">
                    <Link className="dropdown-item" role="menuitem" href="/profile" onClick={() => setOpen(false)}>
                      Trang cá nhân
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li role="none">
                    <button className="dropdown-item text-danger" role="menuitem" onClick={onLogout}>
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </>
            ) : (
              <div className="d-inline-flex gap-2">
                <Link href="/authenticate/login" className="iris-btn iris-btn--primary">
                  Đăng nhập
                </Link>
                <Link href="/authenticate/register" className="iris-btn iris-btn--ghost">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
