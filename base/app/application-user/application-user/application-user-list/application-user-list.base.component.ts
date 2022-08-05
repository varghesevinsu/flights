import { ApplicationUserService } from '../application-user.service';
import { ApplicationUserBase} from '../application-user.base.model';
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { allowedValuesValidator } from "@baseapp/widgets/validators/allowedValuesValidator";
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Filter } from '@baseapp/vs-models/filter.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChangeLogsComponent } from '@baseapp/widgets/change-logs/change-logs.component'
import { fromEvent } from 'rxjs';
import { environment } from '@env/environment';
import { AppUtilBaseService } from '@baseapp/app-util.base.service';
import {  Renderer2} from '@angular/core';
import { map } from 'rxjs';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {  ElementRef } from '@angular/core';
import {  ViewChild} from '@angular/core';
import { BaseAppConstants } from '@baseapp/app-constants.base';

@Directive(
{
	providers:[MessageService, ConfirmationService]
}
)
export class ApplicationUserListBaseComponent{
	
	
	
showAdvancedSearch: boolean = false;
tableSearchFieldConfig:any = {};
@ViewChild('toggleButton')
  toggleButton!: ElementRef;
  @ViewChild('menu')
  menu!: ElementRef;

	quickFilter: any;
hiddenFields:any = {};
quickFilterFieldConfig:any={}
	selectedValues!: [];
  filter: Filter = {
    globalSearch: '',
    advancedSearch: {},
    sortField: null,
    sortOrder: null,
    quickFilter: {}
  };
params: any;
isMobile: boolean = BaseAppConstants.isMobile;

