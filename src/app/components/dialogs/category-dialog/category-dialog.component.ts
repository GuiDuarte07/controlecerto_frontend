import { Component, OnInit } from '@angular/core';
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
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';

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
  defaultColors: Color[] = [
    { code: '#FF5733', selected: false },
    { code: '#FFD700', selected: false },
    { code: '#32CD32', selected: false },
    { code: '#4682B4', selected: false },
    { code: '#9400D3', selected: false },
    { code: '#FF1493', selected: false },
    { code: '#00CED1', selected: false },
    { code: '#8A2BE2', selected: false },
    { code: '#F08080', selected: false },
    { code: '#7FFFD4', selected: false },
  ];

  collapsedIcons: boolean = true;

  icons: string[] = iconsOptions;
  selectedIcon = this.icons[0];

  constructor(
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    private snackBar: MatSnackBar
  ) {}

  closeDialog(sucess: boolean) {
    this.dialogRef.close(sucess);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 3000,
      horizontalPosition: 'start',
      verticalPosition: 'top',
      panelClass: ['.snackbar-error'],
    });
  }

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
      color: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    this.setRandomDefaultColor();
  }

  createNewCategory() {
    const createdCategory = new Category(
      undefined,
      this.categoryForm.value.name!,
      this.categoryForm.value.icon!,
      this.categoryForm.value.billType!,
      this.categoryForm.value.color!
    );
    this.categoryService.createCategory(createdCategory).subscribe({
      next: (value) => {
        console.log(value);
        this.cleanForm();
        this.closeDialog(true);
      },
      error: (err) => {
        this.openSnackBar('Houve um erro na criação da conta: ' + err.message);
      },
    });
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

  resetSelectedColor() {
    this.defaultColors.forEach((c) => (c.selected = true));
  }

  setRandomDefaultColor() {
    const indiceAleatorio = Math.floor(
      Math.random() * this.defaultColors.length
    );

    this.defaultColors[indiceAleatorio].selected = true;
    this.categoryForm.patchValue({
      color: this.defaultColors[indiceAleatorio].code,
    });
  }
}
