"use client";



import HeroOption1 from "@/components/Hero-Option-1";
import { useEffect, useState } from "react";
import { fetchMainSection } from "@/lib/services/mainSectionService";
import '@/style/global.css';
import Banner from "@/components/Banner";
import Link from "next/link";
import Header from "@/components/Header";

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

  const backendUrl = "http://localhost:8080";

  return (
  
    <div className="container mt-4">
      <Header />
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
            const backendUrl = "http://localhost:8080";
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
                <div className="card shadow-sm h-100 border-0 rounded-3 overflow-hidden bg-light">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={mainSection.name}
                      className="card-img-top"
                      style={{
                        objectFit: "cover",
                        height: 200
                      }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-semibold">{mainSection.name}</h5>
                    <p className="card-text text-muted" style={{ flexGrow: 1 }}>
                      {mainSection.description}
                    </p>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <Link
                        className="btn btn-sm btn-outline-info"
                        href={{
                          pathname:
                            mainSection.name === "Hồ sơ nhân vật"
                              ? "/admin/characters-list"
                              : mainSection.name === "Khái niệm Thế giới"
                                ? "/admin/world-building"
                                : `/user/story-list/${mainSection.id}`,
                          query:
                            mainSection.name === "Hồ sơ nhân vật" || mainSection.name === "Khái niệm Thế giới"
                              ? undefined
                              : { mainSectionName: mainSection.name }
                        }}
                      >
                        Xem chi tiết
                      </Link>
                    </div>
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
