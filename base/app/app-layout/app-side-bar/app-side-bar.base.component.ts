import { AppLayoutBaseService } from '../app-layout.service.base'
import { TranslateService } from '@ngx-translate/core';
import { BaseAppConstants } from '@baseapp/app-constants.base';
import { AppUtilBaseService } from "../../app-util.base.service";

export class AppSideBarBaseComponent {
  menuType: string | undefined;
  floatDirection = "top-right";
  displayLeftMenu: any = true;
  displayRightMenu: any = true;
  badgeValue: number = Math.floor(Math.random() * 10);;

  items: any = [];

  isMobile: boolean = BaseAppConstants.isMobile;
  sideBarElements: any = []
  floatItems: any;
  fixedItems: any;
  floatDialog: any
  fixedSideBar: any
  floatMenuType: any
  fixedMenuType: any;
  menuRecursiveCount: number = 0
  childrenItemINdex: number = 0
  fixedSidebarOnInit: boolean = true
  floatDialogOnInit: boolean = true
  constructor(public bs: AppLayoutBaseService, public translate: TranslateService, public utilBase: AppUtilBaseService) {
  }

  getBadgeValue() {
    return this.badgeValue;
  }

  onInit(): void {
    // this.items = this.bs.getMenuItems();
    let values = this.bs.getMenuItems();
    this.sideBarElements.push(values.leftMenu)
    this.sideBarElements.push(values.rightMenu)
    let response = this.bs.getMenu();
      this.sideBarElements?.forEach((sideBarItems: any) => {
        if (sideBarItems?.element == "leftMenu") {
          sideBarItems["children"] = response?.left
        }
        if (sideBarItems?.element == "rightMenu") {
          sideBarItems["children"] = response?.right
        }
      })
    if (this.sideBarElements[0]?.menuType == 'float') {
      this.floatItems = this.sideBarElements[0]
      this.floatMenuType = 'left'
      this.floatDirection = 'top-left'
    } else if (this.sideBarElements[1]?.menuType == 'float') {
      this.floatItems = this.sideBarElements[1]
      this.floatMenuType = 'right'
      this.floatDirection = 'top-right'
    }
    if (this.sideBarElements[0]?.menuType == 'fixed') {
      this.fixedItems = this.sideBarElements[0]
      this.fixedMenuType = 'left'
    } else if (this.sideBarElements[1]?.menuType == 'fixed') {
      this.fixedItems = this.sideBarElements[1]
      this.fixedMenuType = 'right'
    }
    this.menuType = this.bs.getMenuType();
    let pageLink = window.location.href.split('#')[1];
    this.bs.getLeftMenuVisibility().subscribe(d => {
      this.displayLeftMenu = d
      if (this.fixedMenuType == 'left') {
        this.fixedSideBar = this.displayLeftMenu
        if (this.fixedSidebarOnInit && this.fixedSideBar) {
          this.fixedSidebarOnInit = false
          this.childrenItemINdex = 0
          this.iterateRecursiveArray(this.fixedItems?.children, "fixed", pageLink);
        }
      }
      if (this.floatMenuType == 'left') {
        this.floatDialog = this.displayLeftMenu
        if (this.floatDialogOnInit && this.floatDialog) {
          this.floatDialogOnInit = false
          this.childrenItemINdex = 0
          this.iterateRecursiveArray(this.floatItems?.children, "float", pageLink);
        }
      }
    });
    this.bs.getRightMenuVisibility().subscribe(d => {
      this.displayRightMenu = d
      if (this.fixedMenuType == 'right') {
        this.fixedSideBar = this.displayRightMenu
        if (this.fixedSidebarOnInit && this.fixedSideBar) {
          this.fixedSidebarOnInit = false
          this.childrenItemINdex = 0
          this.iterateRecursiveArray(this.fixedItems?.children, "fixed", pageLink);
        }
      }
      if (this.floatMenuType == 'right') {
        this.floatDialog = this.displayRightMenu
        if (this.floatDialogOnInit && this.floatDialog) {
          this.floatDialogOnInit = false
          this.childrenItemINdex = 0
          this.iterateRecursiveArray(this.floatItems?.children, "float", pageLink);
        }
      }
    });
    if (this.isMobile || this.sideBarElements[0]?.menuType == "float" || this.sideBarElements[1]?.menuType == "float") {
      this.floatDialog = false
      if (this.floatMenuType == 'left' || this.isMobile) {
        this.displayLeftMenu = false
        this.bs.updateLeftMenuVisibility(this.displayLeftMenu);
      }
      if (this.floatMenuType == 'right' || this.isMobile) {
        this.displayRightMenu = false
        this.bs.updateRightMenuVisibility(this.displayRightMenu);
      }
    }
    this.iterateRecursiveArray(this.fixedItems?.children, "fixed", pageLink);
    this.childrenItemINdex = 0
    this.iterateRecursiveArray(this.floatItems?.children, "float", pageLink);
  }

