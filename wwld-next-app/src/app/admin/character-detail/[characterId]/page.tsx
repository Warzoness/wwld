"use client";

import { useState } from "react";
import styles from "./CharacterDetail.module.css"; // CSS module
import Link from "next/link";
import BackButton from "@/components/buttons/back-button/page";

type Tab = "bio" | "dialogue" | "combat";

export default function CharacterDetailPage() {
  const [tab, setTab] = useState<Tab>("bio");

  // TODO: thay bằng dữ liệu thật
  const character = {
    name: "Yangyang",
    overview:
      "Yangyang journeyed far away from home to become an Outrider in Jinzhou. Instead of seeking the spotlight, she chooses to provide comfort through quiet companionship for others. After enduring hardships and anguish, she has found a clear purpose: to be a beacon of guidance and an aiding presence in a world still in need of healing.",
    nation: "HuangLong",
    org: "Đội gác đêm",
    age: "17",
    height: "1.65m",
    portrait: "/images/Yangyang_Card.webp",
    biography:
      "Sinh ra ở vùng biên của HuangLong, Yangyang rời quê từ rất sớm để trở thành Outrider tại Jinzhou. Cô điềm tĩnh, luôn hỗ trợ đồng đội và giữ vững lý tưởng dù trải qua nhiều biến cố.",
    dialogues: [
      "Mọi người ổn cả chứ?",
      "Mình ở đây rồi, đừng lo.",
      "Đường còn dài, đi chậm thôi cũng được.",
    ],
    combat: {
      style:
        "Hỗ trợ – kiểm soát đám đông, bảo kê đồng đội, tạo khoảng trống giao tranh.",
      skills: [
        { name: "Wind Whistle", note: "Hút kẻ địch vào một điểm." },
        { name: "Breeze Guard", note: "Tạo lá chắn gió cho đồng đội." },
        { name: "Zephyr Burst (Ultimate)", note: "Hất tung diện rộng." },
      ],
    },
  };

  const tabs = [
    { key: "bio" as Tab, label: "Tiểu sử", icon: "bi bi-book" },
    { key: "dialogue" as Tab, label: "Thoại", icon: "bi bi-chat-dots" },
    { key: "combat" as Tab, label: "Combat", icon: "bi bi-crosshair2" },
  ];

  const handleEditInfo = () => {
    // TODO: mở modal chỉnh sửa info
    alert("Mở modal sửa thông tin");
  };

  return (
  <div className={styles.page}>
    <div className="container py-4">
      <BackButton label="Quay lại" className="mb-2" />
      <div className="row g-4 align-items-start">
        {/* COL-6: Thông tin + nội dung tab */}
        <div className="col-12 col-lg-6">
          <section className={styles.panel}>
            <div className={styles.kicker}>TỔNG QUAN NHÂN VẬT</div>

            <div className="d-flex align-items-center justify-content-between gap-2">
              <h1 className={styles.title}>{character.name}</h1>
              <button className={`btn ${styles.editBtn}`} onClick={handleEditInfo}>
                <i className="bi bi-pencil-square me-2" />
                Sửa thông tin
              </button>
            </div>

            {/* Giới thiệu tổng quan (chỉ 1 lần) */}
            <div className={styles.overview}>
              <p>{character.overview}</p>
              <div className={styles.metaGrid}>
                <div className={styles.metaItem}><span>QUỐC GIA:</span><strong>{character.nation}</strong></div>
                <div className={styles.metaItem}><span>TỔ CHỨC:</span><strong>{character.org}</strong></div>
                <div className={styles.metaItem}><span>TUỔI:</span><strong>{character.age}</strong></div>
                <div className={styles.metaItem}><span>CHIỀU CAO:</span><strong>{character.height}</strong></div>
              </div>
            </div>

            {/* Nội dung TAB */}
            <div className={styles.tabContent}>
              {tab === "bio" && (<><h3 className={styles.sectionTitle}>Tiểu sử</h3><p className={styles.text}>{character.biography}</p></>)}
              {tab === "dialogue" && (<><h3 className={styles.sectionTitle}>Thoại tiêu biểu</h3><ul className={styles.list}>{character.dialogues.map((d,i)=><li key={i}>{d}</li>)}</ul></>)}
              {tab === "combat" && (
                <>
                  <h3 className={styles.sectionTitle}>Combat</h3>
                  <p className={styles.text}>{character.combat.style}</p>
                  <div className={styles.skillGrid}>
                    {character.combat.skills.map(s=>(
                      <div key={s.name} className={styles.skillCard}>
                        <div className={styles.skillName}>{s.name}</div>
                        <div className={styles.skillNote}>{s.note}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Tabs mobile (ngang) */}
            <div className={`d-lg-none ${styles.tabsMobile}`}>
              {tabs.map(t=>(
                <button
                  key={t.key}
                  className={`${styles.tabPill} ${tab===t.key?styles.tabPillActive:""}`}
                  onClick={()=>setTab(t.key)}
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
            <img src={character.portrait} alt={character.name} className={styles.portraitImg}/>
          </div>
        </div>

        {/* COL-1: Nút tab dọc (desktop) */}
        <div className="col-12 col-lg-1 d-none d-lg-block">
          <aside className={styles.tabsVertical}>
            <p className={styles.tabsLabel}>THÔNG TIN</p>
            <div className={styles.tabIcons}>
              {tabs.map(t=>(
                <button
                  key={t.key}
                  className={`${styles.tabBtn} ${tab===t.key?styles.tabBtnActive:""}`}
                  onClick={()=>setTab(t.key)}
                  title={t.label}
                >
                  <i className={t.icon}/>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
);


}
