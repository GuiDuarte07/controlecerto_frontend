export interface UpdateNoteRequest {
  id: number;
  title: string;
  content: string;
  year?: number | null;
  month?: number | null;
}
