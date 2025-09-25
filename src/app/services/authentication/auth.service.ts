// import { HttpClient, HttpHeaders, HttpBackend } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { Observable, timer } from "rxjs";
// import { environment } from "src/environments/environment";
// import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
// import { map, switchMap } from 'rxjs/operators';
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   baseUrl: string = environment.ApiUrl;

//   private httpWithBackend: HttpClient;

//   constructor(private httpClient: HttpClient,  private httpBackend: HttpBackend) {
//      this.httpWithBackend = new HttpClient(this.httpBackend)
//   }

//   signup(data: any): Observable<any[]> {
//     return this.httpWithBackend.post<any[]>(`${this.baseUrl}users/signup`, data);
//   }


//   login(data: any): Observable<any[]> {
//     return this.httpWithBackend.post<any[]>(`${this.baseUrl}auth/userLogin`, data);
//   }

//   fpMailVerify(data: any): Observable<any[]> {
//     return this.httpWithBackend.post<any[]>(`${this.baseUrl}users/fp-mail-verify`, data);
//   }

//   fpOtpVerify(data: any): Observable<any[]> {
//     return this.httpWithBackend.post<any[]>(`${this.baseUrl}users/fp-otp-verify`, data);
//   }

//   fpResetPassword(data: any): Observable<any[]> {
//     // const token = localStorage.getItem('fp_token');
//     // const header = new HttpHeaders().set('Authorization', `${token}`);
//     return this.httpClient.post<any[]>(`${this.baseUrl}users/fp-reset-password`, data);
//   }



//   searchUser(data: any) {
//     // debounce
//     return timer(1000)
//       .pipe(
//         switchMap(() => {
//           // Check if username is availabledelete-task-type/${data.ID}
//           return this.httpClient.post<any>(`${this.baseUrl}users/find-mail`, data)
//         })
//       );
//   }

//   userValidator(): AsyncValidatorFn {
//     return (control: AbstractControl): Observable<any> => {
//       const data = { email: control.value }
//       return this.searchUser(data)
//         .pipe(
//           map((res: any) => {
//             // if username is already taken
//             if (res && res.userData && res.userData.length)
//               return { 'userEmailExists': true , '_id': res.userData[0]._id};
//             else
//               return null;
//           })
//         );
//     };
//   }

//   isLoggedIn(): any {
//     const auth_token = localStorage.getItem('auth_token');
//     if (auth_token !== null) return true;
//     else return false;
//   }

// }//original


import { HttpClient, HttpHeaders, HttpBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, timer } from "rxjs";
import { environment } from "src/environments/environment";
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = environment.ApiUrl;
  private httpWithBackend: HttpClient;

  constructor(private httpClient: HttpClient, private httpBackend: HttpBackend) { 
    this.httpWithBackend = new HttpClient(this.httpBackend);
  }

  signup(data: any): Observable<any> {
    return this.httpWithBackend.post<any>(`${this.baseUrl}users/signup`, data);
  }

  login(data: any): Observable<any> {
    return this.httpWithBackend.post<any>(`${this.baseUrl}auth/userLogin`, data);
  }

  fpMailVerify(data: any): Observable<any> {
    return this.httpWithBackend.post<any>(`${this.baseUrl}users/fp-mail-verify`, data);
  }

  fpOtpVerify(data: any): Observable<any> {
    return this.httpWithBackend.post<any>(`${this.baseUrl}users/fp-otp-verify`, data);
  }

  fpResetPassword(data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}users/fp-reset-password`, data);
  }

  searchUser(data: any) {
    return timer(1000)
      .pipe(
        switchMap(() => this.httpClient.post<any>(`${this.baseUrl}users/find-mail`, data))
      );
  }

  userValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<any> => {
      const data = { email: control.value };
      return this.searchUser(data)
        .pipe(
          map((res: any) => {
            if (res && res.userData && res.userData.length)
              return { 'userEmailExists': true, '_id': res.userData[0]._id };
            else
              return null;
          })
        );
    };
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('auth_token') !== null;
  }
}
