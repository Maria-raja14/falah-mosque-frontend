import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { MosqueSalahInfoService } from 'src/app/services/mosques/mosque-salah-info.service';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { MosquesService } from 'src/app/services/mosques/mosques.service';
import * as moment from 'moment';

// export class PasswordValidation {
//   static MatchPassword(AC: any) {
//     let password = AC.get('password').value;
//     if (AC.get('confirm_password').touched || AC.get('confirm_password').dirty) {
//       let verifyPassword = AC.get('confirm_password').value;

//       if (password != verifyPassword) {
//         AC.get('confirm_password').setErrors({ MatchPassword: true })
//       } else {
//         return null
//       }
//     }
//     return null
//   }
// }
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

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  mosqueSalahInfoData: any;

  mosqueNameIDList: any;
  constructor(private activatedroute: ActivatedRoute, private router: Router, private form_builder: FormBuilder, private auth_service: AuthService, private mosquesService: MosquesService, private mosqueSalahInfoService: MosqueSalahInfoService, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.createMosqueSalahInfoForm();

    let hrefArr = this.router.url.split('/');

    if (hrefArr.includes("edit-mosque-prayer-time")) {
      this.mosqueSalahInfoID = this.activatedroute.snapshot.paramMap.get("id");
      if (!this.mosqueSalahInfoID)
        this.router.navigateByUrl('/Mosques/mosque-prayer-time-list');
      this.isEdit = true;
      this.getMosqueSalahInfo();
    }
    else {
      this.getMosqueNameIDList();
    }
    this.togglePasswordDisable()
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
      // tarawih: ['', Validators.required],
      // eid: ['', Validators.required],
      sun_rise: ['', Validators.required],
    });
  }

  togglePasswordVisibility(type: any) {
    if (type == 'password') this.showPassword = !this.showPassword;
    else this.showConfirmPassword = !this.showConfirmPassword;
  }

  togglePasswordDisable() {
    if (this.isEdit) {
      // this.MosqueSalahInfoForm.controls['password'].disable()
      // this.MosqueSalahInfoForm.controls['confirm_password'].disable()
    }
    else {
      // this.MosqueSalahInfoForm.controls['password'].enable()
      // this.MosqueSalahInfoForm.controls['confirm_password'].enable()
    }
  }

  getMosqueSalahInfo() {
    const data = { _id: this.mosqueSalahInfoID }
    this.spinner.show();
    this.mosqueSalahInfoService.getMosqueSalahInfo(data).subscribe((res: any) => {
      this.spinner.hide();
      if (res?.status) {
        this.mosqueSalahInfoData = res?.mosquePrayerTimingData;
        if (this.mosqueSalahInfoData?.mosque?._id)
          this.MosqueSalahInfoForm.controls['mosque_id'].setValue(this.mosqueSalahInfoData.mosque._id);
        if (this.mosqueSalahInfoData?.fajr_adhan)
          this.MosqueSalahInfoForm.controls['fajr_adhan'].setValue(this.mosqueSalahInfoData.fajr_adhan);
        if (this.mosqueSalahInfoData?.fajr_namaz)
          this.MosqueSalahInfoForm.controls['fajr_namaz'].setValue(this.mosqueSalahInfoData.fajr_namaz);
        if (this.mosqueSalahInfoData?.dhuhr_adhan)
          this.MosqueSalahInfoForm.controls['dhuhr_adhan'].setValue(this.mosqueSalahInfoData.dhuhr_adhan);
        if (this.mosqueSalahInfoData?.dhuhr_namaz)
          this.MosqueSalahInfoForm.controls['dhuhr_namaz'].setValue(this.mosqueSalahInfoData.dhuhr_namaz);
        if (this.mosqueSalahInfoData?.asr_adhan)
          this.MosqueSalahInfoForm.controls['asr_adhan'].setValue(this.mosqueSalahInfoData.asr_adhan);
        if (this.mosqueSalahInfoData?.asr_namaz)
          this.MosqueSalahInfoForm.controls['asr_namaz'].setValue(this.mosqueSalahInfoData.asr_namaz);
        if (this.mosqueSalahInfoData?.maghrib_adhan)
          this.MosqueSalahInfoForm.controls['maghrib_adhan'].setValue(this.mosqueSalahInfoData.maghrib_adhan);
        if (this.mosqueSalahInfoData?.maghrib_namaz)
          this.MosqueSalahInfoForm.controls['maghrib_namaz'].setValue(this.mosqueSalahInfoData.maghrib_namaz);
        if (this.mosqueSalahInfoData?.isha_adhan)
          this.MosqueSalahInfoForm.controls['isha_adhan'].setValue(this.mosqueSalahInfoData.isha_adhan);
        if (this.mosqueSalahInfoData?.isha_namaz)
          this.MosqueSalahInfoForm.controls['isha_namaz'].setValue(this.mosqueSalahInfoData.isha_namaz);
        if (this.mosqueSalahInfoData?.jumma)
          this.MosqueSalahInfoForm.controls['jumma'].setValue(this.mosqueSalahInfoData.jumma);
        // if (this.mosqueSalahInfoData?.tarawih)
        //   this.MosqueSalahInfoForm.controls['tarawih'].setValue(this.mosqueSalahInfoData.tarawih);
        // if (this.mosqueSalahInfoData?.eid)
        //   this.MosqueSalahInfoForm.controls['eid'].setValue(this.mosqueSalahInfoData.eid);
        if (this.mosqueSalahInfoData?.sun_rise)
          this.MosqueSalahInfoForm.controls['sun_rise'].setValue(this.mosqueSalahInfoData.sun_rise);
        // console.log('this.mosqueSalahInfoData', this.mosqueSalahInfoData);

        this.getMosqueNameIDList();
      }
      else {

      }
    }, (err: any) => {
      if (err?.error?.message == 'jwt expired')
        this.router.navigateByUrl('/login');
      // console.log(err);
      this.spinner.hide();
    });
  }

  getMosqueNameIDList() {
    const data = {
      // page: this.mosqueTablePagination.pageIndex + 1,
      // size: this.mosqueTablePagination.pageSize
      isEditID: this.mosqueSalahInfoData?.mosque?._id ? this.mosqueSalahInfoData.mosque._id : 0
    }
    this.spinner.show();
    this.mosqueSalahInfoService.getMosqueNameIDList(data).subscribe((res: any) => {
      this.spinner.hide();
      if (res?.status) {
        this.mosqueNameIDList = res.mosqueNameIDList;
      }
      else {

      }
    }, (err: any) => {
      if (err?.error?.message == 'jwt expired')
        this.router.navigateByUrl('/login');
      // console.log(err);
      this.spinner.hide();
    });
  }
  
  openIcon(timepicker: { open: () => void }){
    if (!this.mosqueSalahInfoData) {
      // this.mosqueSalahInfoData?.map((val:any)=>{
      //  console.log(val)
      // })
      timepicker.open();
    }
  }
  submitMosqueSalahInfoForm(formDirective: any) {
    if (this.MosqueSalahInfoForm.invalid) {
      this.toastr.warning('Warning', 'Please Fill Required Fields');
      return;
    }
    this.formDirective = formDirective;



    const data: any = {
      _id: this.mosqueSalahInfoID ? this.mosqueSalahInfoID : 0,
      mosque_id: this.MosqueSalahInfoForm.value.mosque_id,
      fajr_adhan: this.MosqueSalahInfoForm.value.fajr_adhan?.split(":")[0]?.length==1?0+''+this.MosqueSalahInfoForm.value.fajr_adhan:this.MosqueSalahInfoForm.value.fajr_adhan,
      fajr_namaz: this.MosqueSalahInfoForm.value.fajr_namaz?.split(":")[0]?.length==1?0+''+this.MosqueSalahInfoForm.value.fajr_namaz:this.MosqueSalahInfoForm.value.fajr_namaz,
      dhuhr_adhan: this.MosqueSalahInfoForm.value.dhuhr_adhan?.split(":")[0]?.length==1?0+''+this.MosqueSalahInfoForm.value.dhuhr_adhan:this.MosqueSalahInfoForm.value.dhuhr_adhan,
      dhuhr_namaz: this.MosqueSalahInfoForm.value.dhuhr_namaz?.split(":")[0]?.length==1?0+''+this.MosqueSalahInfoForm.value.dhuhr_namaz:this.MosqueSalahInfoForm.value.dhuhr_namaz,
      asr_adhan:this.MosqueSalahInfoForm.value.asr_adhan?.split(":")[0]?.length==1?0+''+this.MosqueSalahInfoForm.value.asr_adhan:this.MosqueSalahInfoForm.value.asr_adhan,
      asr_namaz: this.MosqueSalahInfoForm.value.asr_namaz?.split(":")[0]?.length==1?0+''+this.MosqueSalahInfoForm.value.asr_namaz:this.MosqueSalahInfoForm.value.asr_namaz,
      maghrib_adhan: this.MosqueSalahInfoForm.value.maghrib_adhan?.split(":")[0]?.length==1?0+''+this.MosqueSalahInfoForm.value.maghrib_adhan:this.MosqueSalahInfoForm.value.maghrib_adhan,
      maghrib_namaz: this.MosqueSalahInfoForm.value.maghrib_namaz?.split(":")[0]?.length==1?0+''+this.MosqueSalahInfoForm.value.maghrib_namaz:this.MosqueSalahInfoForm.value.maghrib_namaz,
      isha_adhan: this.MosqueSalahInfoForm.value.isha_adhan?.split(":")[0]?.length==1?0+''+this.MosqueSalahInfoForm.value.isha_adhan:this.MosqueSalahInfoForm.value.isha_adhan,
      isha_namaz: this.MosqueSalahInfoForm.value.isha_namaz?.split(":")[0]?.length==1?0+''+this.MosqueSalahInfoForm.value.isha_namaz:this.MosqueSalahInfoForm.value.isha_namaz,
      jumma: this.MosqueSalahInfoForm.value.jumma?.split(":")[0]?.length==1?0+''+this.MosqueSalahInfoForm.value.jumma:this.MosqueSalahInfoForm.value.jumma,
      // tarawih: this.MosqueSalahInfoForm.value.tarawih,
      // eid: this.MosqueSalahInfoForm.value.eid,
      // sun_rise: this.MosqueSalahInfoForm.value.sun_rise?.split(":")[0]?.length==1?0+''+this.MosqueSalahInfoForm.value.sun_rise:this.MosqueSalahInfoForm.value.sun_rise,
    };

   console.log(data);
   

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
        if (err?.error?.message == 'jwt expired')
          this.router.navigateByUrl('/login');
        this.spinner.hide();
        this.toastr.error('Error', err.error.message);
      });
    }
    else {
      data._id = this.mosqueSalahInfoID
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
        if (err?.error?.message == 'jwt expired')
          this.router.navigateByUrl('/login');
        this.spinner.hide();
        this.toastr.error('Error', err.error.message);
      });
    }

  }
}
