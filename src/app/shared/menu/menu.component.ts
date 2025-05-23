import { Component, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth.service';
import { Observable, Subscription, map } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule, MatListModule],
})
export class MenuComponent implements OnDestroy {
  isLargeScreen = false;
  isSidenavOpen = false;
  isAuthenticated$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  private authSubscription: Subscription;
  private adminSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.checkScreenSize();
    this.isAuthenticated$ = this.authService.isAuthenticated();
    this.isAdmin$ = this.authService.getCurrentUser().pipe(
      map((user: User | null) => {
        const isAdmin = user?.email === 'admin@gmail.com';
        console.log('MenuComponent - Is admin:', isAdmin, 'User:', user?.email);
        return isAdmin;
      })
    );
    this.authSubscription = this.isAuthenticated$.subscribe(auth => {
      console.log('MenuComponent - Authenticated:', auth);
    });
    this.adminSubscription = this.isAdmin$.subscribe(isAdmin => {
      console.log('MenuComponent - Admin status updated:', isAdmin);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 1500;
    if (this.isLargeScreen) {
      this.isSidenavOpen = true;
    } else {
      this.isLargeScreen = false;
    }
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  closeSidenav() {
    if (!this.isLargeScreen) {
      this.isSidenavOpen = false;
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login'], { queryParams: { loggedOut: 'true' } });
      },
      error: (err) => {
        console.error('Logout error:', err);
        this.router.navigate(['/login'], { queryParams: { loggedOut: 'true' } });
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) this.authSubscription.unsubscribe();
    if (this.adminSubscription) this.adminSubscription.unsubscribe();
  }
}