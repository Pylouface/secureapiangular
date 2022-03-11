import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RETOUR } from './retour';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MESSAGE } from './message';
import { NotificationService } from './notification.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CHAMPS } from './champs';

@Injectable({
  providedIn: 'root'
})

export class GlobalService {
  
  // on écris ici la l'adresse de base de l'API
  baseApiUrl:string = "http://141.94.223.96/Charley/secureToken/API/";
  // par défaut l'application est déconnecté
  connected:boolean = false;

  // on écris le header à envoyer avec les xmlhttprequest
  headers =  {headers: new  HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })};

  // on met en place un système pour permettre la communication entre différents composants
  private messageAddChamps = new BehaviorSubject('default message');
  // permet de detecter les changement fait à cette variable
  addChampsMessage = this.messageAddChamps.asObservable();

  // on injecte tout ce dont le service a besoin pour fonctionner
  constructor(
    private notifyService:NotificationService,
    private http: HttpClient,
    private cookieService :CookieService, 
    private route: ActivatedRoute, 
    private router: Router
  ) {}


  /**
   * permet d'envoyer un message aux composants abonnés (avec .subscribe)
   * @param message 
   */
  champsAjoute(message:string):void{
    // next permet de déclencher le .subscribe
    this.messageAddChamps.next(message);
  }


  /**
   * permet de faire un appal ajax à l'api pour tenter de ce connecter
   * on récupère ensuite le jwt et le stock dans un cookie
   * @param login 
   * @param password 
   */
  login(login:string, password:string):void{
    // on construit les données à envoyer
      let dataToSend = "login="+login+"&mdp="+password;
      // on envoie via la méthode post les données et l'entête
      this.http.post<RETOUR>(this.baseApiUrl+"LOGIN/LOGIN.php", dataToSend, this.headers)
      .subscribe(
        data => {
        // quand on a les résultats
        // on affiche les messages
        this.displayError(data._MESSAGES);
        // si le code réponse est 200 alors la connexion a réussi
        if(data._CODE_REPONSE == 200){
          // on initialise le cookie
          this.setAuthCookie(data._JWT);
          // on dis qu'on est connecté (pour afficher le menu)
          this.connected= true;
          // on redirige vers la route champs
          this.router.navigate(['/champs']);
        }
    }
    )
  }
  

  /**
  * fonctions affichant autant de toast que de message dans l'array
  * @param messages array de type MESSAGE
  */
  displayError(messages:Array<MESSAGE>):void{
    messages.forEach(element => {
      // fait un toast différents en fonction du type retourné par le serveur
      switch(element._TYPE){
        case("danger"):
          this.notifyService.showError(element._TITRE, element._MESSAGE);
          break;
        case("success"):
          this.notifyService.showSuccess(element._TITRE, element._MESSAGE);
          break;
        case("warning"):
          this.notifyService.showWarning(element._TITRE, element._MESSAGE);
          break;
        default:
          this.notifyService.showInfo(element._TITRE, element._MESSAGE);
          break;
      }
    });
  }

  /**
   * fonction de navigation pour éviter d'avoir à inclure le router partout
   * @param path 
   */
  navigation(path : string):void{
    this.router.navigate([path]);
  }


 /**
  * fonction allant chercher les touts champs en BDD
  * @returns retourne un observable de RETOUR
  */
 getAllChamps():Observable<RETOUR>{
    return this.http.get<RETOUR>(this.baseApiUrl+"CHAMPS/RETREIVE_ALL_CHAMPS.php", this.headers);
  }

  /**
   * ajoute un champs à la bdd via un appel ajax
   * @param description 
   * @returns observable
   */
  addChamps(description:string):Observable<RETOUR>{
    let dataToSend = "description="+description;
    return this.http.post<RETOUR>(this.baseApiUrl+"CHAMPS/CREATE_CHAMPS.php", dataToSend,this.headers);
  }

/**
 * appel ajax avec id en description pour suppression
 * @param id 
 * @returns 
 */
  delete(id:string):Observable<RETOUR>{
    return this.http.delete<RETOUR>(this.baseApiUrl+"CHAMPS/DELETE_CHAMPS.php?id="+id, this.headers);  
  }

 /**
  * appel ajax de mise à jour
  * @param champs 
  * @returns 
  */ 
  update(champs:CHAMPS):Observable<RETOUR>{
    let toSend = "?id="+champs._ID+"&description="+champs._DESCRIPTION;
    return this.http.put<RETOUR>(this.baseApiUrl+"CHAMPS/UPDATE_CHAMPS.php"+toSend, this.headers);  
  }

/**
 * va vérifier si le token est bon (permet de savoir si on est toujours connecté)
 * @returns 
 */
  isConnected():Observable<RETOUR>{
    return this.http.get<RETOUR>(this.baseApiUrl+"LOGIN/IS_CONNECTED.php?", this.headers);  
  }

  /**
   * fabrique un cookie et stocke le jwt dedant
   * @param jwt 
   */
  setAuthCookie(jwt:string):void{
    this.cookieService.set('JWT_AUTH_TOKEN', jwt);
  }

  /**
   * permet de détruire le cookie
   */
  destroyAuthCookie():void{
    this.cookieService.delete('JWT_AUTH_TOKEN');
  }

  /**
   * permet de récupérer la valeur du token passé
   * @returns 
   */
  getAuthCookie():string{
    return this.cookieService.get('JWT_AUTH_TOKEN');
  }
 

}