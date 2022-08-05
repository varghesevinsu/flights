import { Component } from '@angular/core';
import { AppBaseComponent } from '@baseapp/app.component.base';
import { TranslateService } from '@ngx-translate/core';
import { AppLayoutBaseService } from '@baseapp/app-layout/app-layout.service.base';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoaderService } from '@baseapp/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:[MessageService, ConfirmationService]
})
export class AppComponent extends AppBaseComponent {
  override title = 'baseProject';
  constructor(
    override translate: TranslateService, override bs: AppLayoutBaseService, override sanitizer:DomSanitizer,override loaderService: LoaderService
  ) {
    super(translate, bs, sanitizer, loaderService);
  }

  ngOnInit(): void {
    super.onInit();
  }
}
