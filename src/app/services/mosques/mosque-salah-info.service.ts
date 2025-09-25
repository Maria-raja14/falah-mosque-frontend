import { HttpClient, HttpHeaders, HttpBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, timer } from "rxjs";
import { environment } from "src/environments/environment";
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MosqueSalahInfoService {
  baseUrl: string = environment.ApiUrl;

  constructor(private httpClient: HttpClient) { }

  getMosqueNameIDList(data: any): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}mosques-info/get-mosque-nameid-list`, { params: data });
  }

  getMosqueSalahInfoList(data: any): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}mosques-info/get-mosque-prayer-time-list`, { params: data });
  }

  getMosqueSalahInfo(data: any): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}mosques-info/get-mosque-prayer-time`, { params: data });
  }

  createMosqueSalahInfo(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(`${this.baseUrl}mosques-info/create-mosque-prayer-time`, data);
  }

  updateMosqueSalahInfo(data: any): Observable<any[]> {
    return this.httpClient.put<any[]>(`${this.baseUrl}mosques-info/update-mosque-prayer-time`, data);
  }

  deleteMosqueSalahInfo(data: any): Observable<any[]> {
    return this.httpClient.delete<any[]>(`${this.baseUrl}mosques-info/delete-mosque-prayer-time`, { params: data });
  }

  activeDeactiveMosqueSalahInfo(data: any): Observable<any[]> {
    return this.httpClient.put<any[]>(`${this.baseUrl}mosques-info/active-deactive-mosque-prayer-time`, data);
  }}
