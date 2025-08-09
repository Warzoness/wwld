import axios from "axios";

// Interface payload
export interface StoryPayload {
  id?: number;
  title: string;
  mainSectionId: number; // ✅ sửa lại từ area_id
  description: string;
  image: string;
  type: number;
  parentId: number;
}


// Tạo mới
export const addStory = async (payload: StoryPayload) => {
  try {
    const response = await axios.post("/api/stories/insert", payload);
    return response.data;
  } catch (error) {
    console.error("Error adding main section:", error);
    throw error;
  }
};

// Lấy danh sách
export const fetchStories = async () => {
  try {
    const request = {
      clientTime: new Date().toISOString()
    };
    const response = await axios.post("/api/stories/getStories", request);
    return response.data.stories;
  } catch (error) {
    console.error("Error fetching main sections:", error);
    throw error;
  }
};

export const fetchChapters = async (): Promise<StoryPayload[]> => {
  const request ={
    type : 0
  }
  const response = await axios.post("/api/stories/getStories", request);
  return response.data.stories;
};



// Lấy danh sách theo main section id
export const fetchStoriesByMainSectionId = async (mainSectionId: number) => {
  try {
    const request = {
      mainSectionId,
      clientTime: new Date().toISOString()
    };
 
    const response = await axios.post("/api/stories/getStories", request);
    return response.data.stories;
  } catch (error) {
    console.error("Error fetching stories by main section id:", error);
    throw error;
  }
};

// Sửa
export const updateStory = async (payload: StoryPayload) => {
  try {
    console.log("payload", payload);
    const response = await axios.post("/api/stories/update", payload);
    return response.data;
  } catch (error) {
    console.error("Error updating main section:", error);
    throw error;
  }
};

// Xóa
export const deleteStory = async (id: number) => {
  try {
    const response = await axios.post("/api/stories/delete", { id });
    return response.data;
  } catch (error) {
    console.error("Error deleting main section:", error);
    throw error;
  }
};
