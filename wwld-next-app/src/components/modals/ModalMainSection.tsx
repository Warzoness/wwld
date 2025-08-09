"use client";

import React, { useEffect, useState } from "react";
import { MainSectionPayload, addMainSection, updateMainSection } from "@/lib/services/mainSectionService";
import { handleImageUpload } from "@/lib/services/uploadService";

interface MainSectionModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: MainSectionPayload;
}

const MainSectionModal: React.FC<MainSectionModalProps> = ({ show, onClose, onSuccess, initialData }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // ảnh sẽ lưu vào DB
  const [imagePreview, setImagePreview] = useState(""); // ảnh dùng để preview
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("useEffect chạy, initialData:", initialData);
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || "");
      let img = "";
      const backendUrl = "http://localhost:8080"; // Đổi thành domain backend của bạn
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
      setName("");
      setDescription("");
      setImagePreview("");
      setImageUrl("");
    }
    setError("");
  }, [initialData, show]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Tên không được để trống");
      return;
    }

    try {
      const payload: MainSectionPayload = {
        name,
        description,
        image: imageUrl,
      };

      if (initialData?.id) {
        payload.id = initialData.id;
        await updateMainSection(payload);
      } else {
        await addMainSection(payload);
      }

      alert("Lưu thành công!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi lưu dữ liệu.");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview ảnh
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload ảnh
    const uploadedUrl = await handleImageUpload(file);
    if (uploadedUrl) {
      setImageUrl(uploadedUrl); // Dùng để lưu vào DB
    } else {
      setError("Tải ảnh thất bại");
    }
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="form-control"
              placeholder="Mô tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div
              className="form-control mt-3 d-flex align-items-center justify-content-center"
              style={{ minHeight: 120, border: "2px dashed #ccc", cursor: "pointer", position: "relative" }}
              onClick={() => document.getElementById("main-section-image-input")?.click()}
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={async e => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file) await handleFileChange({ target: { files: [file] } } as any);
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
            <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {initialData ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSectionModal;

