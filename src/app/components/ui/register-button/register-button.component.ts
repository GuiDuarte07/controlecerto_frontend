import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-register-button',
  standalone: true,
  imports: [],
  templateUrl: './register-button.component.html',
  styleUrl: './register-button.component.scss',
})
export class RegisterButtonComponent {
  @Input({ required: true }) title!: string;
  @Output() clickEvent = new EventEmitter();

  onClick() {
    this.clickEvent.emit();
  }
}
