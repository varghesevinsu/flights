import { ApplicationUserService } from '../application-user.service';
import { ApplicationUserBase} from '../application-user.base.model';
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ActionItem } from '@baseapp/widgets/action-bar/action-bar.component';
import { AppGlobalService } from '@baseapp/app-global.service';
import { debounceTime } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged} from 'rxjs';
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

@Directive(
{
	providers:[MessageService, ConfirmationService]
}
)
export class ApplicationUserDetailBaseComponent{
	
	
	id: any;
pid:any;
isMobile: boolean = BaseAppConstants.isMobile;
backupData:any = {};
hiddenFields:any = {};
data:any = {};
formErrors:any = {};
inValidFields:any = {};
formFieldConfig:any = {};
securityJson:any = {
}
formConfig = {};     
actionButtons:ActionItem[] = [];  
wizardItems:any = [];
currentUserData = this.appGlobalService.get('currentUser');
selectedItems:any ={};
workflowType = "";
workFlowEnabled = false;
workflowActions:any ={
    disableActions:[],
    enableActions:[],
    hideActions:[]
  };
  isFormValueChanged: boolean = false;
  mandatoryFields:any ={};
  validatorsRetained:any ={};
  isSaveResponseReceived:boolean = false;
  formSecurityConfig:any = {};
  enableReadOnly = BaseAppConstants.enableReadOnly;
	bsModalRef?: BsModalRef;
	isChildPage:boolean = false;

	
	leftActionBarConfig : any = {
  "children" : [ {
    "outline" : "true",
    "buttonType" : "icon_on_left",
    "visibility" : "show",
    "showOn" : "both",
    "buttonStyle" : "curved",
    "icon" : {
      "type" : "icon",
      "icon" : {
        "label" : "fas fa-arrow-left",
        "value" : "fas fa-arrow-left"
      }
    },
    "action" : "back",
    "buttonEnabled" : "yes",
    "label" : "BACK",
    "type" : "button"
  }, {
    "outline" : "true",
    "label" : "BUTTON_GROUP",
    "type" : "buttonGroup",
    "children" : [ {
      "outline" : "true",
      "buttonType" : "icon_on_left",
      "visibility" : "show",
      "showOn" : "both",
      "buttonStyle" : "curved",
      "buttonEnabled" : "yes",
      "action" : "save",
      "conditionForButtonEnable" : "",
      "label" : "SAVE",
      "visiblity" : "show",
      "type" : "button"
    }, {
      "outline" : "true",
      "buttonType" : "icon_on_left",
      "visibility" : "show",
      "showOn" : "both",
      "buttonStyle" : "curved",
      "buttonEnabled" : "yes",
      "action" : "cancel",
      "conditionForButtonEnable" : "",
      "label" : "CANCEL",
      "visiblity" : "show",
      "type" : "button"
    }, {
      "visibility" : "show",
      "valueChange" : true,
      "buttonEnabled" : "yes",
      "action" : "changelog",
      "label" : "CHANGELOG",
      "type" : "button"
    } ],
    "displayCount" : 2,
    "buttonStyle" : "curved"
  } ]
}
	workflowActionBarConfig : any = {
  "children" : [ {
    "outline" : true,
    "label" : "BUTTON_GROUP",
    "type" : "buttonGroup",
    "children" : [ ],
    "buttonStyle" : "curved",
    "displayCount" : 2
  } ],
  "label" : "Workflow Action Bar",
  "type" : "workflowActionBar"
}
	detailCaptionBarConfig : any = {
  "children" : [ ]
}
	detailFormConfig : any = {
  "children" : [ {
    "allowedValues" : { },
    "defaultField" : false,
    "fieldName" : "Email",
    "data" : "Email",
    "label" : "Email",
    "type" : "formField",
    "field" : "email",
    "name" : "email",
    "sysGen" : true,
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "email"
  }, {
    "allowedValues" : { },
    "defaultField" : false,
    "fieldName" : "First Name",
    "data" : "First Name",
    "label" : "First Name",
    "type" : "formField",
    "field" : "firstName",
    "name" : "firstName",
    "sysGen" : true,
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "firstName"
  }, {
    "allowedValues" : { },
    "defaultField" : false,
    "fieldName" : "Last Name",
    "data" : "Last Name",
    "label" : "Last Name",
    "type" : "formField",
    "field" : "lastName",
    "name" : "lastName",
    "sysGen" : true,
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "lastName"
  }, {
    "multipleValues" : true,
    "allowedValues" : { },
    "defaultField" : false,
    "fieldName" : "User Roles",
    "data" : "User Roles",
    "label" : "User Roles",
    "type" : "formField",
    "field" : "userRoles",
    "name" : "userRoles",
    "sysGen" : true,
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "userRoles"
  } ],
  "columns" : "1",
  "type" : "form"
}
	pageViewTitle: string = 'APPLICATION_USER_DETAIL';
	
