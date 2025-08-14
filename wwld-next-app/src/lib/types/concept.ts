// Concept interface payload
export interface ConceptPayload{
    id?: number;
    title: string;
    slug: string;
    contentMd?: string;
    conceptImage?: string;
    description? : string;
}


export interface Concept{
  id?: number;
  title: string;
  slug: string;
  contentMd?: string;
  conceptImage?: string;
  description?: string;
};