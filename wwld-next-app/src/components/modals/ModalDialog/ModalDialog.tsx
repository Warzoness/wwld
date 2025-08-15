'use client';

import { useEffect, useState } from "react";
import { addDialog, updateDialog } from "@/lib/services/dialogService";
import { handleImageUpload } from "@/lib/services/uploadService";
import { fetchCharacters } from "@/lib/services/characterService";
import { useParams, usePathname } from "next/navigation";
import { backendUrl } from "@/lib/consts/const";
import { DialogPayload } from "@/lib/types/dialog";
import { CharacterPayload } from "@/lib/types/character";
import { fetchListNote } from "@/lib/services/noteListService";
import { fetchConcepts } from "@/lib/services/conceptService";
import { buildEntityUrl, Suggestion } from "@/lib/types/buildEntityUrl";
import styles from "./ModalDialogModule.module.css"; // <-- thêm mới
import MentionTextArea from "../MentionTextArea/MentionTextArea";

interface DialogModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: DialogPayload;
  parentId: number | null;
}

const resolveImageUrl = (raw?: string): string => {
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const trimmed = raw.replace(/^\/?uploads\//, "");
  return `${backendUrl}/uploads/${trimmed}`;
};

// Hằng số giúp đọc code rõ ràng hơn
const TYPE_IMAGE = 0;
const TYPE_CHARACTER = 1;
const TYPE_PROTAGONIST = 2; // Rover
const TYPE_NARRATION = 3;

const DialogModal: React.FC<DialogModalProps> = ({ show, onClose, onSuccess, initialData, parentId }) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [characterId, setCharacterId] = useState<number | null>(null);
  const [characters, setCharacters] = useState<CharacterPayload[]>([]);
  const [type, setType] = useState<number>(TYPE_CHARACTER);
  const [noNameCharacter, setNoNameCharacter] = useState("");

  const [allCharacters, setAllCharacters] = useState<CharacterPayload[]>([]);
  const [allNotes, setAllNotes] = useState<{ id: number; noteName: string }[]>([]);
  const [allConcepts, setAllConcepts] = useState<{ id: number; title: string }[]>([]);

  const param = useParams();
  const pathname = usePathname();
  const ctx: "admin" | "public" = pathname.startsWith("/admin") ? "admin" : "public";

  // Nạp dữ liệu khi mở modal
  useEffect(() => {
    if (!show) return;
    setError("");
    fetchCharacters().then((data) => {
      setCharacters(data);
      setAllCharacters(data);
    });
    fetchListNote().then((notes) => {
      const m = (notes ?? []).map((n: { id: number; noteName: string }) => ({ id: n.id, noteName: n.noteName }));
      setAllNotes(m);
    });
    fetchConcepts().then((c) => setAllConcepts(c));
  }, [show]);

  // Gán dữ liệu khi sửa / reset khi thêm
  useEffect(() => {
    if (!show) return;
    if (initialData) {
      setContent(initialData.content ?? "");
      setType(initialData.type ?? TYPE_CHARACTER);
      setCharacterId(initialData.characterId ?? null);
      setNoNameCharacter(initialData.noNameCharacter ?? "");
      const url = resolveImageUrl(initialData.image);
      setImageUrl(url);
      setImagePreview(url);
    } else {
      setContent("");
      setType(TYPE_CHARACTER);
      setCharacterId(null);
      setNoNameCharacter("");
      setImageUrl("");
      setImagePreview("");
    }
  }, [show, initialData]);

  // Khi đổi type, dọn các field không liên quan để form sạch hơn
  useEffect(() => {
    if (type !== TYPE_CHARACTER) {
      setCharacterId(null);
      setNoNameCharacter("");
    }
    if (type !== TYPE_IMAGE) {
      setImageUrl("");
      setImagePreview("");
    }
  }, [type]);

  const processFile = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(String(reader.result ?? ""));
    reader.readAsDataURL(file);

    const uploadedUrl = await handleImageUpload(file);
    if (uploadedUrl) {
      setImageUrl(uploadedUrl);
    } else {
      setError("Tải ảnh thất bại");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
  };

  // Gợi ý mention
  const fetchSuggestions = async (keyword: string): Promise<Suggestion[]> => {
    const q = keyword.trim().toLowerCase();

    const chars: Suggestion[] = allCharacters
      .filter((c) => (c.name ?? "").toLowerCase().includes(q))
      .slice(0, 5)
      .map((c) => ({ id: c.id ?? 0, name: c.name ?? "Unknown", type: "character" }));

    const concepts: Suggestion[] = allConcepts
      .filter((c) => (c.title ?? "").toLowerCase().includes(q))
      .slice(0, 5)
      .map((c) => ({ id: c.id, name: c.title, type: "concept" }));

    const notes: Suggestion[] = allNotes
      .filter((n) => (n.noteName ?? "").toLowerCase().includes(q))
      .slice(0, 5)
      .map((n) => ({ id: n.id, name: n.noteName, type: "note" }));

    return [...chars, ...concepts, ...notes].slice(0, 10);
  };

  const handleSubmit = async () => {
    // Validate theo type
    if (!content.trim() && type !== TYPE_IMAGE) {
      setError("Nội dung không được để trống.");
      return;
    }
    if (type === TYPE_CHARACTER) {
      const displayName =
        characters.find(c => c.id === characterId)?.name || noNameCharacter?.trim();
      if (!displayName) {
        setError("Vui lòng nhập hoặc chọn tên nhân vật.");
        return;
      }
    }
    if (type === TYPE_IMAGE && !imageUrl) {
      setError("Vui lòng chọn ảnh cho kiểu 'Hình ảnh'.");
      return;
    }

    const effectiveParentId: number | null =
      (typeof initialData?.parentId === "number" ? initialData!.parentId! : null) ??
      (typeof parentId === "number" ? parentId! : null) ??
      null;

    try {
      const payload: DialogPayload = {
        id: initialData?.id || 0,
        orderIndex: initialData?.orderIndex || 0,
        storyId: Number(param.storyId) || 0,
        content,
        image: imageUrl,
        characterId: type === TYPE_CHARACTER ? characterId : null,
        type,
        noNameCharacter: type === TYPE_CHARACTER
          ? (noNameCharacter?.trim() || characters.find(c => c.id === characterId)?.name || "????")
          : "",
        voice: initialData?.voice,
        parentId: effectiveParentId
      };

      if (initialData?.id) {
        await updateDialog(payload);
      } else {
        await addDialog(payload);
      }

      alert("Lưu thành công!");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setError("Có lỗi xảy ra khi lưu dữ liệu.");
    }
  };

  if (!show) return null;

  const isImage = type === TYPE_IMAGE;
  const isCharacterDialog = type === TYPE_CHARACTER;

  return (
    <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className={`modal-content shadow-lg rounded-3 border-0 ${styles.card}`}>
          <div className={`modal-header text-white ${styles.modalHeader}`}>
            <h5 className="modal-title fw-bold">
              {initialData ? "✏️ Sửa" : "➕ Thêm mới"} Cốt truyện
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Kiểu nội dung - Radio group */}
            <fieldset className={styles.field}>
              <legend className={styles.legend}>📂 Kiểu nội dung</legend>
              <div className={styles.radioGroup} role="radiogroup" aria-label="Chọn kiểu nội dung">
                {[
                  { value: TYPE_IMAGE, label: "Hình ảnh", desc: "Chỉ hiển thị ảnh minh họa" },
                  { value: TYPE_CHARACTER, label: "Thoại nhân vật", desc: "Đối thoại của NPC/nhân vật thường" },
                  { value: TYPE_PROTAGONIST, label: "Thoại nhân vật chính", desc: "Rover nói chuyện" },
                  { value: TYPE_NARRATION, label: "Chú thích/Dẫn truyện", desc: "Narration / system" },
                ].map(opt => (
                  <label key={opt.value} className={styles.radioCard}>
                    <input
                      type="radio"
                      name="dialogType"
                      value={opt.value}
                      checked={type === opt.value}
                      onChange={() => setType(opt.value)}
                    />
                    <div className={styles.radioBody}>
                      <div className={styles.radioTitle}>{opt.label}</div>
                      <div className={styles.radioDesc}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Chỉ hiện khi là Thoại nhân vật */}
            {isCharacterDialog && (
              <div className={styles.field}>
                <label className={styles.label}>👤 Nhân vật</label>
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
                      c => (c.name ?? "").toLowerCase() === inputName.toLowerCase()
                    );
                    if (found) {
                      setCharacterId(found.id ?? null);
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
                <small className="text-muted">Gõ để tìm, hoặc nhập tên tự do nếu nhân vật chưa có trong danh sách.</small>
              </div>
            )}

            {/* Nội dung thoại (luôn hiển thị với mọi kiểu trừ khi bạn muốn ẩn cho type=IMAGE) */}
            {!isImage && (
              <div className={styles.field}>
                <label className={styles.label}>📝 Nội dung thoại</label>
                <MentionTextArea
                  value={content}
                  onChange={setContent}
                  fetchSuggestions={fetchSuggestions}
                  buildEntityUrl={buildEntityUrl}
                  placeholder="Nhập nội dung… Gõ @ để mention nhân vật/khái niệm/note"
                  rows={4}
                  ariaLabel="dialog content with mentions"
                />
              </div>
            )}

            {/* Upload ảnh – chỉ hiện nếu type = IMAGE */}
            {isImage && (
              <div className={styles.field}>
                <label className={styles.label}>🖼 Ảnh minh họa</label>
                <div
                  className={styles.dropzone}
                  onClick={() => document.getElementById("main-section-image-input")?.click()}
                  onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={async e => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files?.[0];
                    if (file) await processFile(file);
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
                    <div className={styles.previewWrap}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className={styles.previewImg}
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
            )}
          </div>

          <div className={styles.footer}>
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
