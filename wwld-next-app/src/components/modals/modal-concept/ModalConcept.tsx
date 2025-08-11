"use client";

import { useRef, useState } from "react";
import styles from "./ConceptModal.module.css";
import { handleImageUpload } from "@/lib/services/uploadService"; // dùng service đã có

export type ConceptFormData = {
  id?: number;
  title: string;
  excerpt: string;
  cover: string;
  tags: string[];
  shots: number;
};

/** Modal thêm/sửa Concept */
export function ConceptFormModal({
  initial,
  onClose,
  onSave,
}: {
  initial?: ConceptFormData;
  onClose: () => void;
  onSave: (payload: ConceptFormData) => void;
}) {
  const [values, setValues] = useState({
    id: initial?.id,
    title: initial?.title ?? "",
    excerpt: initial?.excerpt ?? "",
    cover: initial?.cover ?? "",
    tags: (initial?.tags ?? []).join(", "),
    shots: initial?.shots ?? 0,
  });
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.title.trim()) {
      setError("Tiêu đề không được để trống");
      return;
    }
    onSave({
      id: values.id,
      title: values.title.trim(),
      excerpt: values.excerpt.trim(),
      cover: values.cover.trim(),
      tags: values.tags.split(",").map(s => s.trim()).filter(Boolean),
      shots: Number(values.shots) || 0,
    });
  };

  const pickFile = () => fileRef.current?.click();

  const onFile = async (file?: File) => {
    if (!file) return;
    try {
      setError("");
      setUploading(true);
      const url = await handleImageUpload(file); // trả secure_url Cloudinary
      if (!url) {
        setError("Tải ảnh thất bại. Vui lòng thử lại.");
        return;
      }
      setValues(v => ({ ...v, cover: url }));
    } catch (e) {
      setError("Có lỗi khi tải ảnh.");
    } finally {
      setUploading(false);
    }
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    await onFile(file);
  };

  const onPaste: React.ClipboardEventHandler<HTMLDivElement> = async (e) => {
    const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith("image/"));
    if (item) {
      const file = item.getAsFile() || undefined;
      await onFile(file);
    }
  };

  const clearImage = () => setValues(v => ({ ...v, cover: "" }));

  return (
    <div className={styles.wapper}>
      <div className={styles.modalBackdrop} onClick={onClose}>
        <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
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
              onChange={(e) => setValues(v => ({ ...v, title: e.target.value }))}
              placeholder="Nhập tiêu đề"
            />

            <label className={styles.label}>Mô tả ngắn</label>
            <textarea
              className={styles.textarea}
              rows={3}
              value={values.excerpt}
              onChange={(e) => setValues(v => ({ ...v, excerpt: e.target.value }))}
              placeholder="Mô tả ngắn…"
            />

            {/* === ẢNH BÌA: preview + upload/drag-drop/paste === */}
            <label className={styles.label}>Ảnh bìa</label>
            <div
              className={`${styles.imgPicker} ${!values.cover ? styles.imgPickerEmpty : ""}`}
              onClick={pickFile}
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={onDrop}
              onPaste={onPaste}
              title="Click / Kéo-thả / Dán (Ctrl+V) để chọn ảnh"
            >
              {values.cover ? (
                <img src={values.cover} alt="cover" className={styles.imgPickerImg} />
              ) : (
                <div className={styles.imgPickerHint}>
                  <i className="bi bi-image me-2" />
                  Chọn hoặc kéo-thả ảnh vào đây
                </div>
              )}

              <div className={styles.imgPickerOverlay} onClick={(e) => e.stopPropagation()}>
                {!uploading ? (
                  <>
                    <button type="button" className={styles.btn} onClick={pickFile}>
                      <i className="bi bi-upload me-1" /> Tải ảnh
                    </button>
                    {values.cover && (
                      <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={clearImage}>
                        <i className="bi bi-trash me-1" /> Xóa
                      </button>
                    )}
                  </>
                ) : (
                  <div className={styles.loading}>
                    <span className={styles.spinner} /> Đang tải…
                  </div>
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </div>

            {/* (tuỳ chọn) Hiện URL để copy nhanh */}
            {values.cover && (
              <div className={styles.urlRow}>
                <span className={styles.urlText} title={values.cover}>{values.cover}</span>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => navigator.clipboard.writeText(values.cover)}
                  title="Copy URL"
                >
                  <i className="bi bi-clipboard" />
                </button>
              </div>
            )}

            <label className={styles.label}>Tags (phân tách bằng dấu phẩy)</label>
            <input
              className={styles.inputBox}
              value={values.tags}
              onChange={(e) => setValues(v => ({ ...v, tags: e.target.value }))}
              placeholder="Environment, Lighting, Materials"
            />

            <label className={styles.label}>Số ảnh (shots)</label>
            <input
              type="number"
              className={styles.inputBox}
              value={values.shots}
              min={0}
              onChange={(e) => setValues(v => ({ ...v, shots: Number(e.target.value) }))}
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
    </div>
  );
}

/* ConfirmModal giữ nguyên như trước */
export function ConfirmModal({ ...props }: any) { /* ... */ return null as any; }
