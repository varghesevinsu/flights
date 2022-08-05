import { NgModule } from '@angular/core';
import { SharedBaseModule } from '@baseapp/shared/shared.base.module';
import { WidgetsBaseModule } from '@baseapp/widgets/widgets.base.module';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';
import { AmericanFlightsDetailComponent } from '@app/american-flights/american-flights/american-flights-detail/american-flights-detail.component';
import { AmericanFlightsListComponent } from '@app/american-flights/american-flights/american-flights-list/american-flights-list.component';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
AmericanFlightsDetailComponent,
AmericanFlightsListComponent
],
imports: [
SharedBaseModule,
WidgetsBaseModule,
TableModule
],

exports: [
SharedBaseModule,
WidgetsBaseModule,
AmericanFlightsDetailComponent,
AmericanFlightsListComponent
],

providers: [
BsModalService,
CanDeactivateGuard
],
  
})
export class AmericanFlightsBaseModule { }