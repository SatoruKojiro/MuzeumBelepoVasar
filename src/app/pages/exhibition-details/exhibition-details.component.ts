import { Component } from '@angular/core';
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
  ],
  templateUrl: './exhibition-details.component.html',
  styleUrl: './exhibition-details.component.scss'
})
export class ExhibitionDetailsComponent {
  loading = true;
  exhibitions: Exhibition[] = [
    { id: 1, title: 'Utazás Térben és Időben', description: 'Munkácsy Mihály – Egy géniusz diadala', price: 2500 },
    { id: 2, title: 'Természettudományi kiállítás', description: 'Békéscsaba és Békés megye természeti kincsei', price: 1500 },
  ];

  constructor(private snackBar: MatSnackBar) {
    setTimeout(() => this.loading = false, 2000);
  }

  openSnackBar(title: string) {
    this.snackBar.open(`Jegyvásárlás: ${title}`, 'Bezár', { duration: 3000 });
  }
}
