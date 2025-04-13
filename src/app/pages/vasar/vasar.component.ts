import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cart } from '../../models/cart';
import { Ticket } from '../../models/ticket';
import { TicketSelectorComponent } from '../../shared/ticket-selector/ticket-selector.component';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vasar',
  templateUrl: './vasar.component.html',
  styleUrls: ['./vasar.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, TicketSelectorComponent, CurrencyFormatPipe, CommonModule],
})
export class VasarComponent implements OnInit {
  dateForm: FormGroup;
  selectedDate: string | null = null;
  today: string;
  tickets: Ticket[] = [
    new Ticket('full', 0, 2500),
    new Ticket('youth', 0, 1250),
    new Ticket('senior', 0, 1250),
  ];
  ticketDescriptions: { [key: string]: string } = {
    full: 'Teljes árú belépő a Magyarországi színező, Rejtőzködő fényképek 1862-ből című kiállításba',
    youth: 'Kedvezményes belépő a Magyarországi színező, Rejtőzködő fényképek 1862-ből című kiállításba',
    senior: 'Kedvezményes belépő a Magyarországi színező, Rejtőzködő fényképek 1862-ből című kiállításba',
  };
  totalPrice = 0;
  cartMessage: string | null = null;

  constructor(private fb: FormBuilder) {
    const today = new Date();
    this.today = today.toISOString().split('T')[0];

    this.dateForm = this.fb.group({
      visitDate: ['', Validators.required],
    });
  }

  ngOnInit() {
    const savedDate = localStorage.getItem('visitDate');
    if (savedDate) {
      this.selectedDate = savedDate;
      this.dateForm.patchValue({ visitDate: savedDate });
    }
  }

  onDateSubmit() {
    if (this.dateForm.valid) {
      this.selectedDate = this.dateForm.get('visitDate')?.value;
      localStorage.setItem('visitDate', this.selectedDate!);
    }
  }

  onQuantityChange(updatedTicket: Ticket) {
    const ticket = this.tickets.find(t => t.type === updatedTicket.type);
    if (ticket) {
      ticket.quantity = updatedTicket.quantity;
      this.calculateTotalPrice();
    }
  }

  calculateTotalPrice() {
    this.totalPrice = this.tickets.reduce((sum: number, ticket: Ticket) => sum + ticket.quantity * ticket.price, 0);
  }

  addToCart() {
    const cart: Cart = new Cart(
      this.selectedDate!,
      this.tickets.map(ticket => new Ticket(ticket.type, ticket.quantity, ticket.price))
    );

    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartMessage = 'Jegyek hozzáadva a kosárhoz!';
    this.tickets.forEach(ticket => ticket.quantity = 0);
    this.calculateTotalPrice();

    setTimeout(() => {
      this.cartMessage = null;
    }, 3000);
  }
}