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
  private materias = [
    {
      id: '1',
      nombre: 'matematica'
    },
    {
      id: '2',
      nombre:'lengua'
    },
    {
      id: '3',
      nombre:'quimica'
    }
  ]
  
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
    console.log(cuerpo)
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
          handler: () => {
            console.log('Confirm Ok');
            this.elegirComision();

          }
        }
      ]
    });

    await alert.present();
  }

  public async elegirComision() {
    console.log([
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
    ])
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Comisión',
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
            
          }
        }
      ]
    });

    await alert.present();
  }

}