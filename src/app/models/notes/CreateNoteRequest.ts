export interface CreateNoteRequest {
  title: string;
  content: string;
  year?: number | null;
  month?: number | null;
}
