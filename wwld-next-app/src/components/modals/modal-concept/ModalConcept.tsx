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

/** ===== Helpers cho URL ảnh ===== */
// Rút URL (string) từ object trả về khi upload
type UploadedLike = {
  url?: string;
  secure_url?: string;
  data?: { url?: string } | null;
};
const toUrlString = (input: unknown): string | null => {
  if (!input) return null;
  if (typeof input === "string") return input;
  if (typeof input === "object" && input !== null) {
    const o = input as Record<string, unknown>;
    const secureUrl = typeof o.secure_url === "string" ? o.secure_url : null;
    const url = typeof o.url === "string" ? o.url : null;
    const dataUrl =
      o.data && typeof o.data === "object" && o.data !== null && "url" in o.data
        ? (o.data as Record<string, unknown>).url
        : null;
    return (secureUrl ?? url ?? (typeof dataUrl === "string" ? dataUrl : null)) || null;
  }
  return null;
};

// Chuẩn hoá về FULL URL dựa trên backendUrl
const backendUrl = "https://wwld-production.up.railway.app";
const toFullImageUrl = (input: unknown): string | null => {
  if (!input) return null;
  if (typeof input === "string") {
    const s = input.trim();
    if (!s) return null;
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    if (s.startsWith("blob:") || s.startsWith("data:")) return null; // không dùng blob/data cho payload
    if (/^\/uploads\/.+/i.test(s)) return backendUrl + s;
    if (/^uploads\/.+/i.test(s)) return backendUrl + "/" + s;
    // cố gắng bóc /uploads/... từ chuỗi bất kỳ
    const m = s.match(/\/uploads\/.+/i);
    return m ? backendUrl + m[0] : null;
  }
  if (typeof input === "object" && input !== null) {
    // nếu input là object từ upload service
    const raw = toUrlString(input);
    return toFullImageUrl(raw);
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
  conceptImage: string; // LUÔN lưu FULL URL ở đây
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
    conceptImage: "", // full URL
  });

  const [preview, setPreview] = useState<string>(""); // hiển thị, có thể là blob hoặc full URL
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fill khi sửa / reset khi thêm
  useEffect(() => {
    if (!show) return;
    setError("");

    if (initialData) {
      const d = initialData;
      const fullUrl = toFullImageUrl(d.conceptImage) || "";
      setFormData({
        id: d.id ?? 0,
        title: d.title ?? "",
        slug: d.slug ?? "",
        description: d.description ?? "",
        contentMd: d.contentMd ?? "",
        conceptImage: fullUrl, // LƯU FULL URL
      });
      setPreview(fullUrl); // preview cũng dùng full URL
    } else {
      // reset
      setFormData({
        id: 0,
        title: "",
        slug: "",
        description: "",
        contentMd: "",
        conceptImage: "",
      });
      setPreview("");
    }
  }, [initialData, show]);

  /** ===== Handlers ===== */
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
    if (name === "conceptImage") {
      // người dùng nhập tay: normalize thành FULL URL luôn (nếu có thể)
      const full = toFullImageUrl(value) || value; // cho nhập bất kỳ, nhưng cố gắng chuẩn hoá
      setFormData((prev) => ({ ...prev, conceptImage: full }));
      setPreview(full);
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload ảnh + preview (blob trước, full URL sau khi upload xong)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const file = inputEl.files?.[0];
    if (!file) return;

    // blob preview tức thời
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const uploaded = await handleImageUpload(file);
      const fullUrl = toFullImageUrl(uploaded); // lấy FULL URL từ server
      if (fullUrl) {
        setFormData((prev) => ({ ...prev, conceptImage: fullUrl }));
        setPreview(fullUrl); // thay blob bằng full URL
      } else {
        setError("Tải ảnh thành công nhưng không lấy được URL đầy đủ.");
      }
    } catch (err) {
      console.error(err);
      setError("Tải ảnh thất bại");
    } finally {
      setUploading(false);
      inputEl.value = "";
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // blob preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const uploaded = await handleImageUpload(file);
      const fullUrl = toFullImageUrl(uploaded);
      if (fullUrl) {
        setFormData((prev) => ({ ...prev, conceptImage: fullUrl }));
        setPreview(fullUrl);
      } else {
        setError("Tải ảnh thành công nhưng không lấy được URL đầy đủ.");
      }
    } catch (err) {
      console.error(err);
      setError("Tải ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError("Tiêu đề không được để trống");
      return;
    }
    if (uploading) {
      setError("Ảnh đang tải lên, vui lòng đợi xong rồi lưu.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Lấy FULL URL từ formData (đã chuẩn hoá sẵn)
      const finalImageFullUrl =
        toFullImageUrl(formData.conceptImage) ||
        toFullImageUrl(initialData?.conceptImage) ||
        undefined;

      const payload: ConceptPayload = {
        id: formData.id || 0,
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description || undefined,
        contentMd: formData.contentMd || undefined,
        conceptImage: finalImageFullUrl, // ✅ GỬI FULL URL
      };

      // Giữ conceptImage nếu có; lọc các field rỗng khác
      const cleaned = Object.fromEntries(
        Object.entries(payload).filter(([k, v]) => {
          if (k === "conceptImage") return v !== undefined; // giữ nếu có giá trị
          return v !== undefined && v !== "";
        })
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

              {/* IMAGE */}
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
                  {preview ? (
                    <div>
                      <img
                        src={preview}
                        alt="Preview"
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: 160 }}
                      />
                      <div className="mt-2">
                        <small className="text-muted">
                          {uploading ? "Đang tải ảnh..." : "Nhấn để thay ảnh"}
                        </small>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted">📤 Chọn hoặc kéo-thả ảnh vào đây</span>
                  )}
                </div>

                {/* Cho phép nhập URL tay (full URL) nếu muốn */}
                <input
                  type="text"
                  className="form-control mt-2"
                  name="conceptImage"
                  placeholder="https://domain.com/uploads/abc.jpg"
                  value={formData.conceptImage}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading || uploading}
              title={uploading ? "Vui lòng đợi ảnh tải xong" : undefined}
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptModal;
