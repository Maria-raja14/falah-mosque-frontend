import { HttpClient, HttpHeaders, HttpBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, timer } from "rxjs";
import { environment } from "src/environments/environment";
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl: string = environment.ApiUrl;
  constructor(private httpClient: HttpClient) { }

  getUserList(data: any): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}users/get-user-list`, { params: data });
  }

  getUser(data: any): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}users/get-user`, { params: data });
  }

  createUser(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${this.baseUrl}users/create-user`, data);
  }

  updateUser(data: any): Observable<any[]> {
    return this.httpClient.put<any[]>(`${this.baseUrl}users/update-user`, data);
  }

  deleteUser(data: any): Observable<any[]> {
    return this.httpClient.delete<any[]>(`${this.baseUrl}users/delete-user`, { params: data });
  }

  activeDeactiveUser(data: any): Observable<any[]> {
    return this.httpClient.put<any[]>(`${this.baseUrl}users/active-deactive-user`, data);
  }
}
