import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseAppConstants } from '@baseapp/app-constants.base';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';


export interface ActionItem extends MenuItem{

  name?:string
  type ?:string,
  action ?:string,
  collapsible ?:boolean,
  label?: string,
  disabled?: boolean,
  visibility?: boolean,
  service?: string,
  defaultAction?: string,
  customAction?: string,
  icon?: string,
  showOnlyIcon?: boolean,
  showOn?:string, 
  buttonType?:string
  styleClass?: string,
  tooltipMessage?:string
  backgroundColor?:string
  buttonEnabled?:boolean
  font?:object
  hoverFont?:object                  
  click?: (event?: any) => any
}


@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss']
})


export class ActionBarComponent implements OnInit {

  @Input() buttons:any = [];


  @Output() onBtnClick: EventEmitter<any> = new EventEmitter();

  isMobile: boolean = BaseAppConstants.isMobile;
  secondaryActions: any = []
  constructor(
    private translateService:TranslateService
  ) { }

  ngDoCheck(changes: any) {
    // this.loadButtons();
  }

  ngOnInit(): void {
    this.loadButtons();
  }

  loadButtons() {
    let arr: any = [];
    this.buttons?.forEach((btn: any) => {
      if (btn.type === 'buttonGroup' && btn.hasOwnProperty('children')) {
        let tempArr = [...btn.children];
        if (btn.displayCount) {
          btn.displayActions = tempArr.splice(0, btn.displayCount);
          btn.dropdownActions = this.updateDropdownActions(tempArr)
        }
        else {
          btn.displayActions = tempArr;

        }
        
      }
      else if (btn.type === 'splitButton') {
        btn.dropdownActions = this.updateDropdownActions(btn.children);
      }
      else if (btn.type === 'button' && this.isMobile) {
        if (btn.onMobile === 'secondary') {
          arr.push(btn);
        }
      }
    });
    if(this.buttons)
    this.secondaryActions = this.updateDropdownActions(arr);
    
    
  }


  updateDropdownActions(arr: any) {
    return arr.map((item: any) => {
      return {
        label: (item.buttonType !== 'icon_only') ? this.translateService.instant(item.label) || '' : '',
        icon: (item.buttonType !== 'text_only') ? item.icon?.icon?.value : '',
        visible: (item.visibility|| !(item.showOn =='mobile_only' && !this.isMobile) || !(item.showOn =='desktop_only' && this.isMobile)),
        disabled: (item.buttonEnabled =='no') ,
        iconStyle: { color: '', },
        style: {
          // backgroundColor: item.backgroundColor,
          fontFamily:item.font?.fontFamily?.code,
          fontSize:item.font?.fontSize,
          fontWeight:item.font?.fontWeight,
          color:item.font?.fontColor
        },
        title: item.tooltipMessage,
        command: (e: any) => {
          this.onButtonClick(e, item)
        }
      };
    })

  }

  
  onButtonClick($event?: any, btn?: any) {
    // if(typeof btn?.action === 'function'){
    this.onBtnClick.emit(btn);
    // btn.click($event, btn);
    // }
  }

  test(i:any){
    return JSON.stringify(i)
  }

  getLabel(label: string){
    this.translateService.instant(label);
  }

  addHoverProperty(btn: any) {
    const ele = (<HTMLInputElement>document.getElementById(btn.label))
    ele.style.fontFamily = btn.hoverFont?.fontFamily?.code;
    ele.style.fontSize = btn.hoverFont?.fontSize;
    ele.style.fontWeight = btn.hoverFont?.fontWeight;
    ele.style.color = btn.hoverFont?.fontColor
    ele.style.backgroundColor = btn.hoverBackground || '';
  }


  removeHoverProperty(btn: any) {
    const ele = (<HTMLInputElement>document.getElementById(btn.label))
    ele.style.fontFamily = btn.font?.fontFamily?.code;
    ele.style.fontSize = btn.font?.fontSize;
    ele.style.fontWeight = btn.font?.fontWeight;
    ele.style.color = btn.font?.fontColor;
    ele.style.backgroundColor = btn.backgroundColor || '';
  }

  hideBtnGroup(btn: any) {
    let hasChildren = false;
    if (btn.children) {
      btn.children.forEach((btn: any) => {
        if (!(btn.visibility === 'hide' || (btn.showOn == 'mobile_only' && !this.isMobile) || (btn.showOn == 'desktop_only' && this.isMobile))) {
          hasChildren = true;
        }
      })
    }
    return hasChildren;
  }
}
