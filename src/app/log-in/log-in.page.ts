import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlumnoService } from '../alumno.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage {
  private correo: string;
  private contrasena1: string;
    // private imagen: string = 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png';
  constructor(public alumnoSrv: AlumnoService, public alContrl: AlertController) { 
    sessionStorage.clear()
  };
  //
  
  public async iniciarSesion() {
    let datos = { mail: this.correo, password: this.contrasena1 };
    this.alumnoSrv.logIn(datos)
      .subscribe(
        res => {
          sessionStorage.setItem('id', res as string);
          
          window.location.href = '/home'; 
        },
      err => { console.log(err); this.errorDeInicio() }
    );
    this.alumnoSrv.id = sessionStorage.getItem('id');
    console.log("id en log" + this.alumnoSrv.id);
  }
  
    public async errorDeInicio() {
  
      const cuerpoAleta = {
        header: "ERROR",
        subHeader: "Usuario o contraseña incorrecta",
        buttons: ["ok"]
      };
    
      const alerta = await this.alContrl.create(cuerpoAleta)
      await alerta.present();
    }
  


  
  

}
