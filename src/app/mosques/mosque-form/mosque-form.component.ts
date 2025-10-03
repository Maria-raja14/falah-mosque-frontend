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
  pageTitle: string = 'Create Mosque';

  formDirective: any;
  MosqueForm!: FormGroup;
  mosque_credentials!: FormArray;
  showPasswords: { [key: number]: { password: boolean; confirm_password: boolean } } = {};

  mosqueData: any;
  fajrAdhanAudioFile: File | null = null;
  adhanAudioFile: File | null = null;

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

    let hrefArr = this.router.url.split('/');
    if (hrefArr.includes('edit-mosque')) {
      this.mosqueID = this.activatedroute.snapshot.paramMap.get('id');
      if (!this.mosqueID) this.router.navigateByUrl('/Mosques');
      this.isEdit = true;
      this.pageTitle = 'Edit Mosque';
      this.getMosque();
    } else {
      // For create mode, add one credential group by default
      this.addCredentials();
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
    const credentialGroup = this.form_builder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.minLength(6)]], // Remove required for edit mode
        confirm_password: [''],
      },
      {
        validator: PasswordValidation.MatchPassword,
      }
    );

    // For edit mode, don't require password initially
    if (this.isEdit) {
      credentialGroup.get('password')?.clearValidators();
      credentialGroup.get('confirm_password')?.clearValidators();
      credentialGroup.get('password')?.updateValueAndValidity();
      credentialGroup.get('confirm_password')?.updateValueAndValidity();
    }

    return credentialGroup;
  }

  get credentials(): FormArray {
    return this.MosqueForm.get('mosque_credentials') as FormArray;
  }

  addCredentials() {
    this.mosque_credentials = this.MosqueForm.get(
      'mosque_credentials'
    ) as FormArray;

    if (this.credentials.length < 2) {
      const newIndex = this.mosque_credentials.length;
      this.mosque_credentials.push(this.createCredentials());
      this.showPasswords[newIndex] = { password: false, confirm_password: false };
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
      // Update the showPasswords object
      delete this.showPasswords[i];
      // Reindex the remaining items
      const newShowPasswords: { [key: number]: any } = {};
      Object.keys(this.showPasswords).forEach((key: string) => {
        const index = parseInt(key);
        if (index > i) {
          newShowPasswords[index - 1] = this.showPasswords[index];
        } else if (index < i) {
          newShowPasswords[index] = this.showPasswords[index];
        }
      });
      this.showPasswords = newShowPasswords;
    } else {
      this.toastr.warning('Single Subadmin is Mandatory', 'Warning');
    }
  }

  readAudioFile(event: any, type: String) {
    const files = event?.target?.files;
    if (files && files.length > 0) {
      let file = files[0];
      if (type == 'fajr_adhan') this.fajrAdhanAudioFile = file;
      if (type == 'adhan') this.adhanAudioFile = file;
    }
  }

  togglePasswordVisibility(index: number, type: 'password' | 'confirm_password') {
    if (!this.showPasswords[index]) {
      this.showPasswords[index] = { password: false, confirm_password: false };
    }
    this.showPasswords[index][type] = !this.showPasswords[index][type];
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

          // Clear existing credentials and add based on mosque data
          while (this.credentials.length !== 0) {
            this.credentials.removeAt(0);
          }

          if (this.mosqueData?.users?.length) {
            this.mosqueData.users.forEach((val: any, index: number) => {
              this.addCredentials();
              this.credentials.at(index).patchValue({
                email: val.email,
                password: '', // Empty password for edit mode
                confirm_password: '' // Empty confirm password for edit mode
              });
            });
          } else if (this.mosqueData?.email) {
            // Fallback for single user data
            this.addCredentials();
            this.credentials.at(0).patchValue({
              email: this.mosqueData.email,
              password: '',
              confirm_password: ''
            });
          }
        }
      },
      (err: any) => {
        this.spinner.hide();
        console.log(err);
        this.toastr.error('Failed to load mosque data', 'Error');
      }
    );
  }

  submitMosqueForm(formDirective: any) {
    this.MosqueForm.markAllAsTouched();

    if (this.MosqueForm.invalid) {
      this.toastr.warning('Please fill all required fields correctly', 'Warning');
      return;
    }

    for (let i = 0; i < this.credentials.length; i++) {
      const subadmin = this.credentials.at(i);
      const email = subadmin.get('email')?.value;

      if (!email) {
        this.toastr.warning(`Email is required for SubAdmin #${i + 1}`, 'Warning');
        return;
      }
    }

    if (!this.isEdit && (!this.fajrAdhanAudioFile || !this.adhanAudioFile)) {
      this.toastr.warning('Both Adhan Audio Files are required', 'Warning');
      return;
    }

    const data: any = {
      _id: this.isEdit ? this.mosqueID : 0,
      name: this.MosqueForm.value.name,
      mobile_number: this.MosqueForm.value.mobile_number,
      mosque_address: this.MosqueForm.value.mosque_address,
      mosque_latitude: this.MosqueForm.value.mosque_latitude,
      mosque_longitude: this.MosqueForm.value.mosque_longitude,
      users: this.MosqueForm.value.mosque_credentials
    };

    const formData = new FormData();
    if (this.fajrAdhanAudioFile) formData.append('fajr_adhan', this.fajrAdhanAudioFile);
    if (this.adhanAudioFile) formData.append('adhan', this.adhanAudioFile);
    formData.append('data', JSON.stringify(data));

    this.spinner.show();
    const request$ = this.isEdit
      ? this.mosquesService.updateMosque(formData)
      : this.mosquesService.createMosque(formData);

    request$.subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res?.status) {
          this.toastr.success(this.isEdit ? 'Mosque Updated Successfully' : 'Mosque Created Successfully', 'Success');
          this.formDirective.resetForm();
          this.MosqueForm.reset();
          this.router.navigateByUrl('/Mosques');
        } else {
          this.toastr.warning(res?.message || 'Operation Failed', 'Warning');
        }
      },
      (err: any) => {
        this.spinner.hide();
        this.toastr.error(err.error?.message || 'Something went wrong', 'Error');
      }
    );
  }

  goBack() {
    this.router.navigateByUrl('/Mosques');
  }
}//original