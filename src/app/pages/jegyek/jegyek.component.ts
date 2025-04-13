import { Component, OnInit } from '@angular/core';
import { Cart } from '../../models/cart';
import { Visit } from '../../models/visit';
import { Ticket } from '../../models/ticket';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jegyek',
  templateUrl: './jegyek.component.html',
  styleUrls: ['./jegyek.component.scss'],
  standalone: true,
  imports: [CommonModule ,CurrencyFormatPipe],
})
export class JegyekComponent implements OnInit {
  cart: Cart | null = null;
  visitDate: string | null = null;
  visits: Visit[] = [];

  ngOnInit() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart) as Cart; // Biztosítjuk, hogy Cart típusként kezelje
      if (this.cart) { // Null-ellenőrzés
        this.visitDate = this.cart.visitDate;
        this.visits.push({
          date: this.visitDate,
          visitorCount: this.cart.tickets.reduce((sum: number, ticket: Ticket) => sum + ticket.quantity, 0),
        });
      }
    }
  }
}