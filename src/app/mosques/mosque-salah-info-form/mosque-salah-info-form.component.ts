import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { MosqueSalahInfoService } from 'src/app/services/mosques/mosque-salah-info.service';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { MosquesService } from 'src/app/services/mosques/mosques.service';

@Component({
  selector: 'app-mosque-salah-info-form',
  templateUrl: './mosque-salah-info-form.component.html',
  styleUrls: ['./mosque-salah-info-form.component.sass']
})
export class MosqueSalahInfoFormComponent implements OnInit {
  dropDownVisibility: boolean = true;
  mosqueSalahInfoID: any;
  isEdit = false;

  formDirective: any;

  MosqueSalahInfoForm!: FormGroup;

  mosqueSalahInfoData: any;
  mosqueNameIDList: any;

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private form_builder: FormBuilder,
    private auth_service: AuthService,
    private mosquesService: MosquesService,
    private mosqueSalahInfoService: MosqueSalahInfoService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.createMosqueSalahInfoForm();

    let hrefArr = this.router.url.split('/');

    if (hrefArr.includes("edit-mosque-prayer-time")) {
      this.mosqueSalahInfoID = this.activatedroute.snapshot.paramMap.get("id");
      if (!this.mosqueSalahInfoID) {
        this.router.navigateByUrl('/Mosques/mosque-prayer-time-list');
        return;
      }
      this.isEdit = true;
      this.getMosqueSalahInfo();
    } else {
      this.getMosqueNameIDList();
    }
  }

  createMosqueSalahInfoForm() {
    this.MosqueSalahInfoForm = this.form_builder.group({
      mosque_id: ['', Validators.required],
      fajr_adhan: ['', Validators.required],
      fajr_namaz: ['', Validators.required],
      dhuhr_adhan: ['', Validators.required],
      dhuhr_namaz: ['', Validators.required],
      asr_adhan: ['', Validators.required],
      asr_namaz: ['', Validators.required],
      maghrib_adhan: ['', Validators.required],
      maghrib_namaz: ['', Validators.required],
      isha_adhan: ['', Validators.required],
      isha_namaz: ['', Validators.required],
      jumma: ['', Validators.required],
      //sun_rise: ['', Validators.required],
    });
  }

  getMosqueSalahInfo() {
    const data = { _id: this.mosqueSalahInfoID }
    this.spinner.show();
    this.mosqueSalahInfoService.getMosqueSalahInfo(data).subscribe((res: any) => {
      this.spinner.hide();
      if (res?.status) {
        this.mosqueSalahInfoData = res?.mosquePrayerTimingData;

        // Patch form values carefully only if data exists
        if (this.mosqueSalahInfoData) {
          this.MosqueSalahInfoForm.patchValue({
            mosque_id: this.mosqueSalahInfoData.mosque?._id || '',
            fajr_adhan: this.padTimeIfNeeded(this.mosqueSalahInfoData.fajr_adhan),
            fajr_namaz: this.padTimeIfNeeded(this.mosqueSalahInfoData.fajr_namaz),
            dhuhr_adhan: this.padTimeIfNeeded(this.mosqueSalahInfoData.dhuhr_adhan),
            dhuhr_namaz: this.padTimeIfNeeded(this.mosqueSalahInfoData.dhuhr_namaz),
            asr_adhan: this.padTimeIfNeeded(this.mosqueSalahInfoData.asr_adhan),
            asr_namaz: this.padTimeIfNeeded(this.mosqueSalahInfoData.asr_namaz),
            maghrib_adhan: this.padTimeIfNeeded(this.mosqueSalahInfoData.maghrib_adhan),
            maghrib_namaz: this.padTimeIfNeeded(this.mosqueSalahInfoData.maghrib_namaz),
            isha_adhan: this.padTimeIfNeeded(this.mosqueSalahInfoData.isha_adhan),
            isha_namaz: this.padTimeIfNeeded(this.mosqueSalahInfoData.isha_namaz),
            jumma: this.padTimeIfNeeded(this.mosqueSalahInfoData.jumma),
            //sun_rise: this.padTimeIfNeeded(this.mosqueSalahInfoData.sun_rise),
          });
        }
        this.getMosqueNameIDList();
      }
      else {
        this.toastr.warning('Warning', 'Failed to fetch mosque prayer timing data');
      }
    }, (err: any) => {
      if (err?.error?.message === 'jwt expired') {
        this.router.navigateByUrl('/login');
      }
      this.spinner.hide();
    });
  }

  getMosqueNameIDList() {
    const data = {
      isEditID: this.mosqueSalahInfoData?.mosque?._id ? this.mosqueSalahInfoData.mosque._id : 0
    };
    this.spinner.show();
    this.mosqueSalahInfoService.getMosqueNameIDList(data).subscribe((res: any) => {
      this.spinner.hide();
      if (res?.status) {
        this.mosqueNameIDList = res.mosqueNameIDList;
      }
      else {
        this.toastr.warning('Warning', 'Failed to fetch mosque list');
      }
    }, (err: any) => {
      if (err?.error?.message === 'jwt expired') {
        this.router.navigateByUrl('/login');
      }
      this.spinner.hide();
    });
  }

  padTimeIfNeeded(time: string): string {
    // Ensures time string like "5:30" becomes "05:30"
    if (!time) return '';
    let parts = time.split(':');
    if (parts.length !== 2) return time;
    if (parts[0].length === 1) {
      parts[0] = '0' + parts[0];
    }
    return parts.join(':');
  }

  submitMosqueSalahInfoForm(formDirective: any) {
    if (this.MosqueSalahInfoForm.invalid) {
      this.toastr.warning('Warning', 'Please Fill Required Fields');
      return;
    }
    this.formDirective = formDirective;

    const formValues = this.MosqueSalahInfoForm.value;

    const data: any = {
      _id: this.mosqueSalahInfoID ? this.mosqueSalahInfoID : 0,
      mosque_id: formValues.mosque_id,
      fajr_adhan: this.padTimeIfNeeded(formValues.fajr_adhan),
      fajr_namaz: this.padTimeIfNeeded(formValues.fajr_namaz),
      dhuhr_adhan: this.padTimeIfNeeded(formValues.dhuhr_adhan),
      dhuhr_namaz: this.padTimeIfNeeded(formValues.dhuhr_namaz),
      asr_adhan: this.padTimeIfNeeded(formValues.asr_adhan),
      asr_namaz: this.padTimeIfNeeded(formValues.asr_namaz),
      maghrib_adhan: this.padTimeIfNeeded(formValues.maghrib_adhan),
      maghrib_namaz: this.padTimeIfNeeded(formValues.maghrib_namaz),
      isha_adhan: this.padTimeIfNeeded(formValues.isha_adhan),
      isha_namaz: this.padTimeIfNeeded(formValues.isha_namaz),
      jumma: this.padTimeIfNeeded(formValues.jumma),
      //sun_rise: this.padTimeIfNeeded(formValues.sun_rise),
    };

    if (!this.isEdit) {
      this.spinner.show();
      this.mosqueSalahInfoService.createMosqueSalahInfo(data).subscribe((res: any) => {
        this.spinner.hide();
        if (res && res.status) {
          this.toastr.success('Success', 'Mosque Created Successfully');
          this.formDirective.resetForm();
          this.MosqueSalahInfoForm.reset();
          this.router.navigateByUrl('/Mosques/mosque-prayer-time-list');
        }
        else {
          this.toastr.warning('Warning', 'Mosque Creation Failed');
        }
      }, (err: any) => {
        if (err?.error?.message === 'jwt expired') {
          this.router.navigateByUrl('/login');
        }
        this.spinner.hide();
        this.toastr.error('Error', err.error.message);
      });
    }
    else {
      data._id = this.mosqueSalahInfoID;
      this.spinner.show();
      this.mosqueSalahInfoService.updateMosqueSalahInfo(data).subscribe((res: any) => {
        this.spinner.hide();
        if (res && res.status) {
          this.toastr.success('Success', 'Mosque Updated Successfully');
          this.formDirective.resetForm();
          this.MosqueSalahInfoForm.reset();
          this.router.navigateByUrl('/Mosques/mosque-prayer-time-list');
        }
        else {
          this.toastr.warning('Warning', 'Mosque Updation Failed');
        }
      }, (err: any) => {
        if (err?.error?.message === 'jwt expired') {
          this.router.navigateByUrl('/login');
        }
        this.spinner.hide();
        this.toastr.error('Error', err.error.message);
      });
    }
  }

  openIcon(timepicker: { open: () => void }) {
    if (!this.mosqueSalahInfoData) {
      timepicker.open();
    }
  }
}