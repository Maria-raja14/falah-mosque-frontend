import { HttpClient, HttpHeaders, HttpBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, timer } from "rxjs";
import { environment } from "src/environments/environment";
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl: string = environment.ApiUrl;

  constructor(private httpClient: HttpClient) { }

  getDashboardData(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}users/get-dashboard-data`);
  }
}
