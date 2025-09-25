// import { AfterViewInit, Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import {
//   FormBuilder,
//   FormGroup,
//   Validators,
//   ValidatorFn,
//   AbstractControl,
//   FormArray,
//   FormControl,
// } from '@angular/forms';
// import { AuthService } from 'src/app/services/authentication/auth.service';
// import { MosquesService } from 'src/app/services/mosques/mosques.service';

// import { ToastrService } from 'ngx-toastr';
// import { NgxSpinnerService } from 'ngx-spinner';

// import Swal from 'sweetalert2';

// export class PasswordValidation {
//   static MatchPassword(AC: any) {
//     let password = AC?.value?.password;
//     if (
//       AC?.controls?.confirm_password?.touched ||
//       AC?.controls?.confirm_password?.dirty
//     ) {
//       let verifyPassword = AC?.value?.confirm_password;

//       if (password != verifyPassword) {
//         AC?.controls?.confirm_password?.setErrors({ MatchPassword: true });
//       }
//     }
//     return null;
//   }
// }

// @Component({
//   selector: 'app-mosque-form',
//   templateUrl: './mosque-form.component.html',
//   styleUrls: ['./mosque-form.component.sass'],
// })
// export class MosqueFormComponent implements OnInit {
//   mosqueID: any;
//   isEdit = false;

//   formDirective: any;

//   MosqueForm!: FormGroup;
//   mosque_credentials!: FormArray;
//   showPassword: boolean = false;
//   showConfirmPassword: boolean = false;

//   mosqueData: any;
//   fajrAdhanAudioFile!: File;
//   adhanAudioFile!: File;

//   constructor(
//     private activatedroute: ActivatedRoute,
//     private router: Router,
//     private form_builder: FormBuilder,
//     private auth_service: AuthService,
//     private mosquesService: MosquesService,
//     private toastr: ToastrService,
//     private spinner: NgxSpinnerService
//   ) {}

//   ngOnInit(): void {
//     this.createMosqueForm();
//     if (!this.isEdit) {
//       this.addCredentials();
//     }

//     let hrefArr = this.router.url.split('/');

//     if (hrefArr.includes('edit-mosque')) {
//       this.mosqueID = this.activatedroute.snapshot.paramMap.get('id');
//       if (!this.mosqueID) this.router.navigateByUrl('/Mosques');
//       this.isEdit = true;
//       this.getMosque();
//     }
//   }
//   // ngAfterViewInit():void{
//   // //  debugger;
//   // this.togglePasswordDisable();
//   // }

//   createMosqueForm() {
//     this.MosqueForm = this.form_builder.group({
//       name: ['', Validators.required],
//       mobile_number: [
//         '',
//         Validators.compose([
//           Validators.required,
//           Validators.pattern(/[0-9]{10}/),
//         ]),
//       ],
//       mosque_address: ['', Validators.required],
//       mosque_latitude: ['', Validators.required],
//       mosque_longitude: ['', Validators.required],
//       mosque_credentials: new FormArray([]),
//     });
//   }

//   createCredentials(): FormGroup {
//     return this.form_builder.group(
//       {
//         email: [
//           '',
//           Validators.compose([Validators.required, Validators.email]),
//         ],
//         password: [
//           '',
//           Validators.compose([Validators.required, Validators.minLength(6)]),
//         ],
//         confirm_password: ['', Validators.required],
//       },
//       {
//         validator: PasswordValidation.MatchPassword,
//       }
//     );
//   }

//   get credentials(): FormArray {
//     return this.MosqueForm.get('mosque_credentials') as FormArray;
//   }

//   addCredentials() {
//     this.mosque_credentials = this.MosqueForm.get(
//       'mosque_credentials'
//     ) as FormArray;

//     if (this.credentials.length < 2) {
//       this.mosque_credentials.push(this.createCredentials());
//     } else {
//       this.toastr.warning('Maximum Two SubAdmin Are Allowed', 'Warning');
//     }
//   }

//   delete_user(i: number) {
//     this.mosque_credentials = this.MosqueForm.get(
//       'mosque_credentials'
//     ) as FormArray;
//     if (this.credentials.length > 1) {
//       this.mosque_credentials.removeAt(i);
//     } else {
//       this.toastr.warning('Single Subadmin is Mandatory', 'Warning');
//     }
//   }

