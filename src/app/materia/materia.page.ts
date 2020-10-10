import { CommentStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AlumnoService } from '../alumno.service';
import { Alumno_Comision } from '../model/alumno_comision';
import { Comision } from '../model/comision';
import { Materia } from '../model/materia';

@Component({
  selector: 'app-materia',
  templateUrl: './materia.page.html',
  styleUrls: ['./materia.page.scss'],
})
export class MateriaPage implements OnInit {

  constructor(private alertController: AlertController, private alumnoSrv:AlumnoService,private lodading: LoadingController, private activeteRoute: ActivatedRoute) { }
  
  async ngOnInit() {
    const loading = await this.lodading.create({  message: 'Cargando',
    //duration: 2000,
      spinner: 'bubbles'
    });  
    loading.present()
    await this.alumnoSrv.ngOnInit()
    
      
    let id_materia: string;
    
    this.activeteRoute.paramMap.subscribe(async paramMap => {
      id_materia = paramMap.get('id');
      loading.dismiss()
    });
    // console.log('id de la materia: ', id_materia)
    
   this.alumnoSrv.obtenerComisionesDeMateria(id_materia);
    
  }
  
  
  public async elegirComision() {
    let id_de_comisiones: Array<String>;
    let cuerpo = [];
    this.alumnoSrv.getComisionesDeMaterias(this.alumnoSrv.miMateria._id).subscribe(async (datos: Array<String>) => {
      id_de_comisiones = datos
      console.log(id_de_comisiones)
      let promesa: Promise<void | Comision>;
      
      for (let id_comision of id_de_comisiones) {
        if(this.alumnoSrv.misComisiones.filter(comisiones => comisiones._id==id_comision).length==0)  
        {
          console.log('buscar comision con nro de id ' + id_comision)
      
          promesa=this.alumnoSrv.getComision(id_comision).then(function(data:Comision){
            
            cuerpo.push({
              name: 'checkbox' + data.id,
              type: 'radio',
              label: data.nombre,
              value: data._id
            })
                     
        })
        };
          
      }
      await promesa
      
      
      const alert = await this.alertController.create({
      
        cssClass: 'my-custom-class',
        header: 'Comisión',
        inputs: cuerpo,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (comision) => {
              if (comision!=undefined){
                console.log('Confirm OK');
                console.log(comision)
                     
              
                this.alumnoSrv.inscribirseAComision(comision, this.alumnoSrv.miMateria._id).subscribe(nuevo => console.log(nuevo));
                this.ngOnInit();
                // window.location.reload();
              }
              else {
                this.alertaDeNoSeleccion();
              }
                
              //Falta desabilitar boton si no hay comision seleccionada
                            
            }
          }
        ]
      });
  
      await alert.present();
    });
  }

  public async alertaDeNoSeleccion() {

    const cuerpoAleta = {
      header: "ERROR",
      subHeader: "No selecciono ninguna comision",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Ok',
          handler:async () => {
            this.elegirComision();    
        }
            
            
                          
          
        }
      ]
    };
  
    const alert = await this.alertController.create(cuerpoAleta)
    await alert.present();
  }

  public async borrarComision(comision:Comision) {

    const cuerpoAleta = {
      header: "Desmatricularese",
      subHeader: "¿Seguro que desea desmatricularse de " + comision.nombre +'?',
      message: 'Perderá toda la información asociada a la comision',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Ok',
          handler:async () => {
                      
            let inscripcion: Array<Alumno_Comision> = this.alumnoSrv.inscripciones.filter(inscripcion => inscripcion.id_comision==comision._id )
            this.alumnoSrv.desmatricularseAComision(inscripcion[0]._id as String).subscribe(nuevo => nuevo);
            // console.log('borrara esta inscripcion: ', inscripcion)
            console.log('Confirm OK');
            this.ngOnInit();
          }
            
            
                          
          
        }
      ]
    };
  
    const alert = await this.alertController.create(cuerpoAleta)
    await alert.present();
  }

}