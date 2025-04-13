import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '../../models/ticket';

@Component({
  selector: 'app-ticket-selector',
  imports: [],
  templateUrl: './ticket-selector.component.html',
  styleUrl: './ticket-selector.component.scss'
})
export class TicketSelectorComponent {
  @Input() ticket: Ticket = { type: '', quantity: 0, price: 0 };
  @Input() ticketDescription: string = '';
  @Output() quantityChange = new EventEmitter<Ticket>();

  updateQuantity(change: number) {
    const newQuantity = this.ticket.quantity + change;
    if (newQuantity >= 0) {
      this.ticket.quantity = newQuantity;
      this.quantityChange.emit(this.ticket);
    }
  }
}
