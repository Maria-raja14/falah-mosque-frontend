import { HttpClient, HttpHeaders, HttpBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, timer } from "rxjs";
import { environment } from "src/environments/environment";
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MosquesService {
  baseUrl: string = environment.ApiUrl;

  constructor(private httpClient: HttpClient) { }

  getMosqueList(data: any): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}mosques/get-mosque-list`, { params: data });
  }

  getMosque(data: any): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}mosques/get-mosque`, { params: data });
  }

  // createMosque(data: any): Observable<any[]> {
  //   return this.httpClient.get<any[]>(`${this.baseUrl}mosques/create-mosque`);
  // }
    createMosque(formData: FormData): Observable<any> {
    return this.httpClient.post<any[]>(`${this.baseUrl}mosques/create-mosque`, formData);
  }

  updateMosque(data: any): Observable<any[]> {
    return this.httpClient.put<any[]>(`${this.baseUrl}mosques/update-mosque`, data);
  }

  deleteMosque(data: any): Observable<any[]> {
    return this.httpClient.delete<any[]>(`${this.baseUrl}mosques/delete-mosque`, { params: data });
  }

  activeDeactiveMosque(data: any): Observable<any[]> {
    return this.httpClient.put<any[]>(`${this.baseUrl}mosques/active-deactive-mosque`, data);
  }
  deleteEmail(data:any):Observable<any>{
    return this.httpClient.post<any>(`${this.baseUrl}mosques/delete-mosque-user`, data);
  }

}//original


// import { HttpClient, HttpHeaders, HttpBackend } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { Observable, timer } from "rxjs";
// import { environment } from "src/environments/environment";
// import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
// import { map, switchMap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class MosquesService {
//   baseUrl: string = environment.ApiUrl;

//   constructor(private httpClient: HttpClient) { }

//   getMosqueList(data: any): Observable<any[]> {
//     return this.httpClient.get<any[]>(`${this.baseUrl}mosques/get-mosque-list`, { params: data });
//   }

//   getMosque(data: any): Observable<any[]> {
//     return this.httpClient.get<any[]>(`${this.baseUrl}mosques/get-mosque`, { params: data });
//   }

//   createMosque(formData: FormData): Observable<any> {
//     return this.httpClient.post<any>(`${this.baseUrl}mosques/create-mosque`, formData);
//   }

//   updateMosque(data: any): Observable<any> {
//     return this.httpClient.put<any>(`${this.baseUrl}mosques/update-mosque`, data);
//   }

//   deleteMosque(data: any): Observable<any> {
//     return this.httpClient.delete<any>(`${this.baseUrl}mosques/delete-mosque`, { params: data });
//   }

//   activeDeactiveMosque(data: any): Observable<any> {
//     return this.httpClient.put<any>(`${this.baseUrl}mosques/active-deactive-mosque`, data);
//   }

//   deleteEmail(data: any): Observable<any> {
//     return this.httpClient.post<any>(`${this.baseUrl}mosques/delete-mosque-user`, data);
//   }
// }