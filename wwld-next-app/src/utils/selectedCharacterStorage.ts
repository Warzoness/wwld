import { CharacterType, Sex } from "@/lib/services/characterService";

export interface Character {
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

const KEY = "selectedCharacter";

export function saveSelectedCharacter(c: Character) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(KEY, JSON.stringify(c));
    } catch { }
}

export function loadSelectedCharacter(): Character | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;
        return JSON.parse(raw) as Character;
    } catch {
        return null;
    }
}

export function clearSelectedCharacter() {
    if (typeof window === "undefined") return;
    try {
        localStorage.removeItem(KEY);
    } catch { }
}