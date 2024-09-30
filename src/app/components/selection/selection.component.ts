import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-selection',
  standalone: true,
  imports: [],
  templateUrl: './selection.component.html',
  styleUrl: './selection.component.scss',
})
export class SelectionComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) placeholder!: string;
  @Input({ required: true }) itemSelected!: boolean;

  isOpen = false;

  toggleSelection(event: MouseEvent) {
    event.stopPropagation();

    this.isOpen = !this.isOpen;

    const closeSelectionOnClick = (event: MouseEvent) => {
      this.isOpen = false;
      window.removeEventListener('click', closeSelectionOnClick);
    };

    if (this.isOpen) {
      window.addEventListener('click', closeSelectionOnClick);
    }
  }
}
