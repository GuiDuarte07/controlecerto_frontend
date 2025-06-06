import { Category } from './../../models/Category';
import { Component, OnInit, signal, viewChild, ViewChild } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BillTypeEnum } from '../../enums/BillTypeEnum';
import {
  CategoryDialogComponent,
  CategoryDialogDataType,
} from '../../components/dialogs/category-dialog/category-dialog.component';
import { InfoParentCategoryResponse } from '../../models/InfoParentCategoryResponse';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { RegisterButtonComponent } from '../../components/ui/register-button/register-button.component';

import { ButtonGroupModule } from 'primeng/buttongroup';
import { OrderListModule } from 'primeng/orderlist';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpErrorResponse } from '@angular/common/http';
import { TagModule } from 'primeng/tag';
import { InfoLimitResponse } from '../../models/InfoLimitResponse';
import { ChangeCategoryLimitDialogComponent } from '../../components/dialogs/change-category-limit-dialog/change-category-limit-dialog.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    SidebarModule,
    ButtonModule,
    StepperModule,
    ButtonGroupModule,
    OrderListModule,
    RegisterButtonComponent,
    ToastModule,
    CategoryDialogComponent,
    ConfirmDialogModule,
    ToastModule,
    TagModule,
    ChangeCategoryLimitDialogComponent,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  fullLoadScreen = signal(false);

  expenseCategories: InfoParentCategoryResponse[] = [];
  incomeCategories: InfoParentCategoryResponse[] = [];
  categoriesType: 'expense' | 'income' = 'expense';

  categorySideBarOpen = false;

  selectedCategory: Category | InfoParentCategoryResponse | null = null;

  loadingLimitInfo: boolean = true;
  selectedCategoryLimitInfo: InfoLimitResponse | null = null;

  @ViewChild('categoryDialog')
  categoryDialog!: CategoryDialogComponent;

  @ViewChild('categoryLimitDialog')
  categoryLimitDialog!: ChangeCategoryLimitDialogComponent;

  constructor(
    private categoryService: CategoryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.updateCategories();
  }

  openCategoryDialog(category?: Category, parentCategory: boolean = false) {
    let dialogData: CategoryDialogDataType;

    if (category) {
      if (parentCategory) {
        dialogData = {
          newCategory: true,
          parentCategory,
          category,
        };
      } else {
        dialogData = {
          newCategory: false,
          category,
          parentCategory: undefined,
        };
      }
    } else {
      dialogData = {
        newCategory: true,
        category: undefined,
      };
    }

    this.categoryDialog.openDialog(dialogData);

    this.categoryDialog.closeEvent.subscribe((success: boolean) => {
      if ((success as boolean) === true) {
        this.updateCategories();
      }
    });
  }

  openEditLimitModal(category?: InfoParentCategoryResponse | Category | null) {
    if (!category) return;

    this.categoryLimitDialog.openDialog(category);

    this.categoryLimitDialog.closeEvent.subscribe(({ success, newLimit }) => {
      if (success && this.selectedCategory) {
        this.selectedCategory.limit = newLimit ?? undefined;
        this.categoryService
          .getLimitInfo(this.selectedCategory.id!)
          .subscribe((res) => (this.selectedCategoryLimitInfo = res));
      }
    });
  }

  updateCategories() {
    this.categoryService.GetCategories().subscribe({
      next: (value) => {
        this.expenseCategories = value.filter(
          (x) => x.billType === BillTypeEnum.EXPENSE
        );
        this.incomeCategories = value.filter(
          (x) => x.billType === BillTypeEnum.INCOME
        );
      },
    });
  }

  deleteCategory(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: 'Deletar Categoria',
      message: `Deseja deletar a categoria ${this.selectedCategory?.name}?`,
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptLabel: 'Deletar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.fullLoadScreen.set(true);

        if (this.selectedCategory) {
          this.categoryService
            .deleteCategory(this.selectedCategory.id!)
            .subscribe({
              next: () => {
                this.selectedCategory = null;
                this.categorySideBarOpen = false;
                this.fullLoadScreen.set(false);
                this.messageService.add({
                  severity: 'success',
                  summary: 'Deletado',
                  detail: 'Categoria deletada com sucesso!',
                  life: 3000,
                });
              },
              error: (error: HttpErrorResponse) => {
                this.fullLoadScreen.set(false);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Erro ao Deletar',
                  detail: error.error,
                  life: 3000,
                });
              },
            });
        }
      },
    });
  }

  toggleSideBarCategory(category: Category | InfoParentCategoryResponse) {
    this.categorySideBarOpen = !this.categorySideBarOpen;
    this.selectedCategory = category;

    this.loadingLimitInfo = true;
    this.categoryService.getLimitInfo(this.selectedCategory.id!).subscribe({
      next: (info) => {
        this.selectedCategoryLimitInfo = info;
        this.loadingLimitInfo = false;
      },
    });
  }

  getSelectedCategoryParent(): InfoParentCategoryResponse | null {
    if (!this.selectedCategory) return null;

    if (this.selectedCategory instanceof InfoParentCategoryResponse) {
      return null;
    } else {
      return this.categoriesType === 'expense'
        ? this.expenseCategories.find(
            (c) => c.id === (this.selectedCategory as Category).parentId
          )!
        : this.incomeCategories.find(
            (c) => c.id === (this.selectedCategory as Category).parentId
          )!;
    }
  }

  listSubCategories(category: Category | InfoParentCategoryResponse | null) {
    if (category === null || category instanceof Category) return [];

    return category.subCategories!;
  }
}
