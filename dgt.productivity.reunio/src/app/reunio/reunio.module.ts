import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReunioPageRoutingModule } from './reunio-routing.module';
import { ReunioPage } from './pages/home/reunio.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReunioPageRoutingModule
  ],
  declarations: [ReunioPage]
})
export class ReunioPageModule {}
