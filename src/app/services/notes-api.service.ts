import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { serverConnectionString } from '../config/server';
import { NoteResponse } from '../models/notes/NoteResponse';
import { CreateNoteRequest } from '../models/notes/CreateNoteRequest';
import { UpdateNoteRequest } from '../models/notes/UpdateNoteRequest';

interface ApiResult<T> {
  data?: T;
  isError?: boolean;
  error?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class NotesApiService {
  private hostAddress = `${serverConnectionString}/Note`;

  constructor(private http: HttpClient) {}

  getAllNotes(): Observable<NoteResponse[]> {
    return this.http
      .get<NoteResponse[] | ApiResult<NoteResponse[]>>(this.hostAddress)
      .pipe(map(this.unwrapResult));
  }

  getGeneralNotes(): Observable<NoteResponse[]> {
    return this.http
      .get<
        NoteResponse[] | ApiResult<NoteResponse[]>
      >(`${this.hostAddress}/general`)
      .pipe(map(this.unwrapResult));
  }

  getNotesByMonth(
    year?: number | null,
    month?: number | null,
  ): Observable<NoteResponse[]> {
    let params = new HttpParams();

    if (year !== undefined && year !== null) {
      params = params.set('year', year);
    }

    if (month !== undefined && month !== null) {
      params = params.set('month', month);
    }

    return this.http
      .get<
        NoteResponse[] | ApiResult<NoteResponse[]>
      >(`${this.hostAddress}/month`, { params })
      .pipe(map(this.unwrapResult));
  }

  getNote(id: number): Observable<NoteResponse> {
    return this.http
      .get<NoteResponse | ApiResult<NoteResponse>>(`${this.hostAddress}/${id}`)
      .pipe(map(this.unwrapResult));
  }

  createNote(payload: CreateNoteRequest): Observable<NoteResponse> {
    return this.http
      .post<NoteResponse | ApiResult<NoteResponse>>(this.hostAddress, payload)
      .pipe(map(this.unwrapResult));
  }

  updateNote(payload: UpdateNoteRequest): Observable<NoteResponse> {
    return this.http
      .put<
        NoteResponse | ApiResult<NoteResponse>
      >(`${this.hostAddress}/${payload.id}`, payload)
      .pipe(map(this.unwrapResult));
  }

  deleteNote(id: number): Observable<boolean> {
    return this.http
      .delete<boolean | ApiResult<boolean>>(`${this.hostAddress}/${id}`)
      .pipe(map(this.unwrapResult));
  }

  private unwrapResult = <T>(result: ApiResult<T> | T): T => {
    const anyResult = result as ApiResult<T>;
    if (anyResult && Object.prototype.hasOwnProperty.call(anyResult, 'data')) {
      return (anyResult.data as T) ?? (result as T);
    }
    return result as T;
  };
}