  onBeforeDialogHide() {
    if (this.floatMenuType == 'left' || this.isMobile) {
      this.bs.updateLeftMenuVisibility(this.displayLeftMenu = false);
    }
    if (this.floatMenuType == 'right' || this.isMobile) {
      this.bs.updateRightMenuVisibility(this.displayRightMenu = false);
    }
  }

  toggleList(rootIndex: any, level: any, itemIndex: any, sideBarMenuType: any, item: any) {
    if (level != 0) {
      itemIndex = rootIndex
    }
    $('#sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-' + item.menuRecursiveCount).toggle();
    if ($('#sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-' + item.menuRecursiveCount).css('display') == 'none') {
      $('.sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-' + item.menuRecursiveCount).addClass('collapsed');
    } else {
      $('.sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-' + item.menuRecursiveCount).removeClass('collapsed');
    }
    if (!item.children) {
      this.onBeforeDialogHide()
      if (item?.page?.url || item?.link) {
        item?.pathsInvolved?.forEach((obj: any) => {
          if (obj.indexOf(item?.page?.url) >= 0 || obj.indexOf(item?.link) >= 0) {
            this.highlightActiveMenu(item, itemIndex, sideBarMenuType)
          }
        })
      }
    }
  }

  highlightActiveMenu(item: any, itemIndex: any, sideBarMenuType: any, onInit: any = "") {
    if (onInit != 'onInit') {
      this.removeMenuActiveClasses()
    }
    setTimeout(() => {
      $('.sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-' + item.menuRecursiveCount).addClass('menu-active')
      $('.sidebar-item-level-' + itemIndex + '-' + sideBarMenuType + '-1').addClass('menu-active')
    }, 100)
  }

  removeMenuActiveClasses() {
    Array.from(document.querySelectorAll('.sidebar-menu-items')).forEach((el) => el.classList.remove('menu-active'));
  }

  showSideBar(showSideBar: any) {
    if (showSideBar == 0) {
      return ((this.fixedMenuType == 'left') ? !this.displayLeftMenu : !this.displayRightMenu);
    } else {
      return ((this.floatMenuType == 'left') ? !this.displayLeftMenu : !this.displayRightMenu);
    }
  }

  getMenuImage(item: any) {
    return "assets/images/" + item?.iconFileName
  }

  iterateRecursiveArray(children: any, menuType: string, pageLink: any) {
    if (children && children?.length > 0) {
      children?.forEach((items: any) => {
        if (menuType == "fixed") {
          if (this.fixedItems.children == children) {
            this.menuRecursiveCount = 0
            ++this.childrenItemINdex
          }
        }
        if (menuType == "float") {
          if (this.floatItems.children == children) {
            this.menuRecursiveCount = 0
            ++this.childrenItemINdex
          }
        }
        items["menuRecursiveCount"] = ++this.menuRecursiveCount
        if (!items?.children && pageLink != "/") {
          items?.pathsInvolved?.forEach((obj: any) => {
            if (obj.indexOf(pageLink) >= 0) {
              this.highlightActiveMenu(items, this.childrenItemINdex - 1, menuType == 'fixed' ? 0 : 1, "onInit")
            }
          })
        }
        if (items?.children && items?.children?.length > 0) {
          this.iterateRecursiveArray(items.children, menuType, pageLink)
        }
      })
    }
  }
}
