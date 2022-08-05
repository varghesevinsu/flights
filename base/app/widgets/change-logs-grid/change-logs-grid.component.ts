import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { AppUtilBaseService } from '@baseapp/app-util.base.service';

@Component({
  selector: 'change-logs-grid',
  templateUrl: './change-logs-grid.component.html',
  styleUrls: ['./change-logs-grid.component.scss'],

})
export class ChangeLogsGridComponent implements OnInit {
  @Input("gridConfig") gridConfig: any
  @Input("gridType") gridType: any
  columns = []
  logsData = []
  logsCompareData: any = []
  logsKey: any = []
  excludedColums: any = []
  compareValue1: any;
  compareValue2: any;
  logsRawData = [];
  updatedValue: any;
  changeLogListGrid: any = []
  changeLogCompareGrid: any = []
  changeLogAPIDetails:any = {}
  constructor(private http: HttpClient,
    private datePipe: DatePipe,
    private appUtilBaseService : AppUtilBaseService
    ) { }

  ngOnInit(): void {
    this.getParms()
    this.getData()
  }
  getParms() {
    this.changeLogListGrid = this.gridConfig.changeLogListGrid
    this.changeLogCompareGrid = this.gridConfig.changeLogCompareGrid
    this.changeLogAPIDetails = this.gridConfig.changeLogApis
  }
  getData() {
    this.logsData = []
    console.log(this.changeLogListGrid.ajaxMethod);   

    if(this.changeLogListGrid.ajaxMethod == 'GET'){
      this.http.get(this.changeLogListGrid.ajaxUrl).subscribe((res: any) => {
        this.getListData(res.results)
        this.getComparesionData(res.results)
      })
    } else{
      this.http.post(this.changeLogListGrid.ajaxUrl,'').subscribe((res: any) => {
        this.getListData(res.results)
        this.getComparesionData(res.results)
      })
    } 
   
  }
  getListData(results: any) {
    let rawData = results
    this.logsRawData = results
    rawData.forEach((ele: any, index: any) => {
      ele.modifiedDate = this.datePipe.transform(ele.modifiedDate, 'medium')
      ele.modifiedBy = ele.modifiedBy.split('@')[0]
    })
    this.logsData = rawData

  }
  getDataById(event : any, entiyId: any) {
    $('.cursor.selected').removeClass('selected');
    $('tr.cursor:nth-child('+ (entiyId + 1) +')').addClass('selected');
    this.getComparesionData(this.logsRawData, entiyId)
    console.log(this.excludedColums);
  }
  getComparesionData(results: any, curIndex?: any) {
    this.compareValue1 = ''
    this.compareValue1 = ''
    let rawData = results

    if (rawData.length === 1) {
      this.compareValue1 = JSON.parse(rawData[0].value)
      this.logsCompareData = []
      this.populateData(this.compareValue1)
    } else if (rawData.length > 1) {
      if (curIndex != undefined) {
        console.log(curIndex);
        if (curIndex == rawData.length - 1) {
          this.compareValue1 = JSON.parse(rawData[curIndex].value)
          this.logsCompareData = []
          this.populateData(this.compareValue1)
        } else {

          this.compareValue1 = JSON.parse(rawData[curIndex].value)
          this.compareValue2 = JSON.parse(rawData[curIndex + 1].value)
          this.logsCompareData = []
          this.populateData(this.compareValue1, this.compareValue2)
        }
      } else {
        this.compareValue1 = JSON.parse(rawData[0].value)
        this.compareValue2 = JSON.parse(rawData[1].value)
        this.logsCompareData = []
        this.populateData(this.compareValue1, this.compareValue2)
        
      }

    } else {

    }
  }
  populateData(value1: any = {}, value2: any = {}, parentKey?: any) {

    for (let key in value1) {
      if (key != undefined) {
        if (!this.changeLogCompareGrid.excludedColums.includes(key)) {
          if (typeof value1[key] === 'object') {
            let parent_keys = this.findParentGrandparent(this.compareValue1, key).reverse().toString().replace(',', '.')
            this.populateData(value1[key], value2[key], parent_keys)
          } else {
            let oldValue;
            let newValue;
            if(this.changeLogCompareGrid.dateTimeFields.indexOf(key) > -1){
              oldValue = this.appUtilBaseService.formatDateTime(value2[key]);
              newValue = this.appUtilBaseService.formatDateTime(value1[key]);
            } else {
              oldValue = value2[key];
              newValue = value1[key];
            }

            
            let newObj = {
              "attribute": parentKey != undefined ? `${parentKey}.${key}` : key,
              "old_value": oldValue,
              "new_value": newValue,
              "is_differ": value2[key] === value1[key] ? "noChange" : "valueChanged"
            }
            this.logsCompareData.push(newObj)
          }
        }
      }
    }
    this.updatedValue = []
    this.updatedValue = [...this.logsCompareData]
  }
  findParentGrandparent(obj: any, target: any): any {
    for (const child of Object.entries(obj)) {
      if (typeof child[1] === 'object' && child[0] !== target) {
        const result = this.findParentGrandparent(child[1], target);
        if (result != undefined) return [...result, child[0]];
      } else if (child[0] === target) {
        return [child[0]];
      }
    };
    return
  };

  ngAfterViewInit(){
    $('tr.cursor:nth-child(1)').addClass('selected');
  }

}
