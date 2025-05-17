import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { JegyekComponent } from './pages/jegyek/jegyek.component';
import { VasarComponent } from './pages/vasar/vasar.component';
import { ExhibitionDetailsComponent } from './pages/exhibition-details/exhibition-details.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'jegyek', component: JegyekComponent },
  { path: 'vasar', component: VasarComponent, canActivate: [AuthGuard] },
  { path: 'exhibition/:id', component: ExhibitionDetailsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'login' },
];