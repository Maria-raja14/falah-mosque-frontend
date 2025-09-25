import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { AuthService } from 'src/app/services/authentication/auth.service';

// import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

export class PasswordValidation {
  static MatchPassword(AC: any) {
    let password = AC.get('password').value;
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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})

export class RegisterComponent implements OnInit {
  formDirective: any;

  RegisterForm: FormGroup;

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private router: Router, private form_builder: FormBuilder, private auth_service: AuthService, private spinner: NgxSpinnerService) {

    this.RegisterForm = this.form_builder.group({
      first_name: ['', Validators.required],
      second_name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email]), this.auth_service.userValidator()],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirm_password: ['', Validators.required],
    },
      {
        validator: PasswordValidation.MatchPassword
      }
    );
  }

  ngOnInit(): void {
  }

  togglePasswordVisibility(type: any) {
    if (type == 'password') this.showPassword = !this.showPassword;
    else this.showConfirmPassword = !this.showConfirmPassword;
  }

  submitRegister(formDirective: any) {
    if (this.RegisterForm.invalid) {
      // this.toastr.warning('Warning', 'Please Fill Required Fields');
      return;
    }
    else if (this.RegisterForm.value.password != this.RegisterForm.value.confirm_password) {
      // this.toastr.warning('Warning', 'Password Does Not Match');
      return;
    }
    this.formDirective = formDirective;

    const data = {
      first_name: this.RegisterForm.value.first_name,
      second_name: this.RegisterForm.value.second_name,
      email: this.RegisterForm.value.email,
      password: this.RegisterForm.value.password,
    };

    this.spinner.show();
    this.auth_service.signup(data).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.status) {
        // this.toastr.success('Success', res.message);
        this.formDirective.resetForm();
        this.RegisterForm.reset();
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
