import { Category } from './../../models/Category';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StepperModule } from 'primeng/stepper';
import { RegisterButtonComponent } from '../../components/ui/register-button/register-button.component';

import { ButtonGroupModule } from 'primeng/buttongroup';
import { OrderListModule } from 'primeng/orderlist';

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
    CategoryDialogComponent,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  expenseCategories: InfoParentCategoryResponse[] = [];
  incomeCategories: InfoParentCategoryResponse[] = [];
  categoriesType: 'expense' | 'income' = 'expense';

  categorySideBarOpen = false;
  selectedCategory: Category | InfoParentCategoryResponse | null = null;

  @ViewChild('categoryDialog')
  categoryDialog!: CategoryDialogComponent;

  constructor(private categoryService: CategoryService) {}

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

  toggleSideBarCategory(category: Category | InfoParentCategoryResponse) {
    this.categorySideBarOpen = !this.categorySideBarOpen;
    this.selectedCategory = category;
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
