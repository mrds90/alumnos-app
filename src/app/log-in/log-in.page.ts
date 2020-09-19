import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage {

  private correo: string;
  private contrasena1: string;
  // private imagen: string = 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png';
  constructor() { };
  //
  
  public iniciarSesion(): void {
    //existe usuario?
      //si-->contraseña correcta?
        //si--> routing home
        //no--> contraseña incorrecta
      //no--> alert no existe usuario
  }
  

}
