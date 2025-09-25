import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MosquesService } from 'src/app/services/mosques/mosques.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-mosque-list',
  templateUrl: './mosque-list.component.html',
  styleUrls: ['./mosque-list.component.sass'],
})
export class MosqueListComponent implements OnInit, AfterViewInit {
  mosqueListDisplayedColumns: string[] = [
    'name',
    'mobile_number',
    'email',
    'mosque_address',
    'is_active',
    'action',
  ];
  mosqueListDataSource: any = new MatTableDataSource();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  mosqueList: any;
  user_type: any;
  

  mosqueTablePagination = {
    Count: 6,
    pageIndex: 0,
    pageSize: 20,
    pageSizeOptions: [20],
  };

  constructor(
    private mosquesService: MosquesService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getMosqueList();
    this.user_type = JSON.parse(localStorage.getItem('user_details') || '{}');
    // console.log(this.user_type)
  }

  ngAfterViewInit(): void {
    this.mosqueListDataSource.sort = this.sort;
    this.mosqueListDataSource.paginator = this.paginator;
  }

  onPaginateChange(event: any) {
    // debugger
    // console.log('page event', event);
    this.mosqueTablePagination.pageIndex = event.pageIndex;
    this.mosqueTablePagination.pageSize = event.pageSize;
    // console.log('this.mosqueTablePagination', this.mosqueTablePagination);

    this.getMosqueList();
  }

  applyFilter(event: any) {
    // debugger
    this.mosqueListDataSource.filter = event?.target?.value
      .trim()
      .toLowerCase();

    if (this.mosqueListDataSource.paginator) {
      this.mosqueListDataSource.paginator.firstPage();
    }

    this.mosqueListDataSource.sort = this.sort;
  }

  getMosqueList() {
    const data = {
      // page: this.mosqueTablePagination.pageIndex + 1,
      // size: this.mosqueTablePagination.pageSize
    };
    this.spinner.show();
    this.mosquesService.getMosqueList(data).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res?.status) {
          this.mosqueList = res?.mosqueList;
          console.log(res?.mosqueList);

          this.mosqueListDataSource = new MatTableDataSource(this.mosqueList);

          this.mosqueListDataSource.sort = this.sort;
          this.mosqueListDataSource.paginator = this.paginator;

          // console.log('this.mosqueList', this.mosqueList);
        } else {
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

  navigateToMosqueForm(type: any, id: any) {
    if (type == 'create') this.router.navigateByUrl('/Mosques/create-mosque');
    else if (type == 'edit') this.router.navigate(['/Mosques/edit-mosque', id]);
  }

  toggleActive(e: any) {
    const event = e;
    const text = event.is_active
      ? 'You want to deactivate this mosque !'
      : 'You want to Activate this mosque !';
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
        this.mosquesService.activeDeactiveMosque(data).subscribe(
          (res: any) => {
            this.spinner.hide();
            if (res.status == true) {
              this.toastr.success(res.message, 'Success');
              this.getMosqueList();
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

  deleteMosque(e: any) {
    const event = e;
    const text = 'You want to delete this mosque !';
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
        this.mosquesService.deleteMosque(data).subscribe(
          (res: any) => {
            this.spinner.hide();
            if (res.status == true) {
              this.toastr.success(res.message, 'Success');
              this.getMosqueList();
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
