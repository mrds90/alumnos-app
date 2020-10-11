import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { AlertController, LoadingController } from '@ionic/angular';
import { AlumnoService } from '../alumno.service';
import { Alumno_Clase } from '../model/alumno_clase';
import { Alumno_Comision } from '../model/alumno_comision';
import { Comision } from '../model/comision';
import { Materia } from '../model/materia';
import { Materia_Comision } from '../model/materia_comison';
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
    loading.dismiss()
    this.materiaSrv.getMaterias().subscribe(datos => {
      this.todasLasMaterias = datos
    });

    let promesaMaterias
    let materias = [];
    for (let registro of this.alumnoSrv.inscripciones) {

      promesaMaterias = this.materiaSrv.getMateriaDeComision(registro.id_comision).then(function (com:Materia_Comision) { materias.push(com.id_materia) });
      await promesaMaterias;
    }
    
    materias = materias.filter(function(elem, index, self) {
      return index === self.indexOf(elem);
  })
    
  
    let promesaMisMaterias
    let mis_Materias=[]
    console.log('las materias son: ',materias)
    for (let materia of materias) {
      promesaMisMaterias = this.materiaSrv.getMateria(materia).then(function (data) { console.log('la materia tiene' , data) ; mis_Materias.push(data) })
    }
    await promesaMisMaterias;
    
  
    this.misMaterias = mis_Materias
    console.log(this.misMaterias)
    if (this.misMaterias.length>0){
    if (this.id_materia_activa == undefined || this.misMaterias.filter(materia => materia._id==this.id_materia_activa).length == 0 ) this.materiaSrv.obtenerMisComisionesDeMateria(this.misMaterias[0]._id);
      else this.materiaSrv.obtenerMisComisionesDeMateria(this.id_materia_activa);
    };
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
    
    for (let mat of this.todasLasMaterias) {
      let bandera =true
      for (let miMat of this.misMaterias) {
        if (miMat._id == mat._id) bandera = false;
      }
      if (bandera==true)
      {  cuerpo.push( {
          name: 'checkbox'+mat.id,
          type: 'radio',
          label: mat.nombre,
          value: mat._id
      })
      };
        
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

  public async elegirComision(materia=this.materiaSrv.miMateria._id) {
    let id_comisiones
    let cuerpo = [];
    await this.materiaSrv.obtenerMisComisionesDeMateria(materia)
    console.log('mis comisiones son: ',this.materiaSrv.misComisiones);
    this.materiaSrv.getComisionesDeMaterias(materia).subscribe(async datos => {
      id_comisiones = datos
      console.log('id de comisiones de la materia: ',id_comisiones)
     
     
      let promesa
      for (let id_comision of id_comisiones) {
        console.log('buscar comision con nro de id ' + id_comision)
        let comisionCompleta: Comision;
        promesa= this.materiaSrv.getComision(id_comision).then(function(data:Comision){comisionCompleta=data})
        await promesa
        console.log('en data hay', comisionCompleta)

        let bandera =true
        for (let miCom of this.materiaSrv.misComisiones) {
          if (miCom._id == comisionCompleta._id) bandera = false;
        }
        if (bandera==true)
        {cuerpo.push({
          name: 'checkbox' + comisionCompleta.id,
          type: 'radio',
          label: comisionCompleta.nombre,
          value: comisionCompleta._id
        })
        };

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



    });
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

            this.ngOnInit();
            console.log('Confirm OK');
            
            //window.location.reload();
                          
          }
        }
      ]
    };
  
    const alert = await this.alertController.create(cuerpoAleta)
    await alert.present();
  }

  async mostrarComisiones(id_materia) {
    if (this.id_materia_activa == id_materia) this.id_materia_activa = '';
    else this.id_materia_activa = id_materia;
    this.materiaSrv.obtenerMisComisionesDeMateria(id_materia);




    
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