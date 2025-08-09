import Link from "next/link";

export default function Header() {
    return (
        <header className="header sticky-top bg-light">
            <div className="row">
                <div className="col col-lg-3">
                    <Link href="/" className="logo-link text-decoration-none d-flex align-items-center">
                        <h2>WWLD</h2>
                    </Link>
                </div>
                <div className="col col-lg-7">
                    <nav className="navbar navbar-light bg-light w-100">
                        <div className="container-fluid w-100">
                            <form className="d-flex w-100 justify-content-center">
                                <div className="search-bar d-flex align-items-center px-3 py-2 rounded-pill w-75" style={{ border: '1px solid #ccc', backgroundColor: '#f8f9fa' }}>
                                    <i className="bi bi-search me-2"></i>
                                    <input
                                        type="text"
                                        className="form-control border-0 shadow-none bg-transparent flex-grow-1"
                                        placeholder="Nhập từ khóa tìm kiếm hoặc hashtag"
                                    />

                                    <div className="icon-circle">
                                        <i className="bi bi-funnel"></i>
                                    </div>
                                </div>


                            </form>
                        </div>
                    </nav>
                </div>
                <div className="col ol-lg-2">
                    <div className="dropdown">
                        <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                            VNI
                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
                            <li><a className="dropdown-item active" href="#">Action</a></li>
                            <li><a className="dropdown-item" href="#">Another action</a></li>

                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}