//   readAudioFile(event: any, type: String) {
//     let file = event?.target?.files[0];
//     if (type == 'fajr_adhan') {
//       this.fajrAdhanAudioFile = file;
//       new Audio(URL.createObjectURL(this.fajrAdhanAudioFile)).onloadedmetadata =
//         (e: any) => {
//           // this.duration = e.currentTarget.duration;
//           // console.log('fajr_adhan',e);
//           // console.log('file',this.fajrAdhanAudioFile.name);
//         };
//     } else if (type == 'adhan') {
//       this.adhanAudioFile = file;
//       new Audio(URL.createObjectURL(this.adhanAudioFile)).onloadedmetadata = (
//         e: any
//       ) => {
//         // this.duration = e.currentTarget.duration;
//         // console.log('adhan',e);
//         // console.log('fajr_adhan',e);
//       };
//     }
//   }

//   togglePasswordVisibility(type: any) {
//     if (type == 'password') this.showPassword = !this.showPassword;
//     else this.showConfirmPassword = !this.showConfirmPassword;
//   }
//   get formData() {
//     return (<FormArray>this.MosqueForm.get('mosque_credentials')).controls;
//   }

//   togglePasswordDisable() {
//     // debugger;
//     if (this.isEdit) {
//       (<FormArray>this.MosqueForm.get('mosque_credentials')).controls.forEach(
//         (control) => {
//           control?.get('password')?.disable();
//           control?.get('confirm_password')?.disable();
//         }
//       );
//     }
//   }

//   getMosque() {
//     const data = { _id: this.mosqueID };
//     this.spinner.show();
//     this.mosquesService.getMosque(data).subscribe(
//       (res: any) => {
//         this.spinner.hide();
//         if (res?.status) {
//           this.mosqueData = res?.mosqueData;
//           if (this.mosqueData?.name)
//             this.MosqueForm?.controls['name']?.setValue(this.mosqueData?.name);
//           if (this.mosqueData?.users && this.mosqueData?.users.length) {
//             // this.mosqueData?.users?.forEach((val: any) => {
//             //   this.addCredentials();
//             // });
//             for (let i = 1; i < this.mosqueData?.users?.length; i++) {
//               this.addCredentials();
//             }
//             this.mosqueData?.users?.map((val: any, index: number) => {
//               this.credentials?.at(index)?.get('email')?.setValue(val?.email);
//             });
//             this.togglePasswordDisable();
//           }

//           if (this.mosqueData?.mobile_number)
//             this.MosqueForm?.controls['mobile_number']?.setValue(
//               this.mosqueData?.mobile_number
//             );
//           if (this.mosqueData?.mosque_latitude)
//             this.MosqueForm?.controls['mosque_latitude']?.setValue(
//               this.mosqueData?.mosque_latitude
//             );
//           if (this.mosqueData?.mosque_longitude)
//             this.MosqueForm?.controls['mosque_longitude']?.setValue(
//               this.mosqueData?.mosque_longitude
//             );
//           if (this.mosqueData?.mosque_address)
//             this.MosqueForm?.controls['mosque_address']?.setValue(
//               this.mosqueData?.mosque_address
//             );
//         }
//       },
//       (err: any) => {
//         if (err?.error?.message == 'jwt expired')
//           this.router.navigateByUrl('/login');
//         console.log(err);
//         this.spinner.hide();
//       }
//     );
//   }

//   submitMosqueForm(formDirective: any) {
//     if (this.MosqueForm.invalid) {
//       this.toastr.warning('Please Fill Required Fields', 'Warning');
//       return;
//     } else if (this.credentials.length === 0) {
//       this.toastr.warning('You Must Add One Field', 'Warning');
//       return;
//     } else if (
//       this.credentials?.controls[0]?.value?.password !=
//         this.credentials?.controls[0]?.value?.confirm_password ||
//       this.credentials?.controls[1]?.value?.password !=
//         this.credentials?.controls[1]?.value?.confirm_password
//     ) {
//       this.toastr.warning('Password Does Not Match', 'Warning');
//       return;
//     } else if (
//       (!this.isEdit &&
//         (!this.fajrAdhanAudioFile?.name || !this.adhanAudioFile?.name)) ||
//       (this.isEdit &&
//         (!this.mosqueData?.adhan_name || !this.mosqueData?.fajr_adhan_name))
//     ) {
//       this.toastr.warning('Select Adhan Audio File', 'Warning');
//       return;
//     }
//     this.formDirective = formDirective;

//     const data: any = {
//       _id: this.isEdit ? this.mosqueID : 0,
//       name: this.MosqueForm.value.name,
//       mobile_number: this.MosqueForm.value.mobile_number,
//       mosque_address: this.MosqueForm.value.mosque_address,
//       mosque_latitude: this.MosqueForm.value.mosque_latitude,
//       mosque_longitude: this.MosqueForm.value.mosque_longitude,
//       users: this.MosqueForm.value.mosque_credentials,
//     };

