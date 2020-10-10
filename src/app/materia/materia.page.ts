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

  private misComisiones;
  private miMateria = new Materia;
    
  constructor(private alertController: AlertController, private alumnoSrv:AlumnoService,private lodading: LoadingController, private activeteRoute: ActivatedRoute) { }
  
  async ngOnInit() {
    const loading = await this.lodading.create({  message: 'Cargando',
    //duration: 2000,
      spinner: 'bubbles'
    });  
    loading.present()
    await this.alumnoSrv.ngOnInit()
    
      
    let promesaMaterias
    let comisiones = [];
    let id_materia
    let materia;
    this.activeteRoute.paramMap.subscribe(async paramMap => {
      id_materia = paramMap.get('id');
      loading.dismiss()
    });
    // console.log('id de la materia: ', id_materia)
    
    await this.alumnoSrv.getMateria(id_materia).then(mat => { materia = mat; });

    this.miMateria = materia;
    console.log('la materia es' , this.miMateria)
    let registros = this.alumnoSrv.inscripciones.filter(inscripcion => inscripcion.id_materia==id_materia )
    // console.log('registro es: ', registros)
    for (let registro of registros) {
      promesaMaterias = this.alumnoSrv.getComision(registro.id_comision).then(function (com:Comision) { comisiones.push(com) });
    }
    await promesaMaterias;
    
    this.misComisiones = comisiones
    console.log('las comisiones de esta materia son :',this.misComisiones)
    
  }
  
  
  public async elegirComision() {
    let comisiones
    let cuerpo = [];
    this.alumnoSrv.getComisionesDeMaterias(this.miMateria._id).subscribe(async datos => {
      comisiones = datos
      console.log(comisiones)
      let promesa
      for (let comision of comisiones) {
      
        console.log('buscar comision con nro de id ' + comision)
      
        promesa=this.alumnoSrv.getComision(comision).then(function(data:Comision){
          
          cuerpo.push({
            name: 'checkbox' + data.id,
            type: 'radio',
            label: data.nombre,
            value: data._id
          })
                     
      })
          
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
                     
              
                this.alumnoSrv.inscribirseAComision(comision, this.miMateria._id).subscribe(nuevo => console.log(nuevo));
                window.location.reload();
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
            window.location.reload();
          }
            
            
                          
          
        }
      ]
    };
  
    const alert = await this.alertController.create(cuerpoAleta)
    await alert.present();
  }

}