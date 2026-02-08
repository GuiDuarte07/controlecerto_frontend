export interface NoteResponse {
  id: number;
  title: string;
  content: string;
  year?: number | null;
  month?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}