//     const formData = new FormData();
//     formData.append('fajr_adhan', this.fajrAdhanAudioFile);
//     formData.append('adhan', this.adhanAudioFile);
//     formData.append('data', JSON.stringify(data));
//     console.log(data);

//     if (!this.isEdit) {
//       this.spinner.show();
//       this.mosquesService.createMosque(formData).subscribe(
//         (res: any) => {
//           this.spinner.hide();
//           if (res && res.status) {
//             this.toastr.success('Mosque Created Successfully', 'Success');
//             this.formDirective.resetForm();
//             this.MosqueForm.reset();
//             this.router.navigateByUrl('/Mosques');
//           } else {
//             this.toastr.warning('Mosque Creation Failed', 'Warning');
//           }
//         },
//         (err: any) => {
//           if (err?.error?.message == 'jwt expired')
//             this.router.navigateByUrl('/login');
//           this.spinner.hide();
//           this.toastr.error(err.error.message, 'Error');
//         }
//       );
//     } else {
//       this.spinner.show();
//       this.mosquesService.updateMosque(formData).subscribe(
//         (res: any) => {
//           this.spinner.hide();
//           if (res && res.status) {
//             this.toastr.success('Mosque Updated Successfully', 'Success');
//             this.formDirective.resetForm();
//             this.MosqueForm.reset();
//             this.router.navigateByUrl('/Mosques');
//           } else {
//             this.toastr.warning('Mosque Updation Failed', 'Warning');
//           }
//         },
//         (err: any) => {
//           if (err?.error?.message == 'jwt expired')
//             this.router.navigateByUrl('/login');
//           this.spinner.hide();
//           this.toastr.error(err.error.message, 'Error');
//         }
//       );
//     }
//   }
// }//original



import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormArray,
} from '@angular/forms';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { MosquesService } from 'src/app/services/mosques/mosques.service';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

export class PasswordValidation {
  static MatchPassword(AC: any) {
    let password = AC?.value?.password;
    if (
      AC?.controls?.confirm_password?.touched ||
      AC?.controls?.confirm_password?.dirty
    ) {
      let verifyPassword = AC?.value?.confirm_password;
      if (password != verifyPassword) {
        AC?.controls?.confirm_password?.setErrors({ MatchPassword: true });
      }
    }
    return null;
  }
}

@Component({
  selector: 'app-mosque-form',
  templateUrl: './mosque-form.component.html',
  styleUrls: ['./mosque-form.component.sass'],
})
export class MosqueFormComponent implements OnInit {
  mosqueID: any;
  isEdit = false;

  formDirective: any;
  MosqueForm!: FormGroup;
  mosque_credentials!: FormArray;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  mosqueData: any;
  fajrAdhanAudioFile!: File;
  adhanAudioFile!: File;

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private form_builder: FormBuilder,
    private auth_service: AuthService,
    private mosquesService: MosquesService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.createMosqueForm();
    this.addCredentials(); // Ensure at least one subadmin field

