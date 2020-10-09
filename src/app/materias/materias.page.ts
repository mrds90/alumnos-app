import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { AlertController } from '@ionic/angular';
import { AlumnoService } from '../alumno.service';
import { Alumno_Clase } from '../model/alumno_clase';
import { Alumno_Comision } from '../model/alumno_comision';
import { Comision } from '../model/comision';
import { Materia } from '../model/materia';
import { Materia_Comision } from '../model/materia_comison';

@Component({
  selector: 'app-materias',
  templateUrl: './materias.page.html',
  styleUrls: ['./materias.page.scss'],
})
export class MateriasPage implements OnInit
{
  public misMaterias;
  private todasLasMaterias;
  private inscripciones : Array<Alumno_Comision>;
  
  constructor(private alertController: AlertController, private alumnoSrv:AlumnoService) { }
  
  async ngOnInit() {
    this.alumnoSrv.id = sessionStorage.getItem('id');
    this.alumnoSrv.getMaterias().subscribe(datos => {
      this.todasLasMaterias = datos
    });
    let registros
    let promesaComision = this.alumnoSrv.getComisionesDeAlumno().then(function (data: Array<Alumno_Comision>) { registros = data });
    await promesaComision;
    let promesaMaterias
    let materias = [];
    for (let registro of registros) {

      promesaMaterias = this.alumnoSrv.getMateriaDeComision(registro.id_comision).then(function (com:Materia_Comision) { materias.push(com.id_materia) });
      await promesaMaterias;
    }
    this.inscripciones = registros;
    
    let promesaMisMaterias
    let mis_Materias=[]
    console.log('las materias son: ',materias)
    for (let materia of materias) {
      promesaMisMaterias = this.alumnoSrv.getMateria(materia).then(function (data) { console.log('la materia tiene' , data) ; mis_Materias.push(data) })
    }
    await promesaMisMaterias;
    this.misMaterias=mis_Materias
    console.log(this.misMaterias)
    


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
    let cuerpo=[];
    for (let mat of this.todasLasMaterias) {
      cuerpo.push( {
        name: 'checkbox'+mat.id,
        type: 'radio',
        label: mat.nombre,
        value: mat._id
      })
        
    }
    console.log('las materias son: ', cuerpo)
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

  public async elegirComision(materia) {
    let comisiones
    let cuerpo = [];
    this.alumnoSrv.getComisionesDeMaterias(materia).subscribe(async datos => {
      comisiones = datos
      console.log(comisiones)
     
      let promesas
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
  
          console.log('hice el push')
          
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
              console.log('Confirm OK');
              console.log(comision)
              console.log(materia)
              
              
              this.alumnoSrv.inscribirseAComision(comision, materia).subscribe(nuevo => console.log(nuevo));
              window.location.reload();
              //Falta desabilitar boton si no hay comision seleccionada
                            
            }
          }
        ]
      });
  
      await alert.present();



    });
  }

  public async borrarMateria(materia:Materia) {

    const cuerpoAleta = {
      header: "Desmatricularese",
      subHeader: "¿Seguro que desea desmatricularse de " + materia.nombre +'?',
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
            console.log('Registros es:',registros)
            for (let inscripcion of registros) {
              
              if (inscripcion.id_materia == materia._id){
                //borrar el registro de inscripcion
                this.alumnoSrv.desmatricularseAComision(inscripcion._id as String).subscribe(nuevo => nuevo);
              }
            }
            
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