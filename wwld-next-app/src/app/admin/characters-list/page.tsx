'use client';

import CharacterModal from "@/components/modals/ModalCharacter/ModalCharacter";
import { getImageUrl, PASSCODE } from "@/lib/consts/const";
import { deleteCharacter, fetchCharacters } from "@/lib/services/characterService";
import { CharacterPayload } from "@/lib/types/character";
import { Character } from "@/utils/selectedCharacterStorage";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

export default function CharacterProfileGrid() {
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filter, setFilter] = useState<"all" | "playable" | "npc">("all");
  const [query, setQuery] = useState("");                 // 🔎 tìm theo tên
  const [currentPage, setCurrentPage] = useState(1);      // 📄 phân trang
  const PAGE_SIZE = 8;

  const [editCharacter, setEditCharacter] = useState<CharacterPayload | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState("");
  const [showPassModal, setShowPassModal] = useState(false);

  type PendingAction =
    | { type: "edit"; data: Character }
    | { type: "delete"; data: number };
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const loadCharacters = async () => {
    setLoading(true);
    try {
      const charactersList = await fetchCharacters();
      setCharacters(charactersList as Character[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCharacters(); }, []);

  // helper bỏ dấu + lowercase
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  // filter theo type + query
  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return (characters ?? [])
      .filter(c =>
        filter === "all" ? true : filter === "playable" ? c.characterType === "playable" : c.characterType === "npc"
      )
      .filter(c => (q ? normalize(c.name || "").includes(q) : true));
  }, [characters, filter, query]);

  // reset về trang 1 khi filter hoặc query đổi
  useEffect(() => { setCurrentPage(1); }, [filter, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (currentPage - 1) * PAGE_SIZE;
  const paged = filtered.slice(start, start + PAGE_SIZE);

  const gotoPage = (p: number) => {
    if (p < 1 || p > pageCount) return;
    setCurrentPage(p);
    // scroll nhẹ lên đầu grid nếu muốn
    // window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    setPendingAction({ type: "delete", data: id });
    setShowPassModal(true);
  };

  const handleOpenAdd = () => {
    setEditCharacter(undefined);
    setShowModal(true);
  };

  const handleOpenEdit = (character: Character) => {
    setPendingAction({ type: "edit", data: character });
    setShowPassModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditCharacter(undefined);
  };

  const handlePassSubmit = () => {
    if (passInput !== PASSCODE) {
      setPassError("Sai passcode!");
      return;
    }
    setShowPassModal(false);
    setPassInput("");
    setPassError("");

    if (pendingAction?.type === "edit") {
      const c = pendingAction.data;
      const initialData: CharacterPayload = {
        id: c.id,
        name: c.name ?? "",
        avatar: c.avatar ?? "",
        imgFull: c.imgFull ?? "",
        birthday: c.birthday ?? "",
        sex: c.sex ?? "Nam",
        overview: c.overview ?? "",
        history: c.history ?? "",
        organization: c.organization ?? "",
        age: c.age ?? undefined,
        nation: c.nation ?? "",
        otherInformation: c.otherInformation ?? "",
        height: c.height ?? undefined,
        combatStyle: c.combatStyle ?? "",
        characterType: c.characterType ?? "playable",
        isLimited : c.isLimited ?? false
      };
      setEditCharacter(initialData);
      setShowModal(true);
    } else if (pendingAction?.type === "delete") {
      doDelete(pendingAction.data);
    }
    setPendingAction(null);
  };

  const doDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa mục này không?")) {
      await deleteCharacter(id);
      // nếu xoá hết trang hiện tại, lùi về trang trước
      await loadCharacters();
      setCurrentPage(prev => {
        const newCount = Math.max(1, Math.ceil((filtered.length - 1) / PAGE_SIZE));
        return Math.min(prev, newCount);
      });
    }
  };

  return (
    <div className="container py-5 iris-page">
      {/* Back */}
      <Link href="/admin/mainSection-manager" className="iris-ghost d-inline-flex align-items-center gap-2 mb-4">
        <i className="bi bi-arrow-left"></i> Quay lại Danh sách nội dung
      </Link>

      {/* Title */}
      <div className="text-center mb-4">
        <div className="iris-hero mx-auto">
          <h1 className="mb-0 fw-bold">Hồ Sơ Nhân Vật</h1>
        </div>
      </div>

      {/* Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="iris-toggle-group">
          <button
            className={`iris-toggle ${filter === "all" ? "is-active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Tất cả
          </button>
          <button
            className={`iris-toggle ${filter === "playable" ? "is-active" : ""}`}
            onClick={() => setFilter("playable")}
          >
            Playable
          </button>
          <button
            className={`iris-toggle ${filter === "npc" ? "is-active" : ""}`}
            onClick={() => setFilter("npc")}
          >
            NPC
          </button>
        </div>

        {/* 🔎 ô tìm kiếm theo tên */}
        <div className="d-flex align-items-center gap-2 ms-auto">
          <div className="iris-search">
            <i className="bi bi-search me-2"></i>
            <input
              type="text"
              className="form-control iris-input"
              placeholder="Tìm theo tên nhân vật…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <button className="iris-btn iris-btn--primary iris-btn--pill" onClick={handleOpenAdd}>
            + Thêm nhân vật
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <>
          {filtered.length === 0 ? (
            <div className="text-center text-muted py-5">
              Không tìm thấy nhân vật nào.
            </div>
          ) : (
            <>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {paged.map((character) => {
                  const accent = character.characterType === "playable" ? "#22c55e" : "#f59e0b";
                  const avatar = getImageUrl(character.avatar) || "/images/banner.png";

                  return (
                    <div className="col" key={character.id}>
                      <div
                        className="iris-card iris-profile-card h-100 text-center"
                        style={{ ["--iris-accent" as string]: accent }}
                      >
                        <div className="iris-avatar">
                          <img src={avatar} alt={character.name} />
                        </div>

                        <div className="iris-card__body">
                          <h5 className="iris-card__heading">{character.name}</h5>
                        </div>

                        <div className="iris-card__footer d-flex justify-content-between align-items-center">
                          <Link href={`/admin/character-detail/${character.id}`} className="iris-cta iris-cta--accent" >
                            Xem<i className="bi bi-arrow-right-short"></i>
                          </Link>
                          <div className="d-flex gap-2">
                            <button
                              className="iris-btn iris-btn--warn"
                              onClick={() => handleOpenEdit(character)}
                            >
                              Sửa
                            </button>
                            <button
                              className="iris-btn iris-btn--danger"
                              onClick={() => handleDelete(character.id)}
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
                <div className="text-muted small">
                  Trang {currentPage}/{pageCount} • Tổng {filtered.length} mục
                </div>

                <nav aria-label="Pagination">
                  <ul className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => gotoPage(1)} aria-label="Trang đầu">
                        «
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => gotoPage(currentPage - 1)} aria-label="Trang trước">
                        ‹
                      </button>
                    </li>

                    {/* hiển thị vài nút xung quanh trang hiện tại */}
                    {Array.from({ length: pageCount }).slice(
                      Math.max(0, currentPage - 3),
                      Math.min(pageCount, currentPage + 2)
                    ).map((_, i) => {
                      const p = Math.max(1, currentPage - 2) + i;
                      if (p > pageCount) return null;
                      return (
                        <li key={p} className={`page-item ${currentPage === p ? "active" : ""}`}>
                          <button className="page-link" onClick={() => gotoPage(p)}>{p}</button>
                        </li>
                      );
                    })}

                    <li className={`page-item ${currentPage === pageCount ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => gotoPage(currentPage + 1)} aria-label="Trang sau">
                        ›
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === pageCount ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => gotoPage(pageCount)} aria-label="Trang cuối">
                        »
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </>
          )}

          {/* Modal thêm/sửa */}
          <CharacterModal
            key={editCharacter?.id || "new"}
            show={showModal}
            onClose={handleCloseModal}
            onSuccess={loadCharacters}
            initialData={editCharacter}
          />

          {/* Modal passcode */}
          {showPassModal && (
            <div className="modal d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog">
                <div className="modal-content iris-panel p-0">
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
        </>
      )}
    </div>
  );
}
