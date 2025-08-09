import Link from "next/link";
export default function StoryReadingPage() {
    return (
        <div className="container mt-4">
            <div className="mb-4">
                <Link href="/user/story-section" className="btn btn-secondary">Quay lại trang trước</Link>
            </div>
            <div className="story-title d-flex flex-column align-items-center mb-4 bg-secondary text-white p-4 rounded" style={{ borderRadius: '20px' }}>
                <h1>Chương 1 : Jinzhou trỗi dậy</h1>
                <h3>Màn 1 : Cộng hưởng đầu tiên</h3>
            </div>
            <div
                className="col-md-12 position-relative"
                style={{
                    border: '1px solid #ccc',
                    padding: '20px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                }}
            >
                <img
                    src="/images/reading-bg.jpg"
                    alt="background decor"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.1, // làm mờ
                        zIndex: 0,
                    }}
                />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className="quest-decription" style={{ padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px' }}>
                        <div className="quest-title-dcp">
                            <i className="bi bi-file-text"></i>
                            <h2 className="d-inline-block ms-2">Mô tả nhiệm vụ</h2>
                        </div>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    </div>
                    <div className="image-story-line">
                        <img
                            src="/images/image.png"
                            alt="story line"
                            className="img-fluid rounded mt-4"
                            style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                        />
                    </div>
                    <div className="dialog-section mt-1 row">
                        <div className="dialog-character col-md-2 d-flex gap-2 justify-content-center" style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                            <i className="bi bi-play-circle pt-1"></i>
                            <h4 className="m-0 p-0 text-primary">Chixia : </h4>
                        </div>
                        <div className="dialog-content col-md-10" style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '1.2rem' }}>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
                        </div>
                    </div>
                    <div className="dialog-section mt-1 row">
                        <div className="dialog-character col-md-2 d-flex gap-2 justify-content-center" style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                            <i className="bi bi-play-circle pt-1"></i>
                            <h4 className="m-0 p-0 text-primary">Chixia : </h4>
                        </div>
                        <div className="dialog-content col-md-10" style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '1.2rem' }}>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                        </div>
                    </div>
                    <div className="diaglog-mc d-flex gap-2 justify-content-center mt-4" style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '1.2rem', color: 'blue' }}>
                        <i className="bi bi-file-earmark-ruled"></i>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
                    </div>
                </div>
            </div>

        </div >
    );
}