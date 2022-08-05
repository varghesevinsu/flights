import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppLandingBaseService {
 
  constructor() {}

  config : any = [ {
  "children" : [ {
    "properties" : {
      "tileType" : "type_1"
    },
    "children" : [ {
      "data" : {
        "properties" : {
          "class" : "home-tile",
          "label" : "Tile 1",
          "data" : "homeTile1",
          "field" : "homeTile"
        }
      },
      "expanded" : false,
      "folder" : false,
      "key" : "homeTile",
      "title" : "Tile 1",
      "type" : "homeTile",
      "id" : "homeTile1",
      "selected" : false
    }, {
      "data" : {
        "properties" : {
          "class" : "home-tile",
          "label" : "Tile 2",
          "data" : "homeTile2",
          "field" : "homeTile"
        }
      },
      "expanded" : false,
      "folder" : false,
      "key" : "homeTile",
      "title" : "Tile 2",
      "type" : "homeTile",
      "id" : "homeTile2",
      "selected" : false
    }, {
      "data" : {
        "properties" : {
          "class" : "home-tile",
          "label" : "Tile 3",
          "data" : "homeTile3",
          "field" : "homeTile"
        }
      },
      "expanded" : false,
      "folder" : false,
      "key" : "homeTile",
      "title" : "Tile 3",
      "type" : "homeTile",
      "id" : "homeTile3",
      "selected" : false
    } ],
    "expanded" : false,
    "folder" : true,
    "key" : "landingPage",
    "title" : "Landing Page",
    "type" : "landingPage",
    "id" : "landingPage",
    "selected" : false
  } ],
  "expanded" : false,
  "folder" : true,
  "key" : "page",
  "title" : "Page",
  "type" : "page",
  "id" : "page",
  "selected" : false
} ];
  
  public getLandingPageData() {
    const data: any = (this.config.find((t: { type: string; }) => t.type === "page"));
    return data.children[0];
  }
}