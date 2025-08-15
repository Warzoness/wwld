import { apiClient } from "../apiClient";


// Interface payload
export interface MainSectionPayload {
  id?: number; // cần khi sửa hoặc xóa
  name: string;
  description: string;
  image : string;
}

// Tạo mới
export const addMainSection = async (payload: MainSectionPayload) => {
  try {
    const response = await apiClient.post("/api/mainSections/insert", payload);
    return response.data;
  } catch (error) {
    console.error("Error adding main section:", error);
    throw error;
  }
};

// Lấy danh sách
export const fetchMainSection = async () => {
  try {
    const request = {
      clientTime: new Date().toISOString()
    };
    const response = await apiClient.post("/api/mainSections/getMainSections", request);
    return response.data.mainSections;
  } catch (error) {
    console.error("Error fetching main sections:", error);
    throw error;
  }
};

// Sửa
export const updateMainSection = async (payload: MainSectionPayload) => {
  try {
    const response = await apiClient.post("/api/mainSections/update", payload);
    return response.data;
  } catch (error) {
    console.error("Error updating main section:", error);
    throw error;
  }
};

// Xóa
export const deleteMainSection = async (id: number) => {
  try {
    const response = await apiClient.post("/api/mainSections/delete", { id });
    return response.data;
  } catch (error) {
    console.error("Error deleting main section:", error);
    throw error;
  }
};
