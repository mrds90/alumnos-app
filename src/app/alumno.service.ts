import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
 
  public id;
  private path = "http://localhost:3000";
  constructor(private httpClient: HttpClient, private alContrl:AlertController ) { }

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
  
}
