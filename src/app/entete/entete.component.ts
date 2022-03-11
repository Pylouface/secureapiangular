import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { RETOUR } from '../retour';

@Component({
  selector: 'app-entete',
  templateUrl: './entete.component.html',
  styleUrls: ['./entete.component.css']
})
export class EnteteComponent implements OnInit {

  // declaration de la variable pour le ngmodel
  description:string ="";

  constructor(private globalService :GlobalService) {
  }

  ngOnInit(): void {
    this.globalService.addChampsMessage.subscribe(message => {
      // comportement lorsque currentMessage du service change
    })
  }

  /**
   * fonction de déconnexion, supprime le cookie, désaffiche le menu, redirige vers le login
   */
  deconnexion():void{
    //on supprime le cookie
    this.globalService.destroyAuthCookie();
    this.globalService.connected = false;
    this.globalService.navigation('/login');
  }

  /**
   * fonction permettant d'ajouter un champs
   * 
   */
  addChamps():void{
    this.globalService.addChamps(this.description).subscribe((data:RETOUR) =>{
      this.globalService.displayError(data._MESSAGES);
      if(data._CODE_REPONSE == 200){
       // on envoie un message au composant champs en passant par le service
       this.globalService.champsAjoute("champs ajouté");
      }
    })
  }
}
