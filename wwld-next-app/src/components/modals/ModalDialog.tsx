'use client';

import { useEffect, useState } from "react";
import { addDialog, DialogPayload, updateDialog } from "@/lib/services/dialogService";
import { handleImageUpload } from "@/lib/services/uploadService";
import { CharacterPayload, fetchCharacters } from "@/lib/services/characterService";
import { useParams } from "next/navigation";

interface DialogModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: DialogPayload;
}

const DialogModal: React.FC<DialogModalProps> = ({ show, onClose, onSuccess, initialData }) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [characterId, setCharacterId] = useState<number | null>(null);
  const [characters, setCharacters] = useState<CharacterPayload[]>([]);
  const [type, setType] = useState<number>(1);
  const [storyId, setStoryId] = useState<number>(0);
  const [noNameCharacter, setNoNameCharacter] = useState("");

  const param = useParams();

  useEffect(() => {
    if (!show) return;

    setError("");
    setStoryId(Number(param.storyId) || 0);
    fetchCharacters().then(setCharacters);

    if (initialData) {
      setContent(initialData.content);
      setCharacterId(initialData.characterId || null);
      setType(initialData.type ?? 1);
      setNoNameCharacter(initialData.noNameCharacter || "");

      // const backendUrl = "http://localhost:8080";
  const backendUrl = "https://wwld-production.up.railway.app";
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
      setCharacterId(null);
      setImagePreview("");
      setImageUrl("");
      setContent("");
      setType(1);
      setNoNameCharacter("");
    }
  }, [initialData, show]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Nội dung không được để trống");
      return;
    }

    try {
      const payload: DialogPayload = {
        content,
        image: imageUrl,
        characterId: characterId,
        type,
        storyId: Number(param.storyId) || 0,
        id: initialData?.id || 0,
        orderIndex: initialData?.orderIndex || 0,
        noNameCharacter: noNameCharacter || "????"
      };

      if (initialData?.id) {
        await updateDialog(payload);
      } else {
        await addDialog(payload);
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    const uploadedUrl = await handleImageUpload(file);
    if (uploadedUrl) {
      setImageUrl(uploadedUrl);
    } else {
      setError("Tải ảnh thất bại");
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content shadow-lg rounded-3 border-0">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title fw-bold">
              {initialData ? "✏️ Sửa" : "➕ Thêm mới"} Cốt truyện
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Chọn nhân vật */}
            <div className="mb-3">
              <label className="form-label fw-semibold">👤 Chọn nhân vật</label>
              <input
                list="character-options"
                className="form-control"
                placeholder="Nhập tên nhân vật hoặc để trống"
                value={
                  characters.find(c => c.id === characterId)?.name ||
                  noNameCharacter ||
                  ""
                }
                onChange={(e) => {
                  const inputName = e.target.value;
                  const found = characters.find(
                    c => c.name.toLowerCase() === inputName.toLowerCase()
                  );
                  if (found) {
                    setCharacterId(found.id);
                    setNoNameCharacter("");
                  } else {
                    setCharacterId(null);
                    setNoNameCharacter(inputName);
                  }
                }}
              />
              <datalist id="character-options">
                {characters.map(character => (
                  <option key={character.id} value={character.name} />
                ))}
              </datalist>
            </div>

            {/* Nội dung */}
            <div className="mb-3">
              <label className="form-label fw-semibold">📝 Nội dung thoại</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Nhập nội dung..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>

            {/* Loại nội dung */}
            <div className="mb-3">
              <label className="form-label fw-semibold">📂 Loại nội dung</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(parseInt(e.target.value))}
              >
                <option value={0}>Hình ảnh</option>
                <option value={1}>Thoại nhân vật</option>
                <option value={2}>Thoại nhân vật chính</option>
                <option value={3}>Chú thích hoặc dẫn truyện</option>
              </select>
            </div>

            {/* Upload ảnh */}
            <div className="mb-3">
              <label className="form-label fw-semibold">🖼 Ảnh minh họa</label>
              <div
                className="border border-2 rounded-3 p-3 text-center position-relative"
                style={{
                  minHeight: 150,
                  cursor: "pointer",
                  backgroundColor: "#f9f9f9"
                }}
                onClick={() => document.getElementById("main-section-image-input")?.click()}
                onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={async e => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files?.[0];
                  // if (file) await handleFileChange({ target: { files: [file] } } as any);
                  // Thay đổi hàm gốc
                  const handleFileChange = (files: FileList) => {
                    // xử lý ở đây
                  };

                  // Gọi
                  if (file) {
                    await handleFileChange([file] as unknown as FileList);
                  }
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
                  <div>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-fluid rounded shadow-sm"
                      style={{ maxHeight: 140 }}
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
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {initialData ? "💾 Cập nhật" : "➕ Thêm mới"}
            </button>
          </div>
        </div>
      </div>
    </div>

    
  );
};

export default DialogModal;
