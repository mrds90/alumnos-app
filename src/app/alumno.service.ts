import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Alumno } from './model/alumno';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private path = "http://localhost:3000";
  constructor(private httpClient:HttpClient) { }

  getAlumnos() {
    return this.httpClient.get<Alumno[]>(this.path + '/alumnos')
  }
  
  registrarse(alumno: Alumno) {
    console.log(this.path + '/alumno');
    console.log(alumno);
    return this.httpClient.post(this.path + '/alumno', alumno);
  }
}
