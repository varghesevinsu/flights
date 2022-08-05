import { AmericanFlightsService } from '../american-flights.service';
import { AmericanFlightsBase } from '../american-flights.base.model';
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

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

@Directive(
  {
    providers: [MessageService, ConfirmationService]
  }
)
export class AmericanFlightsDetailBaseComponent {


  id: any;
  pid: any;
  isMobile: boolean = BaseAppConstants.isMobile;
  backupData: any = {};
  hiddenFields: any = {};
  data: any = {};
  formErrors: any = {};
  inValidFields: any = {};
  formFieldConfig: any = {};
  securityJson: any = {
  }
  formConfig = {};
  actionButtons: ActionItem[] = [];
  wizardItems: any = [];
  currentUserData = this.appGlobalService.get('currentUser');
  selectedItems: any = {};
  workflowType = "";
  workFlowEnabled = false;
  workflowActions: any = {
    disableActions: [],
    enableActions: [],
    hideActions: []
  };
  isFormValueChanged: boolean = false;
  mandatoryFields: any = {};
  validatorsRetained: any = {};
  isSaveResponseReceived: boolean = false;
  formSecurityConfig: any = {};
  enableReadOnly = BaseAppConstants.enableReadOnly;
  ignoreFields = [
    'modifiedDate',
    'sid',
    'createdDate',
    'createdBy',
    'modifiedBy',
  ];
  dataBackup: any = {};
  fieldEditMode: any = {};
  bsModalRef?: BsModalRef;
  isChildPage: boolean = false;


  leftActionBarConfig: any = {
    "children": [{
      "backgroundColor": "#002196",
      "visibility": "show",
      "buttonStyle": "squared",
      "icon": {
        "type": "icon",
        "icon": {
          "label": "fas fa-arrow-left",
          "value": "fas fa-arrow-left"
        }
      },
      "currentNode": "_1",
      "label": "BACK",
      "type": "button",
      "outline": false,
      "buttonType": "icon_on_left",
      "valueChange": true,
      "showOn": "both",
      "outlineColor": "#00a0df",
      "buttonEnabled": "yes",
      "action": "back",
      "font": {
        "fontFamily": {
          "name": "Verdana",
          "code": "Verdana"
        },
        "fontColor": "#faf9f9"
      }
    }, {
      "outline": "true",
      "label": "BUTTON_GROUP",
      "type": "buttonGroup",
      "displayCount": 2,
      "buttonStyle": "curved"
    }]
  }
  workflowActionBarConfig: any = {
    "children": [{
      "outline": true,
      "label": "BUTTON_GROUP",
      "type": "buttonGroup",
      "buttonStyle": "curved",
      "displayCount": 2
    }],
    "label": "Workflow Action Bar",
    "type": "workflowActionBar"
  }
  detailCaptionBarConfig: any = {}
  detailFormConfig: any = {
    "children": [{
      "allowEditing": "yes",
      "allowedValues": {},
      "defaultField": false,
      "fieldName": "ID",
      "data": "ID",
      "label": "ID",
      "type": "formField",
      "mandatory": "no",
      "searchable": "full_word",
      "transientField": false,
      "field": "id",
      "name": "id",
      "sysGen": false,
      "uiType": "number",
      "fieldType": "number",
      "allowViewing": "yes",
      "fieldId": "id"
    }, {
      "allowedValues": {},
      "defaultField": false,
      "fieldName": " Code",
      "data": " Code",
      "label": " Code",
      "type": "formField",
      "field": "code",
      "name": "code",
      "sysGen": false,
      "uiType": "text",
      "fieldType": "string",
      "fieldId": "code"
    }, {
      "allowEditing": "yes",
      "allowedValues": {},
      "defaultField": false,
      "fieldName": " price",
      "data": " price",
      "label": " price",
      "type": "formField",
      "mandatory": "no",
      "searchable": "full_word",
      "transientField": false,
      "field": "price",
      "name": "price",
      "sysGen": false,
      "uiType": "number",
      "fieldType": "number",
      "allowViewing": "yes",
      "fieldId": "price"
    }, {
      "allowEditing": "yes",
      "allowedValues": {
        "values": [{
          "label": "MONDAY",
          "value": "MONDAY"
        }, {
          "label": "TUESDAY",
          "value": "TUESDAY"
        }, {
          "label": "WEDNESDAY",
          "value": "WEDNESDAY"
        }, {
          "label": "THURSDAY",
          "value": "THURSDAY"
        }, {
          "label": "FRIDAY",
          "value": "FRIDAY"
        }, {
          "label": "SATURDAY",
          "value": "SATURDAY"
        }, {
          "label": "SUNDAY",
          "value": "SUNDAY"
        }]
      },
      "defaultField": false,
      "fieldName": " departureDate",
      "data": " departureDate",
      "label": " departureDate",
      "type": "formField",
      "mandatory": "no",
      "searchable": "full_word",
      "transientField": false,
      "field": "departuredate",
      "name": "departuredate",
      "sysGen": false,
      "uiType": "text",
      "fieldType": "string",
      "allowViewing": "yes",
      "fieldId": "departuredate"
    }, {
      "allowedValues": {},
      "defaultField": false,
      "fieldName": " origin",
      "data": " origin",
      "label": " origin",
      "type": "formField",
      "field": "origin",
      "name": "origin",
      "sysGen": false,
      "uiType": "text",
      "fieldType": "string",
      "fieldId": "origin"
    }, {
      "allowedValues": {},
      "defaultField": false,
      "fieldName": " destination",
      "data": " destination",
      "label": " destination",
      "type": "formField",
      "field": "destination",
      "name": "destination",
      "sysGen": false,
      "uiType": "text",
      "fieldType": "string",
      "fieldId": "destination"
    }, {
      "allowEditing": "yes",
      "allowedValues": {},
      "defaultField": false,
      "fieldName": " emptySeats",
      "data": " emptySeats",
      "label": " emptySeats",
      "type": "formField",
      "mandatory": "no",
      "searchable": "full_word",
      "transientField": false,
      "field": "emptyseats",
      "name": "emptyseats",
      "sysGen": false,
      "uiType": "number",
      "fieldType": "number",
      "allowViewing": "yes",
      "fieldId": "emptyseats"
    }, {
      "field": "plane",
      "columns": [{
        "allowedValues": {},
        "name": "modifiedDate",
        "label": "ModifiedDate",
        "type": "datetime"
      }, {
        "allowedValues": {},
        "name": "createdDate",
        "label": "CreatedDate",
        "type": "datetime"
      }, {
        "allowedValues": {},
        "name": "createdBy",
        "label": "CreatedBy",
        "type": "text"
      }, {
        "allowedValues": {},
        "name": "type",
        "label": "Type",
        "type": "text"
      }, {
        "allowedValues": {},
        "name": "totalseats",
        "label": "Totalseats",
        "type": "number"
      }, {
        "allowedValues": {},
        "name": "modifiedBy",
        "label": "ModifiedBy",
        "type": "text"
      }, {
        "allowedValues": {},
        "name": "sid",
        "label": "Sid",
        "type": "text"
      }],
      "name": "plane",
      "label": "plane",
      "type": "formField",
      "fieldType": "Table"
    }],
    "columns": "2",
    "valueChange": true,
    "currentNode": "detailForm",
    "type": "form"
  }
  pageViewTitle: string = 'AMERICAN_FLIGHTS_DETAIL';

