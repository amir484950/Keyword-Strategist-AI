export enum SearchIntent {
  INFORMATIONAL = 'Informational',
  TRANSACTIONAL = 'Transactional',
  COMMERCIAL = 'Commercial',
  NAVIGATIONAL = 'Navigational'
}

export enum Level {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export interface KeywordAnalysis {
  keyword: string;
  searchVolume: Level; // Step 2.1: Traffic/Volume
  commercialValue: Level; // Step 2.2: Business Value
  intent: SearchIntent; // Step 2.3: User Need
  competition: Level; // Step 2.4: Difficulty
  difficultyIndex: number; // 0-100 Score
  rationale: string;
  suggestedTitle: string; // New: Click-worthy Title
  contentFormat: string; // New: e.g., "Guide", "Listicle", "Product Page"
}

export interface StrategyResult {
  topic: string;
  summary: string;
  keywords: KeywordAnalysis[];
}

export interface TreeNode {
  name: string;
  value?: string;
  type?: 'root' | 'category' | 'item' | 'detail';
  children?: TreeNode[];
  color?: string;
}