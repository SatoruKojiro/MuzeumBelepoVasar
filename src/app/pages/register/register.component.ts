import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Kérjük, töltse ki mindkét mezőt.';
      return;
    }

    this.authService.register(this.email, this.password).subscribe(success => {
      if (success) {
        this.errorMessage = null;
        this.successMessage = 'Sikeres regisztráció! Átirányítás a kezdőlapra...';
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      } else {
        this.errorMessage = 'Regisztrációs hiba. Próbálja újra.';
        this.successMessage = null;
      }
    });
  }
}