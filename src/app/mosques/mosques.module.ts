import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MosquesRoutingModule } from './mosques-routing.module';
import { MosqueListComponent } from './mosque-list/mosque-list.component';
import { MosqueFormComponent } from './mosque-form/mosque-form.component';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';

import { NgxMatTimepickerModule } from 'ngx-mat-timepicker'
import { NgxSpinnerModule } from "ngx-spinner";

import { MosqueSalahInfoListComponent } from './mosque-salah-info-list/mosque-salah-info-list.component';
import { MosqueSalahInfoFormComponent } from './mosque-salah-info-form/mosque-salah-info-form.component';

@NgModule({
  declarations: [
    MosqueListComponent,
    MosqueFormComponent,
    MosqueSalahInfoListComponent,
    MosqueSalahInfoFormComponent
  ],
  imports: [
    CommonModule,
    MosquesRoutingModule,

    FormsModule,
    ReactiveFormsModule,

    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatDividerModule,

    NgxSpinnerModule,
    NgxMatTimepickerModule
  ]
})
export class MosquesModule { }
