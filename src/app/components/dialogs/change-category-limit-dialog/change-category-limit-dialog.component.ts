import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { Category } from '../../../models/Category';
import { InfoParentCategoryResponse } from '../../../models/InfoParentCategoryResponse';
import { CategoryService } from '../../../services/category.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CurrencyMaskDirective } from '../../../directive/currency-mask.directive';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-change-category-limit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    CurrencyMaskDirective,
  ],
  providers: [MessageService],
  templateUrl: './change-category-limit-dialog.component.html',
  styleUrl: './change-category-limit-dialog.component.scss',
})
export class ChangeCategoryLimitDialogComponent implements OnInit {
  data: Category | InfoParentCategoryResponse | null = null;
  visible = false;
  closeEvent = new EventEmitter<{
    success: boolean;
    newLimit: number | null;
  }>();

  limitForm!: FormGroup<{ limit: FormControl<number> }>;

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.limitForm = new FormGroup({
      limit: new FormControl<number>(0, {
        nonNullable: true,
        validators: [Validators.min(0)],
      }),
    });
  }

  openDialog(data: Category | InfoParentCategoryResponse) {
    this.data = data;
    this.visible = true;

    if (data.limit && data.limit > 0) {
      this.limitForm.patchValue({ limit: data.limit });
    }
  }

  changeLimit() {
    if (this.data && this.data?.limit != this.limitForm.value.limit) {
      this.categoryService
        .updateCategoryLimit(this.data.id!, this.limitForm.value.limit!)
        .subscribe({
          next: (result) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Limite Atualizado',
              detail: `Categoria ${
                this.data!.name
              } teve seu limite atualizado para ${result.limit ?? 0}`,
              life: 3000,
            });
            this.limitForm.reset();
            this.closeDialog(true, result.limit ?? null);
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: err.error,
              life: 3000,
            });
          },
        });
    }
  }

  closeDialog(success: boolean, newLimit: number | null) {
    this.visible = false;
    this.closeEvent.emit({ success, newLimit });
  }
}
