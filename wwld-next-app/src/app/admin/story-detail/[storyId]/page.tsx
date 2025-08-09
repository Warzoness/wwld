'use client';

import DialogModal from "@/components/modals/ModalDialog";
import { deleteDialog, fetchDialogsByStoryId, updateDialogOrder } from "@/lib/services/dialogService";
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
    const [pendingAction, setPendingAction] = useState<null | { type: "edit" | "delete", data: any }>(null);
    const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
    const [passInput, setPassInput] = useState("");
    const [passError, setPassError] = useState("");

    useEffect(() => {
        const storyData = sessionStorage.getItem("storyData");
        if (storyData) {
            setStoryData(JSON.parse(storyData));
        }

        const load = async () => {
            try {
                const data = await fetchDialogsByStoryId(Number(params.storyId));
                setDialogDetail(data);
                console.log("Dialog Detail:", data);
            }
            catch {
                setDialogDetail([]);
            }

            setLoading(false);
        }
        load();
    }, [])

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

    console.log("Updating order for dialogId:", dialogId, "to new index:", newIndex);
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

    const backendUrl = "http://localhost:8080";
    const getImageUrl = (image: string) => {
        if (!image) return "";
        if (image.startsWith("http")) return image;
        if (image.startsWith("/uploads/")) return backendUrl + image;
        return backendUrl + `/uploads/${image.replace(/^\/?uploads\//, "")}`;
    };


    return (
        <div className="container dialog-detail-page py-4">
            {/* Nút quay lại */}
            <div className="mb-4">
                <button
                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                    onClick={() => window.history.back()}
                >
                    <i className="bi bi-arrow-left"></i> Quay lại
                </button>
            </div>

            {/* Tiêu đề */}
            <div className="text-center mb-4">
                <div
                    className="p-3 rounded shadow-sm"
                    style={{ backgroundColor: "#f0f0f0", maxWidth: "600px", margin: "auto" }}
                >
                    <h1 className="fw-bold mb-1">{storyData?.chapterName || "Chưa có tên"}</h1>
                    <h4 className="text-muted">{storyData?.actName || "Chưa có tên"}</h4>
                </div>
            </div>

            {/* Nội dung & mô tả */}
            <div className="p-4 border rounded shadow-sm bg-white">
                {/* Mô tả nhiệm vụ */}
                <div className="mb-3">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="bi bi-list-task fs-5"></i>
                        <h4 className="mb-0">Mô tả nhiệm vụ</h4>
                    </div>
                    <p className="mb-0 text-secondary">
                        {storyData?.description || "Chưa có mô tả nhiệm vụ"}
                    </p>
                </div>

                <hr />

                {/* Nút thêm hội thoại */}
                <div className="d-flex justify-content-end mb-3">
                    <button className="btn btn-primary" onClick={handleOpenAdd}>
                        <i className="bi bi-plus-circle me-1"></i> Thêm hội thoại
                    </button>
                </div>

                {/* Danh sách hội thoại */}
                <div className="content-dialog">
                    {dialogDetail.map((dialog) => (
                        <div
                            key={dialog.id}
                            className="p-3 mb-3 border rounded shadow-sm bg-light row align-items-center"
                        >
                            {dialog.type === 0 && (
                                <div className="col-12 text-center">
                                    <img
                                        src={getImageUrl(dialog.image) || "/default-image.png"}
                                        alt="Dialog Image"
                                        className="img-fluid rounded"
                                        style={{ maxHeight: "300px" }}
                                    />
                                </div>
                            )}

                            {dialog.type === 1 && (
                                <>
                                    <div className="col-md-2 fw-bold">
                                        {dialog.characterId ? (
                                            <span className="text-primary">{dialog.characterName}</span>
                                        ) : (
                                            <span className="text-secondary fst-italic">
                                                {dialog.noNameCharacter || "????"}
                                            </span>
                                        )}
                                        :
                                    </div>
                                    <div className="col-md-8">{dialog.content}</div>
                                </>
                            )}

                            {dialog.type === 2 && (
                                <div className="col-md-10 text-danger fw-bold d-flex align-items-start gap-2">
                                    <i className="bi bi-arrow-right-square"></i>
                                    {dialog.content}
                                </div>
                            )}

                            {/* Nút hành động */}
                            <div className="col-md-2 d-flex flex-wrap gap-2 justify-content-center">
                                <button className="btn btn-sm btn-warning" onClick={() => handleEdit(dialog)}>
                                    <i className="bi bi-pencil"></i>
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(dialog.id)}>
                                    <i className="bi bi-trash"></i>
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => handleOrderChange(dialog.id, "up")}
                                >
                                    <i className="bi bi-chevron-double-up"></i>
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => handleOrderChange(dialog.id, "down")}
                                >
                                    <i className="bi bi-chevron-double-down"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal thêm/sửa hội thoại */}
            <DialogModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={() => {
                    setShowModal(false);
                    setEditDialog(undefined);
                    fetchDialogsByStoryId(Number(params.storyId)).then(setDialogDetail);
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

            {/* Modal xác nhận passcode */}
            {showPassModal && (
                <div className="modal d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
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
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowPassModal(false);
                                        setPassInput("");
                                        setPassError("");
                                    }}
                                >
                                    Hủy
                                </button>
                                <button className="btn btn-primary" onClick={handlePassSubmit}>
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
