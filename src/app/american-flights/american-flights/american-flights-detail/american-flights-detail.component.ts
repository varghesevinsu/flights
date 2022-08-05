import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ActionItem } from '@baseapp/widgets/action-bar/action-bar.component';
import { AppGlobalService } from '@baseapp/app-global.service';
import { debounceTime } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged } from 'rxjs';
import { Observable } from 'rxjs';
import { ChangeLogsComponent } from '@baseapp/widgets/change-logs/change-logs.component'
import { fromEvent } from 'rxjs';
import { AppUtilBaseService } from '@baseapp/app-util.base.service';
import { map } from 'rxjs';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseAppConstants } from '@baseapp/app-constants.base';
import { allowedValuesValidator } from '@baseapp/widgets/validators/allowedValuesValidator';
import { DomSanitizer } from '@angular/platform-browser';
import { dateValidator } from '@baseapp/widgets/validators/dateValidator';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { AppBaseService } from '@baseapp/app.base.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AmericanFlightsService } from '@baseapp/american-flights/american-flights/american-flights.service';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AmericanFlightsDetailBaseComponent } from '@baseapp/american-flights/american-flights/american-flights-detail/american-flights-detail.base.component';

@Component({
  selector: 'app-american-flights-detail',
  templateUrl: '../../../../../base/app/american-flights/american-flights/american-flights-detail/american-flights-detail.component.html',
  styleUrls: ['./american-flights-detail.scss']
})
export class AmericanFlightsDetailComponent extends AmericanFlightsDetailBaseComponent implements OnInit {

  override detailFormControls: FormGroup = new FormGroup({
    plane: new FormControl({ value: '', disabled: true }, []),
    departuredate: new FormControl({ value: '', disabled: true }, []),
    origin: new FormControl({ value: '', disabled: true }, []),
    id: new FormControl({ value: '', disabled: true }, []),
    emptyseats: new FormControl({ value: '', disabled: true }, []),
    code: new FormControl({ value: '', disabled: true }, []),
    price: new FormControl({ value: '', disabled: true }, []),
    destination: new FormControl({ value: '', disabled: true }, []),
  });
  constructor(public override americanFlightsService: AmericanFlightsService, public override appUtilBaseService: AppUtilBaseService, public override translateService: TranslateService, public override messageService: MessageService, public override confirmationService: ConfirmationService, public override domSanitizer: DomSanitizer, public override bsModalService: BsModalService, public override activatedRoute: ActivatedRoute, public override appBaseService: AppBaseService, public override router: Router, public override appGlobalService: AppGlobalService, public override location: Location) {
    super(americanFlightsService, appUtilBaseService, translateService, messageService, confirmationService, domSanitizer, bsModalService, activatedRoute, appBaseService, router, appGlobalService, location);
  }

  override formatRawData() {
    let _plane = [this.backupData.plane];
    this.backupData.plane = _plane;
    super.formatRawData();
  }

  ngAfterViewInit(): void {
    this.onAfterViewInit()
  }

  handleFormChanges() {
    let detailFormControls = this.detailFormControls;
    detailFormControls.controls['effort'].valueChanges.subscribe((value) => {
      let hours = detailFormControls.controls['hoursPerResource'].value;
      if (value && hours) {
        detailFormControls.controls['manDays'].setValue(value / hours);
      }
    });

    detailFormControls.controls['hoursPerResource'].valueChanges.subscribe((value) => {
      let effort =detailFormControls.controls['effort'].value;
      if (value && effort) {
        detailFormControls.controls['manDays'].setValue(effort / value);
      }
    });

    detailFormControls.controls['service'].valueChanges.subscribe((value) => {
      if (value) {
        detailFormControls.controls['type'].setValue(value.type);
        detailFormControls.controls['leader'].setValue(value.leader);
        detailFormControls.controls['approver'].setValue(value.approver);
        detailFormControls.controls['scheduler'].setValue(value.scheduler);

      } else {
        detailFormControls.controls['type'].setValue(null);
        detailFormControls.controls['leader'].setValue(null);
        detailFormControls.controls['approver'].setValue(null);
        detailFormControls.controls['scheduler'].setValue(null);
      }
    });
  }

    ngOnInit(): void {
      super.onInit();
      this.handleFormChanges();
    }






  }
