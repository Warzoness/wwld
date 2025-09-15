"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./NoteUpsertDeleteModal.module.css";
import { handleImageUpload } from "@/lib/services/uploadService"; // chỉnh path cho đúng
import { addNote, deleteNoteData, updateNoteData } from "@/lib/services/noteListService";

export interface NoteData {
  id: number;
  noteName: string;
  noteContent: string;
  storyId: number;
  description: string;
  image: string;
}

export interface NoteDataPayload {
  id?: number;
  noteName: string;
  noteContent: string;
  storyId: number;
  description: string;
  image: string;
}

type Mode = "create" | "edit";

interface NoteUpsertDeleteModalProps {
  open: boolean;
  mode: Mode;
  note: NoteData | null;     // edit: khác null; create: null
  onClose: () => void;
  onSaved: (saved: NoteData) => void;
  onDeleted: (id: number) => void;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_MB = 10;

export default function NoteUpsertDeleteModal({
  open,
  mode,
  note,
  onClose,
  onSaved,
  onDeleted,
}: NoteUpsertDeleteModalProps) {
  const [form, setForm] = useState<NoteDataPayload>({
    id: undefined,
    noteName: "",
    noteContent: "",
    storyId: 0,
    description: "",
    image: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File + preview
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setError(null);
    setUploadError(null);
    setConfirmingDelete(false);

    if (mode === "edit" && note) {
      setForm({
        id: note.id,
        noteName: note.noteName ?? "",
        noteContent: note.noteContent ?? "",
        storyId: note.storyId ?? 0,
        description: note.description ?? "",
        image: note.image ?? "",
      });
      setSelectedFile(null);
      setPreviewUrl(note.image ?? "");
    } else {
      setForm({
        id: undefined,
        noteName: "",
        noteContent: "",
        storyId: 0,
        description: "",
        image: "",
      });
      setSelectedFile(null);
      setPreviewUrl("");
    }
  }, [open, mode, note]);

  useEffect(() => {
    // cleanup object URL để tránh leak
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!open) return null;

  // ===== Helpers =====
  const onChange =
    (field: Exclude<keyof NoteDataPayload, "image">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = field === "storyId" ? Number(e.target.value) : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const pickFile = () => {
    inputRef.current?.click();
  };

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Định dạng không hỗ trợ. Chọn JPEG/PNG/WebP/GIF.";
    }
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_MB) {
      return `Kích thước quá lớn (${sizeMb.toFixed(1)} MB). Tối đa ${MAX_MB} MB.`;
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    const err = validateFile(file);
    if (err) {
      setUploadError(err);
      return;
    }
    setUploadError(null);
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearImage = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl("");
    // Không xoá form.image ở đây: để chế độ edit vẫn giữ ảnh cũ nếu user không upload mới
  };

  // ===== Save/Delete =====
 const handleSave = async () => {
  if (!form.noteName.trim()) {
    setError("Vui lòng nhập tiêu đề (noteName).");
    return;
  }
  setSubmitting(true);
  setError(null);

  try {
    let finalImageUrl = form.image; // edit: giữ ảnh cũ nếu không thayF

    // Nếu user chọn file mới -> upload trước để lấy secure_url (string)
    if (selectedFile) {
      const uploadedUrl = await handleImageUpload(selectedFile); // string | null

      if (!uploadedUrl) {
        throw new Error("Upload ảnh thất bại");
      }
      finalImageUrl = uploadedUrl;
    } else if (mode === "create") {
      finalImageUrl = ""; // tạo mới và không chọn ảnh
    }

    const payload: NoteDataPayload = {
      id: form.id,
      noteName: form.noteName,
      noteContent: form.noteContent,
      storyId: form.storyId,
      description: form.description,
      image: finalImageUrl,
    };

    if (mode === "create") {
      const res = await addNote(payload);
      const created: NoteData =
        (res?.noteDataDTO as NoteData) ??
        ({
          id: res?.id ?? Math.floor(Math.random() * 1_000_000),
          noteName: payload.noteName,
          noteContent: payload.noteContent,
          storyId: payload.storyId,
          description: payload.description,
          image: payload.image,
        } satisfies NoteData);

      onSaved(created);
    } else {
      const res = await updateNoteData(payload);
      const updated: NoteData =
        (res?.noteDataDTO as NoteData) ??
        ({
          id: payload.id ?? 0,
          noteName: payload.noteName,
          noteContent: payload.noteContent,
          storyId: payload.storyId,
          description: payload.description,
          image: payload.image,
        } satisfies NoteData);

      onSaved(updated);
    }

    onClose();
  } catch (err: unknown) {
    setError(err instanceof Error ? err.message : "Lỗi lưu dữ liệu");
  } finally {
    setSubmitting(false);
  }
};


  const handleDelete = async () => {
    if (mode !== "edit" || form.id == null) return;
    setSubmitting(true);
    setError(null);
    try {
      await deleteNoteData(form.id);
      onDeleted(form.id);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Xoá thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{mode === "create" ? "Thêm Note" : "Sửa/Xoá Note"}</h3>
          <button className={styles.iconBtn} onClick={onClose} aria-label="Đóng">✕</button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.body}>
          <div className={styles.field}>
            <label>Tiêu đề</label>
            <input
              value={form.noteName}
              onChange={onChange("noteName")}
              className={styles.input}
              placeholder="Nhập tiêu đề…"
            />
          </div>

          <div className={styles.cols}>
            <div className={styles.field}>
              <label>Mô tả</label>
              <input
                value={form.description}
                onChange={onChange("description")}
                className={styles.input}
                placeholder="Mô tả ngắn…"
              />
            </div>
            <div className={styles.field}>
              <label>Story ID</label>
              <input
                type="number"
                value={form.storyId}
                onChange={onChange("storyId")}
                className={styles.input}
              />
            </div>
          </div>

          {/* --- Upload khu vực --- */}
          <div className={styles.field}>
            <label>Hình ảnh</label>

            <div
              className={styles.dropzone}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onClick={pickFile}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pickFile()}
            >
              {!previewUrl ? (
                <div className={styles.dropContent}>
                  <span>Kéo & thả ảnh vào đây, hoặc bấm để chọn ảnh</span>
                  <small>(Hỗ trợ: JPG/PNG/WebP/GIF, tối đa {MAX_MB}MB)</small>
                </div>
              ) : (
                <div className={styles.previewWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="preview" className={styles.previewImg} />
                  <div className={styles.previewActions}>
                    <button
                      type="button"
                      className={styles.btn}
                      onClick={pickFile}
                      disabled={submitting}
                    >
                      Đổi ảnh
                    </button>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnGhost}`}
                      onClick={clearImage}
                      disabled={submitting}
                    >
                      Gỡ ảnh
                    </button>
                  </div>
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                className={styles.fileInput}
                onChange={onFileInputChange}
              />
            </div>

            {uploadError && <div className={styles.hintError}>{uploadError}</div>}
            {mode === "edit" && !selectedFile && form.image && (
              <div className={styles.hint}>
                Đang dùng ảnh hiện tại. Chọn ảnh mới để thay thế.
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label>Nội dung</label>
            <textarea
              value={form.noteContent}
              onChange={onChange("noteContent")}
              className={styles.textarea}
              rows={8}
              placeholder="Nội dung chi tiết…"
            />
          </div>
        </div>

        <div className={styles.footer}>
          {!confirmingDelete ? (
            <>
              <button className={styles.btn} onClick={handleSave} disabled={submitting}>
                {submitting ? "Đang lưu…" : "Lưu"}
              </button>

              {mode === "edit" && (
                <button
                  className={`${styles.btn} ${styles.btnDanger}`}
                  onClick={() => setConfirmingDelete(true)}
                  disabled={submitting}
                >
                  Xoá
                </button>
              )}

              <button className={styles.btnGhost} onClick={onClose} disabled={submitting}>
                Đóng
              </button>
            </>
          ) : (
            <div className={styles.confirmRow}>
              <span>Bạn chắc chắn muốn xoá?</span>
              <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleDelete} disabled={submitting}>
                {submitting ? "Đang xoá…" : "Xác nhận xoá"}
              </button>
              <button className={styles.btnGhost} onClick={() => setConfirmingDelete(false)} disabled={submitting}>
                Huỷ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
