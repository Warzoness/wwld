"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/services/userService";
import styles from "@/app/authenticate/authenticate.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    if (!username || !password) {
      setErrorMsg("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }
    try {
      setLoading(true);
      const user = await login({ username, hashpassword: password });
      if (typeof window !== "undefined") {
        localStorage.setItem("userDTO", JSON.stringify(user));
      }
      router.replace("/");
    } catch (err: any) {
      setErrorMsg(err?.message || "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.authRoot}>
      <div className={styles.auth}>
        <aside className={styles.authArt}>
          <div className={styles.artInner}>
            <h1>Chào mừng trở lại</h1>
            <p>Đăng nhập để tiếp tục quản trị hệ thống.</p>
          </div>
        </aside>

        <main className={styles.panel}>
          <section className={styles.card}>
            <header className={styles.header}>
              <h2 className={styles.title}>Đăng nhập</h2>
              <p className={styles.subtitle}>Sử dụng tài khoản đã đăng ký</p>
            </header>

            {errorMsg && <div className={styles.alert}>{errorMsg}</div>}

            <form className={styles.form} onSubmit={onSubmit}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="username">Tên đăng nhập</label>
                <input
                  className={styles.input}
                  id="username"
                  name="username"
                  placeholder="john.doe"
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
                <label className={styles.checkbox}>
                  <input type="checkbox" /> Ghi nhớ đăng nhập
                </label>
                <button
                  className={`${styles.btn} ${loading ? styles.btnLoading : ""}`}
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </div>
            </form>

            <div className={`${styles.divider} ${styles.mt12}`}><span>hoặc</span></div>
            <p className={styles.switchText}>
              Chưa có tài khoản? <Link href="/authenticate/register">Đăng ký ngay</Link>
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
