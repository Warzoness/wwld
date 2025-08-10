'use client';

import CharacterModal from "@/components/modals/ModalCharacter";
import { deleteCharacter, fetchCharacters } from "@/lib/services/characterService";
import type { CharacterPayload } from "@/lib/services/characterService";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Character = {
  id: number;
  name: string;
  avatar?: string;
  imgFull?: string;
  birthday?: string; // ISO date string
  sex?: "Nam" | "Nữ" | "Khác";
  overview?: string;
  history?: string;
  organization?: string;
  age?: number;
  nation?: string;
  otherInformation?: string;
  height?: number;
  combatStyle?: string;
  // các ID có thể có hoặc không, nhưng không cần nhập ở modal
  mainQuestId?: number;
  sideQuestId?: number;
  eventQuestId?: number;
  areaId?: number;
  memeId?: number;
  type?: "playable" | "npc";
};

const PASSCODE = "1";
const backendUrl = "https://wwld-production.up.railway.app";

export default function CharacterProfileGrid() {
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filter, setFilter] = useState<"all" | "playable" | "npc">("all");
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

  useEffect(() => {
    loadCharacters();
  }, []);

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

      // Chuẩn hoá dữ liệu sang CharacterPayload cho Modal (khớp service/schema mới)
      const initialData: CharacterPayload = {
        id: c.id,
        name: c.name ?? "",
        avatar: c.avatar ?? "",
        imgFull: c.imgFull ?? "",
        birthday: c.birthday ?? "", // dạng YYYY-MM-DD hoặc ISO, Modal/service sẽ chuẩn hoá
        sex: (c.sex as any) ?? "Nam",
        overview: c.overview ?? "",
        history: c.history ?? "",
        organization: c.organization ?? "",
        age: c.age ?? undefined,
        nation: c.nation ?? "",
        otherInformation: c.otherInformation ?? "",
        height: c.height ?? undefined,
        combatStyle: c.combatStyle ?? "",
        // các ID không cần nhập → để undefined
        type: (c.type as any) ?? "playable",
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
      loadCharacters();
    }
  };

  const getImageUrl = (image?: string) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    if (image.startsWith("/uploads/")) return backendUrl + image;
    return backendUrl + `/uploads/${image.replace(/^\/?uploads\//, "")}`;
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

        <button className="iris-btn iris-btn--primary iris-btn--pill" onClick={handleOpenAdd}>
          + Thêm nhân vật
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {characters
            .filter((c) =>
              filter === "all"
                ? true
                : filter === "playable"
                ? c.type === "playable"
                : c.type === "npc"
            )
            .map((character) => {
              const accent = character.type === "playable" ? "#22c55e" : "#f59e0b";
              const avatar = getImageUrl(character.avatar) || "/images/banner.png";
              const desc =
                character.overview ||
                character.organization ||
                character.combatStyle ||
                character.history ||
                character.nation ||
                "";

              return (
                <div className="col" key={character.id}>
                  <div
                    className="iris-card iris-profile-card h-100 text-center"
                    style={{ ["--iris-accent" as any]: accent }}
                  >
                    <div className="iris-avatar">
                      <img src={avatar} alt={character.name} />
                    </div>

                    <div className="iris-card__body">
                      <h5 className="iris-card__heading">{character.name}</h5>
                      <p className="iris-card__text line-clamp-3 small">{desc}</p>
                    </div>

                    <div className="iris-card__footer d-flex justify-content-between align-items-center">
                      <Link href={`/admin/character/${character.id}`} className="iris-cta iris-cta--accent">
                        Xem <i className="bi bi-arrow-right-short"></i>
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
        </div>
      )}
    </div>
  );
}
