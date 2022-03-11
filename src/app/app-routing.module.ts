import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './auth-guard.guard';
import { ChampsComponent } from './champs/champs.component';
import { LoginComponent } from './login/login.component';

// Déclaration des routes possible,
// On note ici l'utilisation de AuthGuar pour vérouiller la route si pas connecté
const routes: Routes = [
  {path : 'login', component : LoginComponent},
  {path : 'champs', component : ChampsComponent, canActivate:[AuthGuardGuard]},
  {path : '', component : LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
