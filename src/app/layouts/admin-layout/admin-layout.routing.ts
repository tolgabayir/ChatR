import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';

import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { AuthGuard } from 'src/app/guards/auth.guard';


export const AdminLayoutRoutes: Routes = [

    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'settings', component: DashboardComponent, canActivate: [AuthGuard] },



];
