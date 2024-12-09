import { MessageService } from 'primeng/api';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  toast(success: boolean, summary: string, message: string) {
    console.log(summary);
    this.messageService.add({
      severity: success ? 'success' : 'error',
      summary,
      detail: message,
      life: 3000,
    });
  }
}
