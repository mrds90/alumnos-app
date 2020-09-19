import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {

  private correo: string;
  private contrasena1: string;
  private contrasena2: string;
  private sexo: string = 'f';
  // private imagen: string = 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png';
  constructor() { };
  public guardar(): void {
    let textoSexo = "masculino"
    if (this.sexo == "f") {
      textoSexo = "femenino";
    }
    else {
        if (this.sexo == "o") {
          textoSexo = "otro";
        }
    }
    
    if (this.correo == undefined || this.correo == '' || this.contrasena1 == undefined || this.contrasena1 == ''|| this.contrasena2 == undefined|| this.contrasena2 == ''){
    alert('ERROR: Hay campos obligatorios vacios');
    }
    else{
    if (this.contrasena1 == this.contrasena2) {
      alert('registro exitoso') 
      window.location.href = '/log-in';
    } else {
      alert('ERROR: Las contraseñas no coinciden')
    }
    }
  }
  

}
