import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'ng-frontend';

  isMenuOpen: boolean = true;
  showLayout: boolean = false;

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  drawerContainer: boolean = true;
  sideNavContainer: boolean = false;

  constructor(private router: Router, private observer: BreakpointObserver) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        if (
          event['url'] == '/' ||
          event['url'] == '/login' ||
          event['url'] == '/register' ||
          event['url'] == '/reset-password'
        )
          this.showLayout = false;
        else this.showLayout = true;

        if (event['url'] == '/' || event['url'] == '/login')
          localStorage.clear();
      }
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 992px)']).subscribe((res) => {
      if (res.matches) {
        this.drawerContainer = false;
        this.sideNavContainer = true;
        // this.sidenav.mode = 'over';
        // this.sidenav.close();
      } else {
        this.drawerContainer = true;
        this.sideNavContainer = false;
        // this.sidenav.mode = 'side';
        // this.sidenav.open();
      }
    });
  }

  onMenuTogglerChange(isMenuOpenStatus: any): void {
    this.isMenuOpen = isMenuOpenStatus ? false : true;
  }
}
