import { Component, OnInit } from '@angular/core';
import { AppSideBarBaseComponent } from '@baseapp/app-layout/app-side-bar/app-side-bar.base.component';
import { AppLayoutBaseService } from '@baseapp/app-layout/app-layout.service.base';
import { TranslateService } from '@ngx-translate/core';
import { AppUtilBaseService } from "@baseapp/app-util.base.service";

@Component({
  selector: 'app-side-bar',
  templateUrl: '../../../../base/app/app-layout/app-side-bar/app-side-bar.component.html',
  styleUrls: ['../../../../base/app/app-layout/app-side-bar/app-side-bar.component.scss']
})
export class AppSideBarComponent extends AppSideBarBaseComponent {
  constructor(bs: AppLayoutBaseService, override translate: TranslateService, override utilBase: AppUtilBaseService) {
    super(bs, translate, utilBase)
  }
  ngOnInit(): void {
    super.onInit();
  }

}
