import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { AuthService } from 'src/app/services/authentication/auth.service';

// import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

export class PasswordValidation {
  static MatchPassword(AC: any) {
    let password = AC.get('new_password').value;
    if (AC.get('confirm_password').touched || AC.get('confirm_password').dirty) {
      let verifyPassword = AC.get('confirm_password').value;

      if (password != verifyPassword) {
        AC.get('confirm_password').setErrors({ MatchPassword: true })
      } else {
        return null
      }
    }
    return null
  }
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.sass']
})
export class ResetPasswordComponent implements OnInit {
  formDirective: any;

  FPMailVerifyForm: FormGroup;
  FPOTPVerifyForm: FormGroup;
  FResetPasswordForm: FormGroup;

  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  FPStage: any;
  UserDetails: any;
  //private toastr: ToastrService,
  constructor(private router: Router, private form_builder: FormBuilder, private auth_service: AuthService, private spinner: NgxSpinnerService) {
    this.FPMailVerifyForm = this.form_builder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });

    this.FPOTPVerifyForm = this.form_builder.group({
      otp: ['', Validators.required],
    });

    this.FResetPasswordForm = this.form_builder.group({
      new_password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirm_password: ['', Validators.required],
    },
      {
        validator: PasswordValidation.MatchPassword
      });
  }

  ngOnInit(): void {
    this.FPStage = localStorage.getItem('fp_stage');
    if (!this.FPStage)
      localStorage.setItem('fp_stage', 'mailVerify');
    this.FPStage = localStorage.getItem('fp_stage');
  }

  togglePasswordVisibility(type: any) {
    if (type == 'new_password') this.showNewPassword = !this.showNewPassword;
    else this.showConfirmPassword = !this.showConfirmPassword;
  }

  submitMailVerify(formDirective: any) {
    if (this.FPMailVerifyForm.invalid) {
      // this.toastr.warning('Warning', 'Please Fill Required Fields');
      return;
    }

    this.formDirective = formDirective;

    const data = {
      email: this.FPMailVerifyForm.value.email,
    };

    this.spinner.show();
    this.auth_service.fpMailVerify(data).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.status) {
        // this.toastr.success('Success', res.message);
        this.formDirective.resetForm();
        this.FPMailVerifyForm.reset();

        localStorage.setItem('fp_stage', 'otpVerify');
        this.FPStage = localStorage.getItem('fp_stage');
        localStorage.setItem('fp_user_details', JSON.stringify(res.userDetail));
        this.UserDetails = localStorage.getItem('fp_user_details');
        this.UserDetails = JSON.parse(this.UserDetails);
      }
      else {
        // this.toastr.warning('Warning', res.message);
      }
    }, (err: any) => {
      if (err?.error?.message == 'jwt expired')
        this.router.navigateByUrl('/login');
      this.spinner.hide();
      // this.toastr.error('Error', err.error.message);
    });
  }

  submitOTPVerify(formDirective: any) {
    if (this.FPOTPVerifyForm.invalid) {
      // this.toastr.warning('Warning', 'Please Fill Required Fields');
      return;
    }

    this.formDirective = formDirective;

    let FPUserDetails: any = localStorage.getItem('fp_user_details');
    FPUserDetails = JSON.parse(FPUserDetails);

    const data = {
      user_id: FPUserDetails.id,
      otp: this.FPOTPVerifyForm.value.otp,
    };

    this.spinner.show();
    this.auth_service.fpOtpVerify(data).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.status) {
        // this.toastr.success('Success', res.message);
        this.formDirective.resetForm();
        this.FPOTPVerifyForm.reset();

        localStorage.setItem('fp_stage', 'resetPassword');
        this.FPStage = localStorage.getItem('fp_stage');
        localStorage.setItem('fp_token', res.token);
      }
      else {
        // this.toastr.warning('Warning', res.message);
      }
    }, (err: any) => {
      if (err?.error?.message == 'jwt expired')
        this.router.navigateByUrl('/login');
      this.spinner.hide();
      // this.toastr.error('Error', err.error.message);
    });
  }

  submitResetPassword(formDirective: any) {
    if (this.FResetPasswordForm.invalid) {
      // this.toastr.warning('Warning', 'Please Fill Required Fields');
      return;
    }

    this.formDirective = formDirective;

    let FPUserDetails: any = localStorage.getItem('fp_user_details');
    FPUserDetails = JSON.parse(FPUserDetails);

    const data = {
      user_id: FPUserDetails.id,
      reset_password: this.FResetPasswordForm.value.new_password,
    };

    this.spinner.show();
    this.auth_service.fpResetPassword(data).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.status) {
        // this.toastr.success('Success', res.message);
        this.formDirective.resetForm();
        this.FResetPasswordForm.reset();
        localStorage.clear();
        this.router.navigate(['/login']);
      }
      else {
        // this.toastr.warning('Warning', res.message);
      }
    }, (err: any) => {
      if (err?.error?.message == 'jwt expired')
        this.router.navigateByUrl('/login');
      this.spinner.hide();
      // this.toastr.error('Error', err.error.message);
    });
  }

}
