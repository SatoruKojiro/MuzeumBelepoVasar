import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideFirebaseApp(() => 
      initializeApp({projectId: "muzeum-belepo-projekt", 
        appId: "1:273450923939:web:4fe7f4bccbc1731fc7cc16", 
        storageBucket: "muzeum-belepo-projekt.firebasestorage.app", 
        apiKey: "AIzaSyC-ptfTv7OwFBLBO6E5O5HNHJ1KG7oQTRI", 
        authDomain: "muzeum-belepo-projekt.firebaseapp.com", 
        messagingSenderId: "273450923939"})), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore())]
};
