import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExhibitionService } from '../../services/exhibition.service';
import { Exhibition } from '../../models/exhibition';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AdminComponent {
  exhibitions: Exhibition[] = [];
  expensiveExhibitions: Exhibition[] = [];
  limitedExhibitions: Exhibition[] = [];
  specificExhibitions: Exhibition[] = [];
  newExhibition: Partial<Exhibition> = { id: '', title: '', description: '', price: 0 };
  selectedExhibition: Partial<Exhibition> | null = null;
  specificExhibitionId: string = '';
  errorMessage: string | null = null;
  lastDoc: QueryDocumentSnapshot | null = null;

  constructor(private exhibitionService: ExhibitionService) {
    this.loadExhibitions();
  }

  loadExhibitions() {
    this.exhibitionService.getExhibitions().subscribe(data => {
      this.exhibitions = data;
    });
  }

  loadExpensiveExhibitions() {
    this.exhibitionService.getExpensiveExhibitions().subscribe(data => {
      this.expensiveExhibitions = data;
    });
  }

  loadLimitedExhibitions() {
    this.exhibitionService.getLimitedExhibitions().subscribe(result => {
      this.limitedExhibitions = result.exhibitions;
      this.lastDoc = result.lastDoc;
    });
  }

  loadMoreExhibitions() {
    if (this.lastDoc) {
      this.exhibitionService.getPaginatedExhibitions(this.lastDoc).subscribe(result => {
        this.limitedExhibitions = [...this.limitedExhibitions, ...result.exhibitions];
        this.lastDoc = result.lastDoc;
      });
    }
  }

  loadSpecificExhibitions() {
    if (this.specificExhibitionId) {
      this.exhibitionService.getSpecificExhibitions(this.specificExhibitionId).subscribe(data => {
        this.specificExhibitions = data;
        if (data.length === 0) {
          this.errorMessage = 'Nincs kiállítás a megadott ID-vel.';
        } else {
          this.errorMessage = null;
        }
      });
    } else {
      this.errorMessage = 'Kérjük, adja meg az ID-t.';
    }
  }

  addExhibition() {
    if (this.newExhibition.id && this.newExhibition.title && this.newExhibition.description && this.newExhibition.price) {
      const exhibition: Exhibition = {
        id: this.newExhibition.id,
        title: this.newExhibition.title,
        description: this.newExhibition.description,
        price: this.newExhibition.price,
      };
      this.exhibitionService.createExhibition(exhibition).then(() => {
        this.loadExhibitions();
        this.newExhibition = { id: '', title: '', description: '', price: 0 };
        this.errorMessage = null;
      }).catch(err => {
        console.error('Add error:', err);
        this.errorMessage = err.message || 'Hiba történt a kiállítás hozzáadása közben.';
      });
    } else {
      this.errorMessage = 'Kérjük, töltse ki az összes mezőt.';
    }
  }

  editExhibition(exhibition: Exhibition) {
    this.selectedExhibition = { ...exhibition };
  }

  updateExhibition() {
    if (this.selectedExhibition && this.selectedExhibition.id) {
      const updates: Partial<Exhibition> = {
        title: this.selectedExhibition.title,
        description: this.selectedExhibition.description,
        price: this.selectedExhibition.price,
      };
      this.exhibitionService.updateExhibition(this.selectedExhibition.id, updates).then(() => {
        this.loadExhibitions();
        this.selectedExhibition = null;
        this.errorMessage = null;
      }).catch(err => {
        console.error('Update error:', err);
        this.errorMessage = err.message || 'Hiba történt a kiállítás módosítása közben.';
      });
    }
  }

  deleteExhibition(id: string) {
    this.exhibitionService.deleteExhibition(id).subscribe(() => {
      this.loadExhibitions();
    }, err => {
      console.error('Delete error:', err);
    });
  }

  cancelEdit() {
    this.selectedExhibition = null;
  }
}