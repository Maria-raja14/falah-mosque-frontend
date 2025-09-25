import { Injectable } from '@angular/core';
import { HttpEventType, HttpInterceptor } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { tap } from 'rxjs/operators'
@Injectable({
    providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

    constructor(private spinner: NgxSpinnerService) { }

    intercept(req: any, next: any): any {
        const url = req.url;
        const urlArr = url.split("/");
        const urlCheck = urlArr[urlArr.length - 1];

        let token: any;
        if (urlCheck == 'fp-reset-password')
            token = localStorage.getItem('fp_token');
        else
            token = localStorage.getItem('auth_token');

        // if (urlCheck != 'signup' && urlCheck != 'login' && urlCheck != 'fp-mail-verify' && urlCheck != 'fp-otp-verify') {
        const tokenizedReq = req.clone({
            setHeaders: {
                Authorization: `${token}`,
                'Access-Control-Expose-Headers': 'Content-Disposition'
            }
        });
        return next.handle(tokenizedReq);
        // return next.handle(tokenizedReq).pipe(
        //     tap((event:any) => {
        //         this.spinner.show();
        //         if(event.type == HttpEventType.Response) {
        //             this.spinner.hide();
        //         }
        //     })
        // );
        // }
    }
}