'use client';

import { fetchDialogsByStoryId } from "@/lib/services/dialogService";
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

    // const backendUrl = "http://localhost:8080";
    const backendUrl = "https://wwld-production.up.railway.app";
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
                                    <div className="col-md-10">{dialog.content}</div>
                                </>
                            )}

                            {dialog.type === 2 && (
                                <div className="col-md-10 text-danger fw-bold d-flex align-items-start gap-2">
                                    <i className="bi bi-arrow-right-square"></i>
                                    {dialog.content}
                                </div>
                            )}

                            {dialog.type === 3 && (
                                <div className="col-md-10 text-danger fw-bold d-flex align-items-center gap-2">
                                    {dialog.content}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );

}
