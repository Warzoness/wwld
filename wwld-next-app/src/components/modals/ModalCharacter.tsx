// components/CharacterModal.tsx
import React, { useState, useEffect } from "react";
import { addCharacter, updateCharacter, CharacterPayload } from "@/lib/services/characterService";
import { handleImageUpload } from "@/lib/services/uploadService";

interface CharacterModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: CharacterPayload;
}

const CharacterModal: React.FC<CharacterModalProps> = ({ show, onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState<CharacterPayload>({
    id: 0,
    name: "",
    avatar: "",
    imgFull: "",
    birthday: "",
    sex: "Nam",
    information: "",
    mainQuestId: 0,
    sideQuestId: 0,
    eventQuestId: 0,
    areaId: 0,
    memeId: 0,
    type: "undifine", // 1: playable, 2: non-playable
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(""); // ảnh dùng để preview
  const [imageUrl, setImageUrl] = useState(""); // ảnh sẽ lưu vào DB
  const [error, setError] = useState("");




  // Khi sửa, fill dữ liệu
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Reset khi thêm mới
      setFormData({
        id: 0,
        name: "",
        avatar: "",
        imgFull: "",
        birthday: "",
        sex: "Nam",
        information: "",
        mainQuestId: 0,
        sideQuestId: 0,
        eventQuestId: 0,
        areaId: 0,
        memeId: 0,
        type: "undefined" // Default type,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (initialData) {
        await updateCharacter(formData);
      } else {
        await addCharacter(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving character:", error);
    } finally {
      setLoading(false);
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
    <div className="modal d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{initialData ? "Sửa nhân vật" : "Thêm nhân vật"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Tên nhân vật</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Ngày sinh</label>
                <input
                  type="date"
                  className="form-control"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Giới tính</label>
                <select className="form-select" name="sex" value={formData.sex} onChange={handleChange}>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Loại nhân vật</label>
                <select className="form-select" name="type" value={formData.type} onChange={handleChange}>
                  <option value="playable">Playable</option>
                  <option value="npc">NPC</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Avatar (URL)</label>
                <input
                  type="text"
                  className="form-control"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="http://..."
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Avatar (URL)</label>
                <input
                  type="file"
                  className="form-control"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleFileChange}
                  placeholder="http://..."
                />
              </div>

             

              <div className="col-12">
                <label className="form-label">Thông tin</label>
                <textarea
                  className="form-control"
                  name="information"
                  value={formData.information}
                  onChange={handleChange}
                  rows={3}
                />
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

export default CharacterModal;
