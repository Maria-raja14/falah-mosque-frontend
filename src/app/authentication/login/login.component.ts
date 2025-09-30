// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

// import { AuthService } from 'src/app/services/authentication/auth.service';

// import { ToastrService } from 'ngx-toastr';
// import { NgxSpinnerService } from "ngx-spinner";

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.sass']
// })
// export class LoginComponent implements OnInit {
//   formDirective: any;

//   LoginForm: FormGroup;

//   showPassword: boolean = false;

//   constructor(private router: Router, private form_builder: FormBuilder, private auth_service: AuthService, private spinner: NgxSpinnerService, private toast :ToastrService) {
//     this.LoginForm = this.form_builder.group({
//       email: ['', Validators.compose([Validators.required, Validators.email])],
//       password: ['', Validators.required],
//     });
//   }

//   ngOnInit(): void {

//   }

//   togglePasswordVisibility() {
//     this.showPassword = !this.showPassword;
//   }


// submitLogin(formDirective: any) {
//   if (this.LoginForm.invalid) {
//     this.toast.warning('Warning', 'Please fill required fields');
//     return;
//   }

//   this.formDirective = formDirective;

//   const data = {
//     email: this.LoginForm.value.email,
//     password: this.LoginForm.value.password,
//   };

//   this.spinner.show();
//   this.auth_service.login(data).subscribe(
//     (res: any) => {
//       this.spinner.hide();
//       if (res && res.status) {
//         this.formDirective.resetForm();
//         this.LoginForm.reset();

//         localStorage.setItem('auth_token', res.authToken);
//         localStorage.setItem('user_details', JSON.stringify(res.userDetails));

//         if(res.userDetails.role == 'sub_admin'){
//           this.router.navigate(['/Mosques']);
//         } else if(res.userDetails.role == 'super_admin') {
//           this.router.navigate(['/Home']);
//         } else {
//           this.router.navigate(['/login']);
//           this.toast.warning('Warning','Unauthorized');
//         }
//       } else {
//         this.toast.warning('Warning', res.message || 'Login failed');
//       }
//     },
//     (err: any) => {
//       this.spinner.hide();
//       this.toast.error('Error', err?.error?.message || 'Server Error');
//       if (err?.error?.message === 'jwt expired') {
//         this.router.navigateByUrl('/login');
//       }
//     }
//   );
// }

// }//original


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

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
  loginType: string = 'admin'; // 'admin' or 'user'

  constructor(
    private router: Router, 
    private form_builder: FormBuilder, 
    private auth_service: AuthService, 
    private spinner: NgxSpinnerService, 
    private toast: ToastrService
  ) {
    this.LoginForm = this.form_builder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleLoginType(type: string) {
    this.loginType = type;
  }

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
    
    let loginObservable: Observable<any>;
    
    if (this.loginType === 'admin') {
      // Admin login (existing functionality)
      loginObservable = this.auth_service.login(data);
    } else {
      // User login (new functionality)
      loginObservable = this.auth_service.userLogin(data);
    }

    loginObservable.subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res && res.status) {
          this.formDirective.resetForm();
          this.LoginForm.reset();

          localStorage.setItem('auth_token', res.authToken);
          localStorage.setItem('user_details', JSON.stringify(res.userDetails));

          // Redirect based on role
          const role = res.userDetails.role;
          this.handleLoginRedirect(role);
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

  private handleLoginRedirect(role: string) {
    switch (role) {
      case 'super_admin':
        this.router.navigate(['/Home']);
        this.toast.success('Success', 'Welcome Super Admin!');
        break;
      case 'sub_admin':
        this.router.navigate(['/Mosques']);
        this.toast.success('Success', 'Welcome Sub Admin!');
        break;
      case 'user':
        this.router.navigate(['/Home']);
        this.toast.success('Success', 'Welcome User!');
        break;
      default:
        this.router.navigate(['/login']);
        this.toast.warning('Warning', 'Unauthorized role');
        break;
    }
  }
}