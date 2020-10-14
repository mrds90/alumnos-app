import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { AlertController, LoadingController } from '@ionic/angular';
import { AlumnoService } from '../alumno.service';
import { Alumno_Clase } from '../model/alumno_clase';
import { Alumno_Comision } from '../model/alumno_comision';
import { Comision } from '../model/comision';
import { Materia } from '../model/materia';
import { Materia_Comision } from '../model/materia_comison';
import { MateriaConComision } from '../model/materia_con_comision';
import { MateriaService } from '../services/materia.service';

@Component({
  selector: 'app-materias',
  templateUrl: './materias.page.html',
  styleUrls: ['./materias.page.scss'],
})
export class MateriasPage implements OnInit
{

  public misMaterias: Array<Materia>;
  
  private todasLasMaterias;
  private id_materia_activa: string='';
  
  constructor(private alertController: AlertController,private materiaSrv:MateriaService, private alumnoSrv:AlumnoService,private loading: LoadingController) { }
  
  async ngOnInit() {
    const loading = await this.loading.create({  message: 'Cargando',
    //duration: 2000,
      spinner: 'bubbles'
    });  
    loading.present()
    await this.alumnoSrv.ngOnInit()
    await this.materiaSrv.ngOnInit()
    loading.dismiss()
  }
  
  public async elegirCarrera() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Carrera',
      inputs: [
        {
          name: 'checkbox1',
          type: 'radio',
          label: 'Checkbox 1',
          value: 'value1',
          checked: true
        },

        {
          name: 'checkbox2',
          type: 'radio',
          label: 'Checkbox 2',
          value: 'value2'
        }
      ],
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
          handler: () => {
            console.log('Confirm Ok');
            this.elegirMateria();

          }
        }
      ]
    });

    await alert.present();
  }

  public async elegirMateria() {
    let cuerpo = [];
    
    for (let mat of this.materiaSrv.todasLasMaterias) {
      let bandera =true
      for (let miMat of this.materiaSrv.misMaterias) {
        if (miMat.materia._id == mat._id) bandera = false;
      }
      if (bandera==true)
      {  cuerpo.push( {
          name: 'checkbox'+mat._id,
          type: 'radio',
          label: mat.nombre,
          value: mat._id
      })
      };
        
    }
    
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Materia',
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
          handler: (data) => {
            console.log('Confirm OK');
            console.log(data)
            //Falta desabilitar boton si no hay materia seleccionada
            this.elegirComision(data);

          }
        }
      ]
    });

    await alert.present();
  }

  public async elegirComision(materia = this.materiaSrv.materiaActiva._id) {
    let materiaCompleta = this.materiaSrv.todasLasMaterias.filter(Materia => Materia._id == materia);
    console.log('materiaCompleta: ',materiaCompleta);
    let index = this.materiaSrv.todasLasMaterias.indexOf(materiaCompleta[0]);
    console.log('index: ',index)
    let comisiones = this.materiaSrv.todasLasComisiones[index];
    console.log('comisiones: ', comisiones);
    console.log('todas comisiones completas: ', this.materiaSrv.todasLasComisionesCompletas);
    let comisionesAMostrar = this.materiaSrv.todasLasComisionesCompletas.filter(val => comisiones.includes(val._id))
    console.log('comisiones a mostrar1: ',comisionesAMostrar);
    comisionesAMostrar = comisionesAMostrar.filter(val => !this.materiaSrv.misComisiones.includes(val));
    console.log('comisiones a mostrar2: ',comisionesAMostrar);
        
    let cuerpo = [];
    for (let comisionCompleta of comisionesAMostrar){
        cuerpo.push({
          name: 'checkbox' + comisionCompleta._id,
          type: 'radio',
          label: comisionCompleta.nombre,
          value: comisionCompleta._id
        })
        ;

        console.log('hice el push')
      }

      
      console.log('cuerpo :',cuerpo)
      
      
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
              console.log(materia)
              
              
              this.alumnoSrv.inscribirseAComision(comision, materia).subscribe(nuevo => console.log(nuevo));
              this.ngOnInit();
                // window.location.reload();
              //Falta desabilitar boton si no hay comision seleccionada
              }
              else {
              this.alertaDeNoSeleccion(materia);
            }
                            
            }
          }
        ]
      });
  
      await alert.present();
    }
  
  public async alertaDeNoSeleccion(materia) {

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
            this.elegirComision(materia);    
        }
            
            
                          
          
        }
      ]
    };
  
    const alert = await this.alertController.create(cuerpoAleta)
    await alert.present();
  }
  public async borrarMateria(materia:MateriaConComision) {

    const cuerpoAleta = {
      header: "Desmatricularese",
      subHeader: "¿Seguro que desea desmatricularse de " + materia.materia.nombre +'?',
      message: 'Perderá toda la información asociada a la materia',
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
          handler:async () => {
            let registros
            let promesaComision = this.alumnoSrv.getComisionesDeAlumno().then(function (data: Array<Alumno_Comision>) { registros = data });
            await promesaComision;
            console.log('Registros es:', registros)
            
            
            let inscripciones: Array<Alumno_Comision> = this.alumnoSrv.inscripciones.filter(inscripcion => inscripcion.id_materia==materia.materia._id )
              //borrar el registro de inscripcion
            console.log('inscripciones: ',inscripciones)
            for (let inscripcion of inscripciones) {
             
              this.alumnoSrv.desmatricularseAComision(inscripcion._id as String).subscribe(nuevo => {
                nuevo;
                this.ngOnInit();
                console.log('Confirm OK');
              });
              
            }

            
            
            //window.location.reload();
                          
          }
        }
      ]
    };
  
    const alert = await this.alertController.create(cuerpoAleta)
    await alert.present();
  }

  async mostrarComisiones(id_materia) {
    if (this.materiaSrv.materiaActiva._id == id_materia) this.materiaSrv.materiaActiva= {nombre:'',_id:''};
    else 
    { 
      for (let materiaAMostrar of this.materiaSrv.misMaterias) {
      if (materiaAMostrar.materia._id == id_materia) {
        this.materiaSrv.materiaActiva = materiaAMostrar.materia;
        this.materiaSrv.misComisiones = materiaAMostrar.comisiones;
      };
    }
  }

    
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
            this.alumnoSrv.desmatricularseAComision(inscripcion[0]._id as String).subscribe(nuevo => {
              nuevo; console.log('Confirm OK');
              this.ngOnInit();
            });
            // console.log('borrara esta inscripcion: ', inscripcion)
            
          }
            
            
                          
          
        }
      ]
    };
  
    const alert = await this.alertController.create(cuerpoAleta)
    await alert.present();
  }
  setComisionActiva(comision)
  {
    this.materiaSrv.comsionActiva = comision;
  }
}