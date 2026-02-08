import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { QuillModule } from 'ngx-quill';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import {
  NoteOverlayService,
  NoteOverlayContext,
} from '../../services/note-overlay.service';
import { NotesApiService } from '../../services/notes-api.service';
import { NoteResponse } from '../../models/notes/NoteResponse';
import { CreateNoteRequest } from '../../models/notes/CreateNoteRequest';
import { UpdateNoteRequest } from '../../models/notes/UpdateNoteRequest';

@Component({
  selector: 'app-note-overlay',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    QuillModule,
    ToastModule,
    SkeletonModule,
  ],
  templateUrl: './note-overlay.component.html',
  styleUrl: './note-overlay.component.scss',
})
export class NoteOverlayComponent implements OnInit, OnDestroy {
  isOpen = signal(false);
  view = signal<'list' | 'editor'>('list');
  context = signal<NoteOverlayContext>({ type: 'list' });

  isLoadingList = signal(false);
  isLoadingNote = signal(false);
  isSaving = signal(false);
  isExpanded = signal(false);
  showCreateForm = signal(false);

  allNotes = signal<NoteResponse[]>([]);
  activeNote = signal<NoteResponse | null>(null);
  activeGroupKey = signal<string | null>(null);

  editorVisible = signal(true);

  noteTitle = '';
  noteContent = '';

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ header: 2 }, { header: 3 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
    ],
  };

  listFilter = signal<{
    search: string;
    month: number | null;
    year: number | null;
  }>({
    search: '',
    month: null,
    year: null,
  });

  createForm = signal<{
    title: string;
    type: 'general' | 'month';
    year: number;
    month: number;
  }>({
    title: 'Nova anotação',
    type: 'month',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  private subscription = new Subscription();

  monthOptions = [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Fev' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Abr' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Ago' },
    { value: 9, label: 'Set' },
    { value: 10, label: 'Out' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Dez' },
  ];

  editorHeightPx = computed(() => (this.isExpanded() ? 400 : 220));

  editorSkeletonHeightPx = computed(
    () => (this.isExpanded() ? 400 : 220) + 52.5,
  );

  yearOptions = computed(() => {
    const baseYear = new Date().getFullYear();
    const fromNotes = this.allNotes()
      .map((n) => n.year)
      .filter((y): y is number => y !== null && y !== undefined);
    const years = new Set<number>([baseYear - 1, baseYear, baseYear + 1]);
    fromNotes.forEach((y) => years.add(y));
    return Array.from(years).sort((a, b) => b - a);
  });

  generalNotes = computed(() =>
    this.allNotes().filter((n) => n.year == null && n.month == null),
  );

  monthlyGroups = computed(() => {
    const map = new Map<string, NoteResponse[]>();

    this.allNotes()
      .filter((n) => n.year != null && n.month != null)
      .forEach((note) => {
        const key = this.buildGroupKey(
          note.year as number,
          note.month as number,
        );
        const group = map.get(key) ?? [];
        group.push(note);
        map.set(key, group);
      });

    return map;
  });

  currentGroupNotes = computed(() => {
    const key = this.activeGroupKey();
    if (!key) return [] as NoteResponse[];

    if (key === 'general') {
      return [...this.generalNotes()].sort((a, b) =>
        this.sortByUpdatedAtDesc(a, b),
      );
    }

    const group = this.monthlyGroups().get(key) ?? [];
    return [...group].sort((a, b) => this.sortByUpdatedAtDesc(a, b));
  });

  currentGroupLabel = computed(() => {
    if (this.view() === 'list') return 'Lista de anotações';

    const ctx = this.context();
    if (ctx.type === 'month') {
      return this.formatGroupLabel(this.buildGroupKey(ctx.year, ctx.month));
    }

    const key = this.activeGroupKey();
    if (key) return this.formatGroupLabel(key);

    return 'Lista de anotações';
  });

  filteredGeneralNotes = computed(() => {
    const search = this.listFilter().search.toLowerCase();

    return this.generalNotes()
      .filter((note) =>
        search
          ? `${note.title} ${note.content ?? ''}`.toLowerCase().includes(search)
          : true,
      )
      .sort((a, b) => this.sortByUpdatedAtDesc(a, b));
  });

  filteredMonthlyKeys = computed(() => {
    const search = this.listFilter().search.toLowerCase();
    const { month, year } = this.listFilter();

    return Array.from(this.monthlyGroups().entries())
      .map(([key, notes]) => ({ key, notes }))
      .filter(({ key, notes }) => {
        const [groupYear, groupMonth] = this.splitKey(key);

        if (month && groupMonth !== month) return false;
        if (year && groupYear !== year) return false;

        if (!search) return true;

        return notes.some((note) =>
          `${note.title} ${note.content ?? ''}`.toLowerCase().includes(search),
        );
      })
      .sort((a, b) => this.sortGroupKeyDesc(a.key, b.key))
      .map((g) => g.key);
  });

  constructor(
    private overlayService: NoteOverlayService,
    private notesApiService: NotesApiService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.overlayService.isOpen$.subscribe((open) => {
        this.isOpen.set(open);
        if (open) {
          this.syncWithContext(this.overlayService.getContextSnapshot());
        }
      }),
    );

    this.subscription.add(
      this.overlayService.context$.subscribe((context) => {
        this.context.set(context);
        if (this.isOpen()) {
          this.syncWithContext(context);
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  togglePanel() {
    this.overlayService.toggleFromLauncher();
  }

  closePanel() {
    this.showCreateForm.set(false);
    this.isExpanded.set(false);
    this.overlayService.close();
  }

  toggleExpand() {
    this.isExpanded.update((v) => !v);
  }

  openListView() {
    this.overlayService.openList();
  }

  openMonthView(year: number, month: number) {
    // Month-specific opening removed; fall back to list view.
    this.overlayService.openList();
  }

  syncWithContext(context: NoteOverlayContext) {
    this.view.set('list');
    this.activeGroupKey.set(null);
    this.loadAllNotes();
  }

  loadAllNotes() {
    this.isLoadingList.set(true);
    this.notesApiService.getAllNotes().subscribe({
      next: (notes) => {
        this.allNotes.set(notes ?? []);
        this.isLoadingList.set(false);
      },
      error: () => this.isLoadingList.set(false),
    });
  }

  loadMonthNotes(year: number, month: number) {
    this.isLoadingNote.set(true);
    this.view.set('editor');
    this.activeGroupKey.set(this.buildGroupKey(year, month));

    this.notesApiService.getNotesByMonth(year, month).subscribe({
      next: (notes) => {
        const existing = this.allNotes().filter(
          (n) => !(n.year === year && n.month === month),
        );
        this.allNotes.set([...(notes ?? []), ...existing]);

        const firstNote = (notes ?? [])[0] ?? null;
        if (firstNote) {
          this.setActiveNote(firstNote);
        }
        this.isLoadingNote.set(false);
      },
      error: () => {
        this.isLoadingNote.set(false);
      },
    });
  }

  openNoteFromList(note: NoteResponse) {
    const key = this.buildGroupKey(note.year ?? 0, note.month ?? 0);
    this.activeGroupKey.set(key);
    this.setActiveNote(note);
    this.view.set('editor');
  }

  setActiveNote(note: NoteResponse) {
    this.editorVisible.set(false);
    this.activeNote.set(note);
    this.noteTitle = note.title;
    this.noteContent = note.content ?? '';

    setTimeout(() => this.editorVisible.set(true), 0);
  }

  goBackToList() {
    this.activeNote.set(null);
    this.activeGroupKey.set(null);
    this.noteTitle = '';
    this.noteContent = '';
    this.view.set('list');
  }

  saveNote() {
    const note = this.activeNote();
    if (!note || this.isSaving()) return;

    const payload: UpdateNoteRequest = {
      id: note.id,
      title: this.noteTitle,
      content: this.noteContent,
      year: note.year ?? null,
      month: note.month ?? null,
    };

    this.isSaving.set(true);
    this.notesApiService.updateNote(payload).subscribe({
      next: (updated) => {
        const merged = { ...note, ...updated } as NoteResponse;
        this.replaceNote(merged);
        this.setActiveNote(merged);
        this.isSaving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Anotação salva',
          life: 2000,
        });
      },
      error: () => this.isSaving.set(false),
    });
  }

  onEditorCreated(quill: any) {
    console.log('Editor created/changed, syncing content');
    const html = this.activeNote()?.content ?? '';

    quill.setContents([]);
    quill.clipboard.dangerouslyPasteHTML(html);
  }

  toggleCreateForm() {
    if (!this.showCreateForm()) {
      this.prefillCreateFormFromContext();
    }
    this.showCreateForm.update((v) => !v);
  }

  submitCreateForm() {
    if (this.isSaving()) return;

    const form = this.createForm();
    const payload: CreateNoteRequest = {
      title: form.title?.trim() || 'Nova anotação',
      content: '',
      year: form.type === 'month' ? form.year : null,
      month: form.type === 'month' ? form.month : null,
    };

    this.isSaving.set(true);
    this.notesApiService.createNote(payload).subscribe({
      next: (created) => {
        this.allNotes.set([created, ...this.allNotes()]);
        this.createForm.set({
          title: 'Nova anotação',
          type: form.type,
          year: form.year,
          month: form.month,
        });
        this.showCreateForm.set(false);
        this.openNoteFromList(created);
        this.isSaving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Anotação criada',
          life: 2000,
        });
      },
      error: () => this.isSaving.set(false),
    });
  }

  createNoteInCurrentGroup() {
    if (this.isSaving()) return;

    const ctx = this.context();
    const activeKey = this.activeGroupKey();

    let year: number | null = null;
    let month: number | null = null;

    if (activeKey && activeKey !== 'general') {
      [year, month] = this.splitKey(activeKey);
    }

    const payload: CreateNoteRequest = {
      title: 'Nova anotação',
      content: '',
      year,
      month,
    };

    const targetKey =
      year && month ? this.buildGroupKey(year, month) : 'general';
    this.isSaving.set(true);

    this.notesApiService.createNote(payload).subscribe({
      next: (created) => {
        this.allNotes.set([created, ...this.allNotes()]);
        this.activeGroupKey.set(targetKey);
        this.setActiveNote(created);
        this.view.set('editor');
        this.isSaving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Anotação criada',
          life: 2000,
        });
      },
      error: () => this.isSaving.set(false),
    });
  }

  deleteActiveNote() {
    const note = this.activeNote();
    if (!note) return;

    this.isSaving.set(true);
    this.notesApiService.deleteNote(note.id).subscribe({
      next: (success) => {
        if (success !== false) {
          this.removeNote(note.id);
          this.goBackToList();
        }
        this.isSaving.set(false);
      },
      error: () => this.isSaving.set(false),
    });
  }

  formatGroupLabel(key: string) {
    if (key === 'general') return 'Anotações gerais';
    const [year, month] = this.splitKey(key);
    return `${this.monthOptions.find((m) => m.value === month)?.label ?? ''}/${year}`;
  }

  formatBadge(note: NoteResponse) {
    if (note.year == null || note.month == null) return 'Geral';
    const monthLabel =
      this.monthOptions.find((m) => m.value === note.month)?.label ?? '';
    return `${monthLabel}/${note.year}`;
  }

  updateFilter(
    key: 'search' | 'month' | 'year',
    value: string | number | null,
  ) {
    this.listFilter.set({ ...this.listFilter(), [key]: value });
  }

  updateCreateForm(
    key: 'title' | 'type' | 'year' | 'month',
    value: string | number,
  ) {
    this.createForm.set({ ...this.createForm(), [key]: value });
  }

  private prefillCreateFormFromContext() {
    const ctx = this.context();
    if (ctx.type === 'month') {
      this.createForm.set({
        title: 'Nova anotação',
        type: 'month',
        year: ctx.year,
        month: ctx.month,
      });
      return;
    }

    this.createForm.set({
      ...this.createForm(),
      title: 'Nova anotação',
      type: 'general',
    });
  }

  private buildGroupKey(year: number, month: number) {
    if (!year || !month) return 'general';
    return `${year}-${month.toString().padStart(2, '0')}`;
  }

  private splitKey(key: string): [number, number] {
    const [yearStr, monthStr] = key.split('-');
    return [Number(yearStr), Number(monthStr)];
  }

  private replaceNote(updated: NoteResponse) {
    this.allNotes.set(
      this.allNotes().map((n) => (n.id === updated.id ? updated : n)),
    );
  }

  private removeNote(id: number) {
    this.allNotes.set(this.allNotes().filter((n) => n.id !== id));
  }

  private sortByUpdatedAtDesc(a: NoteResponse, b: NoteResponse) {
    const aDate = new Date(a.updatedAt ?? a.createdAt ?? '').getTime();
    const bDate = new Date(b.updatedAt ?? b.createdAt ?? '').getTime();
    return bDate - aDate;
  }

  private sortGroupKeyDesc(a: string, b: string) {
    const [ay, am] = this.splitKey(a);
    const [by, bm] = this.splitKey(b);
    if (ay === by) return bm - am;
    return by - ay;
  }
}
