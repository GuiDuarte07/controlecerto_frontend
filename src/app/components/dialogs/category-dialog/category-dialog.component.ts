import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BillTypeEnum } from '../../../enums/BillTypeEnum';
import { iconsOptions } from '../../../utils/material_options_icons';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/Category';
import { CommonModule } from '@angular/common';
import { UpdateCategoryRequest } from '../../../models/UpdateCategoryRequest';
import { colorOptions } from '../../../utils/color_options';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SpeedDialModule } from 'primeng/speeddial';
import { ColorPickerModule } from 'primeng/colorpicker';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { InfoParentCategoryResponse } from '../../../models/InfoParentCategoryResponse';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

export type CategoryDialogDataType =
  | {
      newCategory: true;
      category: undefined;
      parentCategory?: undefined;
    }
  | {
      newCategory: true;
      category: Category;
      parentCategory: true;
    }
  | {
      newCategory: false;
      category: Category;
      parentCategory?: undefined;
    };

interface ICateogryForm {
  name: FormControl<string>;
  icon: FormControl<string>;
  billType: FormControl<BillTypeEnum>;
  color: FormControl<string>;
  parentId: FormControl<number | null>;
}

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectButtonModule,
    OverlayPanelModule,
    SpeedDialModule,
    ColorPickerModule,
    TabViewModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    DropdownModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.scss',
})
export class CategoryDialogComponent implements OnInit {
  members = [
    {
      name: 'Amy Elsner',
      image: 'amyelsner.png',
      email: 'amy@email.com',
      role: 'Owner',
    },
    {
      name: 'Bernardo Dominic',
      image: 'bernardodominic.png',
      email: 'bernardo@email.com',
      role: 'Editor',
    },
    {
      name: 'Ioni Bowcher',
      image: 'ionibowcher.png',
      email: 'ioni@email.com',
      role: 'Viewer',
    },
  ];
  categoryForm!: FormGroup<ICateogryForm>;

  data: CategoryDialogDataType | null = null;
  visible = false;
  closeEvent = new EventEmitter<boolean>();

  categoriesTypeOptions = [
    { label: 'Despesa', value: BillTypeEnum.EXPENSE },
    { label: 'Receita', value: BillTypeEnum.INCOME },
  ];
  collapsedIcons: boolean = true;

  categories: Category[] | null = null;

  icons: string[] = iconsOptions;
  selectedIcon = this.icons[0];

  defaultColors: string[] = colorOptions;

  selectedParentCategory?: InfoParentCategoryResponse;

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.categoryForm = new FormGroup({
      name: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      }),
      icon: new FormControl<string>(this.icons[0], {
        nonNullable: true,
        validators: [Validators.required],
      }),
      billType: new FormControl<BillTypeEnum>(BillTypeEnum.EXPENSE, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      color: new FormControl<string>(this.defaultColors[0], {
        nonNullable: true,
        validators: [Validators.required],
      }),
      parentId: new FormControl<number | null>(null, {
        nonNullable: false,
      }),
    });
  }

  openDialog(data: CategoryDialogDataType) {
    this.data = data;
    this.visible = true;

    if (
      this.data.newCategory === false &&
      this.data.parentCategory === undefined
    ) {
      this.categoryForm.patchValue({
        name: this.data.newCategory ? '' : this.data.category.name,
        icon: this.data.newCategory ? this.icons[0] : this.data.category.icon,
        billType: this.data.newCategory
          ? BillTypeEnum.EXPENSE
          : this.data.category.billType,
        color: this.data.newCategory
          ? this.defaultColors[0]
          : this.data.category.color,
      });
    } else {
      if (this.data.parentCategory) {
        this.categoryForm.patchValue({
          parentId: this.data.category.id!,
        });
        this.selectedParentCategory = this.data
          .category as InfoParentCategoryResponse;

        const parentIdControl = this.categoryForm.controls.parentId;
        parentIdControl.addValidators(Validators.required);
        parentIdControl.updateValueAndValidity();
      }
    }

    this.categoryForm.get('parentId')?.valueChanges.subscribe((id) => {
      this.selectedParentCategory = this.categories?.find(
        (category) => category.id === id
      ) as InfoParentCategoryResponse;
    });

    this.updateCategories();
  }

  closeDialog(success: boolean) {
    this.cleanForm();
    this.visible = false;
    this.closeEvent.emit(success);
  }

  createNewCategory() {
    if (this.data!.newCategory) {
      const createdCategory = new Category(
        undefined,
        this.categoryForm.value.name!,
        this.categoryForm.value.icon!,
        this.categoryForm.value.billType!,
        this.categoryForm.value.color!,
        this.categoryForm.value.parentId!
      );

      this.categoryService.createCategory(createdCategory).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Categoria Criada',
            detail: 'Categoria criada com sucesso!',
            life: 3000,
          });
          this.cleanForm();
          this.closeDialog(true);
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
    } else {
      const updatedCategory = new UpdateCategoryRequest({
        id: this.data!.category.id!,
        ...this.categoryForm.getRawValue(),
      });

      this.categoryService.updateCategory(updatedCategory).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Categoria Editada',
            detail: 'Categoria editada com sucesso!',
            life: 3000,
          });
          this.cleanForm();
          this.closeDialog(true);
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

  changeBillType(type: BillTypeEnum) {
    this.categoryForm.patchValue({ billType: type });
  }

  cleanForm() {
    this.categoryForm.reset();
  }

  changeCollapseIcons() {
    this.collapsedIcons = !this.collapsedIcons;
  }

  changeSelectedIcon(icon: string) {
    this.selectedIcon = icon;
    this.categoryForm.patchValue({ icon: this.selectedIcon });
  }

  setDefaultColor(color: string) {
    this.categoryForm.patchValue({ color });
  }

  updateCategories() {
    const categoryType = this.categoryForm.value.billType;

    this.categoryService.GetCategories(categoryType).subscribe((categories) => {
      this.categories = categories.filter((c) => c.billType === categoryType);
    });
  }
}
