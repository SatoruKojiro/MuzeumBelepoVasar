import { Injectable, OnDestroy } from '@angular/core';
import { Observable, from, BehaviorSubject, EMPTY, of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState = new BehaviorSubject<boolean>(false);
  private userState = new BehaviorSubject<User | null>(null);
  private authStateSubscription: any;

  constructor(private auth: Auth) {
    this.authStateSubscription = onAuthStateChanged(this.auth, (user) => {
      console.log('Auth state changed:', user?.email || 'No user');
      this.authState.next(!!user);
      this.userState.next(user);
    }, (error) => {
      console.error('Auth state error:', error);
      this.authState.next(false);
      this.userState.next(null);
    });
  }

  register(email: string, password: string): Observable<boolean> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      map(userCredential => !!userCredential.user),
      tap(isAuthenticated => this.authState.next(isAuthenticated)),
      catchError(error => {
        console.error('Registration error:', error);
        return of(false);
      })
    );
  }

  login(email: string, password: string): Observable<boolean> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(userCredential => !!userCredential.user),
      tap(isAuthenticated => {
        console.log('Login successful, isAuthenticated:', isAuthenticated);
        this.authState.next(isAuthenticated);
      }),
      switchMap(() => this.userState.pipe(map(user => {
        const isAdmin = !!user && user.email === 'admin@gmail.com';
        console.log('Checking admin after login:', isAdmin, 'User:', user?.email);
        return isAdmin;
      }))),
      catchError(error => {
        console.error('Login error:', error);
        return of(false);
      })
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        console.log('Logged out');
        this.authState.next(false);
        this.userState.next(null);
      }),
      catchError(error => {
        console.error('Logout error:', error);
        return EMPTY;
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState.asObservable();
  }

  getCurrentUser(): Observable<User | null> {
    return this.userState.asObservable();
  }

  ngOnDestroy() {
    if (this.authStateSubscription) {
      this.authStateSubscription();
    }
  }
}