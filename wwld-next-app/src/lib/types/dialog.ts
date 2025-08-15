
export interface DialogPayload {
    id: number;
    characterId: number | null; // null nếu không có nhân vật
    storyId: number;
    content: string;
    image: string;
    // type = 0 : image (characterId : null), type = 1 : text (characterId : not null), type = 2 : text ( main character), type = 3 : text (description or nana)
    type: number;
    orderIndex: number;
    voice?: string;
    noNameCharacter?: string; // dùng khi không chọn nhân vật nào
    parentId: number | null;
}

export interface Dialog {
    id: number;
    characterId: number;
    characterName: string;
    storyId: number;
    content: string;
    image: string;
    // type = 0 : image (characterId : null), type = 1 : text (characterId : not null), type = 2 : text ( main character)
    type: number;
    orderIndex: number;
    voice?: string;
    noNameCharacter?: string; // dùng khi không chọn nhân vật nào
    parentId: number;
}

export interface StoryData {
    chapterName: string;
    actName: string;
    description: string;
}
