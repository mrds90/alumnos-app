import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComisionPageRoutingModule } from './comision-routing.module';

import { ComisionPage } from './comision.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComisionPageRoutingModule
  ],
  declarations: [ComisionPage]
})
export class ComisionPageModule {}
