"use client";

import { useEffect, useState } from "react";
import styles from "./CharacterDetail.module.css"; // CSS module
import BackButton from "@/components/buttons/back-button/page";
import { Character } from "@/utils/selectedCharacterStorage";
import { useParams } from "next/navigation";
import { fetchOneCharacterById } from "@/lib/services/characterService";

type Tab = "bio" | "history" | "combat";

export default function CharacterDetailPage() {
  const [tab, setTab] = useState<Tab>("bio");
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState<Character>();
  const params = useParams();
  const characterId = Number(params.characterId);

  const loadCharacter = async () => {
    setLoading(true);
    try {
      const characterById = await fetchOneCharacterById(characterId);
      setCharacter(characterById);
    } catch {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCharacter();
  }, []);


  const tabs = [
    { key: "bio" as Tab, label: "Giới thiệu chung", icon: "bi bi-book" },
    { key: "history" as Tab, label: "Tiểu sử", icon: "bi bi-chat-dots" },
    { key: "combat" as Tab, label: "Combat", icon: "bi bi-crosshair2" },
  ];


  return (
    <div className={styles.wapper}>
      <div className={styles.page}>
        <div className="container py-4">
          <BackButton label="Quay lại" className="mb-2" />
          <div className="row g-4 align-items-start">
            {/* COL-6: Thông tin + nội dung tab */}
            <div className="col-12 col-lg-6">
              <section className={styles.panel}>
                <div className={styles.kicker}>TỔNG QUAN NHÂN VẬT</div>
                <div className={styles.tabContent}>
                  {tab === "bio" && (
                    <>
                      {/* Meta info */}
                      <div className={styles.metaGrid}>
                        <div className={styles.metaItem}>
                          <span>QUỐC GIA:</span>
                          <strong>{character?.nation}</strong>
                        </div>
                        <div className={styles.metaItem}>
                          <span>TỔ CHỨC:</span>
                          <strong>{character?.organization}</strong>
                        </div>
                        <div className={styles.metaItem}>
                          <span>TUỔI:</span>
                          <strong>{character?.age}</strong>
                        </div>
                        <div className={styles.metaItem}>
                          <span>CHIỀU CAO:</span>
                          <strong>{character?.height} M</strong>
                        </div>
                        <div className={`${styles.metaItem} ${styles.metaItemFull} ${styles.colSpanAll}`}>
                          <span>THÔNG TIN CHUNG:</span>
                          <p className={styles.text}>{character?.overview}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {tab === "history" && (
                    <>
                      <h3 className={styles.sectionTitle}>Tiểu sử nhân vật</h3>
                      <p className={styles.text}>{character?.history}</p>
                    </>
                  )}

                  {tab === "combat" && (
                    <>
                      <h3 className={styles.sectionTitle}>Combat</h3>
                      <p className={styles.text}>{character?.combatStyle}</p>
                    </>
                  )}
                </div>

                {/* Tabs mobile (ngang) */}
                <div className={`d-lg-none ${styles.tabsMobile}`}>
                  {tabs.map(t => (
                    <button
                      key={t.key}
                      className={`${styles.tabPill} ${tab === t.key ? styles.tabPillActive : ""}`}
                      onClick={() => setTab(t.key)}
                    >
                      <i className={`${t.icon} me-1`} /> {t.label}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* COL-5: Ảnh */}
            <div className="col-12 col-lg-5">
              <div className={styles.portraitPanel}>
                <img src={character?.imgFull} alt={character?.name} className={styles.portraitImg} />
              </div>
            </div>

            {/* COL-1: Nút tab dọc (desktop) */}
            <div className="col-12 col-lg-1 d-none d-lg-block">
              <aside className={styles.tabsVertical}>
                <p className={styles.tabsLabel}>THÔNG TIN</p>
                <div className={styles.tabIcons}>
                  {tabs.map(t => (
                    <button
                      key={t.key}
                      className={`${styles.tabBtn} ${tab === t.key ? styles.tabBtnActive : ""}`}
                      onClick={() => setTab(t.key)}
                      title={t.label}
                    >
                      <i className={t.icon} />
                    </button>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


}
