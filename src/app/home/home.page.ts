import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  materia = 'Matematicas'
  tiempo = '1 dia y 4 horas'
    
    
  constructor() {}

  public scanQR() {
    //tambien te lo debo
  }

}
