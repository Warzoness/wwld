// File: app/admin/story-manager/page.tsx
"use client";

import BackButton from "@/components/buttons/back-button/page";
import StoryModal from "@/components/modals/ModalMainSection";
import { deleteMainSection, fetchMainSection } from "@/lib/services/mainSectionService";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface MainSection {
  id: number;
  name: string;
  description: string;
  image: string;
}

const PASSCODE = "123456"; // Đổi thành passcode của bạn

export default function MainSectionManage() {
  const [showModal, setShowModal] = React.useState(false);
  const [editMainSection, setEditMainSection] = React.useState<MainSection | undefined>(undefined);
  const [mainSection, setMainSections] = React.useState<MainSection[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showPassModal, setShowPassModal] = useState(false);
  type PendingAction =
    | { type: "edit"; data: MainSection }
    | { type: "delete"; data: number };

  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState("");

  const loadMainSections = async () => {
    setLoading(true);
    const data = await fetchMainSection();
    setMainSections(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMainSections();
  }, []);

  const handleDelete = (id: number) => {
    setPendingAction({ type: "delete", data: id });
    setShowPassModal(true);
  };

  const handleOpenAdd = () => {
    setEditMainSection(undefined);
    setShowModal(true);
  };

  const handleOpenEdit = (story: MainSection) => {
    setPendingAction({ type: "edit", data: story });
    setShowPassModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMainSection(undefined);
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
      setEditMainSection(pendingAction.data);
      setShowModal(true);
    } else if (pendingAction?.type === "delete") {
      // Gọi hàm xóa thật sự ở đây
      doDelete(pendingAction.data);
    }
    setPendingAction(null);
  };

  const doDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa mục này không?")) {
      await deleteMainSection(id);
      loadMainSections();
    }
  };

  return (
    <div className="container">
      {/* Quay lại */}
      <div className="mb-3">
          <BackButton label="Quay Lại" />
      </div>

      {/* Tiêu đề + nút thêm */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 fw-bold text-light">Danh sách loại nội dung chính</h1>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          + Thêm mới mục
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3">Đang tải...</p>
        </div>
      ) : (
        <div className="row g-4">
          {mainSection.map(mainSection => {
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
                {(() => {
                  // Đổi màu nhấn theo từng section (tuỳ bạn tinh chỉnh)
                  const accent =
                    mainSection.name === "Hồ sơ nhân vật" ? "#22d3ee" :
                      mainSection.name === "Khái niệm Thế giới" ? "#f43f5e" :
                        "#a78bfa";

                  const img = imageUrl || "/images/banner.png";

                  return (
                    <div className="iris-card h-100" style={{ ["--iris-accent" as any]: accent }}>
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
                                  ? "/admin/characters-list"
                                  : mainSection.name === "Khái niệm Thế giới"
                                    ? "/admin/concept-list"
                                    : `/admin/story-list/${mainSection.id}`,
                              query:
                                mainSection.name === "Hồ sơ nhân vật" || mainSection.name === "Khái niệm Thế giới"
                                  ? undefined
                                  : { mainSectionName: mainSection.name }
                            }}
                          >
                            Xem chi tiết <i className="bi bi-arrow-right-short"></i>
                          </Link>

                          <div className="d-flex gap-2">
                            <button className="iris-btn iris-btn--warn" onClick={() => handleOpenEdit(mainSection)}>
                              Sửa
                            </button>
                            <button className="iris-btn iris-btn--danger" onClick={() => handleDelete(mainSection.id)}>
                              Xóa
                            </button>
                          </div>
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

      {/* Modal */}
      <StoryModal
        key={editMainSection?.id || "new"}
        show={showModal}
        onClose={handleCloseModal}
        onSuccess={loadMainSections}
        initialData={editMainSection}
      />

      {/* Passcode Modal */}
      {showPassModal && (
        <div className="modal d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content rounded-3 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title">Nhập passcode xác nhận</h5>
              </div>
              <div className="modal-body">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Nhập passcode"
                  value={passInput}
                  onChange={e => setPassInput(e.target.value)}
                />
                {passError && <div className="text-danger mt-2">{passError}</div>}
              </div>
              <div className="modal-footer border-0">
                <button
                  className="btn btn-outline-secondary"
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
  );

}
