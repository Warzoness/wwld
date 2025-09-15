'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import styles from './ItemsList.module.css';
import { deleteItemData, fetchPageItem, ITEM_TYPES, ItemData } from '@/lib/services/itemService';

// Utils nhỏ
const cls = (...a: Array<string | false | undefined>) => a.filter(Boolean).join(' ');

export default function ItemsListPage() {
    // search/filter
    const [q, setQ] = useState('');
    const [type, setType] = useState<'all' | string>('all');

    // pagination (service 0-based pageIndex)
    const [page, setPage] = useState(1);      // UI 1-based
    const [size, setSize] = useState(12);

    // data
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState<ItemData[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [error, setError] = useState('');

    // debounce search
    const [qDebounced, setQDebounced] = useState(q);
    useEffect(() => {
        const t = setTimeout(() => setQDebounced(q.trim()), 300);
        return () => clearTimeout(t);
    }, [q]);

    // fetch theo service
    useEffect(() => {
        let alive = true;
        setLoading(true);
        setError('');

        fetchPageItem(page - 1, size, qDebounced)
            .then((res) => {
                if (!alive) return;
                setList(res.items || []);
                setTotalPages(Math.max(1, res.totalPages || 1));
                setTotalElements(res.totalItems || 0);
            })
            .catch((e: unknown) => {
                if (!alive) return;
                if (e instanceof Error) setError(e.message);
                else setError('Tải danh sách thất bại');
            })
            .finally(() => alive && setLoading(false));

        return () => {
            alive = false;
        };
    }, [qDebounced, page, size]);

    // reset về trang 1 khi đổi size hoặc từ khóa
    useEffect(() => {
        setPage(1);
    }, [qDebounced, size, type]);

    // client-side filter theo type (service chưa hỗ trợ)
    const filtered = useMemo(() => {
        if (type === 'all') return list;
        return list.filter((it) => (it.itemType || '').toLowerCase() === type.toLowerCase());
    }, [list, type]);


    const pageButtons = useMemo(() => {
        const max = totalPages;
        const curr = page;
        const out: (number | string)[] = [];
        const win = new Set<number>([1, curr - 1, curr, curr + 1, max]);
        const arr = [...win].filter((n) => n >= 1 && n <= max).sort((a, b) => a - b);
        for (let i = 0; i < arr.length; i++) {
            if (i > 0 && arr[i] - arr[i - 1] > 1) out.push('…');
            out.push(arr[i]);
        }
        return out;
    }, [page, totalPages]);

    return (
        <div className={styles.wapper}>
            <div className={styles.page}>
                <Link href={"/"} className="iris-btn iris-btn--danger mb-3">  Quay Lại</Link>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Danh sách vật phẩm</h1>

                </div>

                {/* Toolbar */}
                <div className={styles.toolbar}>
                    <input
                        className={styles.input}
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Tìm theo tên / mô tả…"
                        aria-label="Tìm kiếm"
                    />

                    <select
                        className={styles.select}
                        value={type}
                        onChange={(e) => setType(e.target.value as string)}
                        aria-label="Lọc loại"
                    >
                        <option value="all">Tất cả loại</option>
                        {ITEM_TYPES.map((itemType) => (
                            <option key={itemType} value={itemType}>
                                {itemType == "WEAPON" ? (
                                    "Vũ khí"
                                ) : itemType == "KEY" ? (
                                    "Vật phẩm nhiệm vụ"
                                ) : itemType == "MATERIAL" ? (
                                    "Nguyên liệu"
                                ) : itemType == "UPGRADE_MATERIAL" ? (
                                    "Nguyên liệu nâng cấp"
                                ) : (
                                    "Khác"
                                )
                                }
                            </option>
                        ))}
                    </select>


                    <select
                        className={styles.select}
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        aria-label="Số dòng mỗi trang"
                    >
                        <option value={6}>6 / trang</option>
                        <option value={12}>12 / trang</option>
                        <option value={24}>24 / trang</option>
                    </select>

                    <div className={styles.summary}>
                        {loading ? 'Đang tải…' : `${totalElements} vật phẩm`}
                    </div>
                </div>

                {/* Lỗi */}
                {error && <div className={styles.error}>{error}</div>}

                {/* Grid */}
                <div className={styles.grid}>
                    {loading && filtered.length === 0 ? (
                        Array.from({ length: size }).map((_, i) => <div key={i} className={styles.cardSkeleton} />)
                    ) : filtered.length === 0 ? (
                        <div className={styles.noData}>Không có dữ liệu phù hợp.</div>
                    ) : (
                        filtered.map((it) => {
                            const cover =
                                it.itemImage?.trim() ||
                                it.itemIcon?.trim() ||
                                '/default-image.png';
                            const detailHref = `/user/items/items-detail/${it.id}`;
                            return (
                                <article key={it.id} className={styles.card}>
                                    {/* Ảnh mô tả lớn */}
                                    <div className={styles.coverWrap}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={cover}
                                            alt={it.itemName}
                                            className={styles.coverImg}
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Nội dung */}
                                    <div className={styles.cardBody}>
                                        <div className={styles.cardHead}>
                                            <h3 className={styles.name} title={it.itemName}>
                                                {it.itemName}
                                            </h3>
                                            <span className={cls(styles.badge)}>{it.itemType || '—'}</span>
                                        </div>

                                        <p className={styles.desc}>
                                            {it.itemdescription || '—'}
                                        </p>

                                        <div className={styles.actions}>
                                            <Link href={detailHref} className="iris-btn">Xem</Link>
                                        </div>

                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            className={styles.pageBtn}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={loading || page <= 1}
                        >
                            ‹ Trước
                        </button>

                        {pageButtons.map((p, i) =>
                            typeof p === 'number' ? (
                                <button
                                    key={`${p}-${i}`}
                                    className={cls(styles.pageBtn, p === page && styles.pageActive)}
                                    onClick={() => setPage(p)}
                                    disabled={loading}
                                >
                                    {p}
                                </button>
                            ) : (
                                <span key={`${p}-${i}`} className={styles.ellipsis}>…</span>
                            ),
                        )}

                        <button
                            className={styles.pageBtn}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={loading || page >= totalPages}
                        >
                            Sau ›
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}