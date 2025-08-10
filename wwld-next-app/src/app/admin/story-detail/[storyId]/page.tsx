'use client';

import DialogModal from "@/components/modals/ModalDialog";
import { deleteDialog, fetchDialogPagesByStoryId, updateDialogOrder } from "@/lib/services/dialogService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Dialog {
    id: number;
    characterId: number;
    characterName: string;
    storyId: number;
    content: string;
    image: string;
    // type = 0 : image (characterId : null), type = 1 : text (characterId : not null), type = 2 : text ( main character)
    type: number;
    orderIndex: number;
    voice?: string;
    noNameCharacter?: string; // dùng khi không chọn nhân vật nào
}

interface StoryData {
    chapterName: string;
    actName: string;
    description: string;
}

const PASSCODE = "1";


export default function StoryDetailPage() {


    const params = useParams();
    const [storyData, setStoryData] = useState<StoryData | null>(null);
    const [loading, setLoading] = useState(true);

    const [dialogDetail, setDialogDetail] = useState<Dialog[]>([]);

    const [showModal, setShowModal] = useState(false);
    const [editDialog, setEditDialog] = useState<Dialog | undefined>(undefined);

    const [showPassModal, setShowPassModal] = useState(false);
    type PendingAction =
        | { type: "edit"; data: Dialog }
        | { type: "delete"; data: number };

    const [pendingAction, setPendingAction] = useState<PendingAction | null>(null); const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
    const [passInput, setPassInput] = useState("");
    const [passError, setPassError] = useState("");

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



    const handleOpenAdd = () => {
        setEditDialog(undefined);
        setShowModal(true);
    };

    const handleDelete = (dialogId: number) => {
        setPendingAction({ type: "delete", data: dialogId });
        setShowPassModal(true);
    };

    const handleEdit = (dialog: Dialog) => {
        setPendingAction({ type: "edit", data: dialog });
        setShowPassModal(true);
    };

    const handleOrderChange = (dialogId: number, direction: "up" | "down") => {
        const currentIndex = dialogDetail.findIndex(dialog => dialog.id === dialogId);
        if (currentIndex === -1) return;

        const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= dialogDetail.length) return;

        // Hoán đổi vị trí trong mảng hiển thị
        const updatedDialogs = [...dialogDetail];
        [updatedDialogs[currentIndex], updatedDialogs[newIndex]] =
            [updatedDialogs[newIndex], updatedDialogs[currentIndex]];

        setDialogDetail(updatedDialogs);

        // Gọi API cập nhật orderIndex cho phần tử được di chuyển
        updateDialogOrder(dialogId, newIndex).catch(error => {
            console.error("Error updating dialog order:", error);
            alert("Cập nhật thứ tự hội thoại thất bại!");
        });
    };




    const handlePassSubmit = async () => {
        if (passInput !== PASSCODE) {
            setPassError("Sai passcode!");
            return;
        }
        setShowPassModal(false);
        setPassInput("");
        setPassError("");

        if (pendingAction?.type === "edit") {
            setEditDialog(pendingAction.data);
            setShowModal(true);
        } else if (pendingAction?.type === "delete") {
            try {
                await deleteDialog(pendingAction.data);
                setDialogDetail(dialogDetail.filter(dialog => dialog.id !== pendingAction.data));
            } catch (error) {
                alert("Xóa story thất bại!");
            }
        }

        setPendingAction(null);
    };

    // const backendUrl = "http://localhost:8080";
    const backendUrl = "https://wwld-production.up.railway.app";
    const getImageUrl = (image: string) => {
        if (!image) return "";
        if (image.startsWith("http")) return image;
        if (image.startsWith("/uploads/")) return backendUrl + image;
        return backendUrl + `/uploads/${image.replace(/^\/?uploads\//, "")}`;
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

                {/* Nút thêm hội thoại */}
                <div className="d-flex justify-content-end mb-3">
                    <button className="iris-btn iris-btn--primary" onClick={handleOpenAdd}>
                        <i className="bi bi-plus-circle me-1"></i> Thêm hội thoại
                    </button>
                </div>

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
                            <div key={dialog.id} className="iris-dialog" style={{ ["--iris-accent" as any]: accent }}>
                                {isImage ? (
                                    <div className="dlg-media">
                                        <img src={getImageUrl(dialog.image) || "/default-image.png"} alt="Dialog Image" />

                                        {/* nếu bạn đang dùng nút overlay */}
                                        <div className="dlg-media-toolbar">
                                            <button className="iris-btn iris-btn--warn" onClick={() => handleEdit(dialog)}>
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="iris-btn iris-btn--danger" onClick={() => handleDelete(dialog.id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                            <button className="iris-btn" onClick={() => handleOrderChange(dialog.id, "up")}>
                                                <i className="bi bi-chevron-double-up"></i>
                                            </button>
                                            <button className="iris-btn" onClick={() => handleOrderChange(dialog.id, "down")}>
                                                <i className="bi bi-chevron-double-down"></i>
                                            </button>
                                        </div>
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

                                            {/* Toolbar */}
                                            <div className="dlg-toolbar">
                                                <button className="iris-btn iris-btn--warn" onClick={() => handleEdit(dialog)}>
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button className="iris-btn iris-btn--danger" onClick={() => handleDelete(dialog.id)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                                <button className="iris-btn" onClick={() => handleOrderChange(dialog.id, "up")}>
                                                    <i className="bi bi-chevron-double-up"></i>
                                                </button>
                                                <button className="iris-btn" onClick={() => handleOrderChange(dialog.id, "down")}>
                                                    <i className="bi bi-chevron-double-down"></i>
                                                </button>
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
            <DialogModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={() => {
                    setShowModal(false);
                    setEditDialog(undefined);
                    fetchDialogPagesByStoryId(Number(params.storyId), pageNumber, pageSize).then((data) => {
                        setDialogDetail(data.dialogs);
                        setTotalItem(data.totalItem);
                    });
                }}
                initialData={
                    editDialog
                        ? {
                            id: editDialog.id,
                            content: editDialog.content,
                            image: editDialog.image,
                            type: editDialog.type,
                            characterId: editDialog.characterId ?? undefined,
                            orderIndex: editDialog.orderIndex,
                            voice: editDialog.voice,
                            storyId: Number(params.storyId),
                        }
                        : undefined
                }
            />

            {/* Modal xác nhận passcode (giữ nguyên, sẽ auto tối nhờ CSS dưới) */}
            {showPassModal && (
                <div className="modal d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content iris-panel p-0">
                            <div className="modal-header">
                                <h5>Nhập passcode xác nhận</h5>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Nhập passcode"
                                    value={passInput}
                                    onChange={(e) => setPassInput(e.target.value)}
                                />
                                {passError && <div className="text-danger mt-2">{passError}</div>}
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="iris-btn"
                                    onClick={() => {
                                        setShowPassModal(false);
                                        setPassInput("");
                                        setPassError("");
                                    }}
                                >
                                    Hủy
                                </button>
                                <button className="iris-btn iris-btn--primary" onClick={handlePassSubmit}>
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );

}
