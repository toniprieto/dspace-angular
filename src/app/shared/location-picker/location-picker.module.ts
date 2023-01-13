import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';

import { LocationPickerComponent } from './location-picker.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LocationPickerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    GoogleMapsModule,
    TranslateModule
  ],
  exports: [
    LocationPickerComponent,
  ],
})
export class LocationPickerModule {}
