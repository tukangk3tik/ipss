import { Routes } from '@angular/router';
import { AuthGuard } from './features/auth/auth.guard';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', component: AppComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) }
];
