"use client";

import React, { useEffect, useState } from "react";
import {
  addConcept,
  updateConcept,
  type ConceptPayload,
} from "@/lib/services/conceptService";
import { handleImageUpload } from "@/lib/services/uploadService";

/** ===== Helper: slugify ===== */
const slugify = (input: string) =>
  input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// helper ép về /uploads/...
const toUploadsPath = (input: unknown): string | null => {
  if (!input) return null;

  if (typeof input === "object" && input !== null) {
    // ép kiểu rõ ràng thành Record<string, unknown> thay vì any
    const o = input as Record<string, unknown>;
    const secureUrl = typeof o.secure_url === "string" ? o.secure_url : undefined;
    const url = typeof o.url === "string" ? o.url : undefined;
    const dataUrl =
      typeof (o.data as Record<string, unknown> | undefined)?.url === "string"
        ? (o.data as Record<string, unknown>).url
        : undefined;

    return toUploadsPath(secureUrl ?? url ?? dataUrl ?? null);
  }

  if (typeof input === "string") {
    const s = input.trim();
    if (!s || s.startsWith("blob:") || s.startsWith("data:")) return null;
    if (/^\/uploads\/.+/i.test(s)) return s;
    if (/^uploads\/.+/i.test(s)) return `/${s}`;
    if (/^https?:\/\//i.test(s)) {
      try {
        const u = new URL(s);
        if (/^\/uploads\/.+/i.test(u.pathname)) return u.pathname;
      } catch {
        /* ignore invalid URL */
      }
    }
    const m = s.match(/\/uploads\/.+/i);
    return m ? m[0] : null;
  }

  return null;
};



/** ===== Props ===== */
interface ConceptModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ConceptPayload;
}

/** ===== Form state (UI) ===== */
interface ConceptFormData {
  id: number;
  title: string;
  slug: string;
  description: string;
  contentMd: string;
}

const ConceptModal: React.FC<ConceptModalProps> = ({
  show,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [formData, setFormData] = useState<ConceptFormData>({
    id: 0,
    title: "",
    slug: "",
    description: "",
    contentMd: "",
  });

  const [imageUrl, setImageUrl] = useState<string>(""); // URL gốc từ server
  const [imagePreview, setImagePreview] = useState<string>(""); // blob hoặc full URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = "https://wwld-production.up.railway.app";

  // Fill khi sửa / reset khi thêm
  useEffect(() => {
    if (!show) return;
    setError("");

    if (initialData) {
      const d = initialData;
      setFormData({
        id: d.id ?? 0,
        title: d.title ?? "",
        slug: d.slug ?? "",
        description: d.description ?? "",
        contentMd: d.contentMd ?? "",
      });

      // LẤY ẢNH CŨ -> gán sẵn
      const oldPath = toUploadsPath(d.conceptImage) ?? "";
      setImageUrl(oldPath);              // giá trị để lưu (luôn là /uploads/...)
      setImagePreview(oldPath ? backendUrl + oldPath : ""); // chỉ để hiển thị
    } else {
      // reset
      setFormData({ id: 0, title: "", slug: "", description: "", contentMd: "" });
      setImageUrl("");
      setImagePreview("");
    }
  }, [initialData, show]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "title") {
      const next = value;
      setFormData((prev) => ({
        ...prev,
        title: next,
        slug:
          !prev.slug || prev.slug === slugify(prev.title)
            ? slugify(next)
            : prev.slug,
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload ảnh + preview
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget; // lưu lại reference ngay đầu
    const file = inputEl.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      const uploaded = await handleImageUpload(file);
      const path = toUploadsPath(uploaded);
      if (path) {
        setImageUrl(path);
        setImagePreview(backendUrl + path);
      } else {
        setError("Tải ảnh thành công nhưng không lấy được đường dẫn /uploads/...");
      }
    } catch (err) {
      console.error(err);
      setError("Tải ảnh thất bại");
    } finally {
      inputEl.value = ""; // reset input file an toàn
    }
  };


  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const uploaded = await handleImageUpload(file);
      const path = toUploadsPath(uploaded);
      if (path) {
        setImageUrl(path);
        setImagePreview(backendUrl + path);
      } else {
        setError("Tải ảnh thành công nhưng không lấy được đường dẫn /uploads/...");
      }
    } catch (err) {
      console.error(err);
      setError("Tải ảnh thất bại");
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError("Tiêu đề không được để trống");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Nếu user không upload mới -> dùng lại ảnh cũ từ initialData
      const finalImagePath =
        toUploadsPath(imageUrl) ??                 // ảnh mới (nếu có)
        toUploadsPath(initialData?.conceptImage) ?? // fallback ảnh cũ
        undefined;                                  // có thể cho phép null nếu muốn xóa ảnh

      const payload: ConceptPayload = {
        id: formData.id || 0,
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description || undefined,
        contentMd: formData.contentMd || undefined,
        conceptImage: finalImagePath, // <-- LUÔN GỬI (nếu có)
      };

      // nếu bạn đang filter field rỗng, KHÔNG xoá conceptImage đã có giá trị
      const cleaned = Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v !== undefined && v !== "")
      ) as ConceptPayload;

      if (initialData) await updateConcept(cleaned);
      else await addConcept(cleaned);

      alert("Thành công");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Có lỗi khi lưu dữ liệu");
    } finally {
      setLoading(false);
    }
  };


  if (!show) return null;

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title fw-bold">
              {initialData ? "✏️ Sửa concept" : "➕ Thêm concept"}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {error && <div className="alert alert-danger py-2">{error}</div>}

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Tiêu đề *</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Slug *</label>
                <input
                  type="text"
                  className="form-control"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="slug-tu-dong-theo-tieu-de"
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">Mô tả ngắn</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">Nội dung (Markdown)</label>
                <textarea
                  className="form-control"
                  name="contentMd"
                  value={formData.contentMd}
                  onChange={handleChange}
                  rows={6}
                />
              </div>

              {/* IMAGE — giống DialogModal */}
              <div className="col-md-12">
                <label className="form-label fw-semibold">🖼 Ảnh minh họa</label>
                <div
                  className="border border-2 rounded-3 p-3 text-center position-relative"
                  style={{ minHeight: 150, cursor: "pointer", backgroundColor: "#f9f9f9" }}
                  onClick={() => document.getElementById("concept-image-input")?.click()}
                  onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={handleDrop}
                >
                  <input
                    id="concept-image-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  {imagePreview ? (
                    <div>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: 160 }}
                      />
                      <div className="mt-2">
                        <small className="text-muted">Nhấn để thay ảnh</small>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted">📤 Chọn hoặc kéo-thả ảnh vào đây</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptModal;
