"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  addStory,
  fetchChapters,
  type StoryPayload,
  updateStory,
} from "@/lib/services/storyService";
import {
  fetchMainSection,
  type MainSectionPayload,
} from "@/lib/services/mainSectionService";
import { handleImageUpload } from "@/lib/services/uploadService";
import { backendUrl } from "@/lib/consts/const";

interface StoryModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: StoryPayload;

  /** ⬇️ NGỮ CẢNH: nếu có → auto set & disable các field tương ứng */
  fixedMainSectionId?: number; // Đang ở trong 1 MainSection cụ thể
  fixedType?: 0 | 1;           // 0 = Chương, 1 = Màn
  fixedParentId?: number;      // Nếu đang ở trong một Chương → thêm Màn con
}

/** Chuẩn hoá PREVIEW ảnh: http | /uploads | tên file → FULL URL để hiển thị */
const toPreviewUrl = (raw?: string): string => {
  if (!raw) return "";
  if (raw.startsWith("http")) return raw;
  if (raw.startsWith("/uploads/")) return backendUrl + raw;
  return backendUrl + `/uploads/${raw.replace(/^\/?uploads\//, "")}`;
};

const StoryModal: React.FC<StoryModalProps> = ({
  show,
  onClose,
  onSuccess,
  initialData,
  fixedMainSectionId,
  fixedType,
  fixedParentId,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Ảnh lưu DB (ưu tiên URL http/https từ Cloudinary; nếu dữ liệu cũ /uploads/... thì có thể giữ nguyên)
  const [imageUrl, setImageUrl] = useState("");
  // Ảnh preview (blob hoặc full URL)
  const [imagePreview, setImagePreview] = useState("");

  const [error, setError] = useState("");

  const [mainSectionId, setMainSectionId] = useState<number>(0);
  const [mainSections, setMainSections] = useState<MainSectionPayload[]>([]);

  // 0 = chương, 1 = màn
  const [type, setType] = useState<number>(0);

  // Danh sách chương để chọn parent nếu type = 1
  const [chapters, setChapters] = useState<StoryPayload[]>([]);
  const [parentId, setParentId] = useState<number | undefined>(undefined);

  // input file ref để reset value an toàn sau await
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** ===== Load danh sách chọn (main sections + chapters) khi mở modal ===== */
  useEffect(() => {
    if (!show) return;

    setError("");

    // Load nguồn chọn
    fetchMainSection().then(setMainSections).catch(() => setMainSections([]));
    fetchChapters().then(setChapters).catch(() => setChapters([]));

    if (initialData) {
      // === EDIT MODE ===
      setTitle(initialData.title ?? "");
      setDescription(initialData.description ?? "");

      // mainSection: ưu tiên fixed nếu có
      const msId = fixedMainSectionId ?? initialData.mainSectionId ?? 0;
      setMainSectionId(msId);

      // type: ưu tiên fixed nếu có
      const t = fixedType ?? (initialData.type ?? 0);
      setType(t);

      // parent/chapter: ưu tiên fixed nếu có (khi đang đứng trong 1 chương)
      const pid = fixedParentId ?? (initialData.parentId || undefined);
      setParentId(pid);

      // ảnh
      const img = initialData.image ? toPreviewUrl(initialData.image) : "";
      setImagePreview(img);
      setImageUrl(initialData.image ?? img); // lưu lại raw để submit (nếu là http càng tốt)
    } else {
      // === CREATE MODE ===
      setTitle("");
      setDescription("");
      setImagePreview("");
      setImageUrl("");

      // Áp ngữ cảnh mặc định
      setMainSectionId(fixedMainSectionId ?? 0);
      setType(fixedType ?? 0);
      setParentId(fixedParentId); // nếu đang ở trong 1 chương cụ thể
    }
  }, [show, initialData, fixedMainSectionId, fixedType, fixedParentId]);

  /** Khi đổi Type: nếu chuyển về "Chương" thì xoá parentId */
  useEffect(() => {
    if (type === 0) setParentId(undefined);
  }, [type]);

  /** ===== Upload ảnh: preview blob → upload → set URL thật ===== */
  const uploadImage = async (file: File) => {
    // 1) Preview blob trước để UX mượt
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    // 2) Upload bằng service; service có thể trả string (URL) hoặc object
    try {
      const uploaded = await handleImageUpload(file); // string | object tuỳ service
      // Nếu service trả string (URL) → set luôn; nếu trả object có url/secure_url → bạn có thể mở rộng parsing tại đây.
      if (typeof uploaded === "string" && uploaded) {
        setImageUrl(uploaded);
        setImagePreview(uploaded); // thay blob bằng URL thật
      } else if (uploaded && typeof uploaded === "object") {
        const anyObj = uploaded as Record<string, unknown>;
        const u =
          (typeof anyObj.secure_url === "string" && anyObj.secure_url) ||
          (typeof anyObj.url === "string" && anyObj.url) ||
          (anyObj.data &&
            typeof anyObj.data === "object" &&
            anyObj.data !== null &&
            typeof (anyObj.data as Record<string, unknown>).url === "string" &&
            ((anyObj.data as Record<string, unknown>).url as string)) ||
          "";
        if (u) {
          setImageUrl(String(u));
          setImagePreview(String(u));
        } else {
          setError("Tải ảnh thành công nhưng không lấy được URL.");
        }
      } else {
        setError("Tải ảnh thất bại.");
      }
    } catch (e) {
      console.error(e);
      setError("Tải ảnh thất bại.");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget; // cache để reset value sau await
    const file = inputEl.files?.[0];
    if (!file) return;
    try {
      await uploadImage(file);
    } finally {
      inputEl.value = ""; // tránh lỗi e.currentTarget null sau await
    }
  };

  /** ====== Submit ====== */
  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Tên không được để trống");
      return;
    }
    if (!mainSectionId) {
      setError("Thiếu Main Section");
      return;
    }
    if (type === 1 && !parentId) {
      setError("Màn cần chọn Chương cha");
      return;
    }

    try {
      setError("");

      // Nếu là "Chương", backend thường mong parentId = 0
      const finalParentId = type === 0 ? 0 : (parentId ?? 0);

      const payload: StoryPayload = {
        ...(initialData?.id ? { id: initialData.id } : {}),
        title: title.trim(),
        description: description || "",
        // Lưu image như hiện có (URL cloud hoặc /uploads/...), backend của bạn đã xử lý hiển thị tương tự ở list. :contentReference[oaicite:3]{index=3}
        image: imageUrl || "",
        mainSectionId,
        type,
        parentId: finalParentId,
      };

      if (initialData?.id) await updateStory(payload);
      else await addStory(payload);

      alert("Lưu thành công!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi lưu dữ liệu.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">{initialData ? "Sửa" : "Thêm mới"} Cốt truyện</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          {/* Body */}
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Title */}
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Tên"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Description */}
            <textarea
              className="form-control mb-3"
              placeholder="Mô tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />

            {/* Main Section */}
            <div className="form-group mt-2">
              <label>Chọn phần cốt truyện (Main Section)</label>
              <select
                className="form-select"
                value={mainSectionId}
                onChange={(e) => setMainSectionId(Number(e.target.value))}
                disabled={!!fixedMainSectionId} // khóa khi có ngữ cảnh
                title={fixedMainSectionId ? "Đang ở trong Main Section hiện tại — không cần chọn lại." : undefined}
              >
                <option value={0}>-- Chọn Main Section --</option>
                {mainSections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="form-group mt-3">
              <label>Loại nội dung</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(parseInt(e.target.value))}
                disabled={fixedType !== undefined} // khóa khi có ngữ cảnh
                title={fixedType !== undefined ? "Loại đã cố định theo ngữ cảnh." : undefined}
              >
                <option value={0}>Chương</option>
                <option value={1}>Màn</option>
              </select>
            </div>

            {/* Parent (chỉ khi là Màn) */}
            {type === 1 && (
              <div className="form-group mt-3">
                <label>Thuộc Chương</label>
                <select
                  className="form-select"
                  value={parentId ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setParentId(v ? Number(v) : undefined);
                  }}
                  disabled={!!fixedParentId} // khóa khi có ngữ cảnh (đang đứng trong chương)
                  title={fixedParentId ? "Đang đứng trong Chương này — không cần chọn lại." : undefined}
                >
                  <option value="">-- Chọn chương --</option>
                  {chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Upload ảnh: click + kéo-thả + preview */}
            <div
              className="form-control mt-3 d-flex align-items-center justify-content-center"
              style={{ minHeight: 120, border: "2px dashed #ccc", cursor: "pointer", position: "relative" }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file) await uploadImage(file);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="img-fluid rounded" style={{ maxHeight: 100, objectFit: "contain" }} />
              ) : (
                <span className="text-muted">Chọn hoặc kéo-thả ảnh vào đây</span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {initialData ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;
