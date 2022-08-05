import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';

import { AmericanFlightsDetailComponent } from '@app/american-flights/american-flights/american-flights-detail/american-flights-detail.component';
import { AmericanFlightsListComponent } from '@app/american-flights/american-flights/american-flights-list/american-flights-list.component';

export const routes: Routes = [
{
     path: '',
     redirectTo: 'americanflightsdetail',
     pathMatch: 'full'
 },
{
     path: 'americanflightsdetail',
     component: AmericanFlightsDetailComponent,
     canDeactivate: [ CanDeactivateGuard ],
     data: {
     	label: "AMERICAN_FLIGHTS_DETAIL",
        breadcrumb: "AMERICAN_FLIGHTS_DETAIL",
        roles : [
        			"all"
				]
     }
},
{
     path: 'americanflightslist',
     component: AmericanFlightsListComponent,
     canDeactivate: [ CanDeactivateGuard ],
     data: {
     	label: "AMERICAN_FLIGHTS_LIST",
        breadcrumb: "AMERICAN_FLIGHTS_LIST",
        roles : [
        			"all"
				]
     }
}
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AmericanFlightsBaseRoutingModule
{
}