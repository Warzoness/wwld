"use client";

import React, { useEffect, useState } from "react";
import {
  addConcept,
  updateConcept,
  type ConceptPayload,
} from "@/lib/services/conceptService";
import { handleImageUpload } from "@/lib/services/uploadService";

/** ===== Type guard cho kết quả upload để lấy URL ===== */
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
  conceptImage: string; // cho phép nhập URL
}

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
    conceptImage: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // preview ảnh

  // Fill khi sửa / reset khi thêm
  useEffect(() => {
    if (!initialData) {
      setFormData({
        id: 0,
        title: "",
        slug: "",
        description: "",
        contentMd: "",
        conceptImage: "",
      });
      return;
    }

    const d = initialData;
    setFormData({
      id: d.id ?? 0,
      title: d.title ?? "",
      slug: d.slug ?? "",
      description: d.description ?? "",
      contentMd: d.contentMd ?? "",
      conceptImage: d.conceptImage ?? "",
    });
  }, [initialData]);

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
        // auto slug nếu slug đang rỗng hoặc đang là biến thể auto cũ
        slug:
          !prev.slug || prev.slug === slugify(prev.title)
            ? slugify(next)
            : prev.slug,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload file ảnh + preview
  const handleFileUpload =
    () =>
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputEl = e.currentTarget;          // tránh event pooling
        const file = inputEl.files?.[0];
        if (!file) return;

        // 👉 Preview ngay lập tức bằng blob URL và đẩy vào formData
        const blobUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, conceptImage: blobUrl }));

        try {
          const uploaded = await handleImageUpload(file);
          const url = toUrlString(uploaded);
          if (url) {
            // 👉 Ghi đè blob URL bằng URL thật từ server
            setFormData(prev => ({ ...prev, conceptImage: url }));
          } else {
            setError("Tải ảnh thất bại: không lấy được URL.");
          }
        } catch (err) {
          console.error(err);
          setError("Tải ảnh thất bại.");
          // (giữ blobUrl để người dùng vẫn thấy preview, hoặc bạn có thể clear tuỳ ý)
        } finally {
          inputEl.value = "";                     // reset input file an toàn
        }
      };


  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const payload: ConceptPayload = {
        id: formData.id || 0,
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        description: formData.description || undefined,
        contentMd: formData.contentMd || undefined,
        conceptImage: formData.conceptImage || undefined,
      };

      // Làm gọn payload: bỏ "", null, undefined
      const cleaned = Object.fromEntries(
        Object.entries(payload).filter(
          ([, v]) => v !== null && v !== undefined && v !== ""
        )
      ) as ConceptPayload;

      if (initialData) {
        await updateConcept(cleaned);
        console.log("update thành công :",cleaned);
        
      } else {
        await addConcept(cleaned);
      }
      alert("Thành công");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving concept:", err);
      setError(
        "Có lỗi khi lưu dữ liệu. Vui lòng kiểm tra các trường bắt buộc và định dạng."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{initialData ? "Sửa concept" : "Thêm concept"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
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
              <div className="col-md-8">
                <label className="form-label">Ảnh (URL)</label>
                <input
                  type="text"
                  className="form-control"
                  name="conceptImage"
                  value={formData.conceptImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Hoặc chọn file</label>
                <input
                  type="file"
                  className="form-control mt-2"
                  accept="image/*"
                  onChange={handleFileUpload()}   // 👈 không truyền setImagePreview nữa
                />

              </div>

              {formData.conceptImage && (
                <div className="col-md-12">
                  <div className="mt-2">
                    <img
                      src={formData.conceptImage}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{ maxWidth: 360, maxHeight: 240, objectFit: "cover" }}
                    />
                  </div>
                </div>
              )}
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
