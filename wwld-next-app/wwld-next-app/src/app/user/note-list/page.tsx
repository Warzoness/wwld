"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import styles from "./NoteList.module.css";
import {fetchListNote } from "@/lib/services/noteListService";
import NoteViewModal from "@/components/modals/NoteListModal/NoteViewModal";
import BackButton from "@/components/buttons/back-button/page";

interface NoteData {
    id: number;
    noteName: string;
    noteContent: string;
    storyId: number;
    description: string;
    image: string;
}

export default function NoteListPage() {
    const [loading, setLoading] = useState(true);
    const [allNotes, setAllNotes] = useState<NoteData[]>([]);
    const [keyword, setKeyword] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [error, setError] = useState<string | null>(null);

    const [upsertOpen, setUpsertOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selected, setSelected] = useState<NoteData | null>(null);
    const [viewOpen, setViewOpen] = useState(false);

    const loadAll = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchListNote();
            setAllNotes(data ?? []);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Không thể tải danh sách");
            }
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadAll();
    }, []);

    const filtered = useMemo(() => {
        const q = keyword.trim().toLowerCase();
        if (!q) return allNotes;
        return allNotes.filter((n) => {
            const name = n.noteName?.toLowerCase() ?? "";
            const desc = n.description?.toLowerCase() ?? "";
            const content = n.noteContent?.toLowerCase() ?? "";
            return name.includes(q) || desc.includes(q) || content.includes(q);
        });
    }, [allNotes, keyword]);

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize)));

    useEffect(() => {
        if (pageIndex > totalPages - 1) setPageIndex(0);
    }, [totalPages, pageIndex]);

    const pageItems = useMemo(() => {
        const start = pageIndex * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, pageIndex, pageSize]);

    const fromItem = totalItems === 0 ? 0 : pageIndex * pageSize + 1;
    const toItem = Math.min((pageIndex + 1) * pageSize, totalItems);

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPageIndex(0);
    };



    return (
        <div className={styles.wrapper}>
            <BackButton />
            <div className={styles.toolbar}>
                <h1 className={styles.title}>Danh sách Note</h1>
            </div>

            <form onSubmit={onSearch} className={styles.form}>
                <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Tìm theo tiêu đề/mô tả/nội dung…"
                    className={styles.input}
                />
                <button type="submit" className={styles.cta}>Tìm</button>

                <div className={styles.mlAuto}>
                    <span>Hiển thị</span>
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className={styles.select}
                    >
                        {[5, 10, 20, 50].map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                    <span>mục / trang</span>
                </div>
            </form>

            <div className={styles.card}>
                {loading ? (
                    <div className="p-6">Đang tải…</div>
                ) : error ? (
                    <div className="p-6" style={{ color: "#f87171" }}>{error}</div>
                ) : pageItems.length === 0 ? (
                    <div className="p-6">Không có dữ liệu.</div>
                ) : (
                    <div className={styles.overflowX}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th} style={{ width: 80 }}>ID</th>
                                    <th className={styles.th} style={{ width: 72 }}>Ảnh</th>
                                    <th className={styles.th}>Tiêu đề</th>
                                    <th className={styles.th}>Mô tả</th>
                                    <th className={styles.th} style={{ width: 160 }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageItems.map((n) => (
                                    <tr key={n.id}>
                                        <td className={styles.td}>#{n.id}</td>
                                        <td className={styles.td}>
                                            {n.image ? (
                                                <div className={styles.thumb}>
                                                    <Image
                                                        src={n.image}
                                                        alt={n.noteName}
                                                        fill
                                                        sizes="56px"
                                                        style={{ objectFit: "cover" }}
                                                    />
                                                </div>
                                            ) : "—"}
                                        </td>
                                        <td className={`${styles.td}`}><strong>{n.noteName || "(Không tiêu đề)"}</strong></td>
                                        <td className={`${styles.td} ${styles.truncate}`} style={{ maxWidth: 420 }}>
                                            {n.description || ""}
                                        </td>
                                        <td className={styles.td}>
                                            <div className={styles.rowActions}>
                                                <button
                                                    className={styles.btn}
                                                    onClick={() => { setSelected(n); setViewOpen(true); }}
                                                >
                                                    Xem
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className={styles.footer}>
                            <div className={styles.muted}>
                                Hiển thị {fromItem}–{toItem} / {totalItems}
                            </div>

                            <div className={styles.actions}>
                                <button
                                    className={styles.btn}
                                    disabled={pageIndex === 0}
                                    onClick={() => setPageIndex(0)}
                                    title="Trang đầu"
                                >
                                    «
                                </button>
                                <button
                                    className={styles.btn}
                                    disabled={pageIndex === 0}
                                    onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                                    title="Trang trước"
                                >
                                    ‹
                                </button>

                                <span className={styles.muted}>
                                    Trang {totalPages === 0 ? 0 : pageIndex + 1} / {totalPages}
                                </span>

                                <button
                                    className={styles.btn}
                                    disabled={pageIndex + 1 >= totalPages}
                                    onClick={() => setPageIndex((p) => (p + 1 < totalPages ? p + 1 : p))}
                                    title="Trang sau"
                                >
                                    ›
                                </button>
                                <button
                                    className={styles.btn}
                                    disabled={pageIndex + 1 >= totalPages}
                                    onClick={() => setPageIndex(Math.max(0, totalPages - 1))}
                                    title="Trang cuối"
                                >
                                    »
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <NoteViewModal
                open={viewOpen}
                note={selected}
                onClose={() => setViewOpen(false)}
            />

        </div>


    );

}


