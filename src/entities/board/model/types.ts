export type Priority = 'high' | 'medium' | 'low' | null;

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Card {
  id: string;
  content: string;
  description: string;
  labels: string[];
  dueDate: string | null;
  checklist: ChecklistItem[];
  priority: Priority;
  attachments: Attachment[];
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
  sortBy: 'none' | 'alphabetical' | 'dueDate' | 'createdAt';
}

export interface BoardState {
  title: string;
  searchQuery: string;
  columns: Record<string, Column>;
  cards: Record<string, Card>;
  columnOrder: string[];
}
