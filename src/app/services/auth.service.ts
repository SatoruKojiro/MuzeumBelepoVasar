import { Injectable, OnDestroy } from '@angular/core';
import { Observable, from, BehaviorSubject, EMPTY } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(false);
  private authStateSubscription: any;

  constructor(private auth: Auth) {
    this.authStateSubscription = onAuthStateChanged(this.auth, (user) => {
      this.authState.next(!!user);
    }, (error) => {
      console.error('Auth state error:', error);
      this.authState.next(false);
    });
  }

  register(email: string, password: string): Observable<boolean> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      map(userCredential => !!userCredential.user),
      tap(isAuthenticated => this.authState.next(isAuthenticated)),
      catchError(error => {
        console.error('Registration error:', error);
        return EMPTY;
      })
    );
  }

  login(email: string, password: string): Observable<boolean> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(userCredential => !!userCredential.user),
      tap(isAuthenticated => this.authState.next(isAuthenticated)),
      catchError(error => {
        console.error('Login error:', error);
        return EMPTY;
      })
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => this.authState.next(false)),
      catchError(error => {
        console.error('Logout error:', error);
        return EMPTY;
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState.asObservable();
  }

  ngOnDestroy() {
    if (this.authStateSubscription) {
      this.authStateSubscription();
    }
  }
}