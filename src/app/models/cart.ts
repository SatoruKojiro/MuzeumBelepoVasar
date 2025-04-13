import { Ticket } from './ticket';

export class Cart {
  constructor(
    public visitDate: string,
    public tickets: Ticket[]
  ) {}
}