import axios from "axios";

export interface DialogPayload {
    id: number;
    characterId: number | null; // null nếu không có nhân vật
    storyId: number;
    content: string;
    image: string;
    // type = 0 : image (characterId : null), type = 1 : text (characterId : not null), type = 2 : text ( main character)
    type: number;
    orderIndex: number;
    voice?: string;
    noNameCharacter?: string; // dùng khi không chọn nhân vật nào
}

// Tạo mới 
export const addDialog = async (payload: DialogPayload) => {
    try {
        const response = await axios.post("/api/dialog/insert", payload);
        console.log("addDialog response:", payload);
        return response.data;
    } catch (error) {
        console.error("Error adding dialog :", error);
        throw error;
    }
};

// Lấy danh sách
export const fetchDialogs = async () => {
    try {
        const request = {
            clientTime: new Date().toISOString()
        };
        const response = await axios.post("/api/dialog/getDialogs", request);
        return response.data.listDialogs;
    } catch (error) {
        console.error("Error fetching main sections:", error);
        throw error;
    }
};

// Lấy danh sách theo storyId
export const fetchDialogsByStoryId = async (storyId: number) => {
    try {
        const request = {
            storyId,
            clientTime: new Date().toISOString()
        };
        const response = await axios.post("/api/dialog/getDialogs", request);
        return response.data.listDialogs;
    } catch (error) {
        console.error("Error fetching dialogs by story id:", error);
        throw error;
    }
};

// Sửa 
export const updateDialog = async (payload: DialogPayload) => {
  try {
    console.log("payload", payload);
    const response = await axios.post("/api/dialog/update", payload);
    return response.data;
  } catch (error) {
    console.error("Error updating dialog:", error);
    throw error;
  }
};

// Xóa
export const deleteDialog = async (id: number) => {
    try {
        const response = await axios.post("/api/dialog/delete", { id });
        return response.data;
    } catch (error) {
        console.error("Error deleting dialog:", error);
        throw error;
    }
};

// update order index
// API call
export const updateDialogOrder = async (dialogId: number, orderIndex: number) => {
    try {
        const response = await axios.post("/api/dialog/updateOrderIndex", {
            id: dialogId,
            orderIndex: orderIndex
        });
        return response.data;
    } catch (error) {
        console.error("Error updating dialog order:", error);
        throw error;
    }
};