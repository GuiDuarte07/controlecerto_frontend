import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormaterService {
  constructor() {}

  formatDateString(dateString: string | Date): string {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;

    // Remove time part from dates for comparison
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return 'Hoje';
    } else if (isYesterday) {
      return 'Ontem';
    } else if (date.getFullYear() === today.getFullYear()) {
      return date.toLocaleDateString('pt-BR', {
        month: 'long',
        day: 'numeric',
      });
    } else {
      return date.toLocaleDateString('pt-BR', options);
    }
  }

  getMonthYearString(date: Date): string {
    const monthYear = date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });
    return monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  formatCurrencySymbol(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  formatDateToHourMinutes(date: Date): string {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
