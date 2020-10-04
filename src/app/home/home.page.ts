//Prueba
import { Component } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { AlumnoService } from '../alumno.service';
import { Alumno } from '../model/alumno'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private alumnos;
  materia = 'Matematicas';
  tiempo = '1 dia y 4 horas';
  
  scannedData: any;
  encodedData: '';
  encodeData: any;
  constructor(public barcodeCtrl: BarcodeScanner, public alumnoSrv: AlumnoService) {

    alumnoSrv.getAlumnos().subscribe(datos => {
      this.alumnos = datos;
    });
  }
  goToBarcodeScan() {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: true,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Place a barcode inside the scan area',
      resultDisplayDuration: 500,
      formats: 'QR_CODE,PDF_417 ',
      orientation: 'landscape',
    };

    this.barcodeCtrl.scan(options).then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.scannedData = barcodeData;

    }).catch(err => {
      console.log('Error', err);
    });
  }
    



}
