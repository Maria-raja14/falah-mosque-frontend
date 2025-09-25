import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from 'src/app/services/authentication/auth.guard';

const routes: Routes = [
    { path: '', canActivate: [AuthGuard], component: DashboardComponent },
    { path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomeRoutingModule { }