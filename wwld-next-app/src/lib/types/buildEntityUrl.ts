// types
type ViewerCtx = "admin" | "public";

export interface Suggestion {
  id: number;
  name: string;
  type: "character" | "concept" | "note";
}

// mapping route cho 2 ngữ cảnh
const ROUTES: Record<ViewerCtx, Record<Suggestion["type"], (id: number) => string>> = {
  admin: {
    character: (id) => `/admin/character-detail/${id}`,
    concept:   (id) => `/admin/concept-detail/${id}`,
    note:      (id) => `/admin/note-detail/${id}`,
  },
  public: {
    // TUỲ web public của bạn (đổi cho khớp router thật)
    character: (id) => `/characters/${id}`,
    concept:   (id) => `/concepts/${id}`,
    note:      (id) => `/notes/${id}`,
  },
};

// builder
export const buildEntityUrl = (s: Suggestion, ctx: ViewerCtx = "admin"): string =>
  ROUTES[ctx][s.type](s.id);
