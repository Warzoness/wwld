import { apiClient } from "../apiClient";

export interface NoteData {
  id: number;
  noteName: string;
  noteContent: string;
  storyId: number;
  description: string;
  image: string;
}

export interface PagedNotes {
  items: NoteData[];
  totalItems: number;
  totalPages: number;
  pageIndex: number;
  pageSize: number;
}

export const fetchPagedNotes = async (
  pageIndex = 0,
  pageSize = 10,
  keyword = ""
): Promise<PagedNotes> => {
  const req = {
    pageIndex,
    pageSize,
    keyword: keyword.trim(),
    clientTime: new Date().toISOString(),
  };
  const res = await apiClient.post("/api/noteData/listNoteDatas", req);
  const data = res.data || {};

  // map linh hoạt theo backend hiện tại
  const items: NoteData[] =
    data.listNoteDatas ?? data.items ?? data.listDialogs ?? [];

  const totalItems: number =
    data.totalItems ?? data.total ?? data.count ?? items.length;

  const totalPages: number =
    data.totalPages ?? Math.ceil(totalItems / Math.max(1, pageSize));

  return { items, totalItems, totalPages, pageIndex, pageSize };
};


// Tạo mới 
export const addNote = async (payload: NoteDataPayLoad) => {
    try {
        const response = await apiClient.post("/api/noteData/insert", payload);
        return response.data;
    } catch (error) {
        console.error("Error adding note data :", error);
        throw error;
    }
};

// Lấy danh sách
export const fetchListNote = async () => {
    try {
        const request = {
            clientTime: new Date().toISOString()
        };
        const response = await apiClient.post("/api/noteData/listNoteDatas", request);
        return response.data.listNoteData;
    } catch (error) {
        console.error("Error fetching list note:", error);
        throw error;
    }
};

// Lấy note data theo Id
export const fetchNoteDataById = async (id: number) => {
    try {
        const request = {
            id,
            clientTime: new Date().toISOString()
        };
        const response = await apiClient.post("/api/noteData/getOneById", request);
        return response.data.noteDataDTO;
    } catch (error) {
        console.error("Error fetching note data by id:", error);
        throw error;
    }
};


// Sửa 
export const updateNoteData = async (payload: NoteDataPayLoad) => {
  try {
    const response = await apiClient.post("/api/noteData/update", payload);
    return response.data;
  } catch (error) {
    console.error("Error updating note data:", error);
    throw error;
  }
};

// Xóa
export const deleteNoteData = async (id: number) => {
    try {
        const response = await apiClient.post("/api/noteData/delete", { id });
        return response.data;
    } catch (error) {
        console.error("Error deleting note data:", error);
        throw error;
    }
};
