import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() id: string = '';
  @Input() header: string = '';

  @Output() setEvent = new EventEmitter<void>();

  // Método chamado quando o botão "I Accept" é clicado
  set() {
    this.setEvent.emit();
  }
}
