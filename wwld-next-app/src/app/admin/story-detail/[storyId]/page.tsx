'use client';

import MentionHighlighter from "@/components/modals/MentionTextArea/MentionHighlighter";
import DialogModal from "@/components/modals/ModalDialog/ModalDialog";
import NoteViewModal from "@/components/modals/NoteListModal/NoteViewModal";
import { getImageUrl, PASSCODE } from "@/lib/consts/const";
import { deleteDialog, fetchDialogPagesByStoryId, updateDialogOrder } from "@/lib/services/dialogService";
import { fetchNoteDataById } from "@/lib/services/noteListService";
import { Dialog, StoryData } from "@/lib/types/dialog";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./StoryDetailPage.module.css";
import { fetchOneCharacterById } from "@/lib/services/characterService";
import BackButton from "@/components/buttons/back-button/page";

interface NoteDataDTO {
  id: number;
  noteName: string;
  noteContent: string;
  storyId: number;
  description: string;
  image: string;
}

/** Mở rộng để chứa đủ dữ liệu dùng cho chat + avatar */
type DialogEx = Dialog & {
  parentId?: number | null;
  avatar?: string | null;           // 👈 nếu BE trả trực tiếp kèm dialog
  characterName?: string | null;
  noNameCharacter?: string | null;
};




type DialogNode = DialogEx & { children: DialogNode[] };

