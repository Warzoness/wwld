'use client';

import { getImageUrl } from "@/lib/consts/const";
import { fetchDialogPagesByStoryId } from "@/lib/services/dialogService";
import { Dialog, StoryData } from "@/lib/types/dialog";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function StoryDetailPage() {

    const params = useParams();
    const [storyData, setStoryData] = useState<StoryData | null>(null);
    const [loading, setLoading] = useState(true);

    const [dialogDetail, setDialogDetail] = useState<Dialog[]>([]);


    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize] = useState(30);
    const [totalItem, setTotalItem] = useState(0);

    useEffect(() => {
        const storyData = sessionStorage.getItem("storyData");
        if (storyData) {
            setStoryData(JSON.parse(storyData));
        }


        if (!params.storyId) return;

        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchDialogPagesByStoryId(Number(params.storyId), pageNumber, pageSize);
                setDialogDetail(data.dialogs);
                setTotalItem(data.totalItem);
            } catch (error) {
                setDialogDetail([]);
                setTotalItem(0);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [params.storyId, pageNumber, pageSize]);
    const safeTotalItems = Number(totalItem) || 0;
    const safePageSize = Number(pageSize) || 1; // tránh chia cho 0
    const totalPages = Math.ceil(safeTotalItems / safePageSize);
    const pageNumbers = totalPages > 0 ? Array.from({ length: totalPages }, (_, i) => i) : [];

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPageNumber(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn lên đầu trang
        }
    };

    

    return (
        <div className="container dialog-detail-page py-4 iris-page">
            {/* Nút quay lại */}
            <div className="mb-4">
                <button
                    className="iris-ghost d-flex align-items-center gap-2"
                    onClick={() => window.history.back()}
                >
                    <i className="bi bi-arrow-left"></i> Quay lại
                </button>
            </div>

            {/* Tiêu đề */}
            <div className="text-center mb-4">
                <div className="iris-hero mx-auto">
                    <h1 className="fw-bold mb-1">{storyData?.chapterName || "Chưa có tên"}</h1>
                    <h4 className="iris-muted">{storyData?.actName || "Chưa có tên"}</h4>
                </div>
            </div>

            {/* Nội dung & mô tả */}
            <div className="iris-panel p-4">
                {/* Mô tả nhiệm vụ */}
                <div className="mb-3">
                    <div className="d-flex align-items-center gap-2 mb-2 iris-section-title">
                        <i className="bi bi-list-task fs-5"></i>
                        <h4 className="mb-0">Mô tả nhiệm vụ</h4>
                    </div>
                    <p className="mb-0 iris-muted">
                        {storyData?.description || "Chưa có mô tả nhiệm vụ"}
                    </p>
                </div>

                <div className="iris-sep" />


                {/* Danh sách hội thoại */}
                <div className="content-dialog">
                    {dialogDetail.map((dialog) => {
                        const isImage = dialog.type === 0;
                        const isLine = dialog.type === 1;
                        const isNarr = dialog.type === 2;
                        const isSys = dialog.type === 3;

                        const displayName = dialog.characterId
                            ? dialog.characterName
                            : (dialog.noNameCharacter || "????");

                        const accent =
                            isLine ? "#22d3ee" : isNarr ? "#ef4444" : isSys ? "#a78bfa" : "#38bdf8";

                        return (
                            <div key={dialog.id} className="iris-dialog" style={{ ["--iris-accent" as string]: accent }}>
                                {isImage ? (
                                    <div className="dlg-media">
                                        <img src={getImageUrl(dialog.image) || "/default-image.png"} alt="Dialog Image" />

                                    </div>

                                ) : (
                                    <div className="dlg-grid">
                                        <div className="dlg-side">
                                            <span className={`dlg-chip ${dialog.characterId ? "dlg-chip--char" : "dlg-chip--anon"}`}>
                                                <i className="bi bi-person"></i>
                                                <span className="text-truncate">{displayName}</span>
                                            </span>
                                        </div>

                                        <div className="dlg-main">
                                            <div
                                                className={
                                                    "dlg-bubble " +
                                                    (isNarr ? "dlg-bubble--narr" : isSys ? "dlg-bubble--sys" : "dlg-bubble--line")
                                                }
                                                title={isLine ? displayName : undefined}
                                            >
                                                {isNarr && <i className="bi bi-arrow-right-square me-2"></i>}
                                                {dialog.content}
                                            </div>

                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pagination */}
            <nav aria-label="Dialog pagination" className="mt-4">
                <ul className="pagination justify-content-center iris-pagination">
                    <li className={`page-item ${pageNumber === 0 ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(pageNumber - 1)}
                            disabled={pageNumber === 0}
                        >
                            <i className="bi bi-chevron-left d-inline d-sm-none"></i>
                            <span className="d-none d-sm-inline">Trước</span>
                        </button>
                    </li>

                    {pageNumbers.map((index) => (
                        <li key={index} className={`page-item ${pageNumber === index ? "active" : ""}`}>
                            <button className="page-link" onClick={() => handlePageChange(index)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}

                    <li className={`page-item ${pageNumber >= totalPages - 1 ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(pageNumber + 1)}
                            disabled={pageNumber >= totalPages - 1}
                        >
                            <span className="d-none d-sm-inline">Sau</span>
                            <i className="bi bi-chevron-right d-inline d-sm-none"></i>
                        </button>
                    </li>
                </ul>
            </nav>


            {/* Nút lên đầu trang */}
            <button
                className="fixed-scroll-top iris-fab"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                title="Lên đầu trang"
                aria-label="Lên đầu trang"
            >
                <i className="bi bi-arrow-up-circle"></i>
            </button>

            {/* Modal thêm/sửa hội thoại */}


        </div>
    );

}
