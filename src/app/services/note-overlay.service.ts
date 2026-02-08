import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NoteOverlayContext =
  | { type: 'list' }
  | { type: 'month'; year: number; month: number };

@Injectable({ providedIn: 'root' })
export class NoteOverlayService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  private contextSubject = new BehaviorSubject<NoteOverlayContext>({
    type: 'list',
  });

  isOpen$ = this.isOpenSubject.asObservable();
  context$ = this.contextSubject.asObservable();

  toggleFromLauncher() {
    const currentlyOpen = this.isOpenSubject.getValue();
    if (currentlyOpen) {
      this.isOpenSubject.next(false);
      return;
    }

    this.contextSubject.next({ type: 'list' });
    this.isOpenSubject.next(true);
  }

  openList() {
    this.contextSubject.next({ type: 'list' });
    this.isOpenSubject.next(true);
  }

  openMonth(year: number, month: number) {
    // Keep signature for compatibility, but always open in list mode.
    this.contextSubject.next({ type: 'list' });
    this.isOpenSubject.next(true);
  }

  close() {
    this.isOpenSubject.next(false);
  }

  getContextSnapshot() {
    return this.contextSubject.getValue();
  }
}