export default function StoryDetailPage() {
  const params = useParams();
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogDetail, setDialogDetail] = useState<DialogEx[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editDialog, setEditDialog] = useState<Dialog | undefined>(undefined);

  const [showPassModal, setShowPassModal] = useState(false);
  type PendingAction = { type: "edit"; data: Dialog } | { type: "delete"; data: number };
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState("");

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(30);
  const [totalItem, setTotalItem] = useState(0);

  const safeTotalItems = Number(totalItem) || 0;
  const safePageSize = Number(pageSize) || 1;
  const totalPages = Math.ceil(safeTotalItems / safePageSize);
  const pageNumbers = totalPages > 0 ? Array.from({ length: totalPages }, (_, i) => i) : [];

  // ===== Note modal =====
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteData, setNoteData] = useState<NoteDataDTO | null>(null);
  const [noteErr, setNoteErr] = useState<string | null>(null);

  const [charAvatarMap, setCharAvatarMap] = useState<Map<number, string>>(new Map());

  const handleOpenNote = async (id: number) => {
    try {
      setNoteErr(null);
      const dto = await fetchNoteDataById(id);
      setNoteData(dto as NoteDataDTO);
      setNoteOpen(true);
    } catch {
      setNoteErr("Không tải được ghi chú.");
    }
  };

  // ===== Parent for new dialog =====
  const [parentForNew, setParentForNew] = useState<number | null>(null);
  const handleOpenAdd = () => {
    setParentForNew(null);
    setEditDialog(undefined);
    setShowModal(true);
  };
  const handleAddChild = (parent: DialogEx) => {
    setParentForNew(parent.id);
    setEditDialog(undefined);
    setShowModal(true);
  };



  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPageNumber(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ===== Pass modal & actions =====
  const handleDelete = (dialogId: number) => {
    setPendingAction({ type: "delete", data: dialogId });
    setShowPassModal(true);
  };
  const handleEdit = (dialog: Dialog) => {
    setPendingAction({ type: "edit", data: dialog });
    setShowPassModal(true);
  };
  const handlePassSubmit = async () => {
    if (passInput !== PASSCODE) {
      setPassError("Sai passcode!");
      return;
    }
    setShowPassModal(false);
    setPassInput("");
    setPassError("");

    if (pendingAction?.type === "edit") {
      setEditDialog(pendingAction.data);
      setShowModal(true);
    } else if (pendingAction?.type === "delete") {
      try {
        await deleteDialog(pendingAction.data);
        setDialogDetail(prev => prev.filter(d => d.id !== pendingAction.data));
      } catch {
        alert("Xóa story thất bại!");
      }
    }
    setPendingAction(null);
  };

  // ===== Build tree (giữ thứ tự theo orderIndex trong từng cấp) =====
  const tree: DialogNode[] = useMemo(() => {
    const items = dialogDetail;
    const map = new Map<number, DialogNode>();
    const roots: DialogNode[] = [];
    items.forEach(d => map.set(d.id, { ...d, children: [] }));
    items.forEach(d => {
      const node = map.get(d.id)!;
      if (d.parentId) {
        const p = map.get(d.parentId);
        if (p) p.children.push(node);
        else roots.push(node);
      } else {
        roots.push(node);
      }
    });
    const sortRec = (nodes: DialogNode[]) => {
      nodes.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
      nodes.forEach(n => sortRec(n.children));
    };
    sortRec(roots);
    return roots;
  }, [dialogDetail]);

  // ===== Helpers =====
  const isMainChar = (n: DialogNode) => n.type === 2; // type=2 là lời của Rover (nhân vật chính)
  const isSystem = (n: DialogNode) => n.type === 3; // system / thuyết minh hệ thống
  const isImage = (n: DialogNode) => n.type === 0; // node hình ảnh


  const displayName = (n: DialogNode) =>
    n.type === 2
      ? "Rover"
      : (n.characterName || n.noNameCharacter || "????");

  const getAvatarUrl = (n: DialogEx) => {
    // Nếu là Rover (type = 2 hoặc tên hiển thị = Rover)
    if (n.type === 2 || (n.characterName && n.characterName === "Rover")) {
      return "/images/rover.jpg";
    }

    // Nếu NPC không có tên
    if (!n.characterName && !n.noNameCharacter) {
      return "/images/npc.jpg";
    }

    // Ưu tiên avatar trực tiếp từ node
    if (n.avatar) {
      const u = getImageUrl(n.avatar);
      if (u) return u;
    }

    // Ưu tiên avatar từ cache
    if (n.characterId && charAvatarMap.has(Number(n.characterId))) {
      const raw = charAvatarMap.get(Number(n.characterId))!;
      const u = getImageUrl(raw);
      if (u) return u;
    }

    // Fallback chung
    return "/images/npc.jpg";
  };





  // ===== Node renderer (chat Zalo) =====
  const Node = ({ node, level }: { node: DialogNode; level: number }) => {
    const hasChildren = node.children.length > 0;


    // 1) Hình ảnh: canh giữa, vẫn giữ tool + có thể có con
    if (isImage(node)) {
      return (
        <div className={styles.node}>
          <div className={`${styles.chatTools} ${styles.chatToolsCenter}`}>

            <button className="iris-btn iris-btn--warn" onClick={() => handleEdit(node)} title="Sửa">
              <i className="bi bi-pencil" />
            </button>
            <button className="iris-btn iris-btn--danger" onClick={() => handleDelete(node.id)} title="Xóa">
              <i className="bi bi-trash" />
            </button>
            <button className="iris-btn" onClick={() => handleOrderChange(node.id, "up")} title="Lên">
              <i className="bi bi-chevron-double-up" />
            </button>
            <button className="iris-btn" onClick={() => handleOrderChange(node.id, "down")} title="Xuống">
              <i className="bi bi-chevron-double-down" />
            </button>
            <button className="iris-btn" onClick={() => handleAddChild(node)} title="Thêm thoại con">
              <i className="bi bi-plus-circle" />
            </button>
          </div>

          <div className={styles.mediaBubble}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getImageUrl(node.image) || "/default-image.png"} alt="Dialog Image" />
          </div>

          {hasChildren && (
            <div className={styles.dialogDivider}>
              {node.children.map(c => (
                <Node key={c.id} node={c} level={level + 1} />
              ))}
            </div>
          )}
        </div>
      );
    }

    // 2) System line: canh giữa, chữ nghiêng
    if (isSystem(node)) {
      return (
        <div className={styles.node}>
          <div className={`${styles.chatTools} ${styles.chatToolsCenter}`}>

            <button className="iris-btn iris-btn--warn" onClick={() => handleEdit(node)} title="Sửa">
              <i className="bi bi-pencil" />
            </button>
            <button className="iris-btn iris-btn--danger" onClick={() => handleDelete(node.id)} title="Xóa">
              <i className="bi bi-trash" />
            </button>
            <button className="iris-btn" onClick={() => handleOrderChange(node.id, "up")} title="Lên">
              <i className="bi bi-chevron-double-up" />
            </button>
            <button className="iris-btn" onClick={() => handleOrderChange(node.id, "down")} title="Xuống">
              <i className="bi bi-chevron-double-down" />
            </button>
            <button className="iris-btn" onClick={() => handleAddChild(node)} title="Thêm thoại con">
              <i className="bi bi-plus-circle" />
            </button>
          </div>

          <div className={`${styles.chatRow} ${styles.center}`}>
            <div className={`${styles.bubbleSysChat}`}>
              <MentionHighlighter text={node.content} onNoteOpen={handleOpenNote} />
            </div>
          </div>

          {hasChildren && (
            <div className={styles.dialogDivider}>
              {node.children.map(c => (
                <Node key={c.id} node={c} level={level + 1} />
              ))}
            </div>
          )}
        </div>
      );
    }

    // 3) Tin nhắn trái/phải kiểu Zalo
    // 3) Tin nhắn trái/phải kiểu Zalo
    const rightSide = isMainChar(node); // Rover => true
    const avatarUrl = getAvatarUrl(node);

    return (
      <div className={styles.node}>
        <div className={`${styles.chatTools} ${rightSide ? styles.chatToolsRight : styles.chatToolsLeft}`}>
          <div className={styles.tools}>
            <button className="iris-btn iris-btn--warn" onClick={() => handleEdit(node)} title="Sửa">
              <i className="bi bi-pencil" />
            </button>
            <button className="iris-btn iris-btn--danger" onClick={() => handleDelete(node.id)} title="Xóa">
              <i className="bi bi-trash" />
            </button>
            <button className="iris-btn" onClick={() => handleOrderChange(node.id, "up")} title="Lên">
              <i className="bi bi-chevron-double-up" />
            </button>
            <button className="iris-btn" onClick={() => handleOrderChange(node.id, "down")} title="Xuống">
              <i className="bi bi-chevron-double-down" />
            </button>
            <button className="iris-btn" onClick={() => handleAddChild(node)} title="Thêm thoại con">
              <i className="bi bi-plus-circle" />
            </button>
          </div>
        </div>

        {/* // ✅ Bubble + Avatar: giữ như lần trước (tên chỉ ở trên avatar) */}
        <div className={`${styles.chatRow} ${rightSide ? styles.right : styles.left}`}>
          {!rightSide && (
            <div className={styles.avatarBlock}>
              <div className={styles.avatarName}>{displayName(node)}</div>
              <img src={avatarUrl} alt="avatar" className={styles.avatar} />
            </div>
          )}

          <div className={`${styles.bubbleChat} ${rightSide ? styles.bubbleRight : styles.bubbleLeft}`}>
            <MentionHighlighter text={node.content} onNoteOpen={handleOpenNote} />
          </div>

          {rightSide && (
            <div className={styles.avatarBlock}>
              <div className={styles.avatarName}>{displayName(node)}</div>
              <img src={avatarUrl} alt="avatar" className={styles.avatar} />
            </div>
          )}
        </div>




        {hasChildren && (
          <div className={styles.dialogDivider}>
            {node.children.map(c => (
              <Node key={c.id} node={c} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // ===== Move up/down (giữ như cũ) =====
  const handleOrderChange = (dialogId: number, direction: "up" | "down") => {
    const currentIndex = dialogDetail.findIndex(d => d.id === dialogId);
    if (currentIndex === -1) return;
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= dialogDetail.length) return;

    const updated = [...dialogDetail];
    [updated[currentIndex], updated[newIndex]] = [updated[newIndex], updated[currentIndex]];
    setDialogDetail(updated);
    updateDialogOrder(dialogId, newIndex).catch(() => {
      alert("Cập nhật thứ tự hội thoại thất bại!");
    });
  };

  // ===== Load data =====
  // useEffect giữ nguyên để load storyData + dialog
  useEffect(() => {
    const cached = sessionStorage.getItem("storyData");
    if (cached) setStoryData(JSON.parse(cached));
    if (!params.storyId) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchDialogPagesByStoryId(Number(params.storyId), pageNumber, pageSize);
        setDialogDetail(data.dialogs as DialogEx[]);
        setTotalItem(data.totalItem);
      } catch {
        setDialogDetail([]);
        setTotalItem(0);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.storyId, pageNumber, pageSize]);

  // 👇 useEffect riêng để fetch avatar theo characterId
  useEffect(() => {
    const neededIds = Array.from(
      new Set(
        dialogDetail
          .filter(d => !!d.characterId && !d.avatar && !charAvatarMap.has(Number(d.characterId)))
          .map(d => Number(d.characterId))
      )
    );
    if (neededIds.length === 0) return;

    let mounted = true;
    (async () => {
      try {
        const results = await Promise.allSettled(neededIds.map(id => fetchOneCharacterById(id)));
        const next = new Map(charAvatarMap);
        results.forEach((res, idx) => {
          if (res.status === "fulfilled" && res.value) {
            const id = neededIds[idx];
            const url = res.value.avatar || "";
            if (url) next.set(id, url);
          }
        });
        if (mounted) setCharAvatarMap(next);
      } catch { }
    })();

    return () => { mounted = false; };
  }, [dialogDetail, charAvatarMap]);



  return (
    <div className={`container py-4 ${styles.page}`}>
      {/* Top actions */}
      <div className={styles.topbar}>
        <BackButton label="Quay lại" />
        <div className={styles.topbarRight}>
          <button className="iris-btn iris-btn--primary" onClick={handleOpenAdd}>
            <i className="bi bi-plus-circle me-1" /> Thêm hội thoại
          </button>
        </div>
      </div>

      {/* Title */}
      <div className={styles.hero}>
        <h1>{storyData?.chapterName || "Chưa có tên"}</h1>
        <p className={styles.subtitle}>{storyData?.actName || "Chưa có tên"}</p>
      </div>

      {/* Panel */}
      <div className={styles.panel}>
        {/* Description */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <i className="bi bi-list-task" />
            <h4>Mô tả nhiệm vụ</h4>
          </div>
          <p className={styles.muted}>{storyData?.description || "Chưa có mô tả nhiệm vụ"}</p>
        </div>

        <div className={styles.sep} />

        {/* Content */}
        <div className={styles.content}>
          {loading ? (
            <div className={styles.skeletonWrap}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.skeletonRow} />
              ))}
            </div>
          ) : (
            <div className={styles.chatStream}>
              {tree.map(node => <Node key={node.id} node={node} level={0} />)}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <nav aria-label="Dialog pagination" className={styles.paginationWrap}>
        <ul className={`pagination justify-content-center ${styles.pagination}`}>
          <li className={`page-item ${pageNumber === 0 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(pageNumber - 1)} disabled={pageNumber === 0}>
              <i className="bi bi-chevron-left d-inline d-sm-none" />
              <span className="d-none d-sm-inline">Trước</span>
            </button>
          </li>

          {pageNumbers.map((index) => (
            <li key={index} className={`page-item ${pageNumber === index ? "active" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(index)}>
                {index + 1}
              </button>
            </li>
          ))}

          <li className={`page-item ${pageNumber >= totalPages - 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(pageNumber + 1)}
              disabled={pageNumber >= totalPages - 1}
            >
              <span className="d-none d-sm-inline">Sau</span>
              <i className="bi bi-chevron-right d-inline d-sm-none" />
            </button>
          </li>
        </ul>
        <div className={styles.pageInfo}>
          Trang {pageNumber + 1}/{Math.max(totalPages, 1)} • Tổng {safeTotalItems} đoạn
        </div>
      </nav>

      {/* Scroll to top */}
      <button
        className={styles.fab}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Lên đầu trang"
        aria-label="Lên đầu trang"
      >
        <i className="bi bi-arrow-up-circle" />
      </button>

      {/* Modal add/edit */}
      <DialogModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          setEditDialog(undefined);
          setParentForNew(null);
          fetchDialogPagesByStoryId(Number(params.storyId), pageNumber, pageSize).then((data) => {
            setDialogDetail(data.dialogs as DialogEx[]);
            setTotalItem(data.totalItem);
          });
        }}
        parentId={parentForNew}
        initialData={
          editDialog
            ? {
              id: editDialog.id,
              content: editDialog.content,
              image: editDialog.image,
              type: editDialog.type,
              characterId: editDialog.characterId ?? undefined,
              orderIndex: editDialog.orderIndex,
              voice: editDialog.voice,
              storyId: Number(params.storyId),
              parentId: (editDialog as DialogEx).parentId ?? null,
            }
            : undefined
        }
      />

      {/* Passcode modal */}
      {showPassModal && (
        <div className="modal d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className={`modal-content ${styles.panel}`}>
              <div className="modal-header">
                <h5>Nhập passcode xác nhận</h5>
              </div>
              <div className="modal-body">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Nhập passcode"
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                />
                {passError && <div className="text-danger mt-2">{passError}</div>}
              </div>
              <div className="modal-footer">
                <button
                  className="iris-btn"
                  onClick={() => {
                    setShowPassModal(false);
                    setPassInput("");
                    setPassError("");
                  }}
                >
                  Hủy
                </button>
                <button className="iris-btn iris-btn--primary" onClick={handlePassSubmit}>
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Note viewer */}
      <NoteViewModal
        open={noteOpen}
        note={
          noteData
            ? {
              id: noteData.id,
              noteName: noteData.noteName,
              noteContent: noteData.noteContent,
              storyId: noteData.storyId,
              description: noteData.description,
              image: noteData.image,
            }
            : null
        }
        onClose={() => setNoteOpen(false)}
      />

      {noteErr && <div className="text-danger mt-2">{noteErr}</div>}
    </div>
  );
}
