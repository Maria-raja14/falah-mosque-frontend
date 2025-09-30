// import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';

// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
// import { ToastrModule } from 'ngx-toastr';
// // import { AngularFontAwesomeModule } from 'angular-font-awesome';

// import { LayoutModule } from './layout/layout.module';
// import { HomeModule } from './home/home.module';
// import { UsersModule } from './users/users.module';
// import {MatAutocompleteModule} from '@angular/material/autocomplete';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { TokenInterceptorService } from './services/common/token.interceptor.service';

// @NgModule({
//   declarations: [
//     AppComponent
//   ],
//   imports: [
//     BrowserModule,
//     AppRoutingModule,
//     BrowserAnimationsModule,
//     HttpClientModule,
//     ToastrModule.forRoot(),
//     // AngularFontAwesomeModule,
//     MatAutocompleteModule,
//     LayoutModule,
//     HomeModule,
//     UsersModule,

//     MatSidenavModule,
//   ],
//   providers: [
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: TokenInterceptorService,
//       multi: true,
//     },
//   ],
//   bootstrap: [AppComponent],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA]
// })
// export class AppModule { }


import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

import { LayoutModule } from './layout/layout.module';
import { HomeModule } from './home/home.module';
import { UsersModule } from './users/users.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TokenInterceptorService } from './services/common/token.interceptor.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    MatAutocompleteModule,
    MatSidenavModule,
    LayoutModule,
    HomeModule,
    UsersModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }