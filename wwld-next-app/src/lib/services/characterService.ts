import axios from "axios";

export interface CharacterPayload {
    id: number;
    name: string;
    avatar: string;
    imgFull: string;
    birthday: string; // ISO date string
    sex: string;
    information: string;
    mainQuestId: number;
    sideQuestId: number;
    eventQuestId: number;
    areaId: number;
    memeId: number;
    type: string; // 
}

// tạo mới
export const addCharacter = async (payload: CharacterPayload) => {
    try {
        const response = await axios.post("/api/characters/insert", payload);
        return response.data;
    } catch (error) {
        console.error("Error adding character:", error);
        throw error;
    }
};

// lấy danh sách
export const fetchCharacters = async () => {
    try {
        const request = {
            clientTime: new Date().toISOString()
        };
        const response = await axios.post("/api/characters/getCharacters", request);
        console.log("response.data.listCharacters", response.data.listCharacters);

        return response.data.listCharacters;
    } catch (error) {
        console.error("Error fetching characters:", error);
        throw error;
    }
};

// Update 
export const updateCharacter = async (payload: CharacterPayload) => {
    try {
        const response = await axios.post("/api/characters/update", payload);
        return response.data;
    } catch (error) {
        console.error("Error updating character:", error);
        throw error;
    }
};

// Xóa
export const deleteCharacter = async (id: number) => {
  try {
    const response = await axios.post("/api/characters/delete", { id });
    return response.data;
  } catch (error) {
    console.error("Error deleting characters:", error);
    throw error;
  }
};