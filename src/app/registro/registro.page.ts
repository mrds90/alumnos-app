import { Component, OnInit } from '@angular/core';
import { AlumnoService } from '../alumno.service';
import { Alumno } from '../model/alumno';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  public alumno = new Alumno;
  private dni: string;
  private nombre: string;
  private apellido: string;
  private correo: string;
  private contrasena1: string;
  private contrasena2: string;
  private sexo: string = 'f';
  // private imagen: string = 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png';
  constructor(public alumnoSrv: AlumnoService) { };
  public guardar(): void {
    
    if (this.correo == undefined || this.correo == '' || this.contrasena1 == undefined || this.contrasena1 == ''|| this.contrasena2 == undefined|| this.contrasena2 == ''){
    alert('ERROR: Hay campos obligatorios vacios');
    }
    else{
      if (this.contrasena1 == this.contrasena2) {
        this.alumno.dni = this.dni as string;
        this.alumno.nombre = this.nombre;
        this.alumno.apellido = this.apellido;
        this.alumno.mail = this.correo;
        this.alumno.password = this.contrasena1;
        this.alumnoSrv.registrarse(this.alumno).subscribe(nuevo => console.log(nuevo));
      
      //funcion del servicio
      alert('registro exitoso') 
      window.location.href = '/log-in';
    } else {
      alert('ERROR: Las contraseñas no coinciden')
    }
    }
  }
  

}
