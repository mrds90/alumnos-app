import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlumnoService } from '../alumno.service';
import { Alumno_Comision } from '../model/alumno_comision';
import { Aula_Comision } from '../model/aula_comision';
import { Comision } from '../model/comision';
import { Materia } from '../model/materia';
import { Materia_Comision } from '../model/materia_comison';
import { MateriaConComision } from '../model/materia_con_comision';

@Injectable({
  providedIn: 'root'
})
export class MateriaService implements OnInit {
  public todasLasMaterias: Array<Materia>=[]
  public misMaterias: Array<MateriaConComision> = [];
  public todasLasComisiones: Array<Array<String>> = [];
  public todasLasComisionesCompletas: Array<Comision> = [];
  public misComisiones: Array<Comision>=[];
  public materiaActiva: Materia = {nombre:'',_id:''};
  public comsionActiva: Comision;
  private path = "http://localhost:3000";
  
  constructor(private httpClient: HttpClient, private alContrl: AlertController, private alumnoSrv: AlumnoService) { }

  async ngOnInit() {
    
    this.todasLasMaterias = []
    this.todasLasComisiones = []
      this.getMaterias().subscribe(async (MateriasEnBaseDeDatos: Array<Materia>) => {
        for (let dato of MateriasEnBaseDeDatos) {
          this.todasLasMaterias.push(dato);
          await this.getComisionesDeMaterias(dato._id).then((comisionesDeMateria: Array<String>) => {
          this.todasLasComisiones.push(comisionesDeMateria);
          })
          console.log('las comisiones de la materia ', dato.nombre ,' son: ',this.todasLasComisiones[this.todasLasComisiones.length-1])
        }
        
      });
    
    await this.getMateriasDeAlumno()
    this.materiaActiva = { nombre: '', _id: '' };
    this.getComisiones().subscribe((comisiones: Array<Comision>) => { this.todasLasComisionesCompletas = comisiones;console.log('Comisiones completas cargadas')})
    
  
  }
  
  getAsistencias() {
    let registro = { id_comision: this.comsionActiva.id, id_alumno: this.alumnoSrv.id };
    return this.httpClient.post(this.path + '/consultar_asistencia', registro)
  }
  getMaterias() {
    return this.httpClient.get(this.path + '/materias')
  }

  getComisiones() {
    return this.httpClient.get(this.path + '/comisiones')
  }
  async getMateriasDeAlumno() {
    this.misMaterias = [];
    let promesaMaterias
    let materias = [];
    for (let registro of this.alumnoSrv.inscripciones) {
        promesaMaterias = this.getMateriaDeComision(registro.id_comision).then(function (com:Materia_Comision) { materias.push(com.id_materia) });
        await promesaMaterias;
      }
   
    materias = materias.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
    
      let promesaMisMaterias
      let mis_Materias=[]
      console.log('el id de las materias a las que asiste el alumno son: ',materias)
    for (let materia of materias) {
      promesaMisMaterias = this.getMateria(materia).then(function (data) {mis_Materias.push(data) })
      
    }
    await promesaMisMaterias; 
    
    
    for (let materia of mis_Materias) this.misMaterias.push({ materia: materia, comisiones: [] });
    for (let materia of materias) this.obtenerComisionesDeMateria(materia);
      
      
  }
  
  async getAulaDeComision(id_comision: string) {
    return await this.httpClient.get(this.path + '/aula_de_comision/' + id_comision).toPromise();
  }

  async getMateria(id_materia) {
    return this.httpClient.get(this.path + '/materia/' + id_materia).toPromise();
  }
  
  async getMateriaDeComision(id_comision) {
    return await this.httpClient.get(this.path + '/materia_de_comision/' + id_comision).toPromise();
  }

  async getComisionesDeMaterias(idMateria) {
    return await this.httpClient.get(this.path + '/listaDeComisiones/' + idMateria).toPromise();
  }

  async getComisionesDeAlumno() {
    return await this.httpClient.get(this.path + '/comisiones_de_alumno/' + this.alumnoSrv.id).toPromise();
  }


  async getComision(idComision) {

    return await this.httpClient.get(this.path + '/comision/' + idComision).toPromise()
    
  }

  async obtenerComisionesDeMateria(id_materia:String) {
    let materia:Materia;
    let comisiones = [];
  await this.getMateria(id_materia).then((mat: Materia) => { materia = mat; });

    let registros = this.alumnoSrv.inscripciones.filter(inscripcion => inscripcion.id_materia==id_materia )
    // console.log('registro es: ', registros)
    let promesaMaterias: Promise<void|Comision>;
    for (let registro of registros) {
      promesaMaterias = this.getComision(registro.id_comision).then(function (com:Comision) { comisiones.push(com) });
    }
    await promesaMaterias;
    for (let materia of this.misMaterias)
    {
      if (materia.materia._id==id_materia) materia.comisiones = comisiones;
    }
    // console.log('las comisiones de esta materia son :',materia.comis)
  } 
  range = n => Array.from({length: n}, (value, key) => key)
}

