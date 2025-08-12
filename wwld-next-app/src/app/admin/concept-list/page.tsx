"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import styles from "./ConceptList.module.css";
import BackButton from "@/components/buttons/back-button/page";
import { ConceptPayload, fetchConcepts, deleteConcept } from "@/lib/services/conceptService";
import ConceptModal from "@/components/modals/modal-concept/ModalConcept";

export default function ConceptListPage() {
  const [loading, setLoading] = useState(true);
  const [listConcepts, setListConcepts] = useState<ConceptPayload[]>([]);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 8;
  const backendUrl = "https://wwld-production.up.railway.app";

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ConceptPayload | undefined>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchConcepts();
      setListConcepts((data ?? []) as ConceptPayload[]);
    } catch {
      setListConcepts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listConcepts.filter((c) => q === "" || c.title.toLowerCase().includes(q));
  }, [listConcepts, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice(page * pageSize, page * pageSize + pageSize);

  const getImageUrl = (image?: string) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    if (image.startsWith("/uploads/")) return backendUrl + image;
    return backendUrl + `/uploads/${image.replace(/^\/?uploads\//, "")}`;
  };

  const handleDelete = async (concept : ConceptPayload) => {
    if (!confirm("Bạn có chắc muốn xóa concept này?")) return;
    try {
      await deleteConcept(concept);
      alert("Xóa thành công");
      await load();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa");
    }
  };

  useEffect(() => {
    if (page > 0 && page >= totalPages) setPage(0);
  }, [page, totalPages]);

  return (
    <div className={styles.wapper}>
      <div className={styles.page}>
        <div className="container py-4">
          <BackButton label="Quay lại" />
          <div className={styles.topBar}>
            <h1 className={styles.title}>Concepts</h1>

            <div className="d-flex align-items-center gap-2">
              <div className={styles.searchWrap}>
                <i className="bi bi-search" aria-hidden />
                <input
                  className={styles.input}
                  placeholder="Tìm concept..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button
                className={styles.addBtn}
                onClick={() => {
                  setEditing(undefined);
                  setShowForm(true);
                }}
              >
                <i className="bi bi-plus-lg me-1" /> Thêm concept
              </button>
            </div>
          </div>

          <div className="row g-4">
            {pageData.map((c) => (
              <div key={c.id} className="col-12 col-sm-6 col-lg-4 col-xxl-3">
                <div className={styles.card}>
                  <div className={styles.cardActions}>
                    <button
                      className={`${styles.iconBtn} ${styles.warn}`}
                      title="Sửa"
                      onClick={() => {
                        setEditing(c);
                        setShowForm(true);
                      }}
                    >
                      <i className="bi bi-pencil" />
                    </button>
                    <button
                      className={`${styles.iconBtn} ${styles.danger}`}
                      title="Xóa"
                      onClick={() => handleDelete(c)}
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </div>

                  <div className={styles.media}>
                    <img src={getImageUrl(c.conceptImage) || "/images/banner.png"} alt={c.title} />
                    <span className={styles.badge}>
                      <i className="bi bi-images me-1" />
                      {c.slug}
                    </span>
                  </div>

                  <div className={styles.body}>
                    <h3 className={styles.cardTitle}>{c.title}</h3>
                    <p className={styles.excerpt}>{c.description}</p>

                    <div className={styles.actions}>
                      <Link href={`/admin/concept-detail/${c.id}`} className={styles.cta}>
                        Xem chi tiết <i className="bi bi-arrow-right-short" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {!loading && pageData.length === 0 && (
              <div className="col">
                <div className={styles.empty}>Không tìm thấy concept nào.</div>
              </div>
            )}
          </div>

          <nav aria-label="Concept pagination" className="mt-4">
            <ul className={`pagination justify-content-center ${styles.pagination}`}>
              <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage(Math.max(0, page - 1))}>
                  <i className="bi bi-chevron-left d-inline d-sm-none" />
                  <span className="d-none d-sm-inline">Trước</span>
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i} className={`page-item ${i === page ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setPage(i)}>
                    {i + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${page >= totalPages - 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage(Math.min(totalPages - 1, page + 1))}>
                  <span className="d-none d-sm-inline">Sau</span>
                  <i className="bi bi-chevron-right d-inline d-sm-none" />
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* ===== Modals ===== */}
        <ConceptModal
          key={editing?.id || "new"}
          show={showForm}
          onClose={() => {
            setShowForm(false);
            setEditing(undefined);
          }}
          onSuccess={async () => {
            await load();
            setShowForm(false);
            setEditing(undefined);
          }}
          initialData={editing}
        />
      </div>
    </div>
  );
}
