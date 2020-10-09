import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService implements OnInit {
 
  public id;
  private path = "http://localhost:3000";
  constructor(private httpClient: HttpClient, private alContrl: AlertController) { }
  
  ngOnInit() { 
    this.id = localStorage.getItem('id');
  }
  getAlumnos() {
  return this.httpClient.get(this.path + '/alumnos')
  }
  getAlumno() {
    this.id = localStorage.getItem('id');
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
    return await this.httpClient.get(this.path + '/materia/' + id_materia).toPromise();
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

  inscribirseAComision(comision) {
    let registro = { id_comision: comision, id_alumno: this.id };
    return this.httpClient.post(this.path + '/alumno_comision', registro);
  }


  
}
