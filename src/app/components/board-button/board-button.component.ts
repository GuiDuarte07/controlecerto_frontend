import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board-button.component.html',
  styleUrl: './board-button.component.scss',
})
export class BoardButtonComponent {
  @Input() title = '';
  @Input() amount: number | null = null;
  @Input() active = false;
  @Input() bubbleClass = 'bg-blue-600';
  @Input() bubbleColor: string | null = null;
  @Input() showBubble = true;

  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}
