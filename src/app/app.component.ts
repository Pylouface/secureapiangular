import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { RETOUR } from './retour';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'secureapiangular';
 
constructor(public globalService : GlobalService, private router: Router) {
  // on va vérifier si on est connecté
  globalService.isConnected().subscribe((data:RETOUR) =>{
    //on affiche les messages envoyé par le serveur
    this.globalService.displayError(data._MESSAGES);
    if(data._CODE_REPONSE == 200){
      //si code, 200, alors la connection est toujours active
      // dans ce ca on navigue vers champs
     this.globalService.connected = true;
     this.router.navigate(['/champs']);
    }else{
      this.router.navigate(['/login']);
    }
  })
}



  
 

}
