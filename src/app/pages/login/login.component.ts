import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['loggedOut'] === 'true') {
        this.successMessage = 'Sikeresen kijelentkeztél.';
      }
    });
  }

  login() {
    this.authService.login(this.email, this.password).subscribe(loginSuccess => {
      if (loginSuccess) {
        this.errorMessage = null;
        this.successMessage = 'Sikeres bejelentkezés!';
        this.authService.getCurrentUser().subscribe(user => {
          if (user && user.email === 'admin@gmail.com') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/home']);
          }
        });
      } else {
        this.errorMessage = 'Hibás email vagy jelszó.';
        this.successMessage = null;
      }
    });
  }
}