import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

interface IRegisterForm {
  email: FormControl<string>;
  password: FormControl<string>;
  name: FormControl<string>;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm!: FormGroup<IRegisterForm>;

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z\s]+$/),
        ],
      }),
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.email,
        ],
      }),
      password: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      }),
    });
  }

  register() {
    this.registerForm.patchValue({
      name: this.capitalizeFirstLetter(this.registerForm.value.name!),
    });
    console.log(this.registerForm.getRawValue());
  }

  capitalizeFirstLetter(str: string) {
    const words: string[] = str.toLowerCase().trim().split(' ');

    const capitalizedWords = words.map((word) =>
      (word.charAt(0).toUpperCase() + word.slice(1)).trim()
    );

    const capitalizedStr = capitalizedWords.join(' ');

    return capitalizedStr;
  }
}
