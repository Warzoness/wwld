export default function RegisterPage() {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-75 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "450px", width: "100%", borderRadius: "1rem" }}
      >
        <h2 className="text-center mb-4 fw-bold">Đăng ký tài khoản</h2>

        <form>
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label fw-semibold">
              Họ và tên
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="fullName"
              placeholder="Nhập họ và tên..."
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              Email
            </label>
            <input
              type="email"
              className="form-control form-control-lg"
              id="email"
              placeholder="Nhập email..."
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              Mật khẩu
            </label>
            <input
              type="password"
              className="form-control form-control-lg"
              id="password"
              placeholder="Nhập mật khẩu..."
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label fw-semibold">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              className="form-control form-control-lg"
              id="confirmPassword"
              placeholder="Nhập lại mật khẩu..."
            />
          </div>

          <button
            type="submit"
            className="btn btn-success btn-lg w-100 shadow-sm"
          >
            Đăng ký
          </button>
        </form>

        <hr className="my-4" />

        <div className="text-center">
          <span className="small">Đã có tài khoản?</span>
          <a
            href="/login"
            className="small ms-2 text-primary text-decoration-none"
          >
            Đăng nhập ngay
          </a>
        </div>
      </div>
    </div>
  );
}
