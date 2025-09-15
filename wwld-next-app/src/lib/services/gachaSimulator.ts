import { apiClient } from "../apiClient";


export type BannerType = "CHARACTER" | "WEAPON";

// Interface payload
type BannerPayLoad = {
    id?: number; // update cần id
    bannerName: string;
    bannerType: BannerType;
    startAt: string;      // PHẢI là string
    endAt?: string;       // optional string
    rateup5starId: number;
    rateup4starIds: string; // csv
  };

// Tạo mới
export const addBanner = async (payload: BannerPayLoad) => {
  try {
    const response = await apiClient.post("/api/bannerRateUp/insert", payload);
    return response.data;
  } catch (error) {
    console.error("Error adding main section:", error);
    throw error;
  }
};

// Lấy danh sách
export const fetchBanners = async () => {
  try {
    const request = {
      clientTime: new Date().toISOString()
    };
    const response = await apiClient.post("/api/bannerRateUp/getBanners", request);
    return response.data.bannerRateUpDTOS;
  } catch (error) {
    console.error("Error fetching banners:", error);
    throw error;
  }
};

// Lấy danh sách
export const fetchOneBanner = async (payload : BannerPayLoad) => {
  try {
    const response = await apiClient.post("/api/bannerRateUp/getBannerById", payload);
    return response.data.bannerRateUpDTO;
  } catch (error) {
    console.error("Error fetching banners:", error);
    throw error;
  }
};

// Sửa
export const updateBanner = async (payload: BannerPayLoad) => {
  try {
    const response = await apiClient.post("/api/bannerRateUp/update", payload);
    return response.data;
  } catch (error) {
    console.error("Error updating banner:", error);
    throw error;
  }
};

// Xóa
export const deleteBanner = async (payload: BannerPayLoad) => {
  try {
    const response = await apiClient.post("/api/bannerRateUp/delete",  payload );
    return response.data;
  } catch (error) {
    console.error("Error deleting banner:", error);
    throw error;
  }
};
