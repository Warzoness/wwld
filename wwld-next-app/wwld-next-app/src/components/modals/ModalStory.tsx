"use client";

import React, { useEffect, useState } from "react";
import { MainSectionPayload } from "@/lib/services/mainSectionService";
// ⬇️ Đổi import để dùng Cloudinary direct upload (Phương án A)
import { addStory, fetchChapters, StoryPayload, updateStory } from "@/lib/services/storyService";
import { fetchMainSection } from "@/lib/services/mainSectionService";
import { handleImageUpload } from "@/lib/services/uploadService";
import { backendUrl } from "@/lib/consts/const";

interface StoryModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: StoryPayload;
  mainSectionId: number;
  parentId?: number | undefined;
}

const StoryModal: React.FC<StoryModalProps> = ({ show, onClose, onSuccess, initialData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // ảnh sẽ lưu vào DB
  const [imagePreview, setImagePreview] = useState(""); // ảnh dùng để preview
  const [error, setError] = useState("");
  const [mainSectionId, setMainSectionId] = useState<number>(0);
  const [mainSections, setMainSections] = useState<MainSectionPayload[]>([]);
  const [type, setType] = useState<number>(0); // int: 0 = chương, 1 = màn
  const [chapters, setChapters] = useState<StoryPayload[]>([]);
  const [parentId, setParentId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!show) return;

    setError("");
    fetchMainSection().then(setMainSections);
    fetchChapters().then(setChapters); // 👉 Lấy chương để gán vào dropdown nếu là màn

    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setMainSectionId(initialData.mainSectionId || 0);
      setType(initialData.type ?? 0);
      setParentId(initialData.parentId || 0);

      let img = "";

      if (initialData.image) {
        if (initialData.image.startsWith("http")) {
          img = initialData.image;
        } else if (initialData.image.startsWith("/uploads/")) {
          img = backendUrl + initialData.image;
        } else {
          img = backendUrl + `/uploads/${initialData.image.replace(/^\/?uploads\//, "")}`;
        }
      }

      setImagePreview(img);
      setImageUrl(img);
    } else {
      setTitle("");
      setDescription("");
      setImagePreview("");
      setImageUrl("");
      setMainSectionId(0);
      setParentId(undefined);
      setType(0);
    }
  }, [initialData, show]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Tên không được để trống");
      return;
    }

    try {
      const payload: StoryPayload = {
        title,
        description,
        image: imageUrl,
        mainSectionId: mainSectionId,
        type: type,
        parentId: parentId || 0,
      };

      if (initialData?.id) {
        payload.id = initialData.id;
        await updateStory(payload);
      } else {
        await addStory(payload);
      }

      alert("Lưu thành công!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi lưu dữ liệu.");
    }
  };

  // ⬇️ Dùng chung cho onChange và onDrop
  const uploadImage = async (file: File) => {
    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload Cloudinary (ký từ Spring)
    const uploadedUrl = await handleImageUpload(file);
    if (uploadedUrl) {
      setImageUrl(uploadedUrl); // Dùng để lưu vào DB
    } else {
      setError("Tải ảnh thất bại");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadImage(file);
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{initialData ? "Sửa" : "Thêm mới"} Cốt truyện</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Tên"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="form-control mb-3"
              placeholder="Mô tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="form-group mt-3">
              <label> Chọn phần cốt truyện </label>
              <select
                className="form-select"
                value={mainSectionId}
                onChange={(e) => setMainSectionId(Number(e.target.value))}
              >
                <option value={0}>-- Chọn Main Section --</option>
                {mainSections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mt-3">
              <label>Loại nội dung</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(parseInt(e.target.value))}
              >
                <option value={0}>Chương</option>
                <option value={1}>Màn</option>
              </select>
            </div>

            <div className="form-group mt-3">
              <label>Chọn chương (nếu là màn)</label>
              <select
                className="form-select"
                value={parentId ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setParentId(value ? Number(value) : undefined);
                }}
              >
                <option value="">-- Không chọn chương (nếu là chương chính) --</option>
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="form-control mt-3 d-flex align-items-center justify-content-center"
              style={{ minHeight: 120, border: "2px dashed #ccc", cursor: "pointer", position: "relative" }}
              onClick={() => document.getElementById("main-section-image-input")?.click()}
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
                id="main-section-image-input"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="img-fluid rounded" style={{ maxHeight: 100 }} />
              ) : (
                <span className="text-muted">Chọn hoặc kéo-thả ảnh vào đây</span>
              )}
            </div>
          </div>

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
