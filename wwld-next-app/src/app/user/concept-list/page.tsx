"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import styles from "./ConceptList.module.css";
import BackButton from "@/components/buttons/back-button/page";
import { ConceptPayload, fetchConcepts, deleteConcept } from "@/lib/services/conceptService";

export default function ConceptListPage() {
  const [loading, setLoading] = useState(true);
  const [listConcepts, setListConcepts] = useState<ConceptPayload[]>([]);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 8;
  const backendUrl = "https://wwld-production.up.railway.app";


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

  useEffect(() => {
    if (page > 0 && page >= totalPages) setPage(0);
  }, [page, totalPages]);

  return (
    <div className={styles.wapper}>
      <div className={styles.page}>
        <div className="container py-4">
          <BackButton label="Quay lại" />
          <div className={styles.topBar}>
            <h1 className={styles.title}>Khái niệm thế giới</h1>

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
            </div>
          </div>

          <div className="row g-4">
            {pageData.map((c) => (
              <div key={c.id} className="col-12 col-sm-6 col-lg-4 col-xxl-3">
                <div className={styles.card}>
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
                      <Link href={`/user/concept-detail/${c.id}`} className={styles.cta}>
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

      </div>
    </div>
  );
}
