import { Component, OnInit } from '@angular/core';
import { AppLayoutBaseComponent } from '@baseapp/app-layout/app-layout.base.component';
import { AppLayoutBaseService } from '@baseapp/app-layout/app-layout.service.base';


@Component({
  selector: 'app-layout',
  templateUrl: '../../../base/app/app-layout/app-layout.component.html',
  styleUrls: ['../../../base/app/app-layout/app-layout.component.scss']
})
export class AppLayoutComponent extends AppLayoutBaseComponent {
  constructor(bs: AppLayoutBaseService) {
    super(bs)
  }
  ngOnInit(): void {
    super.onInit();
  }
}
