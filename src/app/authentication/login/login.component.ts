import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { AuthService } from 'src/app/services/authentication/auth.service';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  formDirective: any;

  LoginForm: FormGroup;

  showPassword: boolean = false;

  constructor(private router: Router, private form_builder: FormBuilder, private auth_service: AuthService, private spinner: NgxSpinnerService, private toast :ToastrService) {
    this.LoginForm = this.form_builder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {

  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // submitLogin(formDirective: any) {
  //   if (this.LoginForm.invalid) {
  //     // this.toastr.warning('Warning', 'Please Fill Required Fields');
  //     return;
  //   }

  //   this.formDirective = formDirective;

  //   const data = {
  //     email: this.LoginForm.value.email,
  //     password: this.LoginForm.value.password,
  //   };

  //   this.spinner.show();
  //   this.auth_service.login(data).subscribe((res: any) => {
  //     this.spinner.hide();
  //     if (res && res.status) {
  //       // this.toastr.success('Success', res.message);
  //       this.formDirective.resetForm();
  //       this.LoginForm.reset();

  //       localStorage.setItem('auth_token', res.authToken);
  //       localStorage.setItem('user_details', JSON.stringify(res.userDetails));
        

  //       console.log(res.userDetails.role);
  //       if(res.userDetails.role == 'sub_admin'){
  //         this.router.navigate(['/Mosques'],{});
  //       }else if(res.userDetails.role == 'super_admin') {
  //         this.router.navigate(['/Home']);
  //       }else{
  //         this.router.navigate(['/login']);
  //         this.toast.warning('Warning','Unauthorized');
  //       }

  //     }
  //     else {
  //       // this.toastr.warning('Warning', res.message);
  //     }
  //   }, (err: any) => {
  //     if (err?.error?.message == 'jwt expired')
  //       this.router.navigateByUrl('/login');
  //     this.spinner.hide();
  //     // this.toastr.error('Error', err.error.message);
  //   });
  // }
submitLogin(formDirective: any) {
  if (this.LoginForm.invalid) {
    this.toast.warning('Warning', 'Please fill required fields');
    return;
  }

  this.formDirective = formDirective;

  const data = {
    email: this.LoginForm.value.email,
    password: this.LoginForm.value.password,
  };

  this.spinner.show();
  this.auth_service.login(data).subscribe(
    (res: any) => {
      this.spinner.hide();
      if (res && res.status) {
        this.formDirective.resetForm();
        this.LoginForm.reset();

        localStorage.setItem('auth_token', res.authToken);
        localStorage.setItem('user_details', JSON.stringify(res.userDetails));

        if(res.userDetails.role == 'sub_admin'){
          this.router.navigate(['/Mosques']);
        } else if(res.userDetails.role == 'super_admin') {
          this.router.navigate(['/Home']);
        } else {
          this.router.navigate(['/login']);
          this.toast.warning('Warning','Unauthorized');
        }
      } else {
        this.toast.warning('Warning', res.message || 'Login failed');
      }
    },
    (err: any) => {
      this.spinner.hide();
      this.toast.error('Error', err?.error?.message || 'Server Error');
      if (err?.error?.message === 'jwt expired') {
        this.router.navigateByUrl('/login');
      }
    }
  );
}

}
