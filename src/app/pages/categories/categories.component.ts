import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Observable } from 'rxjs';
import { Category } from '../../models/Category';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { CategoryModalComponent } from '../../components/category-modal/category-modal.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, SidebarComponent, CategoryModalComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  $categories!: Observable<Category[]>;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.$categories = this.categoryService.GetCategories();
  }
}
