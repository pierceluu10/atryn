export type ResourceCategory =
  | "campus_service"
  | "lab"
  | "professor"
  | "opportunity"
  | "student_group";

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  shortDescription: string;
  fullDescription: string;
  topics: string[];
  tags: string[];
  building?: string;
  officeLocation?: string;
  contactEmail?: string;
  website?: string;
  professorName?: string;
  department?: string;
  audience?: string;
  sourceType: string;
  sourceNote: string;
  lastReviewedAt: string;
  aiContextNotes: string;
}

export interface ChatRequest {
  message: string;
  conversationHistory: { role: string; content: string }[];
  selectedResourceId?: string;
}

export interface ChatResponse {
  reply: string;
  cards?: Resource[];
}

export interface SearchRequest {
  query: string;
  category?: ResourceCategory;
  limit?: number;
}

export interface SearchResponse {
  results: Resource[];
  summary: string;
}

export interface AskRequest {
  question: string;
  resourceId: string;
}

export interface AskResponse {
  answer: string;
}

export interface EmailDraftRequest {
  resourceId: string;
  studentContext?: string;
}

export interface EmailDraftResponse {
  subject: string;
  body: string;
}
