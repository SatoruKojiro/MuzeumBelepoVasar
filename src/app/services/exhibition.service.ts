import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter, CollectionReference, QuerySnapshot, QueryDocumentSnapshot, setDoc } from '@angular/fire/firestore';
import { Observable, from, map, catchError, throwError } from 'rxjs';
import { Exhibition } from '../models/exhibition';

@Injectable({
  providedIn: 'root',
})
export class ExhibitionService {
  private exhibitionsCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.exhibitionsCollection = collection(this.firestore, 'exhibitions');
  }

  async seedExhibitions(): Promise<void> {
    const exhibitionsSnapshot = await getDocs(this.exhibitionsCollection);
    const existingTitles = new Set(exhibitionsSnapshot.docs.map(doc => (doc.data() as Partial<Exhibition>).title as string));

    const initialExhibitions: Omit<Exhibition, 'id'>[] = [
      {
        title: 'Utazás Térben és Időben',
        description: 'Munkácsy Mihály – Egy géniusz diadala',
        price: 2500,
      },
      {
        title: 'Természettudományi kiállítás',
        description: 'Békéscsaba és Békés megye természeti kincsei',
        price: 1500,
      },
      {
        title: 'Régészeti kiállítás',
        description: 'Békés megye történelme',
        price: 1200,
      },
      {
        title: 'Néprajzi és történelmi kiállítás',
        description: 'Békéscsaba történelme és népei',
        price: 1000,
      },
    ];

    let addedCount = 0;
    for (const exhibition of initialExhibitions) {
      if (!existingTitles.has(exhibition.title)) {
        await this.createExhibition({ id: '', ...exhibition } as Exhibition).catch(err => {
          console.error(`Error seeding ${exhibition.title}:`, err);
        });
        console.log(`Added exhibition: ${exhibition.title}`);
        addedCount++;
      }
    }

    if (addedCount > 0) {
      console.log(`Firestore seeded with ${addedCount} new exhibitions`);
    } else {
      console.log('Firestore already contains all initial exhibitions');
    }
  }

  async createExhibition(exhibition: Exhibition): Promise<void> {
    const { id, ...data } = exhibition;
    try {
      if (id) {
        const exhibitionDoc = doc(this.firestore, `exhibitions/${id}`);
        await setDoc(exhibitionDoc, data);
      } else {
        await addDoc(this.exhibitionsCollection, data);
      }
    } catch (error) {
      throw new Error('Nem jogosult új kiállítás létrehozására. Csak az adminisztrátor (admin@gmail.com) végezhet ilyen műveletet.');
    }
  }

  getExhibitions(): Observable<Exhibition[]> {
    return from(getDocs(this.exhibitionsCollection)).pipe(
      map((snapshot: QuerySnapshot) =>
        snapshot.docs.map(doc => {
          const data = doc.data() as { title: string; description: string; price: number };
          return { id: doc.id, ...data } as Exhibition;
        })
      )
    );
  }

  async updateExhibition(id: string, exhibition: Partial<Exhibition>): Promise<void> {
    const exhibitionDoc = doc(this.firestore, `exhibitions/${id}`);
    try {
      await updateDoc(exhibitionDoc, exhibition);
    } catch (error) {
      throw new Error('Nem jogosult a kiállítás módosítására. Csak az adminisztrátor (admin@gmail.com) végezhet ilyen műveletet.');
    }
  }

  deleteExhibition(id: string): Observable<void> {
    const exhibitionDoc = doc(this.firestore, `exhibitions/${id}`);
    return from(deleteDoc(exhibitionDoc)).pipe(
      catchError(error => {
        return throwError(() => new Error('Nem jogosult a kiállítás törlésére. Csak az adminisztrátor (admin@gmail.com) végezhet ilyen műveletet.'));
      })
    );
  }

  getExpensiveExhibitions(): Observable<Exhibition[]> {
    const q = query(this.exhibitionsCollection, where('price', '>', 1500), orderBy('price', 'asc'));
    return from(getDocs(q)).pipe(
      map((snapshot: QuerySnapshot) =>
        snapshot.docs.map(doc => {
          const data = doc.data() as { title: string; description: string; price: number };
          return { id: doc.id, ...data } as Exhibition;
        })
      )
    );
  }

  getLimitedExhibitions(): Observable<{ exhibitions: Exhibition[], lastDoc: QueryDocumentSnapshot | null }> {
    const q = query(this.exhibitionsCollection, orderBy('title'), limit(2));
    return from(getDocs(q)).pipe(
      map((snapshot: QuerySnapshot) => ({
        exhibitions: snapshot.docs.map(doc => {
          const data = doc.data() as { title: string; description: string; price: number };
          return { id: doc.id, ...data } as Exhibition;
        }),
        lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
      }))
    );
  }

  getPaginatedExhibitions(lastDoc: QueryDocumentSnapshot | null): Observable<{ exhibitions: Exhibition[], lastDoc: QueryDocumentSnapshot | null }> {
    const q = lastDoc
      ? query(this.exhibitionsCollection, orderBy('title'), startAfter(lastDoc), limit(2))
      : query(this.exhibitionsCollection, orderBy('title'), limit(2));
    return from(getDocs(q)).pipe(
      map((snapshot: QuerySnapshot) => ({
        exhibitions: snapshot.docs.map(doc => {
          const data = doc.data() as { title: string; description: string; price: number };
          return { id: doc.id, ...data } as Exhibition;
        }),
        lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
      }))
    );
  }

  getSpecificExhibitions(id: string): Observable<Exhibition[]> {
    const exhibitionDoc = doc(this.firestore, `exhibitions/${id}`);
    return from(getDoc(exhibitionDoc)).pipe(
      map(docSnapshot => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as { title: string; description: string; price: number };
          return [{ id: docSnapshot.id, ...data }] as Exhibition[];
        } else {
          return [];
        }
      })
    );
  }
}