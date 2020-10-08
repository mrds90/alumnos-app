import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlumnoService } from '../alumno.service';

@Component({
  selector: 'app-materias',
  templateUrl: './materias.page.html',
  styleUrls: ['./materias.page.scss'],
})
export class MateriasPage implements OnInit
{ 
  private todasLasMaterias;
  
  
  constructor(private alertController: AlertController, private alumnoSrv:AlumnoService) { }
  
  ngOnInit(): void {
    this.alumnoSrv.getMaterias().subscribe(datos => {
      this.todasLasMaterias = datos
    });
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
            this.elegirComision(data);

          }
        }
      ]
    });

    await alert.present();
  }

  public async elegirComision(data) {
    let comisiones
    let cuerpo = [];
    this.alumnoSrv.getComisionesDeMaterias(data).subscribe(async datos => {
      comisiones = datos
      console.log(comisiones)
     
      let promesas
      let promesa
      for (let comision of comisiones) {
      
        console.log('buscar comision con nro de id ' + comision)
      
        promesa=this.alumnoSrv.getComision(comision).then(function(data){
          
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
      console.log('las comisiones son: ', cuerpo)
      
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
            handler: () => {
              console.log('Confirm Ok');
              
            }
          }
        ]
      });
  
      await alert.present();



    });
    
    
    
  }

}