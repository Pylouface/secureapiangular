import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { GlobalService } from './global.service';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor(private globalService : GlobalService) {}

  // l'intercepteur permet d'ajouter une entête à toutes les requetes http
  // ici, on récupère le cookie de connexion et on l'envoie
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // si le token existe, l'ajoute au header
    if(this.globalService.getAuthCookie() != ""){
      // on récupère le token d'authentification depuis le cookie
      let token = 'Bearer ' + this.globalService.getAuthCookie();
      // on ajoute au header de la requete le token d'authorisation
      request = request.clone({
        headers: request.headers.set("Authorization", token)
        });
    }
    // ici on gère l'affichage des erreurs
    return next.handle(request).pipe(
      // lorsque l'on reçois autre chose qu'on code 200 en retour
      catchError((error: HttpErrorResponse) => {
        // on va chercher les messages de retour et on demande au service de les afficher
        this.globalService.displayError(error.error._MESSAGES);
        return throwError(() => error);
      })
    );
  }
}
