"use client";



import { useEffect, useState } from "react";
import { fetchMainSection } from "@/lib/services/mainSectionService";
import '@/style/global.css';
import Banner from "@/components/Banner";
import Link from "next/link";

interface MainSection {
  id: number;
  name: string;
  description: string;
  image: string;
}

export default function HomePage() {
  const [mainSections, setMainSections] = useState<MainSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMainSection();
        setMainSections(data);
      } catch (e) {
        setMainSections([]);
      }
      setLoading(false);
    };
    load();
  }, []);

  // // const backendUrl = "http://localhost:8080";
  const backendUrl = "https://wwld-production.up.railway.app";

  return (

    <div className="container body-content">
      <Banner />
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3">Đang tải...</p>
        </div>
      ) : (
        <div className="row g-4">
          {mainSections.map(mainSection => {
            // Xử lý ảnh
            // const backendUrl = "http://localhost:8080";
            const backendUrl = "https://wwld-production.up.railway.app";
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
                <div className="iris-card">
                  {imageUrl && (
                    <div className="iris-card__media">
                      <img
                        src={imageUrl}
                        alt={mainSection.name}
                        className="iris-card__img"
                      />
                    </div>
                  )}

                  <div className="iris-card__body">
                    <div className="iris-card__title">
                      <span className="iris-glyph">
                        <i className="bi bi-activity"></i>
                      </span>
                      <h5 className="iris-card__heading">{mainSection.name}</h5>
                    </div>

                    <p className="iris-card__text">
                      {mainSection.description}
                    </p>

                    <Link
                      className="iris-cta"
                      href={{
                        pathname:
                          mainSection.name === "Hồ sơ nhân vật"
                            ? "/admin/characters-list"
                            : mainSection.name === "Khái niệm Thế giới"
                              ? "/admin/concept-list"
                              : `/user/story-list/${mainSection.id}`,
                        query:
                          mainSection.name === "Hồ sơ nhân vật" || mainSection.name === "Khái niệm Thế giới"
                            ? undefined
                            : { mainSectionName: mainSection.name },
                      }}
                    >
                      Chi tiết <i className="bi bi-arrow-right-short"></i>
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
