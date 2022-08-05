import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetsBaseModule } from '@baseapp/widgets/widgets.base.module';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';


@NgModule({
  declarations: [
  	
  ],
  imports: [
    CommonModule,
    WidgetsBaseModule,
    TranslateModule,
    ConfirmDialogModule,
    MessageModule,
    MessagesModule
  ],
  exports: [
	WidgetsBaseModule,
	TranslateModule,
	ConfirmDialogModule,
    MessageModule,
    MessagesModule,
    
  ],
  providers: [

  ]
})
export class CustomModule { }