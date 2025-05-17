import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cart } from '../../models/cart';
import { Visit } from '../../models/visit';
import { Ticket } from '../../models/ticket';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';
import { CommonModule } from '@angular/common';
import { Exhibition } from '../../models/exhibition';
import { ExhibitionService } from '../../services/exhibition.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-jegyek',
  templateUrl: './jegyek.component.html',
  styleUrls: ['./jegyek.component.scss'],
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe],
})
export class JegyekComponent implements OnInit, OnDestroy {
  cart: Cart | null = null;
  visitDate: string | null = null;
  visits: Visit[] = [];
  exhibitions: Exhibition[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private exhibitionService: ExhibitionService) {}

  ngOnInit() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart) as Cart;
      if (this.cart) {
        this.visitDate = this.cart.visitDate;
        this.visits.push({
          date: this.visitDate,
          visitorCount: this.cart.tickets.reduce((sum: number, ticket: Ticket) => sum + ticket.quantity, 0),
        });
      }
    }

    this.subscription.add(
      this.exhibitionService.getExhibitions().subscribe(data => {
        this.exhibitions = data;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getExhibitionTitle(ticketType: string): string {
    const normalizedType = ticketType.replace(/-/g, ' ');
    return this.exhibitions.find(e => e.title.toLowerCase().replace(/ /g, '-') === ticketType)?.title || ticketType;
  }
}