import { Component, Inject, OnInit } from '@angular/core';
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
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';
import { UpdateCategoryRequest } from '../../../models/UpdateCategoryRequest';
import { colorOptions } from '../../../utils/color_options';

type Color = { code: string; selected: boolean };

interface ICateogryForm {
  name: FormControl<string>;
  icon: FormControl<string>;
  billType: FormControl<BillTypeEnum>;
  color: FormControl<string>;
}

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButton],
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.scss',
})
export class CategoryDialogComponent implements OnInit {
  categoryForm!: FormGroup<ICateogryForm>;
  defaultColors: Color[] = colorOptions.map(color => ({
    code: color, selected: false
  }));

  collapsedIcons: boolean = true;

  icons: string[] = iconsOptions;
  selectedIcon = this.icons[0];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data:
      | {
          newCategory: true;
        }
      | {
          newCategory: false;
          category: Category;
        },
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.categoryForm = new FormGroup({
      name: new FormControl<string>(
        this.data.newCategory ? '' : this.data.category.name,
        {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ],
        }
      ),
      icon: new FormControl<string>(
        this.data.newCategory ? this.icons[0] : this.data.category.icon,
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      billType: new FormControl<BillTypeEnum>(
        this.data.newCategory
          ? BillTypeEnum.EXPENSE
          : this.data.category.billType,
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      color: new FormControl<string>(
        this.data.newCategory ? '' : this.data.category.icon,
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
    });

    this.setRandomDefaultColor();
  }

  closeDialog(sucess: boolean) {
    this.dialogRef.close(sucess);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['.snackbar-error'],
    });
  }

  createNewCategory() {
    if (this.data.newCategory) {
      const createdCategory = new Category(
        undefined,
        this.categoryForm.value.name!,
        this.categoryForm.value.icon!,
        this.categoryForm.value.billType!,
        this.categoryForm.value.color!
      );
      this.categoryService.createCategory(createdCategory).subscribe({
        next: () => {
          this.openSnackBar('Categoria criada com sucesso!');
          this.cleanForm();
          this.closeDialog(true);
        },
        error: (err) => {
          this.openSnackBar('Erro: ' + err.error);
        },
      });
    } else {
      const updatedCategory = new UpdateCategoryRequest({
        id: this.data.category.id!,
        ...this.categoryForm.getRawValue(),
      });

      this.categoryService.updateCategory(updatedCategory).subscribe({
        next: () => {
          this.openSnackBar('Categoria editada com sucesso!');
          this.cleanForm();
          this.closeDialog(true);
        },
        error: (err) => {
          this.openSnackBar('Erro: ' + err.error);
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

  setDefaultColor(color: Color) {
    this.defaultColors.forEach((c) => {
      c.selected = false;
      if (c.code === color.code) {
        c.selected = true;
      }
    });

    this.categoryForm.patchValue({ color: color.code });
  }

  setRandomDefaultColor() {
    if (this.data.newCategory) {
      const indiceAleatorio = Math.floor(
        Math.random() * this.defaultColors.length
      );

      this.defaultColors[indiceAleatorio].selected = true;
      this.categoryForm.patchValue({
        color: this.defaultColors[indiceAleatorio].code,
      });
    } else {
      for (let i = 0; i < this.defaultColors.length; i++) {
        if (this.defaultColors[i].code === this.data.category.color) {
          this.defaultColors[i].selected = true;
          this.categoryForm.patchValue({
            color: this.defaultColors[i].code,
          });
          break;
        }
      }
    }
  }
}
