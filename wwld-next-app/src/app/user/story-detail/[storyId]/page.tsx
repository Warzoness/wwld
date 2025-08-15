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
import styles from "@/app/admin/story-detail/[storyId]/StoryDetailPage.module.css"; // <-- CSS module mới

interface NoteDataDTO {
  id: number;
  noteName: string;
  noteContent: string;
  storyId: number;
  description: string;
  image: string;
}

type DialogEx = Dialog & { parentId?: number | null };
type DialogNode = DialogEx & { children: DialogNode[] };

export default function StoryDetailPage() {
  const params = useParams();
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogDetail, setDialogDetail] = useState<DialogEx[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editDialog, setEditDialog] = useState<Dialog | undefined>(undefined);


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
  // ===== Load data =====
  useEffect(() => {
    const storyData = sessionStorage.getItem("storyData");
    if (storyData) setStoryData(JSON.parse(storyData));
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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPageNumber(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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

  // ===== Collapse state để “dễ đọc” =====
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());
  const toggleCollapse = (id: number) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const collapseAll = () => {
    const allIds = new Set<number>();
    const walk = (nodes: DialogNode[]) => {
      nodes.forEach(n => {
        if (n.children.length) allIds.add(n.id);
        walk(n.children);
      });
    };
    walk(tree);
    setCollapsed(allIds);
  };
  const expandAll = () => setCollapsed(new Set());


  // ===== Helpers hiển thị =====
  const chipColor = (n: DialogNode) =>
    n.type === 1 ? styles.chipLine
      : n.type === 2 ? styles.chipNarr
        : n.type === 3 ? styles.chipSys
          : styles.chipImg;

  const bubbleClass = (n: DialogNode) =>
    n.type === 1 ? styles.bubbleLine
      : n.type === 2 ? styles.bubbleNarr
        : n.type === 3 ? styles.bubbleSys
          : styles.bubbleImg;

  const displayName = (n: DialogNode) =>
    n.type === 2
      ? "Rover"
      : n.characterId
        ? n.characterName
        : n.noNameCharacter || "????";

  // ===== Node renderer (có gấp/mở) =====
  const Node = ({ node, level }: { node: DialogNode; level: number }) => {
    const hasChildren = node.children.length > 0;
    const isCollapsed = collapsed.has(node.id);
    const indentStyle = { marginLeft: `${level * 20}px` };

    if (node.type === 0) {
      // Media node
      return (
        <div className={`${styles.node} ${styles.mediaNode}`} style={indentStyle}>
          <div className={styles.treeGuide} aria-hidden />
          <div className={styles.mediaCard}>
            <div className={styles.mediaHeader}>
              {hasChildren && (
                <button
                  className={styles.toggle}
                  onClick={() => toggleCollapse(node.id)}
                  title={isCollapsed ? "Mở nhánh" : "Gấp nhánh"}
                >
                  {isCollapsed ? <i className="bi bi-caret-right-fill" /> : <i className="bi bi-caret-down-fill" />}
                </button>
              )}
              <span className={`${styles.chip} ${chipColor(node)}`}>
                <i className="bi bi-image" /> Hình ảnh
              </span>
              {hasChildren && <span className={styles.count}>{node.children.length}</span>}
              <div className={styles.spacer} />
            </div>

            {!isCollapsed && (
              <div className={styles.mediaBody}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getImageUrl(node.image) || "/default-image.png"} alt="Dialog Image" />
              </div>
            )}
          </div>

          {/* children */}
          {!isCollapsed && node.children.length > 0 && node.children.map(c => (
            <Node key={c.id} node={c} level={level + 1} />
          ))}
        </div>
      );
    }

    // Textual node
    const isSys = node.type === 3;

    return (
      <div className={styles.node} style={indentStyle}>
        <div className={styles.treeGuide} aria-hidden />
        <div className={`${styles.row} ${isSys ? styles.rowSys : ""}`}>
          <div className={styles.rowHead}>
            {hasChildren && (
              <button
                className={styles.toggle}
                onClick={() => toggleCollapse(node.id)}
                title={isCollapsed ? "Mở nhánh" : "Gấp nhánh"}
              >
                {isCollapsed ? <i className="bi bi-caret-right-fill" /> : <i className="bi bi-caret-down-fill" />}
              </button>
            )}
            {!isSys && (
              <span className={`${styles.chip} ${chipColor(node)}`} title={displayName(node) || ""}>
                <i className="bi bi-person" />
                <span className={styles.chipText}>{displayName(node)}</span>
              </span>
            )}
            {hasChildren && <span className={styles.count}>{node.children.length}</span>}
            <div className={styles.spacer} />
          </div>

          {!isCollapsed && (
            <div className={`${styles.bubble} ${bubbleClass(node)} ${isSys ? styles.centerText : ""}`}>
              <MentionHighlighter text={node.content} onNoteOpen={handleOpenNote} />
            </div>
          )}
        </div>

        {/* children */}
        {!isCollapsed && node.children.length > 0 && node.children.map(c => (
          <Node key={c.id} node={c} level={level + 1} />
        ))}
      </div>
    );
  };

  return (
    <div className={`container py-4 ${styles.page}`}>
      {/* Top actions */}
      <div className={styles.topbar}>
        <button className="iris-ghost" onClick={() => window.history.back()}>
          <i className="bi bi-arrow-left" /> Quay lại
        </button>
        <div className={styles.topbarRight}>
          <button className="iris-btn" onClick={expandAll} title="Mở tất cả nhánh">
            <i className="bi bi-arrows-expand" /> Expand all
          </button>
          <button className="iris-btn" onClick={collapseAll} title="Gấp tất cả nhánh">
            <i className="bi bi-arrows-collapse" /> Collapse all
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
            <div className={styles.tree}>
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
        className={`${styles.fab}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Lên đầu trang"
        aria-label="Lên đầu trang"
      >
        <i className="bi bi-arrow-up-circle" />
      </button>

      {noteErr && <div className="text-danger mt-2">{noteErr}</div>}
    </div>
  );
}
