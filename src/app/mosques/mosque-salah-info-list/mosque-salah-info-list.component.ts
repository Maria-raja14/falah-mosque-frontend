import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { MosqueSalahInfoService } from 'src/app/services/mosques/mosque-salah-info.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import Swal from 'sweetalert2';
import { MosquesService } from 'src/app/services/mosques/mosques.service';

@Component({
  selector: 'app-mosque-salah-info-list',
  templateUrl: './mosque-salah-info-list.component.html',
  styleUrls: ['./mosque-salah-info-list.component.sass'],
})
export class MosqueSalahInfoListComponent implements OnInit, AfterViewInit {
  mosqueSalahInfoListDisplayedColumns: string[] = [
    'mosque_name',
    'fajr_adhan_namaz_time',
    'dhuhr_adhan_namaz_time',
    'asr_adhan_namaz_time',
    'maghrib_adhan_namaz_time',
    'isha_adhan_namaz_time',
    'action',
  ];

  mosqueSalahInfoListDataSource: any = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  mosqueSalahInfoList: any;
  user_type: any;
  mosqueCount!: number;
  createSalah: boolean = false;

  mosqueSalahInfoTablePagination = {
    Count: 6,
    pageIndex: 0,
    pageSize: 20,
    pageSizeOptions: [20],
  };

  constructor(
    private mosqueSalahInfoService: MosqueSalahInfoService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private dashboardService: DashboardService,
    private mosquesService: MosquesService
  ) {}

  ngOnInit(): void {
    this.user_type = JSON.parse(localStorage.getItem('user_details') || '{}');
    // console.log(this.user_type);
    // this.spinner.show();
    
    this.dashboardService.getDashboardData().subscribe(
      (res: any) => {
        if (res) {
          this.spinner.hide();
          this.mosqueCount = res?.dashboardData?.mosqueCount;
        }
        this.getMosqueSalahInfoList();
      },
      (err: any) => {
        if (err?.error?.message == 'jwt expired') {
          this.router.navigateByUrl('/login');
          this.spinner.hide();
        }
      }
    );

    this.getMosqueSalahInfoList();   
    //  this.getMosqueList();
  }

  ngAfterViewInit() {
    this.mosqueSalahInfoListDataSource.sort = this.sort;
    this.mosqueSalahInfoListDataSource.paginator = this.paginator;
  }

  getMosqueSalahInfoList() {
    const data = {
      // page: this.mosqueSalahInfoTablePagination.pageIndex + 1,
      // size: this.mosqueSalahInfoTablePagination.pageSize
    };
    this.spinner.show();
    this.mosqueSalahInfoService.getMosqueSalahInfoList(data).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res) {
          this.mosqueSalahInfoList = res.mosquePrayerTimeList;
          // console.log('mosqueSalahInfoList', this.mosqueSalahInfoList);
          this.mosqueSalahInfoListDataSource = new MatTableDataSource(
            this.mosqueSalahInfoList
          );
          this.mosqueSalahInfoListDataSource.sort = this.sort;
          this.mosqueSalahInfoListDataSource.paginator = this.paginator;

          //  button visible condition

          if (
            this.user_type?.role === 'sub_admin' &&
            this.mosqueSalahInfoList?.length === 1
          ) {
            this.createSalah = true;
          }
          if (this.mosqueCount === this.mosqueSalahInfoList?.length) {
            this.createSalah = true;
          }
        }
      },
      (err: any) => {
        if (err?.error?.message == 'jwt expired')
          this.router.navigateByUrl('/login');
        // console.log(err);
        this.spinner.hide();
      }
    );
  }
  onPaginateChange(event: any) {
    this.mosqueSalahInfoTablePagination.pageIndex = event.pageIndex;
    this.mosqueSalahInfoTablePagination.pageSize = event.pageSize;

    this.getMosqueSalahInfoList();
  }

  //   applyFilter(event: Event) {
  //     const filterValue = (event.target as HTMLInputElement).value;
  //     this.dataSource.filter = filterValue.trim().toLowerCase();

  //     if (this.dataSource.paginator) {
  //       this.dataSource.paginator.firstPage();
  //     }
  //   }
  // }

  applyFilter(event: any) {
    // const filterValue = (event.target as HTMLInputElement).value;
    this.mosqueSalahInfoListDataSource.filter = event.target.value
      .trim()
      .toLowerCase();
    if (this.mosqueSalahInfoListDataSource.paginator) {
      this.mosqueSalahInfoListDataSource.paginator.firstPage();
    }

    this.mosqueSalahInfoListDataSource.sort = this.sort;
  }

  navigateToMosqueSalahInfoForm(type: any, id: any) {
    // console.log(type);
    if (type == 'create')
      this.router.navigateByUrl('/Mosques/create-mosque-prayer-time');
    else if (type == 'edit')
      this.router.navigate(['/Mosques/edit-mosque-prayer-time', id]);
  }

  toggleActive(e: any) {
    const event = e;
    const text = event.is_active
      ? 'You want to deactivate this mosque salah info !'
      : 'You want to Activate this mosque salah info !';
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
        this.mosqueSalahInfoService
          .activeDeactiveMosqueSalahInfo(data)
          .subscribe(
            (res: any) => {
              this.spinner.hide();
              if (res.status) this.getMosqueSalahInfoList();
            },
            (err: any) => {
              if (err?.error?.message == 'jwt expired')
                this.router.navigateByUrl('/login');
              // console.log(err);
              this.spinner.hide();
            }
          );
      }
    });
  }

  deleteMosqueSalahInfo(e: any) {
    const event = e;
    const text = 'You want to delete this mosque salah info !';
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
        this.mosqueSalahInfoService.deleteMosqueSalahInfo(data).subscribe(
          (res: any) => {
            this.spinner.hide();
            if (res.status == true) {
              this.toastr.success(res.message, 'Success');
              this.getMosqueSalahInfoList();
            }
          },
          (err: any) => {
            if (err?.error?.message == 'jwt expired')
              this.router.navigateByUrl('/login');
            // console.log(err);
            this.spinner.hide();
          }
        );
      }
    });
  }
}
