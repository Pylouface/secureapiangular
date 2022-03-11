import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // variable pour le ngmodel
  login:string="";
  password:string ="";
 
  constructor(private monService :GlobalService ) {

  }

  ngOnInit(): void {

  }
  /**
   * fait appel au service pour faire un appel ajax pour la connexion
   */
  connexion():void{
    this.monService.login(this.login, this.password);
  }

}
