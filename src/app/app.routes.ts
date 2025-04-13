import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { JegyekComponent } from './pages/jegyek/jegyek.component';
import { VasarComponent } from './pages/vasar/vasar.component';
import { ExhibitionDetailsComponent } from './pages/exhibition-details/exhibition-details.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'jegyek', component: JegyekComponent },
  { path: 'vasar', component: VasarComponent },
  { path: 'exhibitions', component: ExhibitionDetailsComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: 'home' },
];