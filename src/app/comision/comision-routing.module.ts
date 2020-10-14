import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComisionPage } from './comision.page';

const routes: Routes = [
  {
    path: '',
    component: ComisionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComisionPageRoutingModule {}
