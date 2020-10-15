import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Clase } from '../model/clase';
import { Comision } from '../model/comision';
import { ClaseService } from '../services/clase.service';
import { MateriaService } from '../services/materia.service';

@Component({
  selector: 'app-comision',
  templateUrl: './comision.page.html',
  styleUrls: ['./comision.page.scss'],
})
export class ComisionPage implements OnInit {
  public miComision = new Comision;
  public asistencias;
  constructor(private activeteRoute: ActivatedRoute, private claseSrv: ClaseService, private materiaSrv: MateriaService,private loading:LoadingController) { }
  private cantidadDeClases;
  async ngOnInit() {    
    const loading = await this.loading.create({  message: 'Cargando',
    //duration: 2000,
      spinner: 'bubbles'
    });  
    let miComision:Comision;
    this.activeteRoute.paramMap.subscribe(
      async paramMap => {
          await this.materiaSrv.getComision(paramMap.get("id")).then((datos:Comision) => {
            miComision = datos;
          });
        this.miComision = miComision;
        loading.dismiss()
      });
    this.claseSrv.obtenerClasesDeComision(this.materiaSrv.comsionActiva._id).subscribe((a: Array<Clase>) => {
      for (let i = 0; i < a.length-1; i++){
        for (let j = 1; j < a.length; j++){
          if (a[j].inicio < a[j - 1].inicio) {
            let aux = a[j];
            a[j] = a[j-1];
            a[j-1] = aux;
          }
        }
      }
      
      this.claseSrv.clasesActivas = a
      
      this.cantidadDeClases = this.claseSrv.clasesActivas.length;
      
    });
    loading.present();
    loading.present();
    this.materiaSrv.getAsistencias().subscribe((vectorAsistencia: Array<String>)=> {
      this.asistencias=vectorAsistencia.length
    })
    console.log('Asistencias: ', this.asistencias)
  };

}
