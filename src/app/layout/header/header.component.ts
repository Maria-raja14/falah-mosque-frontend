import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  @Output() menuChangeEvent = new EventEmitter<any>();
  isMenuOpen: boolean = false;
  user_type:any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.user_type= JSON.parse(localStorage.getItem('user_details')||'{}');
    console.log(this.user_type)
  }

  menuToggler(){
    this.isMenuOpen = !this.isMenuOpen;
    this.menuChangeEvent.emit(this.isMenuOpen);
  }

  logout(){
    this.router.navigate(['login']);
  }

  home(){
    if(this.user_type.role =='super_admin'){
      this.router.navigate(['Home']);
    }else{
      this.router.navigate(['/Mosques']); 
    }
  }

}
