import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlumnoService } from '../alumno.service';
import { Alumno_Comision } from '../model/alumno_comision';
import { Aula_Comision } from '../model/aula_comision';
import { Comision } from '../model/comision';
import { Materia } from '../model/materia';
import { Materia_Comision } from '../model/materia_comison';

@Injectable({
  providedIn: 'root'
})
export class MateriaService implements OnInit {
  public todasLasMaterias: Array<Materia>=[]
  public misMaterias: Array<
  {
    materia: Materia,
    comisiones: Array<Comision>
  }
    > = [];
public todasLasComisiones: Array<Array<String>> = [];
public todasLasComisionesCompletas: Array<Comision> = [];
public misComisiones: Array<Comision>=[];
public materiaActiva: Materia = {nombre:'',_id:''};
public comsionActiva: Comision;
  private path = "http://localhost:3000";
  
  constructor(private httpClient: HttpClient, private alContrl: AlertController, private alumnoSrv: AlumnoService) { }

  async ngOnInit() {
    
    if (this.todasLasMaterias.length < 1) {
      this.getMaterias().subscribe((datos: Array<Materia>) => {
        for (let dato of datos) {
          this.todasLasMaterias.push(dato);
          this.getComisionesDeMaterias(dato._id).subscribe((comisionesDeMateria: Array<String>) => {
            this.todasLasComisiones.push(comisionesDeMateria);
            console.log('las comisiones de la materia son: ',comisionesDeMateria)
          })
        }
        
      });
    }
    await this.getMateriasDeAlumno()
    this.materiaActiva = { nombre: '', _id: '' };
    this.getComisiones().subscribe((comisiones:Array<Comision>)=>this.todasLasComisionesCompletas=comisiones)
    
  
  }
  
  getMaterias() {
    return this.httpClient.get(this.path + '/materias')
  }

  getComisiones() {
    return this.httpClient.get(this.path + '/comisiones')
  }
  async getMateriasDeAlumno() {
    this.misMaterias = [];
    let registros
    let promesaComision = this.alumnoSrv.getComisionesDeAlumno().then(function (data: Array<Alumno_Comision>) { registros = data });
    await promesaComision;
      let promesaMaterias
    let materias = [];
    let comisionesSinAula = [];
      for (let registro of this.alumnoSrv.inscripciones) {
        promesaMaterias = this.getMateriaDeComision(registro.id_comision).then(function (com:Materia_Comision) { materias.push(com.id_materia) });
        await promesaMaterias;
      }
   
    materias = materias.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
    
      let promesaMisMaterias
      let mis_Materias=[]
      console.log('las materias son: ',materias)
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

  getComisionesDeMaterias(idMateria) {
    return this.httpClient.get(this.path + '/listaDeComisiones/' + idMateria);
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

