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
  public id;
  // private imagen: string = 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png';
  constructor(public alumnoSrv: AlumnoService , public alContrl:AlertController) { };
  //
  
  public async iniciarSesion() {
    let datos = { mail: this.correo, password: this.contrasena1 };
    this.id = await this.alumnoSrv.logIn(datos).subscribe(
      res => { window.location.href = '/home' },
      err => { console.log(err); this.errorDeInicio() }
    )
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
