"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { fetchStoriesByMainSectionId } from "@/lib/services/storyService";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";


interface Story {
    id: number;
    title: string;
    description: string;
    image: string;
    type: 0 | 1; // 0: chapter, 1: screen
    mainSectionId: number;
    parentId: number;
    parentTitle: string;
}


export default function StoryListPage() {
    const router = useRouter();
    const params = useParams();
    const mainSectionId = Number(params.mainSectionId);
    const mainSectionName = useSearchParams().get("mainSectionName") || "Chưa đặt tên";




    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"card" | "table">("card");
    const [filterType, setFilterType] = useState<"all" | "chapter" | "screen">("all");

    const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);




    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchStoriesByMainSectionId(mainSectionId);
                setStories(data);
            } catch {
                setStories([]);
            }
            setLoading(false);
        };
        if (mainSectionId) load();
    }, [mainSectionId]);

    const filteredStories = useMemo(() => {
        if (selectedChapterId !== null) {
            // Nếu đang chọn 1 chương, chỉ hiển thị các màn con
            return stories.filter(story => story.parentId === selectedChapterId);
        }

        if (filterType === "chapter") {
            return stories.filter(story => story.type === 0);
        }

        if (filterType === "screen") {
            return stories.filter(story => story.type === 1);
        }

        return stories;
    }, [stories, filterType, selectedChapterId]);



    const backendUrl = "http://localhost:8080";
    const getImageUrl = (image: string) => {
        if (!image) return "";
        if (image.startsWith("http")) return image;
        if (image.startsWith("/uploads/")) return backendUrl + image;
        return backendUrl + `/uploads/${image.replace(/^\/?uploads\//, "")}`;
    };


    // Xem chi tiết story
    const handleViewDetail = (story: Story) => {
        router.push(`/user/story-detail/${story.id}`);
        sessionStorage.setItem(
            "storyData",
            JSON.stringify({
                actName: story.title,
                chapterName: story.parentTitle,
                description: story.description || "Chưa có mô tả nhiệm vụ"
            })
        );
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Link href="/" className="btn btn-secondary">Quay lại Danh sách Loại Nội dung</Link>
            </div>

            <h2><span className="text-primary">{mainSectionName}</span></h2>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <select
                    className="form-select w-auto"
                    value={filterType}
                    onChange={e => {
                        const value = e.target.value;
                        if (value === "all" || value === "chapter" || value === "screen") {
                            setFilterType(value);
                        }
                    }}
                >
                    <option value="all">Tất cả</option>
                    <option value="chapter">Chương</option>
                    <option value="screen">Màn</option>
                </select>

                <div>
                    <button
                        className={`btn btn-outline-primary me-2 ${viewMode === "card" ? "active" : ""}`}
                        onClick={() => setViewMode("card")}
                    >
                        Dạng thẻ
                    </button>
                    <button
                        className={`btn btn-outline-secondary ${viewMode === "table" ? "active" : ""}`}
                        onClick={() => setViewMode("table")}
                    >
                        Dạng bảng
                    </button>
                </div>
            </div>

            {selectedChapterId !== null && (
                <div className="mb-3">
                    <button className="btn btn-secondary" onClick={() => {
                        setSelectedChapterId(null);
                        setFilterType("chapter");
                    }}>
                        Quay lại danh sách chương
                    </button>
                </div>
            )}


            {loading ? (
                <p>Đang tải...</p>
            ) : viewMode === "card" ? (
                <div className="row g-4">
                    {filteredStories.map(story => (
                        <div className="col-md-4" key={story.id}
                        >
                            <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                                {story.image && (
                                    <div style={{ height: 180, overflow: "hidden" }}>
                                        <img
                                            src={getImageUrl(story.image) || "/images/banner.png"}
                                            alt={story.title}
                                            className="card-img-top"
                                            style={{
                                                objectFit: "cover",
                                                width: "100%",
                                                height: "100%",
                                                transition: "transform 0.3s ease",
                                            }}
                                            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                        />
                                    </div>
                                )}

                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <h5 className="card-title fw-bold text-truncate" title={story.title}>
                                            {story.title}
                                        </h5>
                                        <p
                                            className="card-text text-muted"
                                            style={{
                                                fontSize: "0.9rem",
                                                lineHeight: "1.4rem",
                                                maxHeight: "4.2rem",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {story.description}
                                        </p>
                                    </div>

                                    <div className="row align-items-center mt-3 g-2">
                                        <div className="col text-end">
                                            {story.type === 0 ? (
                                                <button
                                                    className="btn btn-sm btn-info px-3"
                                                    onClick={() => {
                                                        setSelectedChapterId(story.id);
                                                        setFilterType("screen");
                                                    }}
                                                >
                                                    🎬 Xem màn
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-sm btn-primary px-3"
                                                    onClick={() => handleViewDetail(story)}
                                                >
                                                    📖 Xem chi tiết
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Ảnh</th>
                            <th>Tiêu đề</th>
                            <th>Mô tả</th>
                            <th>Thể loại</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStories.map(story => (
                            <tr key={story.id}>
                                <td>
                                    {story.image && (
                                        <img
                                            src={getImageUrl(story.image)}
                                            alt={story.title}
                                            style={{ width: 80, height: 60, objectFit: "cover" }}
                                        />
                                    )}
                                </td>
                                <td>{story.title}</td>
                                <td>{story.description}</td>
                                <td>{story.type === 0 ? "Chương" : "Màn"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}


        </div>
    );
}
