// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
// import { AuthService } from 'src/app/services/authentication/auth.service';
// import { UsersService } from 'src/app/services/users/users.service';

// import { ToastrService } from 'ngx-toastr';
// import { NgxSpinnerService } from "ngx-spinner";

// import Swal from 'sweetalert2';

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

// @Component({
//   selector: 'app-user-form',
//   templateUrl: './user-form.component.html',
//   styleUrls: ['./user-form.component.sass']
// })
// export class UserFormComponent implements OnInit {
//   userID: any;
//   isEdit = false;

//   formDirective: any;

//   UserForm!: FormGroup;

//   showPassword: boolean = false;
//   showConfirmPassword: boolean = false;

//   userData: any;

//   constructor(private activatedroute: ActivatedRoute, private router: Router, private form_builder: FormBuilder, private auth_service: AuthService, private usersService: UsersService, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

//   ngOnInit(): void {
//     this.createUserForm();

//     let hrefArr = this.router.url.split('/');

//     if (hrefArr.includes("edit-user")) {
//       this.userID = this.activatedroute.snapshot.paramMap.get("id");
//       if (!this.userID)
//         this.router.navigateByUrl('/Users');
//       this.isEdit = true;
//       this.getUser();
//     }

//     this.togglePasswordDisable()
//   }

//   createUserForm() {
//     this.UserForm = this.form_builder.group({
//       name: ['', Validators.required],
//       email: ['', Validators.compose([Validators.required, Validators.email])],
//       mobile_number: ['', Validators.compose([Validators.required])],
//       password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
//       confirm_password: ['', Validators.required]
//     },
//       {
//         validator: PasswordValidation.MatchPassword
//       });
//   }

//   togglePasswordVisibility(type: any) {
//     if (type == 'password') this.showPassword = !this.showPassword;
//     else this.showConfirmPassword = !this.showConfirmPassword;
//   }

//   togglePasswordDisable() {
//     if (this.isEdit) {
//       this.UserForm.controls['password'].disable()
//       this.UserForm.controls['confirm_password'].disable()
//     }
//     else {
//       this.UserForm.controls['password'].enable()
//       this.UserForm.controls['confirm_password'].enable()
//     }
//   }

//   getUser() {
//     const data = { _id: this.userID }
//     this.spinner.show();
//     this.usersService.getUser(data).subscribe((res: any) => {
//       this.spinner.hide();
//       if (res?.status) {
//         this.userData = res.userData;
//         if (this.userData?.name)
//           this.UserForm.controls['name'].setValue(this.userData.name);
//         if (this.userData?.email)
//           this.UserForm.controls['email'].setValue(this.userData.email);
//         if (this.userData?.mobile_number)
//           this.UserForm.controls['mobile_number'].setValue(this.userData.mobile_number);
//         // if (this.userData?.password)
//         //   this.UserForm.controls['password'].setValue(this.userData.password);
//         // if (this.userData?.confirm_password)
//         //   this.UserForm.controls['confirm_password'].setValue(this.userData.confirm_password);


//         console.log('this.userData', this.userData);
//       }
//       else {

//       }
//     }, (err: any) => {
//       if (err?.error?.message == 'jwt expired')
//         this.router.navigateByUrl('/login');
//       console.log(err);
//       this.spinner.hide();
//     });
//   }

//   submitUserForm(formDirective: any) {
//     if (this.UserForm.invalid) {
//       this.toastr.warning('Warning', 'Please Fill Required Fields');
//       return;
//     }
//     else if (this.UserForm.value.password != this.UserForm.value.confirm_password) {
//       this.toastr.warning('Warning', 'Password Does Not Match');
//       return;
//     }
//     this.formDirective = formDirective;

//     const data: any = {
//       _id: this.isEdit ? this.userID : 0,
//       name: this.UserForm.value.name,
//       email: this.UserForm.value.email,
//       mobile_number: this.UserForm.value.mobile_number,
//       password: this.UserForm.value.password,
//       confirm_password: this.UserForm.value.confirm_password,
//     };

//     if (!this.isEdit) {
//       this.spinner.show();
//       this.usersService.createUser(data).subscribe((res: any) => {
//         this.spinner.hide();
//         if (res && res.status) {
//           this.toastr.success('Success', 'User Created Successfully');
//           this.formDirective.resetForm();
//           this.UserForm.reset();
//           this.router.navigateByUrl('/Users');
//         }
//         else {
//           this.toastr.warning('Warning', 'User Creation Failed');
//         }
//       }, (err: any) => {
//         if (err?.error?.message == 'jwt expired')
//           this.router.navigateByUrl('/login');
//         this.spinner.hide();
//         this.toastr.error('Error', err.error.message);
//       });
//     }
//     else {
//       this.spinner.show();
//       this.usersService.updateUser(data).subscribe((res: any) => {
//         this.spinner.hide();
//         if (res && res.status) {
//           this.toastr.success('Success', 'User Updated Successfully');
//           this.formDirective.resetForm();
//           this.UserForm.reset();
//           this.router.navigateByUrl('/Users');
//         }
//         else {
//           this.toastr.warning('Warning', 'User Updation Failed');
//         }
//       }, (err: any) => {
//         if (err?.error?.message == 'jwt expired')
//           this.router.navigateByUrl('/login');
//         this.spinner.hide();
//         this.toastr.error('Error', err.error.message);
//       });
//     }

