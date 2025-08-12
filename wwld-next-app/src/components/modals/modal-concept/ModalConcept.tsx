"use client";

import React from "react";
import styles from "./ConceptModal.module.css";

/** ===== Types ===== */
export type ConceptDTO = {
  id?: number;
  title: string;
  slug: string;
  contentMd: string;
  conceptImage: string;
  description: string;
};

type SaveExtras = { imageFile?: File };

/** ===== Upload helpers (bạn cung cấp) ===== */
type UploadedLike = {
  url?: string;
  secure_url?: string;
  data?: { url?: string } | null;
};
function isUploadedLike(x: unknown): x is UploadedLike {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.url === "string" ||
    typeof o.secure_url === "string" ||
    (o.data !== undefined &&
      o.data !== null &&
      typeof (o.data as Record<string, unknown>).url === "string")
  );
}
const toUrlString = (uploaded: unknown): string | null => {
  if (!uploaded) return null;
  if (typeof uploaded === "string") return uploaded;
  if (isUploadedLike(uploaded)) {
    return uploaded.url ?? uploaded.secure_url ?? uploaded.data?.url ?? null;
  }
  return null;
};

/** ===== Helpers ===== */
function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** ===== ConceptModal (Thêm/Sửa) ===== */
export function ConceptModal({
  initial,
  onClose,
  onSave,
  uploadImage, // 👈 hàm upload ảnh của bạn
  title = "Concept",
}: {
  initial?: Partial<ConceptDTO>;
  onClose: () => void;
  onSave: (payload: ConceptDTO, extras?: SaveExtras) => void | Promise<void>;
  uploadImage?: (file: File) => Promise<unknown>;
  title?: string;
}) {
  // form state
  const [values, setValues] = React.useState<ConceptDTO>({
    id: initial?.id,
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    contentMd: initial?.contentMd ?? "",
    conceptImage: initial?.conceptImage ?? "",
    description: initial?.description ?? "",
  });

  // ảnh file & preview
  const [imageFile, setImageFile] = React.useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = React.useState<string>(
    initial?.conceptImage ?? ""
  );
  const lastObjectUrlRef = React.useRef<string | null>(null);

  // trạng thái upload
  const [uploading, setUploading] = React.useState(false);

  // error / submit
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  // auto-slug theo title
  const lastAutoSlug = React.useRef(values.slug);
  React.useEffect(() => {
    const auto = slugify(values.title || "");
    if (!values.slug || values.slug === lastAutoSlug.current) {
      setValues((v) => ({ ...v, slug: auto }));
      lastAutoSlug.current = auto;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.title]);

  // cleanup objectURL khi đổi file hoặc unmount
  React.useEffect(() => {
    return () => {
      if (lastObjectUrlRef.current) {
        URL.revokeObjectURL(lastObjectUrlRef.current);
        lastObjectUrlRef.current = null;
      }
    };
  }, []);

  // phím tắt
  const canSubmit = React.useMemo(
    () => Boolean(values.title.trim() && values.slug.trim()),
    [values.title, values.slug]
  );

  const handleSubmit = React.useCallback(async () => {
    if (!canSubmit) {
      setError("Vui lòng nhập tối thiểu Tiêu đề và Slug.");
      return;
    }
    if (uploading) return; // đang upload, tránh double-submit
    setError("");
    try {
      setSubmitting(true);
      const payload: ConceptDTO = {
        id: values.id,
        title: values.title.trim(),
        slug: values.slug.trim(),
        contentMd: values.contentMd ?? "",
        // Nếu bạn muốn chỉ lưu URL thật (sau upload) thì previewUrl khi đã upload sẽ là url thật;
        // nếu chưa upload (không có uploadImage) thì vẫn là blob URL/URL nhập tay.
        conceptImage: previewUrl?.trim() || "",
        description: values.description?.trim() ?? "",
      };
      await onSave(payload, { imageFile }); // truyền cả file gốc để tầng trên muốn upload lại thì tuỳ
      onClose();
    } catch (e: any) {
      setError(e?.message || "Không thể lưu. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, uploading, values, previewUrl, imageFile, onSave, onClose]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "enter") {
        e.preventDefault();
        handleSubmit();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleSubmit, onClose]);

  /** ===== Xử lý chọn file + upload ===== */
  const handleFileChange = async (file?: File) => {
    // clear object url cũ
    if (lastObjectUrlRef.current) {
      URL.revokeObjectURL(lastObjectUrlRef.current);
      lastObjectUrlRef.current = null;
    }

    if (!file) {
      setImageFile(undefined);
      return;
    }

    setImageFile(file);

    // Preview ngay lập tức
    const objectUrl = URL.createObjectURL(file);
    lastObjectUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
    setValues((v) => ({ ...v, conceptImage: objectUrl }));

    // Nếu có hàm upload, tiến hành upload để lấy URL thật
    if (uploadImage) {
      try {
        setUploading(true);
        const uploaded = await uploadImage(file);
        const url = toUrlString(uploaded);
        if (url) {
          setPreviewUrl(url); // thay preview bằng URL thật sau upload
          setValues((v) => ({ ...v, conceptImage: url }));
        } else {
          setError("Tải ảnh thất bại: không lấy được URL.");
        }
      } catch (err) {
        console.error(err);
        setError("Tải ảnh thất bại.");
      } finally {
        setUploading(false);
      }
    }
  };

  /** ===== Nhập URL thủ công ===== */
  const onChangeImageUrl = (url: string) => {
    // khi người dùng gõ URL tay, bỏ file hiện tại
    setImageFile(undefined);
    if (lastObjectUrlRef.current) {
      URL.revokeObjectURL(lastObjectUrlRef.current);
      lastObjectUrlRef.current = null;
    }
    setPreviewUrl(url);
    setValues((v) => ({ ...v, conceptImage: url }));
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className="m-0">{values.id ? `Sửa ${title}` : `Thêm ${title}`}</h3>
          <button className={styles.iconBtn} onClick={onClose} aria-label="Đóng">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className={styles.modalBody}>
          {error && <div className={styles.error}>{error}</div>}

          <label className={styles.label}>Tiêu đề *</label>
          <input
            className={styles.inputBox}
            value={values.title}
            onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
            placeholder="Nhập tiêu đề"
          />

          <label className={styles.label}>Slug *</label>
          <input
            className={styles.inputBox}
            value={values.slug}
            onChange={(e) => setValues((v) => ({ ...v, slug: slugify(e.target.value) }))}
            placeholder="slug-tu-dong-theo-tieu-de"
          />

          <label className={styles.label}>Mô tả ngắn</label>
          <textarea
            className={styles.textarea}
            rows={3}
            value={values.description}
            onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
            placeholder="Mô tả ngắn…"
          />

          {/* Ảnh: chọn file hoặc nhập URL */}
          <div className={styles.imageRow}>
            <div className={styles.imageCol}>
              <label className={styles.label}>Ảnh (chọn file)</label>
              <input
                type="file"
                accept="image/*"
                className={styles.inputBox}
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />
              {uploading && <div className={styles.note}>Đang tải ảnh…</div>}
            </div>
            <div className={styles.imageCol}>
              <label className={styles.label}>Ảnh (nhập URL)</label>
              <input
                className={styles.inputBox}
                value={previewUrl}
                onChange={(e) => onChangeImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {previewUrl && (
            <div className={styles.preview}>
              <img
                src={previewUrl}
                alt="preview"
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0")}
              />
            </div>
          )}

          <label className={styles.label}>Nội dung (Markdown)</label>
          <textarea
            className={styles.textarea}
            rows={6}
            value={values.contentMd}
            onChange={(e) => setValues((v) => ({ ...v, contentMd: e.target.value }))}
            placeholder="## Tiêu đề cấp 2..."
          />
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.btn} onClick={onClose} disabled={submitting}>
            Hủy
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleSubmit}
            disabled={!canSubmit || submitting || uploading}
            title={uploading ? "Đang tải ảnh..." : undefined}
          >
            {submitting ? "Đang lưu…" : values.id ? "Lưu" : "Thêm mới"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** ===== ConfirmModal (Xác nhận xoá) ===== */
export function ConfirmModal({
  show = true,
  message = "Bạn có chắc muốn xóa mục này?",
  onCancel,
  onConfirm,
}: {
  show?: boolean;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}) {
  if (!show) return null;

  const handleConfirm = async () => {
    await onConfirm();
    onCancel();
  };

  return (
    <div className={styles.modalBackdrop} onClick={onCancel} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className="m-0">Xác nhận</h3>
          <button className={styles.iconBtn} onClick={onCancel} aria-label="Đóng">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className={styles.modalBody}>
          <p>{message}</p>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btn} onClick={onCancel}>Hủy</button>
          <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleConfirm}>Xóa</button>
        </div>
      </div>
    </div>
  );
}
