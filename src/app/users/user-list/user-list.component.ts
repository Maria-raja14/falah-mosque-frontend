import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { UsersService } from 'src/app/services/users/users.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.sass'],
})
export class UserListComponent implements OnInit, AfterViewInit {
  userListDisplayedColumns: string[] = [
    'name',
    'mobile_number',
    'email',
    'is_active',
    'action',
  ];
  userListDataSource: any = new MatTableDataSource();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  userList: any;

  userTablePagination = {
    Count: 6,
    pageIndex: 0,
    pageSize: 20,
    pageSizeOptions: [20],
  };

  constructor(
    private usersService: UsersService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getUserList();
  }

  ngAfterViewInit(): void {
    this.userListDataSource.sort = this.sort;
    this.userListDataSource.paginator = this.paginator;
  }

  onPaginateChange(event: any) {
    console.log('page event', event);
    this.userTablePagination.pageIndex = event.pageIndex;
    this.userTablePagination.pageSize = event.pageSize;
    // console.log('this.userTablePagination', this.userTablePagination);

    this.getUserList();
  }

  applyFilter(event: any) {
    this.userListDataSource.filter = event.target.value.trim().toLowerCase();

    if (this.userListDataSource.paginator) {
      this.userListDataSource.paginator.firstPage();
    }

    this.userListDataSource.sort = this.sort;
  }

  getUserList() {
    const data = {
      // page: this.userTablePagination.pageIndex + 1,
      // size: this.userTablePagination.pageSize
    };
    this.spinner.show();
    this.usersService.getUserList(data).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res?.status) {
          this.userList = res.userList;
          this.userListDataSource = new MatTableDataSource(this.userList);
          this.userListDataSource.sort = this.sort;
          this.userListDataSource.paginator = this.paginator;
          // console.log('this.userList', this.userList);
        }
      },
      (err: any) => {
        if (err?.error?.message == 'jwt expired')
          this.router.navigateByUrl('/login');
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  navigateToUserForm(type: any, id: any) {
    if (type == 'create') this.router.navigateByUrl('/Users/create-user');
    else if (type == 'edit') this.router.navigate(['/Users/edit-user', id]);
  }

  toggleActive(e: any) {
    const event = e;
    const text = event.is_active
      ? 'You want to deactivate this user !'
      : 'You want to Activate this user !';
    const confirmButtonText = event.is_active
      ? 'Yes deactivate it !'
      : 'Yes Activate it !';
    Swal.fire({
      title: 'Are you sure ?',
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        const data: any = {
          _id: event._id,
          is_active: !event.is_active,
        };
        this.usersService.activeDeactiveUser(data).subscribe(
          (res: any) => {
            this.spinner.hide();
            if (res.status == true) {
              this.toastr.success(res.message, 'Success');
              this.getUserList();
            }
          },
          (err: any) => {
            if (err?.error?.message == 'jwt expired')
              this.router.navigateByUrl('/login');
            console.log(err);
            this.spinner.hide();
          }
        );
      }
    });
  }

  deleteUser(e: any) {
    const event = e;
    const text = 'You want to delete this user !';
    const confirmButtonText = 'Yes delete';
    Swal.fire({
      title: 'Are you sure ?',
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        const data: any = {
          _id: event._id,
        };
        this.usersService.deleteUser(data).subscribe(
          (res: any) => {
            this.spinner.hide();
            if (res.status) {
              this.toastr.success(res.message, 'Success');
              this.getUserList();
            }
          },
          (err: any) => {
            if (err?.error?.message == 'jwt expired')
              this.router.navigateByUrl('/login');
            console.log(err);
            this.spinner.hide();
          }
        );
      }
    });
  }
}