		detailFormControls : FormGroup = new FormGroup({
	lastName: new FormControl('',[]),
	firstName: new FormControl('',[]),
	userRoles: new FormControl('',[]),
	email: new FormControl('',[]),
});


	constructor(public applicationUserService : ApplicationUserService, public appUtilBaseService: AppUtilBaseService, public translateService: TranslateService, public messageService: MessageService, public confirmationService: ConfirmationService, public domSanitizer:DomSanitizer, public bsModalService: BsModalService, public activatedRoute: ActivatedRoute, public appBaseService: AppBaseService, public router: Router, public appGlobalService: AppGlobalService, public location: Location, ...args: any) {
    
 	 }

	
	loadActionbar(){
    
}
	updateAllowedActions() {
      for (const ele in this.formFieldConfig) {
        if (this.formFieldConfig[ele].allowViewing === 'no') {
          this.hiddenFields[this.formFieldConfig[ele].name] = true;
        }
        else if (this.formFieldConfig[ele].viewConditionally && this.formFieldConfig[ele].allowViewing === 'conditional') {
          this.restrictEditandView(this.formFieldConfig[ele].viewConditionally, 'view', this.formFieldConfig[ele].name)
        }
        if (this.formFieldConfig[ele].allowEditing === 'no') {
          this.detailFormControls.get(this.formFieldConfig[ele].name)?.disable({emitEvent: false});
        }
        else if (this.formFieldConfig[ele].editConditionally && this.formFieldConfig[ele].allowEditing === 'conditional') {
          this.restrictEditandView(this.formFieldConfig[ele].editConditionally, 'edit', this.formFieldConfig[ele].name)
        }
      }
  }
	getDateTimeFields() {
    return ['modifiedDate','createdDate'];
  }

  getDateFields() {
    return [];
  }

  /**
  * Ignore fields from displaying in the changelog details
  */
  getIgnoreFields() {
    return ['sid', 'pid'];
  }

