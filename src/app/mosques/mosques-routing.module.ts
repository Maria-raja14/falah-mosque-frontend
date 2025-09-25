import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MosqueFormComponent } from './mosque-form/mosque-form.component';
import { MosqueListComponent } from './mosque-list/mosque-list.component';
import { MosqueSalahInfoFormComponent } from './mosque-salah-info-form/mosque-salah-info-form.component';
import { MosqueSalahInfoListComponent } from './mosque-salah-info-list/mosque-salah-info-list.component';

const routes: Routes = [
  { path: '', component: MosqueListComponent },
  { path: 'mosque-list', component: MosqueListComponent },
  { path: 'create-mosque', component: MosqueFormComponent },
  { path: 'edit-mosque/:id', component: MosqueFormComponent },

  { path: 'mosque-prayer-time-list', component: MosqueSalahInfoListComponent },
  { path: 'create-mosque-prayer-time', component: MosqueSalahInfoFormComponent },
  { path: 'edit-mosque-prayer-time/:id', component: MosqueSalahInfoFormComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MosquesRoutingModule { }
