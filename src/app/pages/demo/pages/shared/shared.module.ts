import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SharedComponent } from './shared.component';
import { ButtonsModule, ControlsModule } from 'app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { IndicatorsModule } from 'app/shared/indicators';
import { PopupsModule } from '@app/shared/popups';

@NgModule({
  declarations: [SharedComponent],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ButtonsModule,
    ReactiveFormsModule,
    ControlsModule,
    IndicatorsModule,
    PopupsModule,
  ],
})
export class SharedModule {}
