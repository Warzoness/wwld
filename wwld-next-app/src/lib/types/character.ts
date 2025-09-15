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
  characterType?: CharacterType;     // String: "playable" | "npc"
  isLimited? : boolean;
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
  characterType?: CharacterType;
  isLimited? : boolean;
}


