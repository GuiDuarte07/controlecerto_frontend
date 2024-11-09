import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Observable } from 'rxjs';
import { Category } from '../../models/Category';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BillTypeEnum } from '../../enums/BillTypeEnum';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../../components/dialogs/category-dialog/category-dialog.component';
import { InfoParentCategoryResponse } from '../../models/InfoParentCategoryResponse';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    SidebarModule,
    ButtonModule,
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  expenseCategories: InfoParentCategoryResponse[] = [];
  incomeCategories: InfoParentCategoryResponse[] = [];

  categorySideBarOpen = true;
  selectedCategory: Category | InfoParentCategoryResponse | null = null;

  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.updateCategories();
  }

  openCreateCategoryDialog() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      data: {
        newCategory: true,
      },
    });
    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
        this.updateCategories();
      }
    });
  }

  openEditCategoryDialog(category: Category) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      data: {
        newCategory: false,
        category,
      },
    });
    dialogRef.afterClosed().subscribe((sucess) => {
      if ((sucess as boolean) === true) {
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

        this.selectedCategory = this.expenseCategories[0];
      },
    });
  }

  toggleSideBarCategory(category: Category | InfoParentCategoryResponse) {
    this.categorySideBarOpen = !this.categorySideBarOpen;
    this.selectedCategory = category;
  }
}
