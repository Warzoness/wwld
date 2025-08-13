"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/services/userService";
import styles from "@/app/authenticate/authenticate.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setOkMsg("");

    if (!username || !password) {
      setErrorMsg("Vui lòng nhập tên đăng nhập và mật khẩu.");
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        username,
        hashpassword: password, // BE tự hash
        email: email || undefined,
        fullname: fullname || undefined,
        role: role || "USER",
      });
      setOkMsg("Tạo tài khoản thành công. Đang chuyển về trang đăng nhập...");
      setTimeout(() => router.replace("/authenticate/login"), 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Đăng ký thất bại.");
      }
    }

  }
  
  return (
    <div className={styles.authRoot}>
      <div className={styles.auth}>
        <aside className={styles.authArt}>
          <div className={styles.artInner}>
            <h1>Tham gia quản trị</h1>
            <p>Tạo tài khoản để bắt đầu sử dụng hệ thống.</p>
          </div>
        </aside>
  
        <main className={styles.panel}>
          <section className={styles.card}>
            <header className={styles.header}>
              <h2 className={styles.title}>Đăng ký</h2>
              <p className={styles.subtitle}>Điền thông tin bên dưới</p>
            </header>
  
            {errorMsg && <div className={styles.alert}>{errorMsg}</div>}
            {okMsg && (
              <div className={`${styles.alert} ${styles.alertSuccess}`}>{okMsg}</div>
            )}
  
            <form className={styles.form} onSubmit={onSubmit}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="fullname">Họ và tên</label>
                <input
                  className={styles.input}
                  id="fullname"
                  name="fullname"
                  placeholder="Nguyễn Văn A"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
  
              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">Email</label>
                <input
                  className={styles.input}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
  
              <div className={styles.field}>
                <label className={styles.label} htmlFor="username">Tên đăng nhập</label>
                <input
                  className={styles.input}
                  id="username"
                  name="username"
                  placeholder="jane.admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  aria-invalid={!!errorMsg && !username}
                />
              </div>
  
              <div className={styles.field}>
                <label className={styles.label} htmlFor="password">Mật khẩu</label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    id="password"
                    name="password"
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!errorMsg && !password}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    aria-label="Hiện/ẩn mật khẩu"
                    onClick={() => setShowPw((v) => !v)}
                  >
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
  
              <div className={styles.actions}>
                <Link
                  href="/authenticate/login"
                  className={`${styles.btn} ${styles.btnGhost}`}
                >
                  Hủy
                </Link>
                <button
                  className={`${styles.btn} ${loading ? styles.btnLoading : ""}`}
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Đang tạo..." : "Đăng ký"}
                </button>
              </div>
            </form>
  
            <p className={styles.switchText}>
              Đã có tài khoản? <Link href="/authenticate/login">Đăng nhập</Link>
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}