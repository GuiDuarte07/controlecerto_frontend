import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-selection',
  standalone: true,
  imports: [],
  templateUrl: './selection.component.html',
  styleUrl: './selection.component.scss',
})
export class SelectionComponent {
  @Input() label!: string;
  @Output() itemSelected = new EventEmitter<any>();

  isOpen = true;

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

  // Seleciona um item e emite o evento
  selectItem(item: any) {
    this.isOpen = false;
    this.itemSelected.emit(item); // Emite o item selecionado
  }
}
