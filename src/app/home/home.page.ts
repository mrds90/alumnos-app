//Prueba
import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { LoadingController } from '@ionic/angular';
import { AlumnoService } from '../alumno.service';
import { Alumno } from '../model/alumno';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private alumno=new Alumno;

  scannedData: any;
  encodedData: '';
  encodeData: any;
  constructor(public barcodeCtrl: BarcodeScanner, public alumnoSrv: AlumnoService,private lodading: LoadingController) { }
  
  public async ngOnInit() {
    
    const loading = await this.lodading.create({  message: 'Cargando',
    //duration: 2000,
    spinner: 'bubbles'});  
      
    
    this.alumnoSrv.getAlumno().subscribe(datos => {
      this.alumno = datos as Alumno;
      loading.dismiss();
    
    });
    loading.present();
  }
  goToBarcodeScan() {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Ubique un QR en el área de escaneo',
      resultDisplayDuration: 500,
      formats: 'QR_CODE,PDF_417 ',
      orientation: 'landscape',
    };

    this.barcodeCtrl.scan(options).then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.scannedData = barcodeData;
      this.alumnoSrv.marcarAsistencia(this.scannedData).subscribe();

    }).catch(err => {
      console.log('Error', err);
    });
  }
    



}
