import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { CaptionBarComponent } from './caption-bar/caption-bar.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { UrlEditComponent } from './url-edit/url-edit.component';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import {SplitButtonModule} from 'primeng/splitbutton';
import {TooltipModule} from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { WorkflowActionBarComponent } from './workflow-action-bar/workflow-action-bar/workflow-action-bar.component';

import { ChangeLogsComponent } from './change-logs/change-logs.component';
import { ChangeLogsGridComponent } from './change-logs-grid/change-logs-grid.component';
import { SharedBaseModule } from '@baseapp/shared/shared.base.module';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    ActionBarComponent,
    CaptionBarComponent,
    SearchBarComponent,
    SearchBarComponent,
    UrlEditComponent,
    WorkflowActionBarComponent,
    ChangeLogsComponent,
    ChangeLogsGridComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    ButtonModule,
    ProgressBarModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    RippleModule,
    SplitButtonModule,
	TooltipModule,
  MenuModule,
  SharedBaseModule
  ],
  exports: [
    ActionBarComponent,
    CaptionBarComponent,
    SearchBarComponent,
    UrlEditComponent,
    WorkflowActionBarComponent,    
    ChangeLogsComponent,
    ChangeLogsGridComponent,
    SharedBaseModule
  ],
  providers:[
    MessageService,
    CaptionBarComponent,
    SearchBarComponent,
    UrlEditComponent,
    DatePipe
  ]
})
export class WidgetsBaseModule { }
