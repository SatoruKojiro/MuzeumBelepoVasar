import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Exhibition } from '../../models/exhibition';
import { CommonModule } from '@angular/common';
import { ExhibitionService } from '../../services/exhibition.service';
import { Subscription } from 'rxjs';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink],
})
export class HomeComponent implements OnInit, OnDestroy {
  exhibitions: Exhibition[] = [];
  private subscription: Subscription = new Subscription();
  public lastDoc: QueryDocumentSnapshot | null = null;
  loading = true;
  hasMore = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private exhibitionService: ExhibitionService
  ) {
    console.log('ExhibitionService:', this.exhibitionService);
    console.log('getPaginatedExhibitions:', this.exhibitionService.getPaginatedExhibitions);
  }

  async ngOnInit() {
    try {
      await this.exhibitionService.seedExhibitions();
      console.log('Seeding completed, proceeding to load exhibitions...');
      this.loadExhibitions();
    } catch (error) {
      console.error('Error seeding exhibitions:', error);
      this.error = 'Failed to seed exhibitions. Please try again later.';
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadExhibitions() {
    if (!this.exhibitionService.getPaginatedExhibitions) {
      console.error('getPaginatedExhibitions method is undefined');
      this.error = 'Service method unavailable. Please try again later.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;
    this.subscription.add(
      this.exhibitionService.getPaginatedExhibitions(this.lastDoc).subscribe({
        next: (result) => {
          console.log('Fetched exhibitions:', result.exhibitions);
          this.exhibitions = [...this.exhibitions, ...result.exhibitions];
          this.lastDoc = result.lastDoc;
          this.hasMore = result.exhibitions.length > 0;
          console.log('Updated exhibitions:', this.exhibitions);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading exhibitions:', err);
          this.error = 'Failed to load exhibitions. Please try again.';
          this.loading = false;
        },
      })
    );
  }

  viewExhibitionDetails(id: string) {
    this.router.navigate(['/exhibition', id]);
  }

  loadMore() {
    if (this.lastDoc && this.hasMore) {
      this.loadExhibitions();
    }
  }
}