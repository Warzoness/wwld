"use client";

import { useEffect, useState } from "react";
import styles from "@/app/admin/concept-detail/[conceptId]/ConceptDetail.module.css";
import { useParams } from "next/navigation";
import { fetchOneConceptById } from "@/lib/services/conceptService";
import { Concept, ConceptPayload } from "@/lib/types/concept";
import BackButton from "@/components/buttons/back-button/page";


export default function ConceptDetailPage() {
  const [concept, setConcept] = useState<Concept | undefined>(undefined);

  // Lightbox (only main image)
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [drag, setDrag] = useState<{ x: number; y: number; dx: number; dy: number; active: boolean }>({
    x: 0, y: 0, dx: 0, dy: 0, active: false
  });

  const params = useParams();
  const conceptId = Number(params.conceptId);

  const conceptReq: ConceptPayload = {
    id: conceptId,
    slug: "",
    conceptImage: "",
    title: "",
    contentMd: "",
    description: ""
  };

  const loadConcept = async () => {
    setLoading(true);
    try {
      const conceptById = await fetchOneConceptById(conceptReq);
      setConcept(conceptById);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConcept();
    // nếu conceptId có thể thay đổi theo route:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conceptId]);

  const openLightbox = () => {
    if (!concept?.conceptImage) return;
    setZoom(1);
    setDrag({ x: 0, y: 0, dx: 0, dy: 0, active: false });
    setOpen(true);
    // khóa scroll nền (optional)
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setOpen(false);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") closeLightbox();
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
        <BackButton label="Quay lại" />
          {/* Hàng trên: ảnh chính + mô tả */}
          <div className="row g-4 align-items-start">
            {/* Ảnh chính (trái) */}
            <div className="col-12 col-md-4">
              <div className={styles.mainBox}>
                {concept?.conceptImage ? (
                  <img
                    src={concept.conceptImage}
                    alt={concept?.title || "Ảnh chính"}
                    className={styles.mainImg}
                    onClick={openLightbox}
                    title="Click để phóng to"
                  />
                ) : (
                  !loading && <div className={styles.placeholder}>Không có ảnh</div>
                )}
              </div>
            </div>

            {/* Mô tả (phải) */}
            <div className="col-12 col-md-8">
              <div className={styles.infoBox}>
                <h1 className={styles.title}>{concept?.title}</h1>
                <p className={styles.summary}>{concept?.description}</p>

                <div className={styles.rule} />

                <ul className={styles.detailList}>
                  <p>{concept?.contentMd}</p>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Lightbox chỉ cho ảnh chính */}
        {open && (
          <div className={styles.lightbox} onClick={closeLightbox}>
            <button
              className={`${styles.lbBtn} ${styles.lbClose}`}
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              aria-label="Đóng"
            >
              <i className="bi bi-x-lg" />
            </button>

            <div
              className={styles.lbStage}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) =>
                setZoom((z) => Math.max(1, Math.min(3, z + (e.deltaY < 0 ? 0.1 : -0.1))))
              }
              onMouseDown={(e) =>
                setDrag((s) => ({ ...s, active: true, dx: e.clientX, dy: e.clientY }))
              }
              onMouseMove={(e) => {
                if (!drag.active || zoom === 1) return;
                setDrag((s) => ({
                  ...s,
                  x: s.x + (e.clientX - s.dx),
                  y: s.y + (e.clientY - s.dy),
                  dx: e.clientX,
                  dy: e.clientY
                }));
              }}
              onMouseUp={() => setDrag((s) => ({ ...s, active: false }))}
              onMouseLeave={() => setDrag((s) => ({ ...s, active: false }))}
            >
              <img
                src={concept?.conceptImage}
                alt={concept?.title || ""}
                className={styles.lbImg}
                style={{ transform: `translate(${drag.x}px, ${drag.y}px) scale(${zoom})` }}
                draggable={false}
              />
            </div>

            <div className={styles.lbControls} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setZoom((z) => Math.max(1, z - 0.25))}>
                <i className="bi bi-zoom-out" />
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom((z) => Math.min(3, z + 0.25))}>
                <i className="bi bi-zoom-in" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
