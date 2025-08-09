// File: app/admin/story-manager/page.tsx
"use client";

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
        <Link href="/admin/dashboard" className="btn btn-outline-secondary">
          ← Quay lại Dashboard
        </Link>
      </div>

      {/* Tiêu đề + nút thêm */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0 fw-bold">Danh sách loại nội dung chính</h1>
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
                <div className="card shadow-sm h-100 border-0 rounded-3 overflow-hidden">
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
                                : `/admin/story-list/${mainSection.id}`,
                          query:
                            mainSection.name === "Hồ sơ nhân vật" || mainSection.name === "Khái niệm Thế giới"
                              ? undefined
                              : { mainSectionName: mainSection.name }
                        }}
                      >
                        Xem chi tiết
                      </Link>

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleOpenEdit(mainSection)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(mainSection.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
