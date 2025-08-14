export interface Story {
    id: number;
    title: string;
    description: string;
    image: string;
    type: 0 | 1; // 0: chapter, 1: screen
    mainSectionId: number;
    parentId: number;
    parentTitle: string;
}


// Interface payload
export interface StoryPayload {
  id?: number;
  title: string;
  mainSectionId: number; // ✅ sửa lại từ area_id
  description: string;
  image: string;
  type: number;
  parentId: number;
}