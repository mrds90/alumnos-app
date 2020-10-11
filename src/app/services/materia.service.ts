import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlumnoService } from '../alumno.service';
import { Comision } from '../model/comision';
import { Materia } from '../model/materia';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  public miMateria: Materia;
  public misComisiones: Array<Comision>;
  private path = "http://localhost:3000";
  
  constructor(private httpClient: HttpClient, private alContrl: AlertController, private alumnoSrv: AlumnoService) { }

  getMaterias() {
    return this.httpClient.get(this.path + '/materias')
  }

  async getMateria(id_materia) {
    return this.httpClient.get(this.path + '/materia/' + id_materia).toPromise();
  }
  
  async getMateriaDeComision(id_comision) {
    return await this.httpClient.get(this.path + '/materia_de_comision/' + id_comision).toPromise();
  }

  getComisionesDeMaterias(idMateria) {
    return this.httpClient.get(this.path + '/listaDeComisiones/' + idMateria);
  }

  async getComisionesDeAlumno() {
    return await this.httpClient.get(this.path + '/comisiones_de_alumno/' + this.alumnoSrv.id).toPromise();
  }


  async getComision(idComision) {

    return await this.httpClient.get(this.path + '/comision/' + idComision).toPromise()
    
  }

  async obtenerMisComisionesDeMateria(id_materia:String) {
    let materia:Materia;
    let comisiones = [];
  await this.getMateria(id_materia).then((mat: Materia) => { materia = mat; });

    this.miMateria = materia;
    let registros = this.alumnoSrv.inscripciones.filter(inscripcion => inscripcion.id_materia==id_materia )
    // console.log('registro es: ', registros)
    let promesaMaterias: Promise<void|Comision>;
    for (let registro of registros) {
      promesaMaterias = this.getComision(registro.id_comision).then(function (com:Comision) { comisiones.push(com) });
    }
    await promesaMaterias;
    
    this.misComisiones = comisiones
    console.log('las comisiones de esta materia son :',this.misComisiones)
  }  
}

