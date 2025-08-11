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



    // const backendUrl = "http://localhost:8080";
    const backendUrl = "https://wwld-production.up.railway.app";
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
                    {filteredStories.map((story) => {
                        const accent = story.type === 0 ? "#ef4444" : "#22d3ee"; // chapter vs màn (tuỳ bạn đổi)
                        const img = story.image ? getImageUrl(story.image) : "/images/banner.png";

                        return (
                            <div className="col-md-4" key={story.id}>
                                <div
                                    className="iris-card h-100"
                                    style={{ ["--iris-accent" as string]: accent }}
                                >
                                    <div className="iris-card__media" style={{ height: 180 }}>
                                        <img src={img} alt={story.title} className="iris-card__img" />
                                    </div>

                                    <div className="iris-card__body">
                                        <div className="iris-card__title">
                                            <span className="iris-glyph">
                                                <i className="bi bi-journal-text"></i>
                                            </span>
                                            <h5 className="iris-card__heading" title={story.title}>
                                                {story.title}
                                            </h5>
                                        </div>

                                        <p className="iris-card__text line-clamp-3">
                                            {story.description}
                                        </p>

                                        <div className="d-flex align-items-center justify-content-between mt-2">

                                            {story.type === 0 ? (
                                                <button
                                                    className="iris-cta  iris-cta--solid" style={{backgroundColor: "transparent"}}
                                                    onClick={() => {
                                                        setSelectedChapterId(story.id);
                                                        setFilterType("screen");
                                                    }}
                                                >
                                                    Xem danh sách màn <i className="bi bi-arrow-right-short"></i>
                                                </button>
                                            ) : (
                                                <button
                                                    className="iris-cta" style={{backgroundColor: "transparent"}}
                                                    onClick={() => handleViewDetail(story)}
                                                >
                                                    Đọc cốt truyện <i className="bi bi-arrow-right-short"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
