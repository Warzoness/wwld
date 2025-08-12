'use client';

import BackButton from "@/components/buttons/back-button/page";
import { fetchCharacters } from "@/lib/services/characterService";
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

const backendUrl = "https://wwld-production.up.railway.app";

export default function CharacterProfileGrid() {
    const [loading, setLoading] = useState(true);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [filter, setFilter] = useState<"all" | "playable" | "npc">("all");

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

    const getImageUrl = (image?: string) => {
        if (!image) return "";
        if (image.startsWith("http")) return image;
        if (image.startsWith("/uploads/")) return backendUrl + image;
        return backendUrl + `/uploads/${image.replace(/^\/?uploads\//, "")}`;
    };

    return (
        <div className="container py-5 iris-page">
            {/* Back */}
            <BackButton label="Quay lại" />

            {/* Title */}
            <div className="text-center mb-4">
                <div className="iris-hero mx-auto">
                    <h1 className="mb-0 fw-bold">Danh sách nhân vật</h1>
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
                                        style={{ ["--iris-accent" as string]: accent }}
                                    >
                                        <div className="iris-avatar">
                                            <img src={avatar} alt={character.name} />
                                        </div>

                                        <div className="iris-card__body">
                                            <h5 className="iris-card__heading">{character.name}</h5>
                                            {/* <p className="iris-card__text line-clamp-3 small">{desc}</p> */}
                                        </div>

                                        <div className="iris-card__footer d-flex justify-content-center align-items-center">
                                            <Link href={`/user/character-detail/${character.id}`} className="iris-cta iris-cta--accent" >
                                                Xem<i className="bi bi-arrow-right-short"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}
