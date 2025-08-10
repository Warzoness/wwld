// components/CharacterModal.tsx
import React, { useEffect, useState } from "react";
import { addCharacter, updateCharacter, CharacterPayload } from "@/lib/services/characterService";
import { handleImageUpload } from "@/lib/services/uploadService";

interface CharacterModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: CharacterPayload; // nên cập nhật interface ở service cho khớp schema mới
}

// Map UI ⇄ API (type là String nên giữ playable/npc)
const uiFromApiType = (apiType: unknown): "playable" | "npc" =>
  apiType === "npc" ? "npc" : "playable";

const toUrlString = (uploaded: unknown): string | null => {
  if (!uploaded) return null;
  if (typeof uploaded === "string") return uploaded;
  if (typeof uploaded === "object" && uploaded !== null) {
    // @ts-ignore
    return uploaded.url || uploaded.secure_url || uploaded.data?.url || null;
  }
  return null;
};

const CharacterModal: React.FC<CharacterModalProps> = ({ show, onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    id: 0 as number | string,
    name: "",
    avatar: "",
    imgFull: "",
    birthday: "", // YYYY-MM-DD
    sex: "Nam",
    overview: "",
    history: "",
    organization: "",
    age: "" as number | string,
    nation: "",
    otherInformation: "",
    height: "" as number | string,
    combatStyle: "",
    type: "playable" as "playable" | "npc",
    // Các ID không hiển thị/không gửi
    mainQuestId: undefined as number | string | undefined,
    sideQuestId: undefined as number | string | undefined,
    eventQuestId: undefined as number | string | undefined,
    areaId: undefined as number | string | undefined,
    memeId: undefined as number | string | undefined,
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
      setFormData((prev) => ({
        ...prev,
        id: 0,
        name: "",
        avatar: "",
        imgFull: "",
        birthday: "",
        sex: "Nam",
        overview: "",
        history: "",
        organization: "",
        age: "",
        nation: "",
        otherInformation: "",
        height: "",
        combatStyle: "",
        type: "playable",
        mainQuestId: undefined,
        sideQuestId: undefined,
        eventQuestId: undefined,
        areaId: undefined,
        memeId: undefined,
      }));
      setAvatarPreview("");
      setImgFullPreview("");
      return;
    }

    // Chuẩn hoá birthday về YYYY-MM-DD nếu initialData.birthday là ISO/Date
    const toYMD = (d: any) => {
      try {
        if (!d) return "";
        const date = typeof d === "string" ? new Date(d) : d;
        if (isNaN(new Date(date).getTime())) return "";
        const z = new Date(date);
        const mm = `${z.getMonth() + 1}`.padStart(2, "0");
        const dd = `${z.getDate()}`.padStart(2, "0");
        return `${z.getFullYear()}-${mm}-${dd}`;
      } catch {
        return "";
      }
    };

    setFormData({
      id: (initialData as any).id ?? 0,
      name: (initialData as any).name ?? "",
      avatar: (initialData as any).avatar ?? "",
      imgFull: (initialData as any).imgFull ?? "",
      birthday: toYMD((initialData as any).birthday),
      sex: (initialData as any).sex ?? "Nam",
      overview: (initialData as any).overview ?? "",
      history: (initialData as any).history ?? "",
      organization: (initialData as any).organization ?? "",
      age: (initialData as any).age ?? "",
      nation: (initialData as any).nation ?? "",
      otherInformation: (initialData as any).otherInformation ?? "",
      height: (initialData as any).height ?? "",
      combatStyle: (initialData as any).combatStyle ?? "",
      type: uiFromApiType((initialData as any).type),
      mainQuestId: undefined,
      sideQuestId: undefined,
      eventQuestId: undefined,
      areaId: undefined,
      memeId: undefined,
    });

    setAvatarPreview((initialData as any).avatar || "");
    setImgFullPreview((initialData as any).imgFull || "");
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // number fields: age, height
    if (name === "age") {
      setFormData((prev) => ({ ...prev, age: value }));
      return;
    }
    if (name === "height") {
      setFormData((prev) => ({ ...prev, height: value }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // nếu nhập URL thủ công (trường hợp bạn đổi thành URL text) → cập nhật preview (hiện tại đang dùng file upload nên không cần)
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

      // convert birthday -> ISO string (nếu có)
      const birthdayISO =
        formData.birthday
          ? new Date(`${formData.birthday}T00:00:00`).toISOString()
          : null;

      // convert number fields
      const ageNum =
        formData.age === "" ? null : Number(formData.age);
      const heightNum =
        formData.height === "" ? null : Number(formData.height);

      const payload: any = {
        id: formData.id || 0,
        name: formData.name.trim(),
        avatar: formData.avatar,
        imgFull: formData.imgFull,
        birthday: birthdayISO, // backend là Date
        sex: formData.sex,
        overview: formData.overview,
        history: formData.history,
        organization: formData.organization,
        age: ageNum,
        nation: formData.nation,
        otherInformation: formData.otherInformation,
        height: heightNum,
        combatStyle: formData.combatStyle,
        type: formData.type, // String: "playable" | "npc"
        // Không gửi các trường ID theo yêu cầu
      };

      // Xoá key null/undefined để payload gọn gàng
      Object.keys(payload).forEach((k) => {
        if (payload[k] === null || payload[k] === undefined || payload[k] === "") {
          // cho phép gửi "" cho name? tuỳ bạn. Ở đây mình loại các giá trị rỗng.
          delete payload[k];
        }
      });

      console.log("[SUBMIT payload]", payload);

      if (initialData) {
        await updateCharacter(payload);
      } else {
        await addCharacter(payload);
      }
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
