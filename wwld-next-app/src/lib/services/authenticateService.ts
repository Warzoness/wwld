import axios from "axios";

export interface AuthenticationPayload{
    id: number;
    username:string;
    hashpassword:string;
    email:string;
    role:string;
    status:string;
    createdAt:string;
    updatedAt:string;
    enabled:boolean;
}

// tạo mới
export const resgister = async (payload: AuthenticationPayload) => {
    try {
        const response = await axios.post("/api/authentication/register", payload);
        return response.data;
    } catch (error) {
        console.error("Error adding user:", error);
        throw error;
    }
};

// Get list
export const fetchListUsers = async () => {
    try {
        const request = {
            clientTime: new Date().toISOString()
        };
        const response = await axios.post("/api/authentication/getListUsers", request);
        console.log("response.data.listUsers", response.data.listCharacters);

        return response.data.listUsers;
    } catch (error) {
        console.error("Error fetching list users:", error);
        throw error;
    }
};

// update 
export const updateUser = async (payload: AuthenticationPayload) => {
    try {
        const response = await axios.post("/api/authentication/update", payload);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

//delete
export const deleteUser = async (id: number) => {
  try {
    const response = await axios.post("/api/authentication/delete", { id });
    return response.data;
  } catch (error) {
    console.error("Error deleting characters:", error);
    throw error;
  }
};