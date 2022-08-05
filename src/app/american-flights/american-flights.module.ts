import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AmericanFlightsRoutingModule } from './american-flights-routing.module';
import { AmericanFlightsBaseModule } from '@baseapp/american-flights/american-flights.base.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AmericanFlightsBaseModule,
    AmericanFlightsRoutingModule
    
  ],
  exports: [
      AmericanFlightsBaseModule,
  ]

})
export class AmericanFlightsModule  { }