"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type UserDTO = {
  id?: number;
  username?: string;
  fullname?: string;
  role?: string;
  avatar?: string;
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // <- mobile search
  const [user, setUser] = useState<UserDTO | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // lấy user từ localStorage (đã lưu sau login)
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("userDTO") : null;
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
  }, []);

  // đóng menu/search khi click ra ngoài
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setOpenUserMenu(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // đóng dropdown & search khi đổi route
  useEffect(() => {
    setOpenUserMenu(false);
    setShowSearch(false);
  }, [pathname]);

  // ESC để đóng dropdown/search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenUserMenu(false);
        setShowSearch(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // autofocus input khi mở search trên mobile
  useEffect(() => {
    if (showSearch) {
      setTimeout(() => searchRef.current?.focus(), 10);
    }
  }, [showSearch]);

  async function onLogout() {
    try {
      await fetch("/api/auth/clear-session", { method: "POST" });
    } finally {
      localStorage.removeItem("userDTO");
      localStorage.removeItem("access_token");
      router.push("/authenticate/login");
    }
  }

  const displayName = user?.fullname?.trim() || user?.username || "Người dùng";
  const isLoggedIn = !!user;

  return (
    <header className="iris-header sticky-top">
      <div className="container-fluid py-2">
        {/* Hàng trên: logo, nút search (mobile), user */}
        <div className="d-flex align-items-center justify-content-between">
          {/* Logo trái */}
          <Link href="/" className="logo-link d-inline-flex align-items-center text-decoration-none">
            <span className="iris-logo">WWLD</span>
          </Link>

          {/* Dàn nút bên phải */}
          <div className="d-flex align-items-center gap-2" ref={menuRef}>
            {/* Nút toggle search (HIỆN trên mobile, ẨN desktop) */}
            <button
              className="iris-chip d-inline-flex d-md-none"
              aria-label={showSearch ? "Đóng tìm kiếm" : "Mở tìm kiếm"}
              aria-expanded={showSearch}
              onClick={() => setShowSearch(v => !v)}
            >
              <i className="bi bi-search" />
            </button>

            {/* User / Auth */}
            {isLoggedIn ? (
              <>
                <div className="dropdown" ref={menuRef}>
                  <button
                    className="iris-btn iris-btn--primary d-inline-flex align-items-center dropdown-toggle"
                    aria-expanded={openUserMenu}
                    onClick={() => setOpenUserMenu(v => !v)}
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="rounded-circle me-2"
                        style={{ width: 28, height: 28, objectFit: "cover" }}
                      />
                    ) : (
                      <span
                        className="rounded-circle bg-light me-2 d-inline-flex justify-content-center align-items-center"
                        style={{ width: 28, height: 28 }}
                      >
                        <i className="bi bi-person" />
                      </span>
                    )}
                    <span className="text-truncate d-none d-sm-inline" style={{ maxWidth: 140 }}>
                      {displayName}
                    </span>
                  </button>

                  <ul
                    role="menu"
                    className={`dropdown-menu dropdown-menu-end ${openUserMenu ? "show" : ""}`}
                  >
                    <li>
                      <Link className="dropdown-item" href="/profile" onClick={() => setOpenUserMenu(false)}>
                        Trang cá nhân
                      </Link>
                    </li>

                    {user?.role === "ADMIN" && (
                      <li>
                        <Link className="dropdown-item" href="/admin/dashboard" onClick={() => setOpenUserMenu(false)}>
                          Quản lý nội dung
                        </Link>
                      </li>
                    )}

                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={onLogout}>
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </div>

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

        {/* Hàng dưới: SEARCH */}
        {/* Desktop: luôn hiện. Mobile: trượt xuống khi showSearch=true */}
        <div
          className={`mobile-search-wrapper ${showSearch ? "is-open" : ""} d-md-none`}
          aria-hidden={!showSearch}
        >
          <form className="w-100 mt-2" role="search" onSubmit={(e) => e.preventDefault()}>
            <div className="iris-search">
              <i className="bi bi-search me-2"></i>
              <input
                ref={searchRef}
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

        <div className="d-none d-md-block mt-2">
          <form className="w-100" role="search" onSubmit={(e) => e.preventDefault()}>
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
      </div>
    </header>
  );
}
