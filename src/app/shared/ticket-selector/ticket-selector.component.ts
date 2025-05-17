import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../models/ticket';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-ticket-selector',
  imports: [CommonModule, CurrencyFormatPipe],
  templateUrl: './ticket-selector.component.html',
  styleUrl: './ticket-selector.component.scss'
})
export class TicketSelectorComponent {
  @Input() ticket: Ticket = { type: '', quantity: 0, price: 0 };
  @Input() ticketDescription: string = '';
  @Input() isDisabled: boolean = false;
  @Input() maxQuantity: number = 10;
  @Input() ticketCategory: string = 'General';
  @Output() quantityChange = new EventEmitter<Ticket>();
  @Output() priceChange = new EventEmitter<number>();
  @Output() selectionError = new EventEmitter<string>();
  @Output() ticketSelected = new EventEmitter<Ticket>();

  updateQuantity(change: number) {
    const newQuantity = this.ticket.quantity + change;
    if (newQuantity < 0) {
      this.selectionError.emit('A mennyiség nem lehet negatív.');
      return;
    }
    if (newQuantity > this.maxQuantity) {
      this.selectionError.emit(`A maximális mennyiség ${this.maxQuantity}.`);
      return;
    }
    this.ticket.quantity = newQuantity;
    this.quantityChange.emit(this.ticket);
    this.priceChange.emit(this.ticket.quantity * this.ticket.price);
    this.ticketSelected.emit(this.ticket);
  }
}