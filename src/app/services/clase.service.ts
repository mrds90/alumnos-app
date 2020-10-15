import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Clase } from '../model/clase';

@Injectable({
  providedIn: 'root'
})
export class ClaseService {
  private path = "http://localhost:3000";
  public clasesActivas: Array<Clase>;
  constructor(private httpClient: HttpClient) { }

  obtenerClasesDeComision(id_comision: String) {
    
    return this.httpClient.get(this.path + '/clases_de_comision/'+id_comision)
  }
}
