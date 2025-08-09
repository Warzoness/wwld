export default function LoginPage() {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-75 bg-light mt-4">
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%", borderRadius: "1rem" }}>
        <h2 className="text-center mb-4 fw-bold">Đăng nhập</h2>

        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control form-control-lg"
              id="email"
              placeholder="Nhập email..."
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">Mật khẩu</label>
            <input
              type="password"
              className="form-control form-control-lg"
              id="password"
              placeholder="Nhập mật khẩu..."
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="remember" />
              <label className="form-check-label small" htmlFor="remember">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <a href="#" className="small text-decoration-none">Quên mật khẩu?</a>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm">
            Đăng nhập
          </button>
        </form>

        <hr className="my-4" />

        <div className="text-center">
          <span className="small">Chưa có tài khoản?</span>
          <a href="/register" className="small ms-2 text-primary text-decoration-none">
            Đăng ký ngay
          </a>
        </div>
      </div>
    </div>
  );
}
