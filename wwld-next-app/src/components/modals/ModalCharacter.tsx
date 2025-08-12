// components/CharacterModal.tsx
import React, { useEffect, useState } from "react";
import { addCharacter, updateCharacter, CharacterPayload, Sex } from "@/lib/services/characterService";
import { handleImageUpload } from "@/lib/services/uploadService";

interface CharacterModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: CharacterPayload;
}

// Form state dùng kiểu riêng để thuận tiện nhập liệu
type CharacterTypeUI = "playable" | "npc";

interface CharacterFormData {
  id: number;
  name: string;
  avatar: string;
  imgFull: string;
  birthday: string; // yyyy-mm-dd
  sex: Sex;
  overview: string;
  history: string;
  organization: string;
  age?: number;      // number trong state
  nation: string;
  otherInformation: string;
  height?: number;   // number trong state
  combatStyle: string;
  type: CharacterTypeUI;
  mainQuestId?: number | null;
  sideQuestId?: number | null;
  eventQuestId?: number | null;
  areaId?: number | null;
  memeId?: number | null;
}

const uiFromApiType = (apiType: unknown): CharacterTypeUI =>
  apiType === "npc" ? "npc" : "playable";

// Type guard cho object trả về từ uploadService để lấy url
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

const CharacterModal: React.FC<CharacterModalProps> = ({ show, onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState<CharacterFormData>({
    id: 0,
    name: "",
    avatar: "",
    imgFull: "",
    birthday: "",
    sex: "Nam",
    overview: "",
    history: "",
    organization: "",
    age: undefined,
    nation: "",
    otherInformation: "",
    height: undefined,
    combatStyle: "",
    type: "playable",
    mainQuestId: undefined,
    sideQuestId: undefined,
    eventQuestId: undefined,
    areaId: undefined,
    memeId: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // preview ảnh
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [imgFullPreview, setImgFullPreview] = useState<string>("");

  // Fill khi sửa
  useEffect(() => {
    if (!initialData) {
      // reset create
      setFormData({
        id: 0,
        name: "",
        avatar: "",
        imgFull: "",
        birthday: "",
        sex: "Nam",
        overview: "",
        history: "",
        organization: "",
        age: undefined,
        nation: "",
        otherInformation: "",
        height: undefined,
        combatStyle: "",
        type: "playable",
        mainQuestId: undefined,
        sideQuestId: undefined,
        eventQuestId: undefined,
        areaId: undefined,
        memeId: undefined,
      });
      setAvatarPreview("");
      setImgFullPreview("");
      return;
    }

    const data: Partial<CharacterPayload> = initialData;

    setFormData({
      id: data.id ?? 0,
      name: data.name ?? "",
      avatar: data.avatar ?? "",
      imgFull: data.imgFull ?? "",
      birthday: data.birthday ?? "",
      sex: data.sex ?? "Nam",
      overview: data.overview ?? "",
      history: data.history ?? "",
      organization: data.organization ?? "",
      age: data.age ?? undefined,
      nation: data.nation ?? "",
      otherInformation: data.otherInformation ?? "",
      height: data.height ?? undefined,
      combatStyle: data.combatStyle ?? "",
      type: uiFromApiType(data.type),
      mainQuestId: undefined,
      sideQuestId: undefined,
      eventQuestId: undefined,
      areaId: undefined,
      memeId: undefined,
    });

    setAvatarPreview(data.avatar ?? "");
    setImgFullPreview(data.imgFull ?? "");
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "age") {
      setFormData((prev) => ({ ...prev, age: value === "" ? undefined : Number(value) }));
      return;
    }
    if (name === "height") {
      setFormData((prev) => ({ ...prev, height: value === "" ? undefined : Number(value) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // nếu nhập URL thủ công → cập nhật preview
    if (name === "avatar") setAvatarPreview(value);
    if (name === "imgFull") setImgFullPreview(value);
  };

  const handleFileUpload =
    (field: "avatar" | "imgFull", setPreview: React.Dispatch<React.SetStateAction<string>>) =>
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // local preview
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);

        try {
          const uploaded = await handleImageUpload(file);
          const url = toUrlString(uploaded);
          if (url) {
            setFormData((prev) => ({ ...prev, [field]: url }));
          } else {
            setError("Tải ảnh thất bại: không lấy được URL.");
          }
        } catch (err) {
          console.error(err);
          setError("Tải ảnh thất bại.");
        } finally {
          e.currentTarget.value = "";
        }
      };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      const ageNum = formData.age || undefined;
      const heightNum = formData.height || undefined;

      const payload: CharacterPayload = {
        id: formData.id || 0,
        name: formData.name.trim(),
        avatar: formData.avatar || undefined,
        imgFull: formData.imgFull || undefined,
        birthday: formData.birthday || undefined,
        sex: formData.sex || undefined,
        overview: formData.overview || undefined,
        history: formData.history || undefined,
        organization: formData.organization || undefined,
        age: ageNum,
        nation: formData.nation || undefined,
        otherInformation: formData.otherInformation || undefined,
        height: heightNum,
        combatStyle: formData.combatStyle || undefined,
        type: formData.type as CharacterPayload["type"],
        // các *_Id để undefined theo yêu cầu
      };

      // (Tuỳ chọn) Làm gọn payload: bỏ null/undefined/""
      const cleaned = Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v !== null && v !== undefined && v !== "")
      ) as CharacterPayload;

      console.log("[SUBMIT payload]", cleaned);

      if (initialData) {
        await updateCharacter(cleaned);
      } else {
        await addCharacter(cleaned);
      }
      alert("Thành công");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving character:", err);
      setError("Có lỗi khi lưu dữ liệu. Vui lòng kiểm tra các trường bắt buộc và định dạng.");
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
            <h5>{initialData ? "Sửa nhân vật" : "Thêm nhân vật"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {error && <div className="alert alert-danger py-2">{error}</div>}

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
                  type="text"
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
                <label className="form-label">Quốc tịch</label>
                <input
                  type="text"
                  className="form-control"
                  name="nation"
                  value={formData.nation}
                  onChange={handleChange}
                />
              </div>

              {/* AVATAR */}
              <div className="col-md-6">
                <label className="form-label">Ảnh đại diện (Avatar)</label>
                <input
                  type="file"
                  className="form-control mt-2"
                  accept="image/*"
                  onChange={handleFileUpload("avatar", setAvatarPreview)}
                />
                {avatarPreview && (
                  <div className="mt-2">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="img-thumbnail"
                      style={{ maxWidth: 180, maxHeight: 180, objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>

              {/* IMG FULL */}
              <div className="col-md-6">
                <label className="form-label">Ảnh toàn thân</label>
                <input
                  type="file"
                  className="form-control mt-2"
                  accept="image/*"
                  onChange={handleFileUpload("imgFull", setImgFullPreview)}
                />
                {imgFullPreview && (
                  <div className="mt-2">
                    <img
                      src={imgFullPreview}
                      alt="Full preview"
                      className="img-thumbnail"
                      style={{ maxWidth: 260, maxHeight: 260, objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">Tuổi</label>
                <input
                  type="number"
                  className="form-control"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min={0}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Chiều cao (m)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min={0}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">Tổ chức</label>
                <input
                  type="text"
                  className="form-control"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">Phong cách chiến đấu</label>
                <input
                  type="text"
                  className="form-control"
                  name="combatStyle"
                  value={formData.combatStyle}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">Tổng quan</label>
                <textarea
                  className="form-control"
                  name="overview"
                  value={formData.overview}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">Lịch sử</label>
                <textarea
                  className="form-control"
                  name="history"
                  value={formData.history}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">Thông tin khác</label>
                <textarea
                  className="form-control"
                  name="otherInformation"
                  value={formData.otherInformation}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Loại nhân vật</label>
                <select
                  className="form-select"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="playable">Playable</option>
                  <option value="npc">NPC</option>
                </select>
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
