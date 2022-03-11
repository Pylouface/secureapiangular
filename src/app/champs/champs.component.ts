import { Component, OnInit } from '@angular/core';
import { CHAMPS } from '../champs';
import { GlobalService } from '../global.service';
import { RETOUR } from '../retour';

@Component({
  selector: 'app-champs',
  templateUrl: './champs.component.html',
  styleUrls: ['./champs.component.css']
})
export class ChampsComponent implements OnInit {

  // on déclare la liste des champs
  listesChamps :Array<CHAMPS> =[];

  //_________________________________________________________________________
  constructor(private monservice:GlobalService) {
    // on s'abonne aux changement fait à la variable addChampsMessage, quand elle est mis à jours on lance le chargement des champs
    this.monservice.addChampsMessage.subscribe(message => {
      this.retreive_all();
    });
   }

  /**
  * 
  */
   ngOnInit(): void {
    // au lancement on va chercher les champs
    this.retreive_all();
  }

  /**
   * affiche le formulaire de mise à jour
   * @param champs 
   */
  displayUpdate(champs:CHAMPS){
    champs._DISPLAY = true;
  }

  /**
   * cache le formulaire de mise à jour
   * @param champs 
   */
  hideUpdate(champs:CHAMPS){
    champs._DISPLAY = false;
  }

  /**
   * envoie une requete ajax pour mettre à jour le champs
   * @param champs 
   */
  update(champs:CHAMPS){
    this.monservice.update(champs).subscribe((data:RETOUR) =>{
      this.monservice.displayError(data._MESSAGES);
      if(data._CODE_REPONSE == 200){
        // inutile de recharger les données, on cache uniquement la div de modification
        champs._DISPLAY=false;
      }
    })
  }

  /**
   * va récupérer tout les champs dans la base de données
   */
  retreive_all():void{
    // on lance la requete de récupération de champs et on s'abonne au résultat
    this.monservice.getAllChamps()
    .subscribe((data:RETOUR) => {
      this.monservice.displayError(data._MESSAGES);
      // si le code réponse est 200
      if(data._CODE_REPONSE == 200){
        // on affiche la liste des champs
        this.listesChamps = data._JSON_REPONSE;
        this.listesChamps.forEach(cham => {
          cham._DISPLAY = false;
        });
        // on réinitialise la valeur du cookie
        this.monservice.setAuthCookie(data._JWT);
      }
    })
  }

  /**
   * supprime un champs en base de donnée
   * @param champs 
   */
  delete(champs:CHAMPS):void{
    this.monservice.delete(champs._ID)
    .subscribe((data:RETOUR) =>{
      if(data._CODE_REPONSE == 200){
        this.retreive_all();
      }else{
        console.warn(data);
      }
    })
  }
}