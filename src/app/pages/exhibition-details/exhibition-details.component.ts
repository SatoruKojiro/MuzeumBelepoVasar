import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Exhibition } from '../../models/exhibition';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../models/ticket';
import { Cart } from '../../models/cart';
import { ExhibitionService } from '../../services/exhibition.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-exhibition-details',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatToolbarModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatBadgeModule,
    MatSnackBarModule,
    CommonModule,
  ],
  templateUrl: './exhibition-details.component.html',
  styleUrls: ['./exhibition-details.component.scss'],
  standalone: true,
})
export class ExhibitionDetailsComponent implements OnInit {
  loading = true;
  exhibitions: Exhibition[] = [];
  selectedExhibition: Exhibition | null = null;
  isAuthenticated = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private exhibitionService: ExhibitionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.subscription.add(
      this.authService.isAuthenticated().subscribe(authStatus => {
        this.isAuthenticated = authStatus;
      })
    );
    if (id) {
      this.subscription.add(
        this.exhibitionService.getSpecificExhibitions(id).subscribe({
          next: (data) => {
            this.selectedExhibition = data[0] || null;
            this.loading = false;
            if (!this.selectedExhibition) {
              this.subscription.add(
                this.exhibitionService.getExhibitions().subscribe({
                  next: (allExhibitions) => {
                    this.exhibitions = allExhibitions;
                    this.selectedExhibition = this.exhibitions.find(e => e.id === id) || null;
                  },
                  error: (err) => console.error('Error loading all exhibitions:', err),
                })
              );
            }
          },
          error: (err) => {
            console.error('Error loading specific exhibition:', err);
            this.loading = false;
          },
        })
      );
    } else {
      this.subscription.add(
        this.exhibitionService.getExhibitions().subscribe({
          next: (data) => {
            this.exhibitions = data;
            this.loading = false;
          },
          error: (err) => console.error('Error loading all exhibitions:', err),
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  openSnackBar(title: string) {
    if (this.isAuthenticated) {
      this.addToCart(title);
      this.snackBar.open(`Jegyvásárlás: ${title}`, 'Bezár', { duration: 3000 });
    } else {
      this.snackBar.open('Kérjük, jelentkezzen be a vásárláshoz!', 'Bezár', { duration: 3000 });
    }
  }

  addToCart(title: string) {
    const exhibition = this.exhibitions.find(e => e.title === title) || this.selectedExhibition;
    if (exhibition) {
      const ticket = new Ticket(title.toLowerCase().replace(/ /g, '-'), 1, exhibition.price);
      let cart: Cart | null = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')!) as Cart : null;
      if (!cart) {
        cart = new Cart(new Date().toISOString().split('T')[0], [ticket]);
      } else {
        const existingTicket = cart.tickets.find(t => t.type === ticket.type);
        if (existingTicket) {
          existingTicket.quantity += 1;
        } else {
          cart.tickets.push(ticket);
        }
      }
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }
}