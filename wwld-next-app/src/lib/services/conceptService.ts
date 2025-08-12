import axios from "axios";

const backendBaseURL = "https://wwld-production.up.railway.app";

const apiClient = axios.create({
  baseURL: backendBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Concept interface payload
export interface ConceptPayload{
    id?: number;
    title: string;
    slug: string;
    contentMd?: string;
    conceptImage?: string;
    description? : string;
}

// tạo mới
export const addConcept = async (payload: ConceptPayload) => {
  try {
    const response = await apiClient.post("/api/concept/insert", payload);
    
    return response.data;
  } catch (error) {
    console.error("Error adding concept:", error);
    throw error;
  }
};

// Lấy danh sách
export const fetchConcepts = async () => {
  try {
    const request = {
      clientTime: new Date().toISOString()
    };
    const response = await apiClient.post("/api/concept/findConcepts", request);
    console.log("response : ", response.data.listConcepts);
    
    return response.data.listConcepts;
  } catch (error) {
    console.error("Error fetching concept :", error);
    throw error;
  }
};

// Sửa
export const updateConcept = async (payload: ConceptPayload) => {
  try {
    const response = await apiClient.post("/api/concept/update", payload);
    console.log("payload :",payload);
    
    return response.data;
  } catch (error) {
    console.error("Error updating concept:", error);
    throw error;
  }
};

// Xóa
export const deleteConcept = async (payload : ConceptPayload) => {
  try {
    
    const response = await apiClient.post("/api/concept/delete", { payload });
    return response.data;
  } catch (error) {
    console.error("Error deleting concept:", error);
    throw error;
  }
};

// get one by id 

export const fetchOneConceptById = async (id : number) => {
  try {
    const request = {
      clientTime: new Date().toISOString(),
      id
    };
    const response = await apiClient.post("/api/concept/getOneById", request);
    console.log("response : ", response.data.conceptDTO);
    
    return response.data.listConcepts;
  } catch (error) {
    console.error("Error fetching concept :", error);
    throw error;
  }
};