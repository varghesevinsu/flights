import {Routes } from '@angular/router';
import { AppLayoutComponent } from '@app/app-layout/app-layout.component';
import { AppLandingPageComponent } from '@app/app-landing-page/app-landing-page.component';
import { AuthenticationResolver } from '@app/auth/authentication.resolver';
import { LoginDetailComponent } from '@app/auth/login/login.component';

export const routes: Routes = [
  {
    path: 'landing',
    component: AppLandingPageComponent
  },
  {
    path: '',
    component: AppLayoutComponent,
    resolve:{},
    children: [
          {
        path: 'applicationuser',
        loadChildren: () => import('@app/application-user/application-user.module').then(m => m.ApplicationUserModule)
      },
      {
        path: 'americanflights',
        loadChildren: () => import('@app/american-flights/american-flights.module').then(m => m.AmericanFlightsModule)
      }
   	]
  }
];