  gridData: ApplicationUserBase[] = [];
  totalRecords: number = 0;
  subscriptions: Subscription[] = [];
  formattableElements:any = ['date','datetime','number','currency','string'];
 multiSortMeta:any =[];
 selectedColumns:any =[];
 readonly GRID_ELEMENTS: any = {
    AUTOCOMPLETE: 'autocomplete',
    DATE: 'date',
    DATETIME: 'datetime',
    DROPDOWN: 'dropdown',
    NUMBER: 'number',
    STRING: 'string',
    ICON: 'icon',
    IMAGE: 'image',
    BOOLEAN: 'Boolean',
    TAG: 'tag',
    CURRENCY: 'currency',
    LINK: 'link'
  };

subHeader: any;
  autoSuggest: any;
  query: any;

rightFreezeColums:any;
total:number =0;
inValidFields:any = {};
selectedItems:any ={};
scrollTop:number =0;
	bsModalRef?: BsModalRef;
	isChildPage:boolean = false;

	
	leftActionBarConfig : any = {
  "children" : [ {
    "outline" : "true",
    "label" : "BUTTON_GROUP",
    "type" : "buttonGroup",
    "children" : [ {
      "outline" : "true",
      "buttonType" : "icon_on_left",
      "visibility" : "show",
      "showOn" : "both",
      "buttonStyle" : "curved",
      "action" : "new",
      "buttonEnabled" : "yes",
      "label" : "NEW",
      "type" : "button"
    }, {
      "outline" : "true",
      "buttonType" : "icon_on_left",
      "visibility" : "show",
      "showOn" : "both",
      "buttonStyle" : "curved",
      "action" : "delete",
      "buttonEnabled" : "yes",
      "label" : "DELETE",
      "type" : "button"
    } ],
    "buttonStyle" : "curved"
  }, {
    "outline" : "true",
    "buttonType" : "icon_on_left",
    "visibility" : "show",
    "showOn" : "both",
    "buttonStyle" : "curved",
    "icon" : {
      "type" : "icon",
      "icon" : {
        "label" : "fas fa-sync",
        "value" : "fas fa-sync"
      },
      "iconColor" : "#000000",
      "iconSize" : "13px"
    },
    "action" : "refresh",
    "buttonEnabled" : "yes",
    "label" : "REFRESH",
    "type" : "button"
  } ]
}
	rightActionBarConfig : any = {
  "children" : [ ]
}
	tableSearchConfig : any = {
  "children" : [ {
    "allowedValues" : { },
    "fieldName" : "sid",
    "data" : "Sid",
    "field" : "sid",
    "name" : "sid",
    "uiType" : "text",
    "label" : "Sid",
    "type" : "datamodelField",
    "fieldType" : "string"
  }, {
    "allowedValues" : { },
    "fieldName" : "createdBy",
    "data" : "Created By",
    "field" : "createdBy",
    "name" : "createdBy",
    "uiType" : "text",
    "label" : "Created By",
    "type" : "datamodelField",
    "fieldType" : "string"
  }, {
    "allowedValues" : { },
    "fieldName" : "createdDate",
    "data" : "Created Date",
    "field" : "createdDate",
    "name" : "createdDate",
    "uiType" : "datetime",
    "label" : "Created Date",
    "type" : "datamodelField",
    "fieldType" : "Date"
  }, {
    "allowedValues" : { },
    "fieldName" : "modifiedBy",
    "data" : "Modified By",
    "field" : "modifiedBy",
    "name" : "modifiedBy",
    "uiType" : "text",
    "label" : "Modified By",
    "type" : "datamodelField",
    "fieldType" : "string"
  }, {
    "allowedValues" : { },
    "fieldName" : "modifiedDate",
    "data" : "Modified Date",
    "field" : "modifiedDate",
    "name" : "modifiedDate",
    "uiType" : "datetime",
    "label" : "Modified Date",
    "type" : "datamodelField",
    "fieldType" : "Date"
  }, {
    "allowedValues" : { },
    "fieldName" : "email",
    "data" : "Email",
    "field" : "email",
    "name" : "email",
    "uiType" : "text",
    "label" : "Email",
    "type" : "datamodelField",
    "fieldType" : "string"
  }, {
    "allowedValues" : { },
    "fieldName" : "firstName",
    "data" : "First Name",
    "field" : "firstName",
    "name" : "firstName",
    "uiType" : "text",
    "label" : "First Name",
    "type" : "datamodelField",
    "fieldType" : "string"
  }, {
    "allowedValues" : { },
    "fieldName" : "lastName",
    "data" : "Last Name",
    "field" : "lastName",
    "name" : "lastName",
    "uiType" : "text",
    "label" : "Last Name",
    "type" : "datamodelField",
    "fieldType" : "string"
  }, {
    "allowedValues" : { },
    "fieldName" : "userRoles",
    "data" : "User Roles",
    "field" : "userRoles",
    "name" : "userRoles",
    "uiType" : "text",
    "label" : "User Roles",
    "type" : "datamodelField",
    "fieldType" : "string"
  } ],
  "columns" : "2",
  "type" : "tableSearch",
  "showAdvancedSearch" : "true"
}
	quickFilterConfig : any = {
  "children" : [ ]
}
	tableConfig : any = {
  "recordSelection" : "multiple_records",
  "rightFreezeFromColumn" : "0",
  "infiniteScroll" : "true",
  "viewAs" : "list",
  "hoverStyle" : "box",
  "tableStyle" : "style_1",
  "type" : "grid",
  "showDetailPageAs" : "navigate_to_new_page",
  "showLabel" : "true",
  "leftFreezeUptoColumn" : "0",
  "pageLimit" : "30",
  "children" : [ {
    "allowedValues" : { },
    "defaultField" : true,
    "fieldName" : "Sid",
    "data" : "Sid",
    "showOnMobile" : "true",
    "label" : "Sid",
    "type" : "datamodelField",
    "field" : "sid",
    "name" : "sid",
    "sysGen" : true,
    "width" : "120px",
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "sid"
  }, {
    "allowedValues" : { },
    "defaultField" : true,
    "fieldName" : "Created By",
    "data" : "Created By",
    "showOnMobile" : "true",
    "label" : "Created By",
    "type" : "datamodelField",
    "field" : "createdBy",
    "name" : "createdBy",
    "sysGen" : true,
    "width" : "120px",
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "createdBy"
  }, {
    "allowedValues" : { },
    "defaultField" : true,
    "fieldName" : "Created Date",
    "data" : "Created Date",
    "showOnMobile" : "true",
    "label" : "Created Date",
    "type" : "datamodelField",
    "field" : "createdDate",
    "name" : "createdDate",
    "sysGen" : true,
    "width" : "120px",
    "uiType" : "datetime",
    "fieldType" : "Date",
    "fieldId" : "createdDate"
  }, {
    "allowedValues" : { },
    "defaultField" : true,
    "fieldName" : "Modified By",
    "data" : "Modified By",
    "showOnMobile" : "true",
    "label" : "Modified By",
    "type" : "datamodelField",
    "field" : "modifiedBy",
    "name" : "modifiedBy",
    "sysGen" : true,
    "width" : "120px",
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "modifiedBy"
  }, {
    "allowedValues" : { },
    "defaultField" : true,
    "fieldName" : "Modified Date",
    "data" : "Modified Date",
    "showOnMobile" : "true",
    "label" : "Modified Date",
    "type" : "datamodelField",
    "field" : "modifiedDate",
    "name" : "modifiedDate",
    "sysGen" : true,
    "width" : "120px",
    "uiType" : "datetime",
    "fieldType" : "Date",
    "fieldId" : "modifiedDate"
  }, {
    "allowedValues" : { },
    "defaultField" : false,
    "fieldName" : "Email",
    "data" : "Email",
    "showOnMobile" : "true",
    "label" : "Email",
    "type" : "datamodelField",
    "field" : "email",
    "name" : "email",
    "sysGen" : true,
    "width" : "120px",
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "email"
  }, {
    "allowedValues" : { },
    "defaultField" : false,
    "fieldName" : "First Name",
    "data" : "First Name",
    "showOnMobile" : "true",
    "label" : "First Name",
    "type" : "datamodelField",
    "field" : "firstName",
    "name" : "firstName",
    "sysGen" : true,
    "width" : "120px",
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "firstName"
  }, {
    "allowedValues" : { },
    "defaultField" : false,
    "fieldName" : "Last Name",
    "data" : "Last Name",
    "showOnMobile" : "true",
    "label" : "Last Name",
    "type" : "datamodelField",
    "field" : "lastName",
    "name" : "lastName",
    "sysGen" : true,
    "width" : "120px",
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "lastName"
  }, {
    "multipleValues" : true,
    "allowedValues" : { },
    "defaultField" : false,
    "fieldName" : "User Roles",
    "data" : "User Roles",
    "showOnMobile" : "true",
    "label" : "User Roles",
    "type" : "datamodelField",
    "field" : "userRoles",
    "name" : "userRoles",
    "sysGen" : true,
    "width" : "120px",
    "uiType" : "text",
    "fieldType" : "string",
    "fieldId" : "userRoles"
  } ],
  "sorting" : "single_column",
  "detailPageNavigation" : "click_of_the_row",
  "resizeMode" : "expand_mode",
  "rowSpacing" : "medium",
  "rowHeight" : "medium"
}
	pageViewTitle: string = 'APPLICATION_USER_LIST';
	
