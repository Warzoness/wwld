'use client';

import { useEffect, useState } from "react";
import { addDialog, updateDialog } from "@/lib/services/dialogService";
import { handleImageUpload } from "@/lib/services/uploadService";
import { fetchCharacters } from "@/lib/services/characterService";
import { useParams } from "next/navigation";
import { backendUrl } from "@/lib/consts/const";
import { DialogPayload } from "@/lib/types/dialog";
import { CharacterPayload } from "@/lib/types/character";
import { fetchListNote } from "@/lib/services/noteListService";
import { fetchConcepts } from "@/lib/services/conceptService";
import MentionTextArea, { Suggestion } from "./MentionTextArea/MentionTextArea";

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

  const [allCharacters, setAllCharacters] = useState<CharacterPayload[]>([]);
  const [allNotes, setAllNotes] = useState<{ id: number; noteName: string }[]>([]);
  const [allConcepts, setAllConcepts] = useState<{ id: number; title: string }[]>([]);

  const param = useParams();

  useEffect(() => {
    if (!show) return;
    // nạp dữ liệu nền một lần khi mở modal
    fetchCharacters().then((data) => {
      setCharacters(data);
      setAllCharacters(data);
    });
    fetchListNote().then((notes) => {
      const m = (notes ?? []).map((n: { id: number; noteName: string }) => ({ id: n.id, noteName: n.noteName }));
      setAllNotes(m);
    });
    fetchConcepts().then((c) => setAllConcepts(c));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);


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

  // Lọc suggestion theo keyword (không dấu cách) sau @
  const fetchSuggestions = async (keyword: string): Promise<Suggestion[]> => {
    const q = keyword.trim().toLowerCase();

    // lọc local (nhanh, không spam API)
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

    // có thể thay đổi thứ tự ưu tiên
    return [...chars, ...concepts, ...notes].slice(0, 10);
  };

  const buildEntityUrl = (s: Suggestion): string => {
    switch (s.type) {
      case "character":
        return `/admin/character-detail/${s.id}`;
      case "concept":
        return `/admin/concept-detail/${s.id}`;
      case "note":
        return `/admin/note-detail/${s.id}`;
      default:
        return "#";
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
                    setCharacterId(found?.id ?? null);
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
