import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass'],
})
export class SidebarComponent implements OnInit {
  sideMenuList: any = [];

  UserDetails: any;

  // listComp: any[] = [
  //   {
  //     title: "Section 1",
  //     children: []
  //   },
  //   {
  //     title: "Section 2",
  //     children: [
  //       {
  //         title: "Section 2.1",
  //         children: []
  //       },
  //       {
  //         title: "Section 2.2",
  //         children: []
  //       },
  //       {
  //         title: "Section 2.3",
  //         children: []
  //       }
  //     ]
  //   },
  //   {
  //     title: "Section 3",
  //     children: [
  //       {
  //         title: "Section 3.1", children: []
  //       },
  //       {
  //         title: "Section 3.2",
  //         children: [
  //           {
  //             title: "Section 3.2.1",
  //             children: []
  //           },
  //           {
  //             title: "Section 3.2.2",
  //             children: []
  //           },
  //           {
  //             title: "Section 3.2.3",
  //             children: [
  //               {
  //                 title: "Section 3.2.3.1",
  //                 children: []
  //               },
  //               {
  //                 title: "Section 3.2.3.2",
  //                 children: []
  //               }
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         title: "Section 3.3",
  //         children: [
  //           {
  //             title: "Section 3.3.1",
  //             children: []
  //           },
  //           {
  //             title: "Section 3.3.2",
  //             children: []
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.UserDetails = localStorage.getItem('user_details');
    this.UserDetails = JSON.parse(this.UserDetails);

    this.setSideBarData();

    // this.setProperty(this.listComp,false);
  }

  setSideBarData() {
    if (this.UserDetails?.role == 'super_admin') {
      this.sideMenuList = [
        {
          name: 'Dashboard',
          url: '/Home',
          icon: {
            src: 'assets/images/dashboard.png',
          },
        },
        {
          name: 'Mosque Management',
          icon: {
            src: 'assets/images/masjidh.png',
          },
          isExpand: false,
          subMenu: [
            {
              name: 'Mosques',
              url: '/Mosques',
              // isExpand: false,
              // subSubMenu: [
              //   {name: "Users", }
              // ]
            },
            {
              name: 'Mosques Salah Info',
              url: '/Mosques/mosque-prayer-time-list',
            },
          ],
        },
        {
          name: 'User Management',
          icon: {
            src: 'assets/images/user.png',
          },
          isExpand: false,
          subMenu: [{ name: 'Users', url: '/Users' }],
        },
        // { name: "Settings", url: '/Home/Settings', icon: 'home' },
      ];
    } else if (this.UserDetails?.role == 'sub_admin') {
      this.sideMenuList = [
        {
          name: 'Mosque Management',
          icon: {
            src: 'assets/images/masjidh.png',
          },
          isExpand: false,
          subMenu: [
            {
              name: 'Mosques',
              url: '/Mosques',
            },
            {
              name: 'Mosques Salah Info',
              url: '/Mosques/mosque-prayer-time-list',
            },
          ],
        },
      ];
    } else if (this.UserDetails?.role == 'user') {
      this.sideMenuList = [
        {
          name: 'User Management',
          icon: {
            src: 'assets/images/user.png',
          },
          isExpand: false,
          subMenu: [{ name: 'Users', url: '/Users' }],
        },
      ];
    }
  }

  clickSideMenu(sideMenu: any) {
    if (sideMenu && sideMenu.subMenu && sideMenu.subMenu.length)
      this.ExpandCollapseSideMenu(sideMenu);
    else this.sideMenuNavigate(sideMenu);
  }

  sideMenuNavigate(url: any) {
    this.router.navigate([url]);
  }

  ExpandCollapseSideMenu(sideMenu: any) {
    sideMenu.isExpand = !sideMenu.isExpand;

    if (
      (sideMenu.subMenu && sideMenu.subMenu.length) ||
      (sideMenu.subSubMenu && sideMenu.subSubMenu.length)
    ) {
      if (sideMenu.subMenu && sideMenu.subMenu.length) {
        sideMenu.subMenu.map((submenu: any) => {
          submenu.isExpand = false;
        });
      } else if (sideMenu.subSubMenu && sideMenu.subSubMenu.length) {
        sideMenu.subSubMenu.map((subsubMenu: any) => {
          subsubMenu.isExpand = false;
        });
      }
    }
  }

  // toggle(item:any){
  //   item.expand = !item.expand;
  //   this.setProperty(item.children,false);
  // }

  // setProperty(list:any,bool:any){
  //   if(list && list.length){
  //     list.map((e:any) => {
  //       if(e && e.children && e.children.length){
  //         e.expand = bool;
  //        return this.setProperty(e.children,bool);
  //       }
  //     })
  //   }
  // }
}
