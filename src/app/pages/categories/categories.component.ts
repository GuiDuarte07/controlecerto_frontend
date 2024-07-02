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

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, SidebarComponent, MatIconModule, MatTabsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  expenseCategories: Category[] = [];
  incomeCategories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.updateCategories();
  }

  openAccountDialog() {
    const dialogRef = this.dialog.open(CategoryDialogComponent);
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
      },
    });
  }
}
