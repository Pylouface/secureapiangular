import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChampsComponent } from './champs/champs.component';
import { AuthGuardGuard } from './auth-guard.guard';
import { AuthInterceptorInterceptor } from './auth-interceptor.interceptor';
import { GlobalService } from './global.service';
import { CookieService } from 'ngx-cookie-service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { EnteteComponent } from './entete/entete.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChampsComponent,
    EnteteComponent
  ],
  // NE PAS OUBLIER d'ajouter le module de toast, httpclien, forms module et browseranimation
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    GlobalService,
    CookieService,
    AuthGuardGuard,
    // Ici on parammètre un intercepteur pour modifier toutes les requetes ajax sortante
    {
      provide:HTTP_INTERCEPTORS,
      useClass:AuthInterceptorInterceptor,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
