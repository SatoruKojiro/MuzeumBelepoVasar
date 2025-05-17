import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CapitalizePipe } from '../../shared/pipes/capitalize.pipe';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule, CapitalizePipe],
})
export class ContactComponent {
  contactForm: FormGroup;
  labels = {
    name: 'név',
    email: 'e-mail',
    subject: 'tárgy',
    message: 'üzenet',
  };

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Űrlap adatai:', this.contactForm.value);
      this.snackBar.open('Üzenet elküldve!', 'Bezár', {
        duration: 3000,
        panelClass: ['custom-snackbar'],
      });
      this.contactForm.reset();
    }
  }
}