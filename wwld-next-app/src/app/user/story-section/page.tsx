import '@/app/globals.css'; // Import global styles
import SortOptions from '@/unity/SortOrder';
import Link from 'next/link';


export default function StorySectionPage() {
    return (
        <div className="container mt-4">
            {/* Nút quay lại trang chủ  */}
            <div className="mb-4">
                <Link href="/" className="btn btn-secondary">Quay lại trang chủ</Link>
            </div>
            <h1 className="mb-4">Story Section</h1>
            <div className="row">
                {/* Thanh tìm kiếm  */}
                <div className="col-md-4 d-flex flex-column">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm theo tiêu đề hoặc nhân vật"
                            aria-label="Tìm kiếm câu chuyện"
                        />
                        <button className="btn btn-primary" type="button">Tìm kiếm</button>
                    </div>
                    <div className="input-group mb-3">
                        <select className="form-select" aria-label="Chọn thể loại">
                            <option defaultValue="0" selected>Chọn thể loại</option>
                            <option value="main">Nhiệm vụ chính tuyến</option>
                            <option value="side">Nhiệm vụ phụ tuyến</option>
                            <option value="character">Nhiệm vụ nhân vật</option>
                        </select>
                    </div>
                    <div className="input-group mb-3">
                        <select className="form-select" aria-label="Chọn khu vực">
                            <option value='0' selected>Chọn khu vực</option>
                            <option value="HuangLong">HuangLong</option>
                            <option value="BlackShore">BlackShore</option>
                            <option value="Rinascita">Rinascita</option>
                        </select>
                    </div>
                    {/* Check box tăng dần hoặc giảm dần*/}
                    {/* <SortOptions /> */}

                    <div className="input-group mb-3">
                        <select className="form-select" aria-label="Chọn thứ tự sắp xếp">
                            <option value='0' selected>Chọn thứ tự sắp xếp</option>
                            <option value="HuangLong">Chương tăng dần</option>
                            <option value="BlackShore">Chương giảm dần</option>
                            <option value="Rinascita">Phiên bản tăng dần</option>
                            <option value="Rinascita">Phiên bản giảm dần</option>
                        </select>
                    </div>

                    <div className="input-group mb-3">
                        <select className="form-select" aria-label="Chọn độ dài">
                            <option value='0' selected>Phân loại</option>
                            <option value="short">Chương</option>
                            <option value="long">Màn</option>
                        </select>
                    </div>


                </div>
                <div className="col-md-8">
                    {/* tích chọn chia theo chương hay màn, kiểu công tắc  */}

                    <div className="row">
                        <div className="col-md-6 card-quest-contain mb-4">
                            <div className="card h-100">
                                <div className="card-image-wrapper">
                                    <img
                                        src="/images/mainQ.webp"
                                        alt="card-img"
                                        className="card-img-top uniform-img"
                                    />
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">Nhiệm vụ chính tuyến</h5>
                                    {/* <h6 className="card-subtitle mb-2 text-muted">Nhiệm vụ chính tuyến</h6> */}
                                    <p className="card-text flex-grow-1">Các nhiệm vụ liên quan trực tiếp đến cốt truyện </p>
                                    <div>
                                        <Link href="/user/story-reading" className="card-link">Đọc full</Link>
                                        <a href="#" className="card-link">Tóm tắt</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 card-quest-contain mb-4">
                            <div className="card h-100">
                                <div className="card-image-wrapper">
                                    <img
                                        src="/images/mainQ.webp"
                                        alt="card-img"
                                        className="card-img-top uniform-img"
                                    />
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">Nhiệm vụ chính tuyến</h5>
                                    {/* <h6 className="card-subtitle mb-2 text-muted">Nhiệm vụ chính tuyến</h6> */}
                                    <p className="card-text flex-grow-1">Các nhiệm vụ liên quan trực tiếp đến cốt truyện </p>
                                    <div>
                                        <a href="#" className="card-link">Đọc full</a>
                                        <a href="#" className="card-link">Tóm tắt</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 card-quest-contain mb-4">
                            <div className="card h-100">
                                <div className="card-image-wrapper">
                                    <img
                                        src="/images/mainQ.webp"
                                        alt="card-img"
                                        className="card-img-top uniform-img"
                                    />
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">Nhiệm vụ chính tuyến</h5>
                                    {/* <h6 className="card-subtitle mb-2 text-muted">Nhiệm vụ chính tuyến</h6> */}
                                    <p className="card-text flex-grow-1">Các nhiệm vụ liên quan trực tiếp đến cốt truyện </p>
                                    <div>
                                        <a href="#" className="card-link">Đọc full</a>
                                        <a href="#" className="card-link">Tóm tắt</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}