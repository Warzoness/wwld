import Link from "next/link";

export default function Header() {
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

          {/* Search */}
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

          {/* Lang */}
          <div className="col-6 col-md-2 order-2 order-md-3 text-end">
            <div className="dropdown">
              <button
                className="iris-btn iris-btn--primary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                VNI
              </button>
              <ul className="dropdown-menu iris-dropdown">
                <li><button className="dropdown-item active">VNI</button></li>
                <li><button className="dropdown-item">ENG</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
