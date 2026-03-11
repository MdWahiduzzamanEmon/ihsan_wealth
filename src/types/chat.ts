export type ChatFeature =
  | "islamic-qa"
  | "asset-help"
  | "dua-recommendation"
  | "distribution-planner";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  feature?: ChatFeature;
}

export interface ChatContext {
  feature: ChatFeature;
  language: string;
  /** Stringified summary of user's zakat data — read-only, never written back */
  zakatSummary?: string;
}