 onChangelog() {
    const initialState: ModalOptions = {
      initialState: {
        class: 'modal-xl',
        changelogConfig: {
          dateFields: this.getDateFields(),
          dateTimeFields: this.getDateTimeFields(),
          ignoreFields: this.getIgnoreFields(),
          filters: [{
            label: 'BASIC_DETAIL'
          }],
          entityId : this.data.sid,
          entityName : 'Application User',
          fieldName : null,
          fromModifiedDate : null,
          useModifiedDate: true,
          translations: {}
        },
        keyboard: true
        
      }
    };
    this.bsModalRef = this.bsModalService.show(ChangeLogsComponent, Object.assign(initialState, { class: 'modal-xl modal-changelog' }));
    this.bsModalRef.content.closeBtnName = 'Close';
  }
	onBack(){
	this.messageService.clear();
	if(this.appUtilBaseService.isEqualIgnoreCase(this.backupData,this.detailFormControls.getRawValue(),[],true)){
		this.location.back();
	}else{
		this.confirmationService.confirm({
			message:'Do you want to discard all unsaved changes?',
			header:'Confirmation',
			icon:'pipi-info-circle',
			accept:()=>{
				this.backupData=JSON.parse(JSON.stringify(this.detailFormControls.getRawValue()));
				this.location.back();
			},
			reject:()=>{
			},
		});
	}
}
	getId(){
      this.activatedRoute.queryParams.subscribe((params: any) => { 
        this.id = params['id'];
        this.pid = params['pid']
      }); 
    }
	formValueChanges() {
    this.detailFormControls.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged(),
    )
      .subscribe(() => {
        this.updateAllowedActions();
        this.isFormValueChanged = true;
      })
  }
	actionBarAction(btn: any) {
    const methodName: any = (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof ApplicationUserDetailBaseComponent, ' '> = methodName;
    if (btn.action === 'navigate_to_page' && btn.pageName?.url) {
      this.router.navigateByUrl(btn.pageName.url);
    }
    else if (typeof this[action] === "function") {
      this[action]();
    }
  }
	restrictBasedonRoles(roles: any) {
    if (roles.includes('selected')) {
       if(this.currentUserData){
        const userDataKeys = Object.keys(this.currentUserData[0]);
        return roles.some((item: any) => userDataKeys.includes(item.toLowerCase()));
      }
      else{
        return false;
      }
    }
    else if (roles.includes('all'))
      return true;
    else
      return true;
  }
	getWorkflowConfig() {
	const workFlowInfo = this.data.workflowInfo;
	const params = {
		workflowType: this.workflowType
	}
	if(workFlowInfo && this.workFlowEnabled){
		this.appBaseService.getWorkFlowConfig(params).subscribe((res: any) => {
			this.securityJson = res.config;
			this.configureFormOnWorkflow();
		})
	}
}
	formatRawData() {
    this.detailFormConfig.children.map((ele: any) => {
      if (ele.fieldType == 'Date') {
        if (this.data && this.data[ele.name]) {
          const formattedDate = new Date(this.data[ele.name])
          this.data[ele.name] = formattedDate;
          this.backupData[ele.name] = formattedDate;
        }
      }
      if (ele.uiType === 'autosuggest' && ele.multipleValues) {
        let arr: any[] = [];
        if (this.data && this.data[ele.name] && Array.isArray(this.data[ele.name])) {
          this.data[ele.name]?.map((k: any) => {
            this.createAutoSuggestFields(ele);
            this.selectedItems[ele.name] = this.data[ele.name]
            arr.push(k.value);
          })
          if (arr.length > 0) {
            this.data[ele.name] = arr;
            this.backupData[ele.name] = arr;
          }
        }
      }
      else if (ele.uiType === 'autosuggest' && !ele.multipleValues) {
        if (this.data && this.data[ele.name] && Object.keys(this.data[ele.name]).length > 0) {
          this.createAutoSuggestFields(ele);
          this.selectedItems[ele.name].push(this.data[ele.name]);
          const value = this.data[ele.name]?.value;
          this.data[ele.name] = value;
          this.backupData[ele.name] = value;
        }
      }
    })
    this.detailFormControls.patchValue(this.backupData);
  }

  createAutoSuggestFields(ele: any) {
    if (!this.selectedItems?.hasOwnProperty(ele.name)) {
      this.selectedItems[ele.name] = [];
    }

  }
	restrictEditandView(ele:any,action:string,fieldName:string){
    const conResult = this.appUtilBaseService.evaluvateCondition(ele.query.rules, ele.query.condition,this.detailFormControls.getRawValue());
     if(action =='view'){
      if (!(this.restrictBasedonRoles(ele.roles) && conResult)) {
       this.hiddenFields[fieldName] = true;
      }
      else{
        this.hiddenFields[fieldName] = false;
      }
     }

     else if(action =='edit'){
      if (!(this.restrictBasedonRoles(ele.roles) && conResult)) {
         this.detailFormControls.get(fieldName)?.disable({emitEvent: false});
      }
      else{
        this.detailFormControls.get(fieldName)?.enable({emitEvent: false});
      }
     }
   }
	formatFormDataBeforeSave() {
    let data = this.detailFormControls.getRawValue();
    if (this.detailFormConfig?.children) {
      this.detailFormConfig.children.map((ele: any) => {
        if (ele.fieldType == 'Date' && data[ele.name]) {
          const formattedDate = new Date(data[ele.name]).getTime()
          data[ele.name] = formattedDate;
        }
      })
    }
    if (Object.keys(this.selectedItems).length > 0) {
      const keys = Object.keys(this.selectedItems);
      keys?.forEach((k) => {
        if (data.hasOwnProperty(k)) {
          data[k] = this.selectedItems[k];
        }
      })
      this.detailFormConfig.children.map((ele: any) => {
        if (ele.uiType == 'autosuggest' && data[ele.name] && !ele.multipleValues) {
          data[ele.name] = (Array.isArray(data[ele.name]) && data[ele.name].length > 0) ? data[ele.name][0] : data[ele.name]
        }
      })
    }
    return data;
  }
	workflowActionBarAction(btn: any) {
    const methodName: any = (`onwf` + btn.wfAction.charAt(0).toUpperCase() + btn.wfAction.slice(1));
    let action: Exclude<keyof ApplicationUserDetailBaseComponent, ' '> = methodName;
    const finalArr: string[] = [];
    this.formErrors = {};
    this.inValidFields = {};
    this.mandatoryFields = this.formSecurityConfig?.mandatoryfields?.hasOwnProperty(btn.wfAction) ? this.formSecurityConfig.mandatoryfields[btn.wfAction] : {}
    if (Object.keys(this.mandatoryFields).length > 0)
      this.addValidations(this.mandatoryFields);

    if (!this.appUtilBaseService.isValidForm(this.detailFormControls, this.formErrors, finalArr, this.inValidFields)) {
      if (finalArr.length) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(finalArr), sticky: true });
        if (Object.keys(this.mandatoryFields).length > 0)
          this.clearValidations(this.mandatoryFields);
      }
    }
    else {
      if (this.formSecurityConfig.confirm?.hasOwnProperty(btn.wfAction)) {
        this.confirmationService.confirm({
          message: this.formSecurityConfig.confirm?.hasOwnProperty(btn.wfAction).message,
          header: 'Confirmation',
          icon: 'pi pi-info-circle',
          accept: () => {
            if (typeof this[action] === "function") {
              this[action]();
            }
          },
          reject: () => {
            if (Object.keys(this.mandatoryFields).length > 0)
              this.clearValidations(this.mandatoryFields);
          },
        });
      }
      else if (typeof this[action] === "function") {
        if (this.isFormValueChanged) {
          this.onSave();
          if (this.isSaveResponseReceived) {
            this[action]();
            this.isSaveResponseReceived = false;
          }
        }
        else {
          this[action]();
        }
      }
    }
  }
