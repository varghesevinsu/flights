import { Component, OnInit } from '@angular/core';
import { AppLandingPageBaseComponent } from "@baseapp/app-landing-page/app-landing-page-base.component";
import { AppLandingBaseService } from '@baseapp/app-landing-page/app-landing.service.base';
import { AppUtilBaseService } from "@baseapp/app-util.base.service";

@Component({
  selector: 'app-landing-page',
  templateUrl: '../../../base/app/app-landing-page/app-landing-page-base.component.html',
  styleUrls: ['../../../base/app/app-landing-page/app-landing-page-base.component.scss']
})
export class AppLandingPageComponent extends AppLandingPageBaseComponent {

  constructor(override bs: AppLandingBaseService, override utilBase: AppUtilBaseService) {
    super(bs, utilBase)
  }

  ngOnInit(): void {
    super.onInit();
  }

}
