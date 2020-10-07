import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Alumno } from './model/alumno';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private alumno;
  public id;
  private path = "http://localhost:3000";
  constructor(private httpClient: HttpClient, private alContrl:AlertController ) { }

  getAlumnos() {
    this.id = localStorage.getItem('id');
    
    return this.httpClient.get<Alumno[]>(this.path + '/alumnos')
  }
  getAlumno() {
    this.id = localStorage.getItem('id');
    console.log('el id es: ' + this.id)
    this.alumno = this.httpClient.get<Alumno>(this.path + '/alumno/' + this.id);
    return this.alumno;
  }
  registrarse(alumno: Alumno) {
    console.log(this.path + '/alumno');
    console.log(alumno);
    return this.httpClient.post(this.path + '/alumno', alumno);
  }

  logIn(datos) {
    return this.httpClient.post(this.path + '/singIn', datos)
    }
  
}
