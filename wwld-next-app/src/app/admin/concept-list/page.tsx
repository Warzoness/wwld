"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./ConceptList.module.css";
import dynamic from "next/dynamic";
import BackButton from "@/components/buttons/back-button/page";

type Concept = {
  id: number;
  title: string;
  excerpt: string;
  cover: string;
  tags: string[];
  shots: number;
};

const SEED: Concept[] = [
  {
    id: 1, title: "Temple Red Pigment", excerpt: "Material & mood exploration for the eastern temple complex at sunrise.",
    cover: "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/samples/landscapes/beach-forest.jpg",
    tags: ["Environment", "Lighting", "Materials"], shots: 7
  },
  {
    id: 2, title: "Industrial Back Alley", excerpt: "Wet asphalt, neon diffusion and clutter pass for a tight alley set.",
    cover: "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/samples/landscapes/landscape-panorama.jpg",
    tags: ["Environment", "City", "Night"], shots: 12
  },
  {
    id: 3, title: "Nomad Caravan", excerpt: "Wind, cloth simulation and color script for desert caravan.",
    cover: "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/samples/landscapes/nature-mountains.jpg",
    tags: ["Props", "Color Script"], shots: 5
  },
  {
    id: 4, title: "Relic Workshop", excerpt: "Bench clutter, grime masks and story props for archaeologist workspace.",
    cover: "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/samples/food/spices.jpg",
    tags: ["Props", "Materials", "Story"], shots: 9
  },
  {
    id: 5, title: "Cliff Shrine Approach", excerpt: "Mist layers, scale reads, and composition for approach shot.",
    cover: "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/samples/animals/reindeer.jpg",
    tags: ["Environment", "Composition"], shots: 6
  },
];