//   }

// }//original


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UsersService } from 'src/app/services/users/users.service';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

import Swal from 'sweetalert2';

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
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.sass']
})
export class UserFormComponent implements OnInit {
  userID: any;
  isEdit = false;
  formDirective: any;
  UserForm!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  userData: any;

  constructor(
    private activatedroute: ActivatedRoute, 
    private router: Router, 
    private form_builder: FormBuilder, 
    private usersService: UsersService, 
    private toastr: ToastrService, 
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.createUserForm();

    let hrefArr = this.router.url.split('/');

    if (hrefArr.includes("edit-user")) {
      this.userID = this.activatedroute.snapshot.paramMap.get("id");
      if (!this.userID)
        this.router.navigateByUrl('/Users');
      this.isEdit = true;
      this.getUser();
    }

    this.togglePasswordDisable()
  }

  createUserForm() {
    this.UserForm = this.form_builder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      mobile_number: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirm_password: ['', Validators.required]
    },
      {
        validator: PasswordValidation.MatchPassword
      });
  }

  togglePasswordVisibility(type: any) {
    if (type == 'password') this.showPassword = !this.showPassword;
    else this.showConfirmPassword = !this.showConfirmPassword;
  }

  togglePasswordDisable() {
    if (this.isEdit) {
      this.UserForm.controls['password'].disable()
      this.UserForm.controls['confirm_password'].disable()
    }
    else {
      this.UserForm.controls['password'].enable()
      this.UserForm.controls['confirm_password'].enable()
    }
  }

  getUser() {
    const data = { _id: this.userID }
    this.spinner.show();
    this.usersService.getUser(data).subscribe((res: any) => {
      this.spinner.hide();
      if (res?.status) {
        this.userData = res.userData;
        if (this.userData?.name)
          this.UserForm.controls['name'].setValue(this.userData.name);
        if (this.userData?.email)
          this.UserForm.controls['email'].setValue(this.userData.email);
        if (this.userData?.mobile_number)
          this.UserForm.controls['mobile_number'].setValue(this.userData.mobile_number);
      }
      else {
        this.toastr.warning('Warning', 'Failed to load user data');
      }
    }, (err: any) => {
      if (err?.error?.message == 'jwt expired')
        this.router.navigateByUrl('/login');
      console.log(err);
      this.spinner.hide();
      this.toastr.error('Error', 'Failed to load user data');
    });
  }

  submitUserForm(formDirective: any) {
    if (this.UserForm.invalid) {
      this.toastr.warning('Warning', 'Please Fill Required Fields');
      return;
    }
    else if (this.UserForm.value.password != this.UserForm.value.confirm_password) {
      this.toastr.warning('Warning', 'Password Does Not Match');
      return;
    }
    this.formDirective = formDirective;

    const data: any = {
      _id: this.isEdit ? this.userID : 0,
      name: this.UserForm.value.name,
      email: this.UserForm.value.email,
      mobile_number: this.UserForm.value.mobile_number,
      password: this.UserForm.value.password,
      confirm_password: this.UserForm.value.confirm_password,
    };

    if (!this.isEdit) {
      this.spinner.show();
      this.usersService.createUser(data).subscribe((res: any) => {
        this.spinner.hide();
        if (res && res.status) {
          this.toastr.success('Success', 'User Created Successfully');
          
          // Show login instructions
          Swal.fire({
            title: 'User Created Successfully!',
            html: `
              <p>The user has been created successfully.</p>
              <p><strong>Login Instructions:</strong></p>
              <p>Email: ${data.email}</p>
              <p>Password: ${data.password}</p>
              <p>The user can now login using these credentials.</p>
            `,
            icon: 'success',
            confirmButtonText: 'OK'
          });
          
          this.formDirective.resetForm();
          this.UserForm.reset();
          this.router.navigateByUrl('/Users');
        }
        else {
          this.toastr.warning('Warning', 'User Creation Failed');
        }
      }, (err: any) => {
        if (err?.error?.message == 'jwt expired')
          this.router.navigateByUrl('/login');
        this.spinner.hide();
        this.toastr.error('Error', err.error.message);
      });
    }
    else {
      this.spinner.show();
      this.usersService.updateUser(data).subscribe((res: any) => {
        this.spinner.hide();
        if (res && res.status) {
          this.toastr.success('Success', 'User Updated Successfully');
          this.formDirective.resetForm();
          this.UserForm.reset();
          this.router.navigateByUrl('/Users');
        }
        else {
          this.toastr.warning('Warning', 'User Updation Failed');
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