    let hrefArr = this.router.url.split('/');
    if (hrefArr.includes('edit-mosque')) {
      this.mosqueID = this.activatedroute.snapshot.paramMap.get('id');
      if (!this.mosqueID) this.router.navigateByUrl('/Mosques');
      this.isEdit = true;
      this.getMosque();
    }
  }

  createMosqueForm() {
    this.MosqueForm = this.form_builder.group({
      name: ['', Validators.required],
      mobile_number: [
        '',
        [Validators.required, Validators.pattern(/[0-9]{10}/)],
      ],
      mosque_address: ['', Validators.required],
      mosque_latitude: ['', Validators.required],
      mosque_longitude: ['', Validators.required],
      mosque_credentials: new FormArray([]),
    });
  }

  createCredentials(): FormGroup {
    return this.form_builder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirm_password: ['', Validators.required],
      },
      {
        validator: PasswordValidation.MatchPassword,
      }
    );
  }

  get credentials(): FormArray {
    return this.MosqueForm.get('mosque_credentials') as FormArray;
  }

  addCredentials() {
    this.mosque_credentials = this.MosqueForm.get(
      'mosque_credentials'
    ) as FormArray;

    if (this.credentials.length < 2) {
      this.mosque_credentials.push(this.createCredentials());
    } else {
      this.toastr.warning('Maximum Two SubAdmins Are Allowed', 'Warning');
    }
  }

  delete_user(i: number) {
    this.mosque_credentials = this.MosqueForm.get(
      'mosque_credentials'
    ) as FormArray;
    if (this.credentials.length > 1) {
      this.mosque_credentials.removeAt(i);
    } else {
      this.toastr.warning('Single Subadmin is Mandatory', 'Warning');
    }
  }

  readAudioFile(event: any, type: String) {
    let file = event?.target?.files[0];
    if (type == 'fajr_adhan') this.fajrAdhanAudioFile = file;
    if (type == 'adhan') this.adhanAudioFile = file;
  }

  togglePasswordVisibility(type: any) {
    if (type == 'password') this.showPassword = !this.showPassword;
    else this.showConfirmPassword = !this.showConfirmPassword;
  }

  togglePasswordDisable() {
    if (this.isEdit) {
      (<FormArray>this.MosqueForm.get('mosque_credentials')).controls.forEach(
        (control) => {
          control?.get('password')?.disable();
          control?.get('confirm_password')?.disable();
        }
      );
    }
  }

  getMosque() {
    const data = { _id: this.mosqueID };
    this.spinner.show();
    this.mosquesService.getMosque(data).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res?.status) {
          this.mosqueData = res?.mosqueData;

          this.MosqueForm.patchValue({
            name: this.mosqueData?.name,
            mobile_number: this.mosqueData?.mobile_number,
            mosque_address: this.mosqueData?.mosque_address,
            mosque_latitude: this.mosqueData?.mosque_latitude,
            mosque_longitude: this.mosqueData?.mosque_longitude,
          });

          if (this.mosqueData?.users?.length) {
            for (let i = 1; i < this.mosqueData.users.length; i++) this.addCredentials();
            this.mosqueData.users.map((val: any, index: number) => {
              this.credentials.at(index).get('email')?.setValue(val.email);
            });
            this.togglePasswordDisable();
          }
        }
      },
      (err: any) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  submitMosqueForm(formDirective: any) {
    // Basic form validation
    if (this.MosqueForm.invalid) {
      this.toastr.warning('Please fill all required fields', 'Warning');
      return;
    }

    // Validate each subadmin
    for (let i = 0; i < this.credentials.length; i++) {
      const subadmin = this.credentials.at(i).value;
      if (!subadmin.email) {
        this.toastr.warning(`Email is required for SubAdmin #${i + 1}`, 'Warning');
        return;
      }
      if (!subadmin.password) {
        this.toastr.warning(`Password is required for SubAdmin #${i + 1}`, 'Warning');
        return;
      }
      if (subadmin.password !== subadmin.confirm_password) {
        this.toastr.warning(`Passwords do not match for SubAdmin #${i + 1}`, 'Warning');
        return;
      }
    }

    // Validate audio files
    if (
      (!this.isEdit && (!this.fajrAdhanAudioFile?.name || !this.adhanAudioFile?.name)) ||
      (this.isEdit &&
        (!this.mosqueData?.adhan_name || !this.mosqueData?.fajr_adhan_name))
    ) {
      this.toastr.warning('Select Adhan Audio File', 'Warning');
      return;
    }

    this.formDirective = formDirective;

    const data: any = {
      _id: this.isEdit ? this.mosqueID : 0,
      name: this.MosqueForm.value.name,
      mobile_number: this.MosqueForm.value.mobile_number,
      mosque_address: this.MosqueForm.value.mosque_address,
      mosque_latitude: this.MosqueForm.value.mosque_latitude,
      mosque_longitude: this.MosqueForm.value.mosque_longitude,
      users: this.MosqueForm.value.mosque_credentials,
    };

    const formData = new FormData();
    formData.append('fajr_adhan', this.fajrAdhanAudioFile);
    formData.append('adhan', this.adhanAudioFile);
    formData.append('data', JSON.stringify(data));

    this.spinner.show();
    const request$ = this.isEdit
      ? this.mosquesService.updateMosque(formData)
      : this.mosquesService.createMosque(formData);

    request$.subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res && res.status) {
          this.toastr.success(
            this.isEdit ? 'Mosque Updated Successfully' : 'Mosque Created Successfully',
            'Success'
          );
          this.formDirective.resetForm();
          this.MosqueForm.reset();
          this.router.navigateByUrl('/Mosques');
        } else {
          this.toastr.warning(
            this.isEdit ? 'Mosque Update Failed' : 'Mosque Creation Failed',
            'Warning'
          );
        }
      },
      (err: any) => {
        this.spinner.hide();
        this.toastr.error(err.error.message || 'Something went wrong', 'Error');
      }
    );
  }
}
