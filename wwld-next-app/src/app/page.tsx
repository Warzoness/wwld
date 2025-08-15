"use client";

import Banner from "@/components/Banner";
import Header from "@/components/Header";
import { backendUrl } from "@/lib/consts/const";
import { fetchMainSection } from "@/lib/services/mainSectionService";
import { MainSection } from "@/lib/types/mainSection";
import Link from "next/link";
import React, { useEffect } from "react";



export default function HomePage() {
  const [mainSection, setMainSections] = React.useState<MainSection[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadMainSections = async () => {
    setLoading(true);
    const data = await fetchMainSection();
    setMainSections(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMainSections();
  }, []);


  return (
    <div className="container">
      <Header />
      <Banner />

      {/* Loading */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3">Đang tải...</p>
        </div>
      ) : (
        <div className="row g-4">
          {mainSection.map(mainSection => {
            let imageUrl = "";
            if (mainSection.image) {
              if (mainSection.image.startsWith("http")) {
                imageUrl = mainSection.image;
              } else if (mainSection.image.startsWith("/uploads/")) {
                imageUrl = backendUrl + mainSection.image;
              } else {
                imageUrl = backendUrl + `/uploads/${mainSection.image.replace(/^\/?uploads\//, "")}`;
              }
            }

            return (
              <div className="col-md-4 col-sm-6" key={mainSection.id}>
                {(() => {
                  // Đổi màu nhấn theo từng section (tuỳ bạn tinh chỉnh)
                  const accent =
                    mainSection.name === "Hồ sơ nhân vật" ? "#22d3ee" :
                      mainSection.name === "Khái niệm Thế giới" ? "#f43f5e" :
                        "#a78bfa";

                  const img = imageUrl || "/images/banner.png";

                  return (
                    <div className="iris-card h-100" style={{ ["--iris-accent" as string]: accent }}>
                      {img && (
                        <div className="iris-card__media" style={{ height: 200 }}>
                          <img src={img} alt={mainSection.name} className="iris-card__img" />
                        </div>
                      )}

                      <div className="iris-card__body">
                        <div className="iris-card__title">
                          <span className="iris-glyph">
                            <i className="bi bi-grid-1x2"></i>
                          </span>
                          <h5 className="iris-card__heading">{mainSection.name}</h5>
                        </div>

                        <p className="iris-card__text">
                          {mainSection.description}
                        </p>

                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <Link
                            className="iris-cta"
                            href={{
                              pathname:
                                mainSection.name === "Hồ sơ nhân vật"
                                  ? "/user/character-list"
                                  : mainSection.name === "Khái niệm Thế giới"
                                    ? "/user/concept-list"
                                    : mainSection.name === "Các mảnh ghi chú"
                                      ? "/user/note-list"
                                      : `/user/story-list/${mainSection.id}`,
                              query:
                                ["Hồ sơ nhân vật", "Khái niệm Thế giới", "Các mảnh ghi chú"].includes(mainSection.name)
                                  ? undefined
                                  : { mainSectionName: mainSection.name }
                            }}
                          >
                            Xem chi tiết <i className="bi bi-arrow-right-short"></i>
                          </Link>

                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

            );
          })}
        </div>
      )}

    </div>
  );

}
