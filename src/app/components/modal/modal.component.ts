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
  @Input() disabledButton: boolean = false;

  @Output() onSubmit = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  submit() {
    this.onSubmit.emit();
  }

  close() {
    this.onClose.emit();
  }
  ngOnInit() {}
}
