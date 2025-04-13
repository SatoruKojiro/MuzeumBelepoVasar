import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: true,
  imports: [ CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule, MatExpansionModule, MatChipsModule, MatProgressSpinnerModule, MatSnackBarModule],
})
export class AboutComponent implements OnInit {
  mapLoading = true;
  email = 'mnm@munkacsy.hu';

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    setTimeout(() => {
      this.mapLoading = false;
    }, 2000);
  }

  copyEmail() {
    navigator.clipboard.writeText(this.email).then(() => {
      this.snackBar.open('E-mail cím másolva!', 'Bezár', {
        duration: 3000,
        panelClass: ['custom-snackbar'],
      });
    });
  }
}