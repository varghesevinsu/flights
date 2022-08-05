import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { allowedValuesValidator } from "@baseapp/widgets/validators/allowedValuesValidator";
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Filter } from '@baseapp/vs-models/filter.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChangeLogsComponent } from '@baseapp/widgets/change-logs/change-logs.component'
import { fromEvent } from 'rxjs';
import { environment } from '@env/environment';
import { AppUtilBaseService } from '@baseapp/app-util.base.service';
import { Renderer2 } from '@angular/core';
import { map } from 'rxjs';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { BaseAppConstants } from '@baseapp/app-constants.base';
import { AmericanFlightsService } from '@baseapp/american-flights/american-flights/american-flights.service';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AmericanFlightsListBaseComponent } from '@baseapp/american-flights/american-flights/american-flights-list/american-flights-list.base.component';

@Component({
  selector: 'app-american-flights-list',
  templateUrl: '../../../../../base/app/american-flights/american-flights/american-flights-list/american-flights-list.component.html',
  styleUrls: ['./american-flights-list.scss']
})
export class AmericanFlightsListComponent extends AmericanFlightsListBaseComponent implements OnInit {
  getFlightsApi = {
    url: 'rest/americanflights/sync',
    method: 'GET',
    showloading: true
  };

  constructor(public override americanFlightsService: AmericanFlightsService, public override appUtilBaseService: AppUtilBaseService, public override translateService: TranslateService, public override messageService: MessageService, public override confirmationService: ConfirmationService, public override domSanitizer: DomSanitizer, public override bsModalService: BsModalService, public override activatedRoute: ActivatedRoute, public override renderer2: Renderer2, public override router: Router) {
    super(americanFlightsService, appUtilBaseService, translateService, messageService, confirmationService, domSanitizer, bsModalService, activatedRoute, renderer2, router);
  }


  override loadGridData() {
    /* this.americanFlightsService.baseService.get(this.getFlightsApi).subscribe((response: any) => {
      console.log(response)
      this.gridData = response;
    }, (err: any) => {
      console.log(err);
    }) */
  }

  override actionBarAction(btn: any){
    if (btn.action == "getflights"){
      this.getflights();
    }
  }

  /* onGetFlights() {
    console.log('get Flights method');
    this.getflights();
  } */
  getflights() {
    this.americanFlightsService.baseService.get(this.getFlightsApi).subscribe((response: any) => {
      console.log(response)
      this.gridData = response;
    }, (err: any) => {
      console.log(err);
    })
  }

  ngAfterViewInit(): void {
    this.onAfterViewInit()
  }

  ngOnInit(): void {
    super.onInit();
  }













}
