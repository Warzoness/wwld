// /lib/services/characterService.ts
import axios from "axios";
import { ApiCharacterPayload, CharacterPayload,Sex } from "../types/character";
import { backendUrl } from "../consts/const";

// ===== Helpers =====
function toIsoDate(v?: string | Date): string | undefined {
  if (!v) return undefined;
  if (v instanceof Date && !isNaN(v.getTime())) return v.toISOString();
  // v là "YYYY-MM-DD"
  const d = new Date(`${v}T00:00:00`);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

// Chuẩn hơn: dùng unknown + Number.isNaN
export function isNumber(n: unknown): n is number {
  return typeof n === "number" && !Number.isNaN(n);
}

/** Xoá key có value undefined/null/"" (rỗng/white-space cũng bị xoá) */
export function stripEmpty<T extends object>(obj: T): T {
  const out = {} as T;
  for (const k of Object.keys(obj) as (keyof T)[]) {
    const v = obj[k];
    const emptyStr = typeof v === "string" && v.trim() === "";
    if (v === undefined || v === null || emptyStr) continue;
    out[k] = v;
  }
  return out;
}



/** Map UI -> API (chuẩn hoá ngày/tham số, loại bỏ ID trống) */
export function toApiPayload(p: CharacterPayload): ApiCharacterPayload {
  const api: ApiCharacterPayload = {
    id: p.id,
    name: (p.name ?? "").trim(),
    avatar: p.avatar,
    imgFull: p.imgFull,
    birthday: p.birthday,
    sex: p.sex,
    overview: p.overview,
    history: p.history,
    organization: p.organization,
    age: isNumber(p.age) ? p.age : undefined,
    nation: p.nation,
    otherInformation: p.otherInformation,
    height: isNumber(p.height) ? p.height : undefined,
    combatStyle: p.combatStyle,
    mainQuestId: isNumber(p.mainQuestId) ? p.mainQuestId : undefined,
    sideQuestId: isNumber(p.sideQuestId) ? p.sideQuestId : undefined,
    eventQuestId: isNumber(p.eventQuestId) ? p.eventQuestId : undefined,
    areaId: isNumber(p.areaId) ? p.areaId : undefined,
    memeId: isNumber(p.memeId) ? p.memeId : undefined,
    type: p.type,
  };
  return stripEmpty(api); // OK, không cần cast
}


// ===== API Client =====

const apiClient = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== Services =====

// Tạo mới
export const addCharacter = async (payload: CharacterPayload) => {
  try {
    const body = toApiPayload(payload);
    const response = await apiClient.post("/api/characters/insert", body);
    return response.data;
  } catch (error) {
    console.error("Error adding character:", error);
    throw error;
  }
};
// Cập nhật
export const updateCharacter = async (payload: CharacterPayload) => {
  try {
    if (!payload.id) throw new Error("Missing id for update");
    const body = toApiPayload(payload);
    const response = await apiClient.post("/api/characters/update", body);
    return response.data;
  } catch (error) {
    console.error("Error updating character:", error);
    throw error;
  }
};

// Lấy danh sách
export const fetchCharacters = async () => {
  try {
    const request = { clientTime: new Date().toISOString() };
    const response = await apiClient.post("/api/characters/getCharacters", request);
    return response.data.listCharacters;
  } catch (error) {
    console.error("Error fetching characters:", error);
    throw error;
  }
};
// Lấy 1 nhân vật
export const fetchOneCharacterById = async (id : number) => {
  try {
    const request = { clientTime: new Date().toISOString(),id };
    
    const response = await apiClient.post("/api/characters/getCharacterById", request);
    return response.data.characterDTO;
  } catch (error) {
    console.error("Error fetching characters:", error);
    throw error;
  }
};


// Xoá
export const deleteCharacter = async (id: number) => {
  try {
    const response = await apiClient.post("/api/characters/delete", { id });
    return response.data;
  } catch (error) {
    console.error("Error deleting characters:", error);
    throw error;
  }
};

export type {CharacterPayload, Sex} from "@/lib/types/character"