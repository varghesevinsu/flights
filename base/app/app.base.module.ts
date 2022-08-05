import { NgModule } from '@angular/core';
import { BrowserModule, } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { AppLayoutComponent } from '@app/app-layout/app-layout.component';
import { AppHeaderComponent } from '@app/app-layout/app-header/app-header.component';
import { AppSideBarComponent } from '@app/app-layout/app-side-bar/app-side-bar.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthenticationResolver } from '@app/auth/authentication.resolver';
import { DirectiveModule } from './directive/directive.module';
import { SidebarModule } from 'primeng/sidebar';
import { AppLandingPageComponent } from "@app/app-landing-page/app-landing-page.component";
import { AuthModule } from '@app/auth/auth.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@env/environment';
import { SharedBaseModule } from './shared/shared.base.module';
import { AppLoaderComponent } from './app-loader.component';
import { DatePipe } from '@angular/common';

export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n-base/', suffix: '.json' },
    { prefix: './assets/i18n/', suffix: '.json' },
  ]);
}
@NgModule({
  declarations: [
    AppLayoutComponent,
    AppHeaderComponent,
    AppSideBarComponent,
    AppLandingPageComponent,
    AppLoaderComponent
  ],
  imports: [
    SharedBaseModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
    DirectiveModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SidebarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: "registerImmediately"
    }),
    AuthModule


  ],
  exports: [
    BrowserAnimationsModule,
    TranslateModule,
    AuthModule,
    SharedBaseModule
  ],
  providers: [ConfirmationService, AuthenticationResolver, MessageService, DatePipe],
  bootstrap: []
})
export class AppBaseModule {

}