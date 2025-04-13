import { Component } from '@angular/core';
import { Exhibition } from '../../models/exhibition';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class HomeComponent {
  exhibitions: Exhibition[] = [
    {
      id: 1,
      title: 'Utazás Térben és Időben',
      description: 'Munkácsy Mihály – Egy géniusz diadala',
      price: 2500,
    },
    {
      id: 2,
      title: 'Természettudományi kiállítás',
      description: 'Békéscsaba és Békés megye természeti kincsei',
      price: 1500,
    },
    {
      id: 3,
      title: 'Régészeti kiállítás',
      description: 'Békés megye történelme',
      price: 1200,
    },
    {
      id: 4,
      title: 'Néprajzi és történelmi kiállítás',
      description: 'Békéscsaba történelme és népei',
      price: 1000,
    },
  ];
}