		tableSearchControls : FormGroup = new FormGroup({
	lastName: new FormControl('',[]),
	sid: new FormControl('',[]),
	createdDate: new FormControl('',[]),
	modifiedBy: new FormControl('',[]),
	firstName: new FormControl('',[]),
	userRoles: new FormControl('',[]),
	modifiedDate: new FormControl('',[]),
	email: new FormControl('',[]),
	createdBy: new FormControl('',[]),
});

		quickFilterControls : FormGroup = new FormGroup({
});


	constructor(public applicationUserService : ApplicationUserService, public appUtilBaseService: AppUtilBaseService, public translateService: TranslateService, public messageService: MessageService, public confirmationService: ConfirmationService, public domSanitizer:DomSanitizer, public bsModalService: BsModalService, public activatedRoute: ActivatedRoute, public renderer2: Renderer2, public router: Router, ...args: any) {
    
 	 }

	
	sort(e: any, field: string) {
this.filter.sortField = field;
this.filter.sortOrder = (e.currentTarget.childNodes[1].childNodes[0].classList.contains('pi-sort-amount-up-alt')) ? 'desc' : 'asc';
this.onRefresh();
}
	clearFilterValues() {
  this.tableSearchControls.reset();
  this.filter.advancedSearch = {};
  this.onRefresh();
}
	onNew() {
	const value: any = "parentId";
	let property: Exclude<keyof ApplicationUserListBaseComponent, ''> = value;
	if (this.isChildPage && this[property]) {
		const methodName: any = "onNewChild";
		let action: Exclude<keyof ApplicationUserListBaseComponent, ''> = methodName;
		if (typeof this[action] == "function") {
			this[action]();
		}
	}
	else {
		this.router.navigate(['../applicationuserdetail'], { relativeTo: this.activatedRoute});
	}
}
	onUpdate(id: any) {
	if (this.tableConfig.detailPage?.url) {
      const value: any = "parentId";
       let property: Exclude<keyof ApplicationUserListBaseComponent, ''> = value;
       const methodName: any = "onUpdateChild";
       let action: Exclude<keyof ApplicationUserListBaseComponent, ''> = methodName;
       if (this.isChildPage && this[property]) {
	       if (typeof this[action] === "function") {
	        	this[action](id);
	         }
       }
       else {
       	this.router.navigateByUrl(this.tableConfig.detailPage.url + '?id=' + id)
       }
    }
}
	conditionalFormatting(config: any, data: any) {
   if(config?.hasOwnProperty([data])){
    const query = config[data].query
    const initialCondition = true;
    const finalCondition = query.condition === 'and' ? '&&' : '||';
    const conditions: any[] = [];
    query.rules?.forEach((rule: any) => {
      conditions.push(this.appUtilBaseService.evaluate(data, rule.value, rule.operator));
    })
    let finalResult = conditions?.reduce((previousValue: any, currentValue: any) =>
      this.appUtilBaseService.evaluate(previousValue, currentValue, finalCondition), initialCondition);
    return finalResult;
   }
   else{
     return false;
   }
}
	onRefresh(){
this.gridData = [];
this.params.start =0;
this.loadGridData();
}
	toggleAdvancedSearch() {
  this.showAdvancedSearch = !this.showAdvancedSearch;
}
	clearAllFilters() {
  this.filter.globalSearch = '';
  this.clearFilterValues();
}
	setHeight() {
  setTimeout(() => {
    const el = (<HTMLInputElement>document.getElementById("table-container")).getBoundingClientRect();
    const top = el.top + 'px';
    (<HTMLInputElement>document.getElementById('table-container')).style.setProperty('height', 'calc(100vh - ' + top + ')');
  }, 100);
 
}
	// closeAdvancedSearchPopup() {
  //   this.renderer2.listen('window', 'click', (e: Event) => {
  //     let clickedInside = this.menu?.nativeElement.contains(e.target);
  //     if(e.target !== this.toggleButton?.nativeElement&& !clickedInside &&this.showAdvancedSearch){
  //       this.showAdvancedSearch = false;
  //     }
  //   );
  // }
	initFilterForm(){
    this.quickFilterFieldConfig= this.appUtilBaseService.getControlsFromFormConfig(this.quickFilterConfig);
    this.filterSearch();
}
	getSubHeader() {
this.subHeader = this.tableConfig.groupOnColumn?.name?.split('.');
}
	onFormatColumns(col: any, datum: any) {
    const type = col.uiType;
    let data = datum[col.name];
    let formattedValue: any;
    switch (type) {
      case 'date':
        formattedValue = this.appUtilBaseService.formatDate(data, col.format ? col.format : null);
        break;

      case 'datetime':
        formattedValue = this.appUtilBaseService.formatDateTime(data, col.format ? col.format : null)
        break;

      case 'currency':
        const ccode = col.currencyCode ? col.currencyCode : null;
        const cDigits = col.currencyDigits ? col.currencyDigits : null;
        formattedValue = this.appUtilBaseService.formatCurrency(data, ccode, cDigits);

        break;

      case 'number':
        formattedValue = this.appUtilBaseService.formatNumber(data, col.format ? col.format : null);
        break;
        
      case 'autosuggest':
        formattedValue = (environment.prototype)? data : (data?.value)? (data?.value[col.displayField]):data;
        break;

      default:
        formattedValue = data;
    }
    return (formattedValue);
  }
	onFormatMultipleValues(col: any, data: any): any {
    const arr: any = []
    const displayField = col.displayField ? col.displayField : '';
  if (col.uiType == 'autosuggest' && Array.isArray(data)) {
      data?.forEach((k: any) => {
        arr.push(k.value[displayField]);
      })
    }
    else if (Array.isArray(data)) {
      data.forEach(function (e: any) {
        if (displayField)
          arr.push(e[displayField])
        else
          arr.push(data);
      })
    }
    else if (typeof data === 'object') {
      if (displayField) {
        arr.push(data[displayField]);
      }
    }
    else {
      arr.push(data);
    }
    return (arr.toString());
  }
	actionBarAction(btn: any) {
    const methodName: any = (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof ApplicationUserListBaseComponent, ' '> = methodName;
    if (btn.action === 'navigate_to_page' && btn.pageName?.url) {
      this.router.navigateByUrl(btn.pageName.url);
    }
    else if (typeof this[action] === "function") {
      this[action]();
    }
  }
	attachInfiniteScroll() {
const tracker = (<HTMLInputElement>document.getElementsByClassName('p-datatable-wrapper')[0])
let windowYOffsetObservable = fromEvent(tracker, 'scroll').pipe(map(() => {
  return Math.round(tracker.scrollTop);
}));

const scrollSubscription = windowYOffsetObservable.subscribe((scrollPos: number) => {
  if(this.scrollTop != scrollPos){
        this.scrollTop = scrollPos;
    if ((tracker.offsetHeight + scrollPos >= tracker.scrollHeight)) {
      this.params.start = this.total;
     this.loadGridData();
   }
  }
});
this.subscriptions.push(scrollSubscription);
}
	filterSearch() {
    this.quickFilterControls.valueChanges.subscribe((value) => {
      let dateRangeNotChoosen: boolean = false;
      for (let control of this.quickFilterConfig.children) {
        if (control.fieldType === 'Date') {
          if (value[control.field][0] && !value[control.field][1]) {
            dateRangeNotChoosen = true;
            break;
          }
        }
      }
      if (!dateRangeNotChoosen) {
        this.filter.quickFilter = value;
       this.onRefresh();
      }
    });
  }
	advancedSearch() {
  this.filter.advancedSearch = this.tableSearchControls.value;
 this.onRefresh();
  this.toggleAdvancedSearch();
}
	loadGridData() {
  let gridSubscription: any;
  if (environment.prototype) {
  	gridSubscription = this.applicationUserService.getProtoTypingData().subscribe((data: any) => {
  		this.gridData = [...this.gridData, ...data];
  	});
  } else {
	  	const searchData: any = {};
	  	const params = this.params;
	  	for (const key in this.filter.advancedSearch) {
	  		if (this.filter.advancedSearch.hasOwnProperty(key) && this.filter.advancedSearch[key]?.toString().length) {
	  			searchData[key] = this.filter.advancedSearch[key];
	  		}
	  	}
	  	if (this.filter.quickFilter) {
	  		for (const key in this.filter.quickFilter) {
	  			if (this.filter.quickFilter.hasOwnProperty(key) && this.filter.quickFilter[key]?.toString().length) {
	  				searchData[key] = this.filter.quickFilter[key];
	  			}
	  		}
	  	}
	  	if (this.filter.globalSearch)
	  		searchData['_global'] = this.filter.globalSearch;
	  		
	  	if(this.filter.sortField && this.filter.sortOrder){
          params.order = [{
            column: this.filter.sortField,
            dir: this.filter.sortOrder
          }]
        }
        else{
          params.order = null;
        }
	  	
	  	params.search = searchData;
	  	const value:any = "parentId";
	  	let property: Exclude<keyof ApplicationUserListBaseComponent, ''> = value;
	  	const method:any = "getChildTableData";
	  	let action: Exclude<keyof ApplicationUserListBaseComponent, ''> = method;
	  	if(this.isChildPage && this[property] && typeof this[action] === "function"){
	  		params.pid = this[property];
	  		this[action](params);
	  	}
	  	else{
		  	this.applicationUserService.getDatatableData(params).subscribe((data: any) => {
				let updateRecords: ApplicationUserBase[] = [...this.gridData, ...data?.results];
				const ids = updateRecords.map(o => o.sid)
				this.gridData = updateRecords.filter(({ sid }, index) => !ids.includes(sid, index + 1))
				this.total = data?.filtered ? data?.filtered : 0;
			});
		}
	}
}
	initSearchForm(){
  this.tableSearchFieldConfig= this.appUtilBaseService.getControlsFromFormConfig(this.tableSearchConfig)
}
	onDelete() {
  if (this.selectedValues.length > 0) {
    let values: any = [];
	this.selectedValues.forEach((field: any) => {
		values.push(field.sid)
	});
	const requestedParams = {ids:values.toString()}
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete the selected records?',
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.applicationUserService.delete(requestedParams).subscribe((res: any) => {
            this.showToastMessage({severity:'success', summary:'', detail:'Records deleted Succesfully'});
            this.onRefresh();

          });
        },
        reject: () => {
          //rejected
        },
      });
    }

  }
	showToastMessage(config: object) {
this.messageService.add(config);
}
	onKeydown(event: any) {
  if (event.which === 13 || event.keyCode === 13) {
    // this.filter.globalSearch = this.globalSearch
   this.onRefresh();
  }
}

    onInit() {
		
		this.initSearchForm();

		this.initFilterForm();
		 this.tableConfig.children = this.appUtilBaseService.formatTableConfig(this.tableConfig.children);
this.params = this.appUtilBaseService.getTableRequestParams(this.tableConfig);
 this.loadGridData();
this.selectedColumns = this.tableConfig.children;
 this.getSubHeader();
this.rightFreezeColums = (this.tableConfig.children.length - this.tableConfig.rightFreezeFromColumn);

    }
	
     onDestroy() {
		
		    this.subscriptions.forEach((subs: { unsubscribe: () => void; }) => subs.unsubscribe());
  
    }
     onAfterViewInit() {
		
		
 this.setHeight();
  this.attachInfiniteScroll();

    }

}
