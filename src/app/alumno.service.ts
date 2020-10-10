import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Alumno_Comision } from './model/alumno_comision';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService implements OnInit {
  public inscripciones: Array<Alumno_Comision>;
  public id;
  private path = "http://localhost:3000";
  constructor(private httpClient: HttpClient, private alContrl: AlertController) { }
  
  async ngOnInit() { 
    this.id = sessionStorage.getItem('id');
    let registros
    await this.getComisionesDeAlumno().then(function (data: Array<Alumno_Comision>) { registros = data });
    this.inscripciones = registros;
  }
  getAlumnos() {
  return this.httpClient.get(this.path + '/alumnos')
  }
  getAlumno() {
    this.id = sessionStorage.getItem('id');
    console.log('el id es: ' + this.id)
    return this.httpClient.get(this.path + '/alumno/' + this.id);
  }
  registrarse(alumno) {
    console.log(this.path + '/alumno');
    console.log(alumno);
    return this.httpClient.post(this.path + '/alumno', alumno);
  }

  logIn(datos) {
    return this.httpClient.post(this.path + '/singIn', datos)
  }
  
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
    return await this.httpClient.get(this.path + '/comisiones_de_alumno/' + this.id).toPromise();
  }


  async getComision(idComision) {

    return await this.httpClient.get(this.path + '/comision/' + idComision).toPromise()
    
  }

  inscribirseAComision(comision,materia) {
    let registro = { id_comision: comision, id_alumno: this.id ,id_materia: materia};
    return this.httpClient.post(this.path + '/alumno_comision', registro);
  }

  desmatricularseAComision(id_registro: String) {
    console.log('registro a borrar:' , id_registro)
    return this.httpClient.delete(this.path + '/alumno_comision/'+ id_registro);
    
  }


  
}
