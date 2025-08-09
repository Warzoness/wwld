'use client';

import CharacterModal from "@/components/modals/ModalCharacter";
import { deleteCharacter, fetchCharacters } from "@/lib/services/characterService";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Character {
    id: number;
    name: string;
    avatar: string;
    imgFull: string;
    birthday: string; // ISO date string
    sex: string;
    information: string;
    mainQuestId: number;
    sideQuestId: number;
    eventQuestId: number;
    areaId: number;
    memeId: number;
    type: string; // 
}

const PASSCODE = "1";


export default function CharacterProfileGrid() {

    const [loading, setLoading] = React.useState(true);
    const [characters, setCharacters] = React.useState<Character[]>([]);
    const [filter, setFilter] = React.useState<"all" | "playable" | "npc">("all");
    const [editCharacter, setEditCharacter] = React.useState<Character | undefined>(undefined);

    const [showModal, setShowModal] = React.useState(false);
    const [passInput, setPassInput] = useState("");
    const [passError, setPassError] = useState("");
    const [showPassModal, setShowPassModal] = useState(false);
    type PendingAction =
  | { type: "edit"; data: Character }
  | { type: "delete"; data: number };

const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
    const loadCharacters = async () => {
        setLoading(true);
        const charactersList = await fetchCharacters();
        setCharacters(charactersList);
        setLoading(false);
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
        console.log("handleOpenEdit", character);
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
            setEditCharacter(pendingAction.data);
            setShowModal(true);
        } else if (pendingAction?.type === "delete") {
            // Gọi hàm xóa thật sự ở đây
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

    const backendUrl = "http://localhost:8080";
    const getImageUrl = (image: string) => {
        if (!image) return "";
        if (image.startsWith("http")) return image;
        if (image.startsWith("/uploads/")) return backendUrl + image;
        return backendUrl + `/uploads/${image.replace(/^\/?uploads\//, "")}`;
    };





    return (
        <div className="container py-5">
            <Link href="/admin/mainSection-manager" className="btn btn-outline-secondary mb-4">
                ← Quay lại Danh sách nội dung
            </Link>
            <h1 className="text-center mb-5 fw-bold">Hồ Sơ Nhân Vật</h1>

            {/* Thanh điều khiển */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <button
                        className={`btn btn-sm me-2 ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setFilter("all")}
                    >
                        Tất cả
                    </button>
                    <button
                        className={`btn btn-sm me-2 ${filter === "playable" ? "btn-success" : "btn-outline-success"}`}
                        onClick={() => setFilter("playable")}
                    >
                        Playable
                    </button>
                    <button
                        className={`btn btn-sm ${filter === "npc" ? "btn-warning" : "btn-outline-warning"}`}
                        onClick={() => setFilter("npc")}
                    >
                        NPC
                    </button>
                </div>
                <button className="btn btn-sm btn-primary" onClick={handleOpenAdd}>
                    + Thêm nhân vật
                </button>
            </div>

            {/* Danh sách nhân vật */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-4">
                {characters
                    .filter(c =>
                        filter === "all"
                            ? true
                            : filter === "playable"
                                ? c.type === "playable"
                                : c.type === "npc"
                    )
                    .map(character => (
                        <div className="col" key={character.id}>
                            <div className="card border-0 shadow-sm h-100 text-center profile-card">
                                <div className="profile-img-wrapper">
                                    <img
                                        src={getImageUrl(character.avatar) || "/images/banner.png"} // fallback ảnh
                                        alt={character.name}
                                        className="card-img-top rounded-circle profile-img"
                                    />
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title fw-semibold">{character.name}</h5>
                                    <p className="card-text text-muted small">{character.information}</p>
                                </div>
                                <div className="card-footer bg-white border-0 d-flex justify-content-between">
                                    <Link href={`/character/${character.id}`} className="btn btn-sm btn-outline-primary">
                                        Xem
                                    </Link>
                                    <div>
                                        <button
                                            className="btn btn-sm btn-outline-warning me-1"
                                            onClick={() => handleOpenEdit(character)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(character.id)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                <CharacterModal
                    key={editCharacter?.id || "new"}
                    show={showModal}
                    onClose={handleCloseModal}
                    onSuccess={loadCharacters}
                    initialData={editCharacter}
                />

                {/* Modal xác nhận passcode */}
                {showPassModal && (
                    <div className="modal d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
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
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowPassModal(false);
                                            setPassInput("");
                                            setPassError("");
                                        }}
                                    >
                                        Hủy
                                    </button>
                                    <button className="btn btn-primary" onClick={handlePassSubmit}>
                                        Xác nhận
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* CSS custom */}
            <style jsx>{`
      .profile-img-wrapper {
        overflow: hidden;
        border-radius: 50%;
        width: 120px;
        height: 120px;
        margin: 20px auto 10px;
      }
      .profile-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
      }
      .profile-card:hover .profile-img {
        transform: rotateY(10deg) scale(1.05);
      }
      .profile-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .profile-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
      }
    `}</style>
        </div>
    );

}
