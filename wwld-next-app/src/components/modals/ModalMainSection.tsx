// components/modals/ModalMainSection.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MainSectionPayload,
  addMainSection,
  updateMainSection,
} from "@/lib/services/mainSectionService";
import { backendUrl } from "@/lib/consts/const";
import { handleImageUpload } from "@/lib/services/uploadService";

// ✅ Dùng uploader Cloudinary mới (trả về secure_url | null)

/** ===== Helpers chuẩn hoá URL ảnh (tham khảo cách làm từ Character/Concept) ===== */
// Rút URL string từ bất kỳ kết quả upload (trường hợp sau này đổi type)
type UploadedLike = {
  url?: string;
  secure_url?: string;
  data?: { url?: string } | null;
};
const toUrlString = (input: unknown): string | null => {
  if (!input) return null;
  if (typeof input === "string") return input;
  if (typeof input === "object") {
    const o = input as UploadedLike;
    return o.secure_url ?? o.url ?? o.data?.url ?? null;
  }
  return null;
};

// Trả về FULL URL hiển thị:
// - http/https: giữ nguyên (Cloudinary, CDN...)
// - /uploads/... hoặc uploads/...: ghép backendUrl (giống phần list & code trước đây)
const toFullImageUrl = (input: unknown): string | null => {
  if (!input) return null;
  if (typeof input === "string") {
    const s = input.trim();
    if (!s) return null;
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    if (s.startsWith("blob:") || s.startsWith("data:")) return null; // blob/data chỉ để preview
    if (/^\/uploads\/.+/i.test(s)) return backendUrl + s;
    if (/^uploads\/.+/i.test(s)) return backendUrl + "/" + s;
    // cố gắng bóc /uploads/... từ chuỗi bất kỳ
    const m = s.match(/\/uploads\/.+/i);
    return m ? backendUrl + m[0] : null;
  }
  if (typeof input === "object") {
    const raw = toUrlString(input);
    return toFullImageUrl(raw);
  }
  return null;
};

interface MainSectionModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: MainSectionPayload;
}

const MainSectionModal: React.FC<MainSectionModalProps> = ({
  show,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Ảnh để lưu DB (ưu tiên Cloudinary secure_url)
  const [imageValue, setImageValue] = useState<string>("");

  // Ảnh để preview (có thể là blob → sau đó thay bằng full URL khi upload xong)
  const [imagePreview, setImagePreview] = useState<string>("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickFile = () => fileInputRef.current?.click();

  // Fill khi sửa / reset khi thêm
  useEffect(() => {
    if (!show) return;
    setError("");

    if (initialData) {
      setName(initialData.name ?? "");
      setDescription(initialData.description ?? "");

      // Nếu DB đang lưu Cloudinary (http/https) thì dùng luôn; nếu là /uploads/... thì ghép backendUrl
      const full = toFullImageUrl(initialData.image) || initialData.image || "";
      setImageValue(full);   // để submit
      setImagePreview(full); // để hiển thị
    } else {
      setName("");
      setDescription("");
      setImageValue("");
      setImagePreview("");
    }
  }, [initialData, show]);

  /** Đọc file → preview blob ngay; sau đó upload Cloudinary → set secure_url */
  const processFile = async (file: File) => {
    // blob preview tức thời
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const secureUrl = await handleImageUpload(file); // string | null
      if (!secureUrl) {
        setError("Tải ảnh thất bại: không lấy được secure_url từ Cloudinary.");
        return;
      }
      // Cập nhật state bằng FULL URL cloud
      setImageValue(secureUrl);
      setImagePreview(secureUrl);
    } catch (e: unknown) {
      console.error(e);
      setError(
        e instanceof Error ? `Tải ảnh thất bại: ${e.message}` : "Tải ảnh thất bại."
      );
    } finally {
      setUploading(false);
    }
  };

  // ... bên trong ModalMainSection
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;               // ✅ cache trước await
    const file = inputEl.files?.[0];
    if (!file) return;

    try {
      await processFile(file);
    } finally {
      // ✅ luôn reset an toàn, ngay cả khi upload lỗi
      if (inputEl) inputEl.value = "";
    }
  };


  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) await processFile(file);
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Tên không được để trống");
      return;
    }
    if (uploading) {
      setError("Ảnh đang tải lên, vui lòng đợi xong rồi lưu.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // Ưu tiên secure_url Cloudinary đã có trong imageValue; fallback từ initialData nếu còn
      const finalImage =
        toFullImageUrl(imageValue) ||
        toFullImageUrl(initialData?.image) ||
        undefined;

      const payload: MainSectionPayload = {
        ...(initialData?.id ? { id: initialData.id } : {}),
        name,
        description,
        image: finalImage || "/images/banner.png",
      };

      if (initialData?.id) await updateMainSection(payload);
      else await addMainSection(payload);

      alert("Lưu thành công!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi lưu dữ liệu.");
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {initialData ? "Sửa" : "Thêm mới"} Cốt truyện
            </h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              className="form-control"
              placeholder="Mô tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />

            {/* Khu vực upload giống Character: click/chọn + kéo-thả + preview */}
            <div
              className="form-control mt-3 d-flex align-items-center justify-content-center"
              style={{
                minHeight: 120,
                border: "2px dashed #ccc",
                cursor: "pointer",
                position: "relative",
              }}
              onClick={pickFile}
              onDragOver={onDragOver}
              onDrop={onDrop}
            >
              <input
                ref={fileInputRef}
                id="main-section-image-input"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onFileChange}
              />

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="img-fluid rounded"
                  style={{ maxHeight: 140, objectFit: "contain" }}
                />
              ) : (
                <span className="text-muted">
                  Chọn hoặc kéo-thả ảnh vào đây
                </span>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving || uploading}>
              {uploading
                ? "Đang tải ảnh…"
                : saving
                  ? "Đang lưu…"
                  : initialData
                    ? "Cập nhật"
                    : "Thêm mới"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSectionModal;