addValidations(mandatoryFields:[]){
    mandatoryFields.forEach((controlName:string)=>{
      if(this.detailFormControls.controls[controlName].hasValidator(Validators.required)){
        if(!(this.validatorsRetained.hasOwnProperty(controlName))){
          this.validatorsRetained[controlName]= {}
        }
        this.validatorsRetained[controlName]['requiredValidator'] = true;
      }
      else{
        this.detailFormControls.controls[controlName].addValidators([Validators.required]);
        this.detailFormControls.controls[controlName].updateValueAndValidity();
      }
     })
  }
	canDeactivate(): Observable<boolean> | boolean {  
    return true      
    //return this.appUtilBaseService.canDeactivateCall(this.form, this.backupData);
}
	waitForResponse() {
  setTimeout(() => {
    if (!this.data.workflowInfo && this.id) {
      this.waitForResponse();
    }
    else {
      this.getWorkflowConfig();
    }
  }, 3000);
}
	onCancel(){
       this.messageService.clear();
       if (this.appUtilBaseService.isEqualIgnoreCase(this.backupData, this.detailFormControls.getRawValue(), [], true)) {
            this.showMessage({severity:'info', summary:'', detail:'No changes available to cancel'});
        }else {
            this.confirmationService.confirm({
                message: 'Do you want to discard all unsaved changes?',
                header: 'Confirmation',
                icon: 'pi pi-info-circle',
                accept: () => {
                    this.detailFormControls.patchValue(this.backupData);
                },
                reject: () => {
                },
            });
        }
        
    }
	getData(){
        if(environment.prototype){
            this.applicationUserService.getProtoTypingData().subscribe((res:any) =>{
                this.data = res;
                this.backupData = res;
                this.detailFormControls.patchValue(this.backupData);
            });
		}else if(this.id){
			const params = {
                sid: this.id
              };
            this.applicationUserService.getById(params).subscribe((res:ApplicationUserBase[]) =>{
                this.data = res||{};
                this.backupData = res || {};
                if(this.backupData?.recDeleted)
                	delete this.backupData?.recDeleted;
                	 this.formatRawData();
            });
        }
    }
	clearValidations(mandatoryFields:[]){
    mandatoryFields.forEach((controlName:string)=>{
      if(!(this.validatorsRetained[controlName]['requiredValidator'])){
        this.detailFormControls.controls[controlName].removeValidators(Validators.required);
        this.detailFormControls.controls[controlName].updateValueAndValidity();
      }
      
     })
  }
	initForm(){
    this.formFieldConfig= this.appUtilBaseService.getControlsFromFormConfig(this.detailFormConfig)
    this.appUtilBaseService.configureValidators(this.detailFormControls, this.formFieldConfig);
this.wizardItems = this.appUtilBaseService.getWizardItemFromFormConfig(this.detailFormConfig, this);
}
	onSave(){
         let data = this.formatFormDataBeforeSave();
        const finalArr:string[] = [];
        this.formErrors = {};
        this.inValidFields = {};
        if(this.appUtilBaseService.isEqualIgnoreCase(data, this.backupData,[], true)){
            this.showMessage({severity:'info', summary:'', detail:'No changes available to save'});
            return;
        }
        if(!this.appUtilBaseService.isValidForm(this.detailFormControls, this.formErrors, finalArr, this.inValidFields)){
            if(finalArr.length){
                this.showMessage({severity:'error', summary:'Error', detail: this.appUtilBaseService.createNotificationList(finalArr), sticky : true});
            }
        }else{
            const method = this.id ? 'update' : 'create';
            data = {...this.backupData,...data}; //data.sid = this.id;
            if(this.pid){
              data.pid = this.pid;
            }
            //$service_VAR$table_VAR()
			const requestedObj = new Proxy(data, {
			get: (obj, prop) => obj[prop] === ""|| (Array.isArray(obj[prop]) && obj[prop].length == 0) ? null : obj[prop],
			});
            this.messageService.clear();
            this.applicationUserService[method](requestedObj).subscribe((res:ApplicationUserBase) => {
            this.isSaveResponseReceived = true;
	        this.id = res.sid;
	        if (method === 'create') {
	          this.router.navigate(
	            [],
	            {
	              queryParams: {id:this.id},
	              relativeTo: this.activatedRoute,
	              queryParamsHandling: 'merge',
	            });
	          this.getId();
	        }       
            this.showMessage({severity:'success', summary:'', detail:'Record Saved Successfully'});
            }); 
        } 
        
    }
	showMessage(config:any){
    this.messageService.clear();
    this.messageService.add(config);
}
	configureFormOnWorkflow() {
    const actions: any = this.workflowActionBarConfig?.children;
    this.formSecurityConfig = this.appUtilBaseService.getFormSecurityConfigFromSecurityJSON(this.securityJson, this.detailFormControls, actions, this.data.workflowInfo);

    this.hiddenFields = this.formSecurityConfig.hide;

    for (const control in this.detailFormControls.getRawValue()) {
      if (this.formSecurityConfig.disableonlyfields.indexOf(control) > -1 && !(this.formSecurityConfig.enableonlyfields.indexOf(control) > -1)) {
        this.detailFormControls.controls[control].disable({emitEvent: false});
      }
if (this.formSecurityConfig.enableonlyfields.indexOf(control) > -1) {
      this.detailFormControls.controls[control].enable({emitEvent: false});
    }
      if(this.formSecurityConfig.hide.indexOf(control)> -1){
        this.hiddenFields[control] = true;
      }
    }
    this.workflowActions = {
      disableActions: [...this.formSecurityConfig.disableonlyactions],
      enableActions: [...this.formSecurityConfig.enableonlyactions],
      hideActions: [...this.formSecurityConfig.hideactions]
    }
  }
	loadCaptionbarItems(){
    
}

    onInit() {
		
		this.waitForResponse();
		this.getId();   
this.initForm();
this.getData();
this.updateAllowedActions();
this.formValueChanges();
    }
	
     onDestroy() {
		
    }
     onAfterViewInit() {
		
    }

}
