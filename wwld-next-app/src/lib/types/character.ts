// ===== Types =====
export type Sex = "Nam" | "Nữ" | "Khác";
export type CharacterType = "playable" | "npc";




/** Payload dùng ở UI (Modal) */
export interface CharacterPayload {
  id?: number;
  name: string;
  avatar?: string;
  imgFull?: string;
  birthday?: string; // UI có thể dùng "YYYY-MM-DD" hoặc Date
  sex?: Sex;
  overview?: string;
  history?: string;
  organization?: string;
  age?: number;             // Integer
  nation?: string;
  otherInformation?: string;
  height?: number;          // Float
  combatStyle?: string;
  // Các ID: để trống/không nhập theo yêu cầu
  mainQuestId?: number | null;
  sideQuestId?: number | null;
  eventQuestId?: number | null;
  areaId?: number | null;
  memeId?: number | null;
  type?: CharacterType;     // String: "playable" | "npc"
}

/** Payload thực gửi backend */
export interface ApiCharacterPayload {
  id?: number;
  name: string;
  avatar?: string;
  imgFull?: string;
  birthday?: string;   // ISO string
  sex?: Sex;
  overview?: string;
  history?: string;
  organization?: string;
  age?: number;
  nation?: string;
  otherInformation?: string;
  height?: number;
  combatStyle?: string;

  // chỉ gửi khi có giá trị hợp lệ
  mainQuestId?: number;
  sideQuestId?: number;
  eventQuestId?: number;
  areaId?: number;
  memeId?: number;

  type?: CharacterType;
}

type Character = {
  id: number;
  name: string;
  avatar?: string;
  imgFull?: string;
  birthday?: string; // ISO date string
  sex?: "Nam" | "Nữ" | "Khác";
  overview?: string;
  history?: string;
  organization?: string;
  age?: number;
  nation?: string;
  otherInformation?: string;
  height?: number;
  combatStyle?: string;
  // các ID có thể có hoặc không, nhưng không cần nhập ở modal
  mainQuestId?: number;
  sideQuestId?: number;
  eventQuestId?: number;
  areaId?: number;
  memeId?: number;
  type?: "playable" | "npc";
};