  detailFormControls: FormGroup = new FormGroup({
    plane: new FormControl('', []),
    departuredate: new FormControl('', []),
    origin: new FormControl('', []),
    id: new FormControl('', []),
    emptyseats: new FormControl('', []),
    code: new FormControl('', []),
    price: new FormControl('', []),
    destination: new FormControl('', []),
  });


  constructor(public americanFlightsService: AmericanFlightsService, public appUtilBaseService: AppUtilBaseService, public translateService: TranslateService, public messageService: MessageService, public confirmationService: ConfirmationService, public domSanitizer: DomSanitizer, public bsModalService: BsModalService, public activatedRoute: ActivatedRoute, public appBaseService: AppBaseService, public router: Router, public appGlobalService: AppGlobalService, public location: Location, ...args: any) {

  }


  getId() {
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
  planeRowEditSave(rowData: any, event: any) {
    const values = this.detailFormControls.controls.plane.value;
    const currentValue = values.find((i: any) => i.id == rowData.id);
    if (this.validateplaneData(rowData)) {
      delete rowData.isNewRow;
      if (currentValue) {
        Object.assign(currentValue, rowData);
      } else {
        values.unshift(rowData);
      }

      //this.detailFormControls.controls.plane.setValue( this.data[fieldName]);
      if (this?.dataBackup?.plane) {
        delete this.dataBackup.plane[rowData.id];

      }
      this.fieldEditMode.plane = false;

    } else {
      event.stopPropagation();
      this.messageService.add({ severity: 'error', summary: 'Invalid', detail: 'Data is Invalid' });
    }
  }
  getWorkflowConfig() {
    const workFlowInfo = this.data.workflowInfo;
    const params = {
      workflowType: this.workflowType
    }
    if (workFlowInfo && this.workFlowEnabled) {
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
  actionBarAction(btn: any) {
    const methodName: any = (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof AmericanFlightsDetailBaseComponent, ' '> = methodName;
    if (btn.action === 'navigate_to_page' && btn.pageName?.url) {
      this.router.navigateByUrl(btn.pageName.url);
    }
    else if (typeof this[action] === "function") {
      this[action]();
    }
  }
  onSave() {
    let data = this.formatFormDataBeforeSave();
    const finalArr: string[] = [];
    this.formErrors = {};
    this.inValidFields = {};
    if (this.appUtilBaseService.isEqualIgnoreCase(data, this.backupData, [], true)) {
      this.showMessage({ severity: 'info', summary: '', detail: 'No changes available to save' });
      return;
    }
    if (!this.appUtilBaseService.isValidForm(this.detailFormControls, this.formErrors, finalArr, this.inValidFields)) {
      if (finalArr.length) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(finalArr), sticky: true });
      }
    } else {
      const method = this.id ? 'update' : 'create';
      data = { ...this.backupData, ...data }; //data.sid = this.id;
      if (this.pid) {
        data.pid = this.pid;
      }
      //$service_VAR$table_VAR()
      const requestedObj = new Proxy(data, {
        get: (obj, prop) => obj[prop] === "" || (Array.isArray(obj[prop]) && obj[prop].length == 0) ? null : obj[prop],
      });
      this.messageService.clear();
      this.americanFlightsService[method](requestedObj).subscribe((res: AmericanFlightsBase) => {
        this.isSaveResponseReceived = true;
        this.id = res.sid;
        if (method === 'create') {
          this.router.navigate(
            [],
            {
              queryParams: { id: this.id },
              relativeTo: this.activatedRoute,
              queryParamsHandling: 'merge',
            });
          this.getId();
        }
        this.showMessage({ severity: 'success', summary: '', detail: 'Record Saved Successfully' });
      });
    }

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
  validateplaneData(rowData: any): boolean {
    return true;
  }
  clearValidations(mandatoryFields: []) {
    mandatoryFields.forEach((controlName: string) => {
      if (!(this.validatorsRetained[controlName]['requiredValidator'])) {
        this.detailFormControls.controls[controlName].removeValidators(Validators.required);
        this.detailFormControls.controls[controlName].updateValueAndValidity();
      }

    })
  }
  showMessage(config: any) {
    this.messageService.clear();
    this.messageService.add(config);
  }
  loadCaptionbarItems() {

  }
  loadActionbar() {

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
        this.detailFormControls.get(this.formFieldConfig[ele].name)?.disable({ emitEvent: false });
      }
      else if (this.formFieldConfig[ele].editConditionally && this.formFieldConfig[ele].allowEditing === 'conditional') {
        this.restrictEditandView(this.formFieldConfig[ele].editConditionally, 'edit', this.formFieldConfig[ele].name)
      }
    }
  }
  onBack() {
    this.messageService.clear();
    if (this.appUtilBaseService.isEqualIgnoreCase(this.backupData, this.detailFormControls.getRawValue(), [], true)) {
      this.location.back();
    } else {
      this.confirmationService.confirm({
        message: 'Do you want to discard all unsaved changes?',
        header: 'Confirmation',
        icon: 'pipi-info-circle',
        accept: () => {
          this.backupData = JSON.parse(JSON.stringify(this.detailFormControls.getRawValue()));
          this.location.back();
        },
        reject: () => {
        },
      });
    }
  }
  planeRowEditInit(rowData: any) {
    if (!rowData.isNewRow) {
      this.dataBackup.plane = {};
      this.dataBackup.plane[rowData.id] = { ...rowData };
      this.fieldEditMode.plane = true;
    }
  }
  restrictBasedonRoles(roles: any) {
    if (roles.includes('selected')) {
      if (this.currentUserData) {
        const userDataKeys = Object.keys(this.currentUserData[0]);
        return roles.some((item: any) => userDataKeys.includes(item.toLowerCase()));
      }
      else {
        return false;
      }
    }
    else if (roles.includes('all'))
      return true;
    else
      return true;
  }
  workflowActionBarAction(btn: any) {
    const methodName: any = (`onwf` + btn.wfAction.charAt(0).toUpperCase() + btn.wfAction.slice(1));
    let action: Exclude<keyof AmericanFlightsDetailBaseComponent, ' '> = methodName;
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
  addValidations(mandatoryFields: []) {
    mandatoryFields.forEach((controlName: string) => {
      if (this.detailFormControls.controls[controlName].hasValidator(Validators.required)) {
        if (!(this.validatorsRetained.hasOwnProperty(controlName))) {
          this.validatorsRetained[controlName] = {}
        }
        this.validatorsRetained[controlName]['requiredValidator'] = true;
      }
      else {
        this.detailFormControls.controls[controlName].addValidators([Validators.required]);
        this.detailFormControls.controls[controlName].updateValueAndValidity();
      }
    })
  }
  restrictEditandView(ele: any, action: string, fieldName: string) {
    const conResult = this.appUtilBaseService.evaluvateCondition(ele.query.rules, ele.query.condition, this.detailFormControls.getRawValue());
    if (action == 'view') {
      if (!(this.restrictBasedonRoles(ele.roles) && conResult)) {
        this.hiddenFields[fieldName] = true;
      }
      else {
        this.hiddenFields[fieldName] = false;
      }
    }

    else if (action == 'edit') {
      if (!(this.restrictBasedonRoles(ele.roles) && conResult)) {
        this.detailFormControls.get(fieldName)?.disable({ emitEvent: false });
      }
      else {
        this.detailFormControls.get(fieldName)?.enable({ emitEvent: false });
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
  planeGetColumnData(field: string) {
    const columnConfig = this.formFieldConfig.plane.columns.find((item: any) => item.name == field);
    return columnConfig;
  }
  initForm() {
    this.formFieldConfig = this.appUtilBaseService.getControlsFromFormConfig(this.detailFormConfig)
    this.appUtilBaseService.configureValidators(this.detailFormControls, this.formFieldConfig);
    this.wizardItems = this.appUtilBaseService.getWizardItemFromFormConfig(this.detailFormConfig, this);
  }
  planeRowEditCancel(rowData: any) {
    const values = this.detailFormControls.controls.plane.value;
    const currentValue = values.find((i: any) => i.id == rowData.id);
    if (this.dataBackup?.plane?.[rowData.id]) {
      Object.assign(currentValue, this.dataBackup.plane[rowData.id] || {});
      delete this.dataBackup.plane[rowData.id];
    } else if (rowData.isNewRow) {
      this.data.plane = values.filter((i: any) => i.id !== rowData.id);
      this.detailFormControls.controls.plane.setValue(this.data.plane);
    }
    this.fieldEditMode.plane = false;
  }
  getData() {
    if (environment.prototype) {
      this.americanFlightsService.getProtoTypingData().subscribe((res: any) => {
        this.data = res;
        this.backupData = res;
        this.detailFormControls.patchValue(this.backupData);
      });
    } else if (this.id) {
      const params = {
        sid: this.id
      };
      this.americanFlightsService.getById(params).subscribe((res: AmericanFlightsBase[]) => {
        this.data = res || {};
        this.backupData = res || {};
        if (this.backupData?.recDeleted)
          delete this.backupData?.recDeleted;
        this.formatRawData();
      });
    }
  }
  planeRowDelete(rowData: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        let values = this.detailFormControls.controls.plane.value.filter((i: any) => i.id !== rowData.id);
        this.detailFormControls.controls.plane.setValue(values);
      },
      reject: () => {
      },
    });
  }
  configureFormOnWorkflow() {
    const actions: any = this.workflowActionBarConfig?.children;
    this.formSecurityConfig = this.appUtilBaseService.getFormSecurityConfigFromSecurityJSON(this.securityJson, this.detailFormControls, actions, this.data.workflowInfo);

    this.hiddenFields = this.formSecurityConfig.hide;

    for (const control in this.detailFormControls.getRawValue()) {
      if (this.formSecurityConfig.disableonlyfields.indexOf(control) > -1 && !(this.formSecurityConfig.enableonlyfields.indexOf(control) > -1)) {
        this.detailFormControls.controls[control].disable({ emitEvent: false });
      }
      if (this.formSecurityConfig.enableonlyfields.indexOf(control) > -1) {
        this.detailFormControls.controls[control].enable({ emitEvent: false });
      }
      if (this.formSecurityConfig.hide.indexOf(control) > -1) {
        this.hiddenFields[control] = true;
      }
    }
    this.workflowActions = {
      disableActions: [...this.formSecurityConfig.disableonlyactions],
      enableActions: [...this.formSecurityConfig.enableonlyactions],
      hideActions: [...this.formSecurityConfig.hideactions]
    }
  }
  planeAddNewRow() {
    if (!this.detailFormControls.controls.plane.value) {
      this.detailFormControls.controls.plane.setValue([]);
    }
    this.detailFormControls.controls.plane.value.unshift({ id: new Date().getTime(), isNewRow: true });
    setTimeout(() => {
      $($(`.plane_edit-btn`)[0]).trigger('click');
    }, 100);
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
