import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Observable, Observer, Subject } from 'rxjs';
import { formatDate, formatNumber, formatCurrency, getCurrencySymbol } from '@angular/common';
import { BaseAppConstants } from './app-constants.base';
import { TranslateService } from '@ngx-translate/core';
import { AppGlobalService } from './app-global.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AppUtilBaseService {

  constructor(
    public confirmationService: ConfirmationService,
    public translateService: TranslateService,
    public appGlobalService: AppGlobalService
  ) { }

  isEqualIgnoreCase(data1: any, data2: any, ignoreProperties?: any, isCaseSensitive?: boolean) {
    isCaseSensitive = isCaseSensitive || false;
    if (this.checkCase(data1, isCaseSensitive) === this.checkCase(data2, isCaseSensitive) || data1 === data2) { return true; }
    if ((typeof data1 !== 'object' || typeof data2 !== 'object')) {
      return this.checkCase(data1, isCaseSensitive) === this.checkCase(data2, isCaseSensitive);
    }
    const isValueEmpty1 = (data1 == null || data1 === '' || data1 === undefined || $.isEmptyObject(data1));
    const isValueEmpty2 = (data2 == null || data2 === '' || data2 === undefined || $.isEmptyObject(data2));
    if (isValueEmpty1 && isValueEmpty2) { return true; }

    if (isValueEmpty1 && !isValueEmpty2) { return false; }
    if (!isValueEmpty1 && isValueEmpty2) { return false; }

    ignoreProperties = ignoreProperties || [];
    let keys = Object.keys(data1 || {});
    const data2Keys = Object.keys(data2 || {});
    keys = keys.concat(Object.keys(data2 || {}));
    for (let index = 0; index < keys.length; index++) {

      const key = keys[index];
      const value1 = this.checkCase(data1[key], isCaseSensitive);
      const value2 = this.checkCase(data2[key], isCaseSensitive);
      if (ignoreProperties.indexOf(key) !== -1) { continue; }
      if (value1 === value2
        || ((value1 === null || value1 === '' || value1 === undefined)
          && (value2 === null || value2 === '' || value2 === undefined))) { continue; }

      const isValue1Array = Array.isArray(value1);
      const isValue2Array = Array.isArray(value2);
      if ((isValue1Array && !isValue2Array)
        || (!isValue1Array && isValue2Array)
        || (isValue1Array && isValue2Array
          && value1.length !== value2.length)) { return false; }
      let retVal = false;
      if (isValue1Array && isValue2Array) {
        if (value1.length === 0 && value2.length === 0) {
          retVal = true;
        } else {
          for (let arrIndex = 0; arrIndex < value1.length; arrIndex++) {
            retVal = this.isEqualIgnoreCase(value1[arrIndex], value2[arrIndex], ignoreProperties, isCaseSensitive)
            if (!retVal) { return false; }
          }
        }
      } else if (typeof value1 === 'object' && typeof value2 === 'object') {
        retVal = this.isEqualIgnoreCase(value1, value2, ignoreProperties, isCaseSensitive)
      } else if ((typeof value1 === 'string' && typeof value2 === 'string') || (typeof value1 === 'number' && typeof value2 === 'number')) {
        retVal = (value1 === value2);
      }
      if (!retVal) {
        return false;
      }
    }

    return true;
  };

  checkCase(data: any, isCaseSensitive: boolean) {
    if (!data || !data.toUpperCase) { return data; }
    return isCaseSensitive ? data : data.toUpperCase();
  }
  getErrorLabel(error: string, fieldName = '') {
    let errLabel = error;
    switch (error) {
      case 'required':
        errLabel = 'required';
        break;
      case 'mandatoryCondition':
        errLabel = 'not matching its mandatory condition';
        break;
      case 'mandatoryCondition':
        errLabel = 'not matching its mandatory condition';
        break;
      case 'customMax':
      case 'max':
        errLabel = 'not matching its max-value condition';
        break;
      case 'customMin':
      case 'min':
        errLabel = 'not matching its min-value condition';
        break;
      case 'maxLength':
      case 'max_length':
      case 'maxlength':
        errLabel = 'not matching its max-length condition';
        break;
      case 'minLength':
      case 'min_length':
      case 'minlength':
        errLabel = 'not matching its min-length condition';
        break;
      case 'mandatoryCharacters':
        errLabel = 'not matching with mandatory characters';
        break;
      case 'allowedValues':
        errLabel = 'not matching with allowed values';
        break;
      case 'notAllowedValues':
        errLabel = 'contains not allowed values';
        break;

      case 'pattern':
        errLabel = 'not matching its accepted pattern';
        break;
      case 'email':
        errLabel = 'not valid';
        break;
      case 'invalidDate':
        errLabel = 'not valid';
        break;
      case 'weekDaysOnly':
        errLabel = 'allowing weekdays only';
        break;
      case 'weekEndsOnly':
        errLabel = 'allowing weekends only';
        break;
      default:
        errLabel = error;
    }

    return errLabel;
  }

  isValidForm(form: FormGroup, formErrors: any, finalArr: string[] = [], inValidFields: any = {}): boolean {
    const allErrors: any = {};
    let isValid = true;
    Object.keys(form.controls).forEach(field => {
      const errors = form.controls[field].errors;
      const fieldName = $(`.${field}-label`).text() || field;
      if (errors) {
        isValid = false;
        Object.keys(errors).forEach(errKey => {
          if (!formErrors[field]) {
            formErrors[field] = `${fieldName} is ${this.getErrorLabel(errKey)}`;
          }
          if (!allErrors[errKey]) {
            allErrors[errKey] = [];
          }
          allErrors[errKey].push(fieldName);
          inValidFields[field] = true;
        });
      }
    });

    for (const error in allErrors) {
      if (allErrors.hasOwnProperty(error)) {
        const element = allErrors[error];
        finalArr.push(`${allErrors[error].join(', ')} ${allErrors[error].length > 1 ? 'are' : 'is'} ${this.getErrorLabel(error)}`);
      }
    }

    return isValid;
  }

  canDeactivateCall(form: FormGroup, backupData: any): Observable<boolean> | boolean {
    if (this.isEqualIgnoreCase(form.getRawValue(), backupData, [], true)) {
      return true;
    }

    return Observable.create((observer: Observer<boolean>) => {

      this.confirmationService.confirm({
        message: 'Do you want to discard all unsaved changes?',
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          observer.next(true);
          observer.complete();
        },
        reject: () => {
          observer.complete();
        },
      });
    });
  }

  frameFormFromConfig(formConfig: any) {

    formConfig = {
      readonlyForm: false,
      items: [
        {
          type: "section",
          items: [
            {
              type: "control"
            }
          ]
        },
        {
          type: "section",
          items: [
            {
              type: "section",
              items: [
                {
                  type: "control"
                },
                {
                  type: "control"
                }
              ]
            }
          ]
        }
      ]
    }

    const controls = this.getControlsFromSectionConfig(formConfig);
    const formControls = {};


    formConfig = {
      id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      createdBy: new FormControl(),
      modifiedBy: new FormControl(),
    };

    return formConfig;
  }

  getControlsFromSectionConfig(config: any, result: any = []): any {
    if (config?.items) {
      for (let index = 0; index < config.items.length; index++) {
        const current = config.items[index];
        if (current.type == "section") {
          this.getControlsFromSectionConfig(current, result);
        } else {
          result.push(current)
        }
      }
    }
    return result;
  }

  getControlsFromFormConfig(config: any, fields: any = {}, fileFields: string[] = []): any {
    if (config?.children?.length) {
      for (let index = 0; index < config.children.length; index++) {
        const current = config.children[index];
        if (current?.children && current?.children.length) {
          this.getControlsFromFormConfig(current, fields, fileFields);
        } else {
          current.isRequired = config.children[index].mandatory === 'yes' ? true : false;
          if(config.children[index].uiType == 'autosuggest'){
            current.lookupFields = config.children[index].lookupFields;
            current.displayField = config.children[index].displayField;
            current.multiple = config.children[index].multipleValues;
          }         
          current.allowEditing = config.children[index].allowEditing === 'no' ? 'no' : (config.children[index].allowEditing === 'yes' || config.children[index].allowEditing == 'undefined') ? 'yes' : 'conditional';
          current.allowViewing = config.children[index].allowViewing === 'no' ? 'no' : (config.children[index].allowViewing === 'yes' || config.children[index].allowViewing == 'undefined') ? 'yes' : 'conditional';
          if (config.children[index].allowEditing === 'conditional' && config.children[index].editConditionally) {
            current.editConditionally = config.children[index].editConditionally;
          }
          if (config.children[index].allowViewing === 'conditional' && config.children[index].viewConditionally) {
            current.viewConditionally = config.children[index].viewConditionally;
          }
          if (['file', 'image'].includes(current.uiType)) {
            fileFields.push(current.data);
          } else if (['dropdown', 'select'].includes(current.uiType)) {
            current.options = current.allowedValues?.values;
            current.optionConditions = {};
            if (current?.allowedValues?.conditions?.conditions) {
              current.allowedValues.conditions.conditions.forEach((condition: any) => {
                current.optionConditions[condition.id] = Object.assign({}, condition.style, {
                  iconStyle: {},
                  cellStyle: {
                    'background-color': condition.style['background-color'],
                    'color': condition.style['color'],
                  }
                });

                switch (condition?.style?.icon?.type) {
                  case 'uploaded':
                    Object.assign(current.optionConditions[condition.id], {
                      image: this.frameAttachmentURL(condition?.style?.icon?.icon[0]?.fileName, true)
                    })
                    break;
                  case 'icon':
                    Object.assign(current.optionConditions[condition.id], {
                      iconClass: condition?.style?.icon?.icon.value
                    });
                    if(condition?.style?.icon.iconColor){
                      Object.assign(current.optionConditions[condition.id].iconStyle,{color : condition?.style?.icon.iconColor})
                    }
                    if (condition?.style?.icon.iconSize) {
                      Object.assign(current.optionConditions[condition.id].iconStyle, { 'font-size': condition?.style?.icon.iconSize })
                    }
                    break;
                  default: break;
                }
              });
            }
          }
          fields[current.field] = current;
        }
      }
    }
    return fields;
  }


  getWizardItemFromFormConfig(formConfig:any, component:any){
    const wizard:any = [];
    if(formConfig?.children?.length){     
      const configLength = formConfig.children.length;
      formConfig.children.forEach((config: any, index: number) => {
        if (config.type === 'formSection') {
          wizard.push({
            id: config.label,
            label: this.translateService.instant(config.label),
            command: component.onWizardClick.bind(component)
          }, {
            separator: true
          });
        }
      });
      if (wizard.length) {
        wizard[0].styleClass = 'wizard-active';
        wizard.splice(-1);
      }
      if (wizard.length) {
        wizard.unshift({
          label: this.translateService.instant('SECTION'),
          disabled: true
        }, {
          separator: true
        });
      }

    }
    return wizard
  }


  configureValidators(detailFormControls: FormGroup, formFieldConfig: any) {
    for (let field in formFieldConfig) {
      const fielConfig = formFieldConfig[field];
      if (fielConfig?.uiType?.toUpperCase() == 'EMAIL') {
        detailFormControls.get(field)?.setValidators(Validators.email);
        detailFormControls.get(field)?.updateValueAndValidity();
      }
    }
  }


  public formatDate(date: number, format?: string, locale?: string): string {
    if (typeof date !== 'number') {
      return date;
    }
    format = format || BaseAppConstants.dateFormat;
    locale = locale || BaseAppConstants.defaultLocale;

    return date ? formatDate(date, format, locale) : '';
  }

  public formatDateTime(date: number, format?: string, locale?: string): string {
    format = format || BaseAppConstants.dateTimeFormat;
    locale = locale || BaseAppConstants.defaultLocale;

    return date ? formatDate(date, format, locale) : '';
  }


  public formatNumber(value: number, digitsInfo: string, locale?: string): string {

    locale = locale || BaseAppConstants.defaultLocale;
    return value ? formatNumber(value, locale, digitsInfo) : '';
  }

  public formatCurrency(value: number, currencyCode: string, digitsInfo?: string, currency?: string, locale?: string): string {

    locale = locale || BaseAppConstants.defaultLocale;
    currencyCode = currencyCode || BaseAppConstants.defaultCurrency;
    currency = currency || getCurrencySymbol(currencyCode, 'narrow', locale);

    return value ? formatCurrency(value, locale, currency, currencyCode, digitsInfo) : '';

  }

  public getCurrencySymbol(code: string, format?: string, locale?: string | undefined) {
    locale = locale || BaseAppConstants.defaultLocale;

    return code ? getCurrencySymbol(code, 'narrow', locale) : '';
  }
  
  getFormSecurityConfigFromSecurityJSON(securityJSON:any, form:FormGroup,actionConfig:any,workflowInfo:any){
    const role = workflowInfo.actors;
    const step =  workflowInfo.step;
    const actions:any =[];
    const roleSecurityConf = securityJSON[role[0]][step] || {
      hide : [],
      enableonlyfields : [],
      disableonlyfields : [],
      enableonlyactions : [],
      disableonlyactions : [],
      hideactions : [],
      mandatoryfields : {},
    };
    const formSecurityConfig:any = {
      hide : [],
      enableonlyfields : [],
      disableonlyfields : [],
      enableonlyactions : [],
      disableonlyactions : [],
      hideactions : [],
      mandatoryfields : {},
    };

    actionConfig.forEach((item:any)=>{
      if(item.type =='buttonGroup'){
           item.children.forEach((k:any)=>{
             actions.push(k.wfAction);
           })
      }
      else if(item.type =='button'){
        actions.push(item.wfAction);
      }
    })

    for(const field in form.controls){
      if(roleSecurityConf?.disableonlyfields.includes('*') || roleSecurityConf?.disableonlyfields.includes(field)){
        formSecurityConfig.disableonlyfields.push(field);
      }
      if(roleSecurityConf?.enableonlyfields.includes('*') || roleSecurityConf?.enableonlyfields.includes(field)){
        formSecurityConfig.enableonlyfields.push(field);
      }

      if(roleSecurityConf?.hide.includes('*') || roleSecurityConf?.hide.includes(field)){
        formSecurityConfig.hide.push(field);
      }
      
    }

    actions.forEach((action:string)=>{
      if(roleSecurityConf?.enableonlyactions.includes('*') || roleSecurityConf?.enableonlyactions.includes(action)){
        formSecurityConfig.enableonlyactions.push(action);
      }
      if(roleSecurityConf?.disableonlyactions.includes('*') || roleSecurityConf?.disableonlyactions.includes(action)){
        formSecurityConfig.disableonlyactions.push(action);
      }
      if(roleSecurityConf?.hideactions.includes('*') || roleSecurityConf?.hideactions.includes(action)){
        formSecurityConfig.hideactions.push(action);
      }
      if(roleSecurityConf?.mandatoryfields.hasOwnProperty(action)){
        formSecurityConfig.mandatoryfields[action] = roleSecurityConf?.mandatoryfields[action];
        
      }
    })
    return formSecurityConfig;
  }

  getPageUrl(pageUrl: any) {
    if (pageUrl) {
      let index = pageUrl?.indexOf('/')
      let currPath = pageUrl.substr(index)
      return "#" + currPath
    } else {
        return null
    }
  }

  formatTableConfig(config: any) {
    return config.reduce((acc1: any, curr1: any) => {
      if (curr1?.allowedValues) {
        // const allowedValues = JSON.parse(curr1.allowedValues);
        const allowedValues = curr1.allowedValues;
        curr1.options = allowedValues.values;
        let count = 0;
        curr1.conditionalStyling = allowedValues.conditions?.conditions?.reduce((acc2: any, curr2: any) => {
          const identifierKey = (curr2.id.replace(/ /g,"_")).toUpperCase();
          curr2.query.rules.map((con:any)=>{
            con.value
          })
          for(var i=0;i<curr2.query.rules.length;i++){
            curr2.query.rules[i].value = (curr2.query.rules[i].value.replace(/ /g,"_")).toUpperCase();
          }
          acc2[identifierKey] = curr2;
          acc2[identifierKey].class = 'condition-' + count;

          count++;
          return acc2;

        }, {})
      }
      acc1.push(curr1)
      return acc1;
    }, [])

  }

  evaluate(key: any, value: any, operator: string) {
    let result: boolean;
    switch (operator) {
      case '==':
      case'=':
        result = (key == value);
        break;
      case '!=':
        result = (key != value);
        break;
      case '&&':
      case "and":
        result = (key && value);
        break;
      case '||':
      case "or":
        result = (key || value);
        break;
       
      // case '>':
      //   result = (key > value);
      //   break;
      // case '<':
      //   result = (key < value);
      //   break;
      default:
        result = false;
    }
    return result;
  }

  getTableRequestParams(tableConfig: any): void {
    const params: any = {};
    params.start = 0;
    params.length = tableConfig.pageSize || BaseAppConstants.defaultPageSize;

    params.search = {};
        params.columns = [];
    for (const col of tableConfig.children) {
      const column: any = {};
      column.data = col.data;
      column.name = col.name;
      column.searchable = true;
      column.orderable = col.orderable = true;

      column.search = {};
      params.columns.push(column);
    }
    params.columns.order = [];

    return params;
  }

  createNotificationList(messages:string[]){
    let $listElem:any = '';
    if(messages.length > 1){
      $listElem = $('<ul>').addClass('list-messages');
      messages.forEach(item => {
        $listElem.append($('<li>').addClass('list-messages-item').text(item))
      });

    }else{
      $listElem = $('<div>')
        .addClass('list-messages-item')
        .append($('<span>').addClass('list-messages-item').text(messages[0] || ''))
    }

    return $('<div>').append($listElem).html()

  }

  frameAttachmentURL(field:string, isLocal = false){
    const baseURL = isLocal ?  BaseAppConstants.localFilePath : BaseAppConstants.attachmentBaseURL
    return !field ? '' : baseURL + field;
  }
  createImagePreviewURL(files:[{fileName:string, id:string, file?:any}]){
    const responseFiles:any = [];
    files.forEach(file => { 
      responseFiles.push({
        previewSrc : this.frameAttachmentURL(file.id),
        id: file.id,
        fileName: file.fileName,
        file : file.file || file
      })
    })
    return responseFiles;
  }

  setImagePreview(files:File[]):Observable<any>{
    const reader = new FileReader();
    const obsr$ = new Subject<any>()
      if(files && files.length) {
        const [file] = files;
        reader.readAsDataURL(file);        
        reader.onloadend = () => {
            obsr$.next({
              previewSrc : reader.result as string,
              fileName: file.name,
              file : file
            });
            obsr$.complete(); 
        };
          
      }
    return obsr$.asObservable();
  }

  evaluvateCondition(rules: any, condition: any, formData?: any) {
    
    const data: any = formData;
    const currentUserData = this.appGlobalService.get('currentUser')
    const val = rules.reduce((acc: boolean, curr: any) => {
      console.log(rules, condition)
      const isParentCondtion = curr.hasOwnProperty("condition")
      if (isParentCondtion) {
        const currentCondition = curr.condition
        acc = this.evaluate(acc, this.evaluvateCondition(curr.rules, currentCondition,data), condition)
      } else {
        let currentValue: any
        let val: any
        if(!environment.prototype){
        if(data){
        if (curr.lhsTableName != 'applicationuser') {
          currentValue = data[curr.label] || ''
        }
        else {
          currentValue = currentUserData[curr.label] || ''
        }

        if (curr.rhsTableName != 'applicationuser' && !curr.custom) {
          val = data[curr.value] || ''
        }
        else if (!curr.custom) {
          val = currentUserData[curr.value] || ''
        }
        else if (curr.custom) {
          val = curr.value;
        }
        const con = curr.operator;
        // console.log("res",currentValue,val, con,this.customEval(currentValue,val,con))
        acc = this.evaluate(acc, this.evaluate(currentValue, val, con), condition);
      }
      else{
        acc = false;
      }
      
      }
    }
      return acc;
    }, true)

    return val
  }
}



