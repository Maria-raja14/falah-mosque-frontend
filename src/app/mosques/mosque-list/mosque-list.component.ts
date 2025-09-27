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
  
  mosqueListDataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  mosqueList: any[] = [];
  user_type: any;

  mosqueTablePagination = {
    Count: 0, // Initialize to 0
    pageIndex: 0,
    pageSize: 20,
    pageSizeOptions: [20],
  };

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private mosquesService: MosquesService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.user_type = JSON.parse(localStorage.getItem('user_details') || '{}');
    this.getMosqueList();
  }

  ngAfterViewInit(): void {
    this.mosqueListDataSource.sort = this.sort;
    this.mosqueListDataSource.paginator = this.paginator;
  }

  onPaginateChange(event: any) {
    this.mosqueTablePagination.pageIndex = event.pageIndex;
    this.mosqueTablePagination.pageSize = event.pageSize;
    this.getMosqueList();
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.mosqueListDataSource.filter = filterValue.trim().toLowerCase();

    if (this.mosqueListDataSource.paginator) {
      this.mosqueListDataSource.paginator.firstPage();
    }
  }

  getMosqueList() {
    const data = {
      page: this.mosqueTablePagination.pageIndex + 1,
      size: this.mosqueTablePagination.pageSize
    };
    
    this.spinner.show();
    this.mosquesService.getMosqueList(data).subscribe(
      (res: any) => {
        this.spinner.hide();
        console.log('API Response:', res); // Debug log
        
        if (res?.status) {
          // Check the actual structure of your API response
          this.mosqueList = res?.mosqueList || res?.data || res || [];
          console.log('Mosque List:', this.mosqueList); // Debug log
          
          // Update the data source
          this.mosqueListDataSource.data = this.mosqueList;
          
          // Update pagination length if available from API
          if (res.totalCount !== undefined) {
            this.mosqueTablePagination.Count = res.totalCount;
          } else if (res.count !== undefined) {
            this.mosqueTablePagination.Count = res.count;
          } else {
            this.mosqueTablePagination.Count = this.mosqueList.length;
          }
          
        } else {
          this.toastr.error(res?.message || 'Failed to load mosque list', 'Error');
          this.mosqueList = [];
          this.mosqueListDataSource.data = [];
        }
      },
      (err: any) => {
        this.spinner.hide();
        if (err?.error?.message == 'jwt expired') {
          this.router.navigateByUrl('/login');
        } else {
          this.toastr.error('Failed to load mosque list', 'Error');
          console.error('Error fetching mosque list:', err);
        }
        this.mosqueList = [];
        this.mosqueListDataSource.data = [];
      }
    );
  }

  navigateToMosqueForm(type: any, id: any) {
    if (type == 'create') {
      this.router.navigateByUrl('/Mosques/create-mosque');
    } else if (type == 'edit') {
      this.router.navigate(['/Mosques/edit-mosque', id]);
    }
  }

  toggleActive(e: any) {
    const event = e;
    const text = event.is_active
      ? 'You want to deactivate this mosque!'
      : 'You want to activate this mosque!';
    const confirmButtonText = event.is_active
      ? 'Yes, deactivate it!'
      : 'Yes, activate it!';
      
    Swal.fire({
      title: 'Are you sure?',
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
            if (res.status) {
              this.toastr.success(res.message, 'Success');
              this.getMosqueList();
            } else {
              this.toastr.error(res.message || 'Operation failed', 'Error');
            }
          },
          (err: any) => {
            this.spinner.hide();
            if (err?.error?.message == 'jwt expired') {
              this.router.navigateByUrl('/login');
            } else {
              this.toastr.error('Operation failed', 'Error');
            }
          }
        );
      }
    });
  }

  deleteMosque(e: any) {
    const event = e;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this mosque!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        const data: any = {
          _id: event._id,
        };
        this.mosquesService.deleteMosque(data).subscribe(
          (res: any) => {
            this.spinner.hide();
            if (res.status) {
              this.toastr.success(res.message, 'Success');
              this.getMosqueList();
            } else {
              this.toastr.error(res.message || 'Deletion failed', 'Error');
            }
          },
          (err: any) => {
            this.spinner.hide();
            if (err?.error?.message == 'jwt expired') {
              this.router.navigateByUrl('/login');
            } else {
              this.toastr.error('Deletion failed', 'Error');
            }
          }
        );
      }
    });
  }
}//all come correctly