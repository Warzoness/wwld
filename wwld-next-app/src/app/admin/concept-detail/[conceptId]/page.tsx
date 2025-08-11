"use client";

import { useEffect, useState } from "react";
import styles from "./ConceptDetail.module.css";

type Concept = {
  title: string;
  summary: string;
  details: string[];
  main: string;        // ảnh chính mặc định
  gallery: string[];   // các ảnh phụ
};

const MOCK: Concept = {
  title: "Temple Red Pigment Study",
  summary:
    "Material and mood exploration for the eastern temple complex. Focus on warm pigments, soft ambient fog and scale contrast between structures.",
  details: [
    "Lighting test at sunrise; low-angle backlight through light fog.",
    "Material study: clay roof tiles, red mineral pigments, dust accumulation.",
    "Composition: foreground silhouette + mid-ground ridge + far mountain.",
    "Pass for NPC pathing and prop scatter (banners, bowls, tools).",
  ],
  main:
    "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/samples/landscapes/beach-forest.jpg",
  gallery: [
    "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/samples/landscapes/landscape-panorama.jpg",
    "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/samples/landscapes/nature-mountains.jpg",
    "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/samples/animals/three-dogs.jpg",
    "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/samples/food/spices.jpg",
  ],
};

export default function ConceptDetailPage() {
  const [concept] = useState<Concept>(MOCK);
  const [selected, setSelected] = useState<string>(MOCK.main);

  // Lightbox
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [drag, setDrag] = useState<{ x: number; y: number; dx: number; dy: number; active: boolean }>({
    x: 0, y: 0, dx: 0, dy: 0, active: false
  });

  const images = [concept.main, ...concept.gallery];

  const openLightbox = (i: number) => {
    setIdx(i);
    setZoom(1);
    setDrag({ x: 0, y: 0, dx: 0, dy: 0, active: false });
    setOpen(true);
  };

  const closeLightbox = () => setOpen(false);
  const next = () => setIdx((i) => (i + 1) % images.length);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "+") setZoom((z) => Math.min(3, z + 0.25));
      if (e.key === "-") setZoom((z) => Math.max(1, z - 0.25));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={styles.wapper}>
      <div className={styles.page}>
        <div className="container py-4">

          {/* Hàng trên: ảnh chính + mô tả */}
          <div className="row g-4 align-items-start">
            {/* Ảnh chính (trái) */}
            <div className="col-12 col-md-4">
              <div className={styles.mainBox}>
                <img
                  src={selected}
                  alt="Ảnh chính"
                  className={styles.mainImg}
                  onClick={() => openLightbox(0)}
                  title="Click để phóng to"
                />
              </div>
            </div>

            {/* Mô tả (phải) */}
            <div className="col-12 col-md-8">
              <div className={styles.infoBox}>
                <h1 className={styles.title}>{concept.title}</h1>
                <p className={styles.summary}>{concept.summary}</p>

                <div className={styles.rule} />

                <ul className={styles.detailList}>
                  {concept.details.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Hàng ảnh phụ */}
          <div className="row mt-4">
            <div className="col">
              <div className={styles.thumbRow}>
                {concept.gallery.map((src, i) => (
                  <button
                    key={i}
                    className={styles.thumb}
                    onClick={() => openLightbox(i + 1)} // +1 vì 0 là ảnh chính
                    onMouseEnter={() => setSelected(src)}
                  >
                    <img src={src} alt={`Ảnh phụ ${i + 1}`} />
                    <span className={styles.zoomBadge}><i className="bi bi-zoom-in" /></span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lightbox */}
        {open && (
          <div className={styles.lightbox} onClick={closeLightbox}>
            <button className={`${styles.lbBtn} ${styles.lbClose}`} onClick={closeLightbox} aria-label="Đóng">
              <i className="bi bi-x-lg" />
            </button>
            <button className={`${styles.lbBtn} ${styles.lbPrev}`} onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Trước">
              <i className="bi bi-chevron-left" />
            </button>
            <button className={`${styles.lbBtn} ${styles.lbNext}`} onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Sau">
              <i className="bi bi-chevron-right" />
            </button>

            <div
              className={styles.lbStage}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => setZoom(z => Math.max(1, Math.min(3, z + (e.deltaY < 0 ? 0.1 : -0.1))))}
              onMouseDown={(e) => setDrag(s => ({ ...s, active: true, dx: e.clientX, dy: e.clientY }))}
              onMouseMove={(e) => {
                if (!drag.active || zoom === 1) return;
                setDrag(s => ({ ...s, x: s.x + (e.clientX - s.dx), y: s.y + (e.clientY - s.dy), dx: e.clientX, dy: e.clientY }));
              }}
              onMouseUp={() => setDrag(s => ({ ...s, active: false }))}
              onMouseLeave={() => setDrag(s => ({ ...s, active: false }))}
            >
              <img
                src={images[idx]}
                alt=""
                className={styles.lbImg}
                style={{ transform: `translate(${drag.x}px, ${drag.y}px) scale(${zoom})` }}
                draggable={false}
              />
            </div>

            <div className={styles.lbControls}>
              <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(1, z - 0.25)); }}><i className="bi bi-zoom-out" /></button>
              <span>{Math.round(zoom * 100)}%</span>
              <button onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(3, z + 0.25)); }}><i className="bi bi-zoom-in" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