export default function ConceptListPage() {
  // ==== DATA + CRUD STATE ====
  const [concepts, setConcepts] = useState<Concept[]>(SEED);
  const [editing, setEditing] = useState<Concept | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string>("Tất cả");
  const [page, setPage] = useState(0);
  const pageSize = 8;


  const ConceptFormModal = dynamic(
    () => import("@/components/modals/modal-concept/ModalConcept").then(m => m.ConceptFormModal),
    { ssr: false, loading: () => null }
  );
  const ConfirmModal = dynamic(
    () => import("@/components/modals/modal-concept/ModalConcept").then(m => m.ConfirmModal),
    { ssr: false, loading: () => null }
  );

  const allTags = useMemo(() => {
    const t = new Set<string>();
    concepts.forEach(c => c.tags.forEach(tag => t.add(tag)));
    return ["Tất cả", ...Array.from(t)];
  }, [concepts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return concepts.filter(c =>
      (activeTag === "Tất cả" || c.tags.includes(activeTag)) &&
      (q === "" || c.title.toLowerCase().includes(q) || c.excerpt.toLowerCase().includes(q))
    );
  }, [concepts, query, activeTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice(page * pageSize, page * pageSize + pageSize);
  if (page > 0 && page >= totalPages) setPage(0);

  const openAdd = () => { setEditing(null); setShowForm(true); };
  const openEdit = (c: Concept) => { setEditing(c); setShowForm(true); };
  const openDelete = (id: number) => setDeletingId(id);

  const handleSave = (payload: Omit<Concept, "id"> & { id?: number }) => {
    if (payload.id) {
      setConcepts(list => list.map(c => (c.id === payload.id ? { ...payload, id: payload.id } : c)));
    } else {
      const newId = concepts.length ? Math.max(...concepts.map(c => c.id)) + 1 : 1;
      setConcepts(list => [{ ...payload, id: newId }, ...list]);
      setPage(0);
    }
    setShowForm(false);
  };

  const handleConfirmDelete = () => {
    if (deletingId == null) return;
    setConcepts(list => list.filter(c => c.id !== deletingId));
    setDeletingId(null);
  };

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
                  onChange={e => setQuery(e.target.value)}
                />
              </div>
              <button className={styles.addBtn} onClick={openAdd}>
                <i className="bi bi-plus-lg me-1" /> Thêm concept
              </button>
            </div>
          </div>

          <div className={styles.tags}>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`${styles.tag} ${activeTag === tag ? styles.tagActive : ""}`}
                onClick={() => { setActiveTag(tag); setPage(0); }}
                style={{ ["--accent" as string]: pickAccent(tag) }}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="row g-4">
            {pageData.map((c) => (
              <div key={c.id} className="col-12 col-sm-6 col-lg-4 col-xxl-3">
                <div className={styles.card} style={{ ["--accent" as string]: pickAccent(c.tags[0]) }}>
                  <div className={styles.cardActions}>
                    <button className={`${styles.iconBtn} ${styles.warn}`} onClick={() => openEdit(c)} title="Sửa">
                      <i className="bi bi-pencil" />
                    </button>
                    <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => openDelete(c.id)} title="Xóa">
                      <i className="bi bi-trash" />
                    </button>
                  </div>

                  <div className={styles.media}>
                    <img src={c.cover} alt={c.title} />
                    <span className={styles.badge}><i className="bi bi-images me-1" />{c.shots}</span>
                  </div>

                  <div className={styles.body}>
                    <h3 className={styles.cardTitle}>{c.title}</h3>
                    <p className={styles.excerpt}>{c.excerpt}</p>
                    <div className={styles.tagRow}>
                      {c.tags.slice(0, 3).map(t => (
                        <span key={t} className={styles.miniTag}>{t}</span>
                      ))}
                    </div>

                    <div className={styles.actions}>
                      <Link href={`/concepts/${c.id}`} className={styles.cta}>
                        Xem chi tiết <i className="bi bi-arrow-right-short" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {pageData.length === 0 && (
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
                  <button className="page-link" onClick={() => setPage(i)}>{i + 1}</button>
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

        {showForm && (
          <Suspense fallback={null}>
            <ConceptFormModal
              initial={editing ? {
                id: editing.id,
                title: editing.title,
                excerpt: editing.excerpt,
                cover: editing.cover,
                tags: editing.tags,
                shots: editing.shots,
              } : undefined}
              onClose={() => setShowForm(false)}
              onSave={handleSave}
            />
          </Suspense>
        )}

        {deletingId !== null && (
          <Suspense fallback={null}>
            <ConfirmModal
              show={Boolean(deletingId)}
              message="Bạn có chắc muốn xóa concept này?"
              onCancel={() => setDeletingId(null)}
              onConfirm={handleConfirmDelete}
            />

          </Suspense>
        )}
      </div>
    </div>
  );
}

/** map tag -> accent color */
function pickAccent(tag?: string) {
  switch (tag) {
    case "Environment": return "#22d3ee";
    case "Lighting": return "#f59e0b";
    case "Materials": return "#a78bfa";
    case "City": return "#34d399";
    case "Props": return "#f43f5e";
    case "Story": return "#60a5fa";
    case "Color Script": return "#eab308";
    case "Composition": return "#fb7185";
    case "Tất cả": return "#ef4444";
    default: return "#ef4444";
  }
}


type FormValues = {
  id?: number;
  title: string;
  excerpt: string;
  cover: string;
  tags: string;
  shots: number;
};

function ConceptFormModal({
  initial,
  onClose,
  onSave,
}: {
  initial?: Concept;
  onClose: () => void;
  onSave: (payload: Omit<Concept, "id"> & { id?: number }) => void;
}) {
  const [values, setValues] = useState<FormValues>({
    id: initial?.id,
    title: initial?.title ?? "",
    excerpt: initial?.excerpt ?? "",
    cover: initial?.cover ?? "",
    tags: initial?.tags?.join(", ") ?? "",
    shots: initial?.shots ?? 0,
  });
  const [error, setError] = useState<string>("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.title.trim()) {
      setError("Tiêu đề không được để trống");
      return;
    }
    const payload = {
      id: values.id,
      title: values.title.trim(),
      excerpt: values.excerpt.trim(),
      cover: values.cover.trim(),
      tags: values.tags.split(",").map(s => s.trim()).filter(Boolean),
      shots: Number(values.shots) || 0,
    };
    onSave(payload);
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className="m-0">{initial ? "Sửa concept" : "Thêm concept"}</h3>
          <button className={styles.iconBtn} onClick={onClose} aria-label="Đóng">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <form onSubmit={submit} className={styles.modalBody}>
          {error && <div className={styles.error}>{error}</div>}

          <label className={styles.label}>Tiêu đề</label>
          <input
            className={styles.inputBox}
            value={values.title}
            onChange={e => setValues(v => ({ ...v, title: e.target.value }))}
            placeholder="Nhập tiêu đề"
          />

          <label className={styles.label}>Mô tả ngắn</label>
          <textarea
            className={styles.textarea}
            value={values.excerpt}
            onChange={e => setValues(v => ({ ...v, excerpt: e.target.value }))}
            rows={3}
            placeholder="Mô tả ngắn…"
          />

          <label className={styles.label}>Ảnh bìa (URL)</label>
          <input
            className={styles.inputBox}
            value={values.cover}
            onChange={e => setValues(v => ({ ...v, cover: e.target.value }))}
            placeholder="https://…"
          />
          {values.cover && (
            <div className={styles.preview}>
              <img src={values.cover} alt="preview" />
            </div>
          )}

          <label className={styles.label}>Tags (phân tách bằng dấu phẩy)</label>
          <input
            className={styles.inputBox}
            value={values.tags}
            onChange={e => setValues(v => ({ ...v, tags: e.target.value }))}
            placeholder="Environment, Lighting, Materials"
          />

          <label className={styles.label}>Số ảnh (shots)</label>
          <input
            type="number"
            className={styles.inputBox}
            value={values.shots}
            onChange={e => setValues(v => ({ ...v, shots: Number(e.target.value) }))}
            min={0}
          />

          <div className={styles.modalFooter}>
            <button type="button" className={styles.btn} onClick={onClose}>Hủy</button>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
              {initial ? "Lưu" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({
  message,
  onCancel,
  onConfirm,
}: {
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className={styles.modalBackdrop} onClick={onCancel}>
      <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className="m-0">Xác nhận</h3>
          <button className={styles.iconBtn} onClick={onCancel} aria-label="Đóng">
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div className={styles.modalBody}>
          <p>{message}</p>
          <div className={styles.modalFooter}>
            <button className={styles.btn} onClick={onCancel}>Hủy</button>
            <button className={`${styles.btn} ${styles.btnDanger}`} onClick={onConfirm}>
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
